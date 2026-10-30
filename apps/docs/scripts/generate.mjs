import { readFile, writeFile, mkdir, readdir, rm } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { dirname, resolve, relative, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import ts from 'typescript';

export const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');
const site = resolve(root, 'apps/docs');
const read = path => readFile(resolve(root, path), 'utf8');
const json = async path => JSON.parse(await read(path));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const write = async (path, text) => { await mkdir(dirname(path), { recursive: true }); await writeFile(path, text); };
const sourceLinks = new Set();
const referenceOnlySources = new Map();
const link = (path, label = path) => {
  const file = path.replace(/:\d+$/, '');
  if (file === 'upstream/krds/manifest.json') {
    // The full manifest receives this site's distribution hashes. Serving a
    // snapshot of it would make current-byte validation recursively self-referential.
    sourceLinks.add('catalog/components.json');
    return `${label} (checkout reference; [frozen component source records](/sources/catalog/components.json.txt))`;
  }
  if (referenceOnlySources.has(file)) return `[${label}](${referenceOnlySources.get(file)})`;
  if (file.endsWith('.html') && !file.startsWith('LICENSES/')) throw new Error(`Raw HTML requires a reference-only URL mapping: ${file}`);
  sourceLinks.add(file);
  return `[${label}](/sources/${file}.txt)`;
};
const code = (text, language = 'ts') => `\n\`\`\`${language}\n${text.trim()}\n\`\`\`\n`;
const safeProse = text => text.split(/(`[^`]*`)/g).map((part, index) => index % 2 ? part : part.replaceAll('<', '&lt;')).join('');
const sourceInputs = new Map();
const trackedRead = async path => {
  const bytes = await read(path);
  const record = { path, bytes: Buffer.byteLength(bytes), sha256: hash(bytes) };
  if (sourceInputs.has(path) && sourceInputs.get(path).sha256 !== record.sha256) throw new Error(`Input changed within documentation generation: ${path}`);
  sourceInputs.set(path, record);
  return bytes;
};
const trackedJson = async path => JSON.parse(await trackedRead(path));
const frameworks = (await trackedJson('compatibility/frameworks.json')).frameworks;
const catalog = await trackedJson('catalog/components.json');
const coverage = await trackedJson('catalog/coverage.json');
const stories = await trackedJson('catalog/full-catalog-stories.json');
const web = catalog.components.filter(component => component.webApplicable);
for (const component of catalog.components) referenceOnlySources.set(component.source.localPath, component.canonicalUrl);
if (existsSync(resolve(root, 'docs/patterns/evidence/sources.json'))) {
  const patterns = await trackedJson('docs/patterns/evidence/sources.json');
  for (const source of patterns.sources) referenceOnlySources.set(source.localPath, source.url);
}
const declarations = new Map();
for (const path of ['packages/contracts/src/full-catalog.ts', 'packages/contracts/src/types.ts']) {
  const content = await trackedRead(path);
  const file = ts.createSourceFile(path, content, ts.ScriptTarget.Latest, true);
  for (const node of file.statements) if (node.name && (ts.isInterfaceDeclaration(node) || ts.isTypeAliasDeclaration(node))) declarations.set(node.name.text, { node, file, path });
}
const semanticContract = name => {
  const seen = new Set();
  const collect = key => {
    if (seen.has(key) || !declarations.has(key)) return;
    seen.add(key);
    const { node } = declarations.get(key);
    const visit = child => {
      if (ts.isTypeReferenceNode(child) && ts.isIdentifier(child.typeName)) collect(child.typeName.text);
      if (ts.isExpressionWithTypeArguments(child) && ts.isIdentifier(child.expression)) collect(child.expression.text);
      ts.forEachChild(child, visit);
    };
    visit(node);
  };
  collect(`${name}Contract`);
  const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed });
  return [...seen].map(key => { const { node, file } = declarations.get(key); return printer.printNode(ts.EmitHint.Unspecified, node, file); }).join('\n\n');
};
const semanticProperties = name => {
  const properties = new Map();
  const collect = (key, substitutions = {}) => {
    const declaration = declarations.get(key);
    if (!declaration || !ts.isInterfaceDeclaration(declaration.node)) return;
    const { node, file } = declaration;
    const substitute = text => Object.entries(substitutions).reduce((value, [parameter, argument]) => value.replace(new RegExp(`\\b${parameter}\\b`, 'g'), argument), text);
    for (const clause of node.heritageClauses ?? []) for (const base of clause.types) {
      const baseName = base.expression.getText(file);
      const parameters = declarations.get(baseName)?.node.typeParameters ?? [];
      const bindings = Object.fromEntries(parameters.map((parameter, index) => [parameter.name.text, substitute(base.typeArguments?.[index]?.getText(file) ?? parameter.name.text)]));
      collect(baseName, bindings);
    }
    for (const member of node.members) if (ts.isPropertySignature(member) && member.name && member.type) {
      properties.set(member.name.getText(file), { required: !member.questionToken, type: substitute(member.type.getText(file)).replaceAll('\n', ' '), event: /^on[A-Z]/.test(member.name.getText(file)) });
    }
  };
  collect(`${name}Contract`);
  return [...properties.entries()];
};
const manifests = new Map();
for (const framework of frameworks) manifests.set(framework.id, await trackedJson(`packages/${framework.id}/package.json`));
const nativeStoryIndexes = new Map();
for (const framework of frameworks) {
  const path = `apps/storybook-${framework.id}/dist/index.json`;
  if (framework.id !== 'solid-next' && existsSync(resolve(root, path))) nativeStoryIndexes.set(framework.id, await trackedJson(path));
}
const prettyPeers = manifest => Object.entries(manifest.peerDependencies ?? {}).map(([name, version]) => `\`${name}@${version}\``).join('<br>') || 'No runtime peer declared';
const countStates = id => {
  const rows = coverage.coverage.filter(row => row.framework === id);
  return [...new Set(rows.map(row => row.status))].map(status => `${rows.filter(row => row.status === status).length} ${status}`).join(', ');
};
const docPages = [];
for (const group of ['getting-started', 'legal']) {
  const directory = resolve(root, 'docs', group);
  for (const name of await readdir(directory)) if (name.endsWith('.md')) {
    const path = `docs/${group}/${name}`;
    const content = (await trackedRead(path)).replaceAll(/\[([^\]]+)\]\(https:\/\/github\.com\/moreal\/krds\/blob\/main\/([^)]+)\)/g, (all, label, sourcePath) => link(sourcePath, label));
    await write(resolve(site, group, name), content);
    docPages.push(path);
  }
}
for (const name of ['README.md', 'native-handoff.md', 'sources.md']) {
  const path = `docs/patterns/${name}`;
  if (!existsSync(resolve(root, path))) continue;
  let content = await trackedRead(path);
  content = safeProse(content.replaceAll(/\[([^\]]+)\]\(([^)]+)\)/g, (all, label, target) => {
    if (/^(?:https?:|#)/.test(target)) return all;
    const destination = relative(root, resolve(root, dirname(path), target));
    if (/^docs\/patterns\/[^/]+\.md$/.test(destination)) return `[${label}](/patterns/${destination.endsWith('/README.md') ? '' : destination.split('/').at(-1).replace(/\.md$/, '')})`;
    return link(destination, label);
  }));
  await write(resolve(site, 'patterns', name === 'README.md' ? 'index.md' : name), content + '\n\n> Repository reference note: preserved raw official HTML stays in the checkout evidence tree and is not distributed as site content. Official links above identify the primary source; frozen source records retain its retrieval time and hash.\n');
}
await mkdir(resolve(site, 'components'), { recursive: true });
let index = '# Component catalog\n\n54 web-applicable entries, generated from the frozen catalog. Use the search button (or Ctrl/Cmd+K) to search English names, Korean names, APIs, and keyboard guidance. Splash screen is platform-only and excluded from this web catalog.\n\n**Availability comes from recorded coverage.** An export or a successful compiler check does not establish verified native behavior. Solid 2 is an isolated preview and never contributes stable coverage.\n\n| Component | Korean name | Completion kind | Cases |\n| --- | --- | --- | --- |\n';
const exampleRegistryPath = 'apps/docs/example-evidence.json';
const exampleRegistry = existsSync(resolve(root, exampleRegistryPath)) ? await trackedJson(exampleRegistryPath) : { examples: [] };
const exampleEvidence = [];
const examplePages = [];
for (const example of exampleRegistry.examples) {
  const source = await trackedRead(example.sourcePath);
  if (hash(source) !== example.sourceSha256) throw new Error(`Compiler example source changed: ${example.sourcePath}`);
  for (const path of example.evidencePaths) if (!existsSync(resolve(root, path))) throw new Error(`Missing compiler evidence: ${path}`);
  if (example.status !== 'compiler-checked' || !example.command || !example.componentIds.length || !example.publicPackageConsumption) throw new Error(`Incomplete compiler evidence for ${example.sourcePath}`);
  for (const proof of example.proofInputs ?? []) {
    const bytes = await trackedRead(proof.path);
    if (hash(bytes) !== proof.sha256 || Buffer.byteLength(bytes) !== proof.bytes) throw new Error(`Compiler checkpoint evidence changed: ${proof.path}`);
  }
  if (example.consumedArtifact) {
    const bytes = await readFile(resolve(root, example.consumedArtifact.path));
    if (hash(bytes) !== example.consumedArtifact.sha256) throw new Error(`Compiler-consumed artifact changed: ${example.consumedArtifact.path}`);
  }
  exampleEvidence.push(example);
  const title = example.componentIds.length === 1 ? `${example.componentIds[0]} · ${example.framework}` : `${example.framework} · ${example.componentIds.length} components`;
  const notes = (example.notes ?? []).map(note => `- ${safeProse(note)}\n`).join('');
  examplePages.push({ path: resolve(site, 'examples', `${example.framework}-${exampleEvidence.length}.md`), text: `# ${title}\n\nThis compiler checkpoint binds the exact source below to its producer's public built-package check. It includes the original imports and local state. It does not certify the latest native candidate, behavior, SSR/resume, or a release.\n\n${notes}\nSource: ${link(example.sourcePath)}. SHA-256: \`${example.sourceSha256}\`.\n\nCommand: \`${example.command}\`. ${example.evidencePaths.map(path => link(path, 'Original compiler evidence')).join(' · ')}.\n\n${code(source, extname(example.sourcePath).slice(1))}\n` });
}
for (const framework of coverage.stableFrameworks) {
  const mapped = new Set(exampleEvidence.filter(example => example.framework === framework).flatMap(example => example.componentIds));
  if (mapped.size !== web.length || web.some(component => !mapped.has(component.id))) throw new Error(`Incomplete ${framework} public compiler checkpoint mapping`);
}
for (const directory of ['components', 'examples', 'public/sources']) await rm(resolve(site, directory), { recursive: true, force: true });
for (const page of examplePages) await write(page.path, page.text);
for (const component of web) {
  const officialSource = await trackedRead(component.source.localPath);
  if (hash(officialSource) !== component.source.sha256) throw new Error(`Frozen KRDS source changed: ${component.source.localPath}`);
  const spec = await trackedRead(component.specPath);
  const sections = spec.split(/^## /m).slice(1).map(section => ({ heading: section.split('\n')[0], body: section.slice(section.indexOf('\n') + 1).trim() }));
  const selected = sections.filter(section => /Project API|Plain semantic API|Keyboard|Native structure|Forms, reset|Asset, integration|Stable parts|Official requirements|Structure and acceptance|Responsive\/mobile|focus|activation policy|View and date|Editing, commits|Calendar integration|Translation and|Form,/.test(section.heading));
  const contract = semanticContract(component.exportName);
  index += `| [${component.nameEn}](./${component.id}) | ${component.nameKo} | ${component.kind} | ${component.variants.map(value => `\`${value}\``).join(', ')} |\n`;
  let page = `---\ntitle: '${component.nameEn.replaceAll("'", "''")} · ${component.nameKo}'\n---\n\n# ${component.nameEn}\n\n${component.nameKo} · \`${component.exportName}\` · ${component.kind}\n\n[Official KRDS guidance](${component.canonicalUrl}) · ${link(component.specPath, 'Full reviewed specification')} · [Framework support](../compatibility/)\n\n## Native availability\n\nThese states are copied from \`catalog/coverage.json\`; they are not inferred from exports, examples, or test-runner exit codes.\n\n| Framework | Package version | Recorded state | Export declaration | Native examples and stories |\n| --- | --- | --- | --- | --- |\n`;
  for (const framework of frameworks) {
    const manifest = manifests.get(framework.id);
    const record = coverage.coverage.find(row => row.framework === framework.id && row.componentId === component.id);
    const exported = Object.hasOwn(manifest.exports ?? {}, `./${component.id}`);
    const publicEntry = manifest.exports?.[`./${component.id}`] ?? manifest.exports?.['.'];
    const typesEntry = typeof publicEntry === 'object' ? publicEntry.types : undefined;
    const typePath = typesEntry ? `packages/${framework.id}/${typesEntry.replace(/^\.\//, '')}` : undefined;
    const declarationLink = typePath && existsSync(resolve(root, typePath)) ? link(typePath, exported ? 'exact subpath types' : 'exact root types') : link(`packages/${framework.id}/package.json`, 'manifest; built types pending');
    page += `| ${framework.id}${framework.supportChannel.includes('preview') ? ' (preview)' : ''} | \`${manifest.version}\` | ${record?.status ?? 'unrecorded'} | ${declarationLink} | [${framework.id} sources and preview policy](../compatibility/examples#${framework.id}) |\n`;
  }
  page += '\n## Props, events, content and defaults\n\nThe semantic contract below is shared data only. Native content, refs and event transport belong to each adapter. Callback names and detail types in the contract are exact; do not pass machine objects. Optional properties are not automatically defaulted: use the explicit defaults in the guidance below.\n';
  if (contract) page += code(contract);
  else page += `\nThe public API is defined in the reviewed guidance below and each native public declaration. ${link('packages/contracts/src/types.ts', 'Shared event and date types')}.\n`;
  const properties = semanticProperties(component.exportName);
  if (properties.length) page += '\n| Semantic property / callback | Required | Exact type | Role |\n| --- | --- | --- | --- |\n' + properties.map(([name, property]) => `| \`${name}\` | ${property.required ? 'yes' : 'no'} | \`${property.type.replaceAll('|', '\\|')}\` | ${property.event ? 'semantic event request' : 'data / state'} |\n`).join('') + '\nOptional values and explicit defaults are different. Defaults and native content requirements are stated in the reviewed guidance below.\n';
  page += '\n### Native content and event transport\n\nReact and Solid use native JSX/content props; Svelte uses native snippets; Vue uses native slots; Angular uses its native inputs, outputs and content projection; Lit uses custom-element properties, slots and DOM events; Qwik uses native QRL event boundaries. Their transport is not interchangeable. Read the linked public package declaration for exact names and required content. A semantic callback below does not imply a same-named Lit DOM event.\n';
  for (const section of selected) page += `\n### ${section.heading}\n\n${safeProse(section.body.replaceAll(/\[([^\]]+)\]\(([^)]+)\)/g, (all, label, path) => /^https?:/.test(path) ? all : link(relative(root, resolve(root, 'specs/components', path)), label)))}\n`;
  const cases = stories.cases.filter(item => (item.componentId ?? item.id?.split('--')[0]) === component.id);
  page += `\n## State examples and native checks\n\nSupported case axes: ${component.variants.map(value => `\`${value}\``).join(', ')}. These case names are independent project axes; they do not imply official KRDS type names or completed coverage.\n\n${link('catalog/full-catalog-stories.json', 'Required native story manifest')} · ${link('catalog/story-cases.json', 'Pilot story manifest')} · ${link('catalog/coverage.json', 'Coverage evidence and native review links')}\n`;
  if (cases.length) page += `\nRequired full-catalog stories: ${cases.map(item => `\`${item.storyId ?? item.id}\``).join(', ')}.\n`;
  page += '\n### Native stories in current built outputs\n\nThe links below come from each actual built Storybook index. A built story is availability evidence, not behavioral or accessibility acceptance. Use the local docs preview server for these links; a stale or missing native output must be rebuilt by its owner.\n\n';
  for (const framework of frameworks) {
    const entries = Object.values(nativeStoryIndexes.get(framework.id)?.entries ?? {}).filter(entry => entry.type === 'story' && entry.id.startsWith(`krds-${component.id}--`));
    page += entries.length ? `- ${framework.id}: ${entries.map(entry => `[${entry.name}](/native/storybook-${framework.id}/?path=/story/${entry.id})`).join(' · ')}.\n` : `- ${framework.id}: ${framework.id === 'solid-next' ? 'unsupported native Storybook preview integration' : 'no matching built native story index entries yet'}.\n`;
  }
  const examples = exampleEvidence.filter(example => example.componentIds.includes(component.id));
  page += examples.length ? '\nNative compiler checkpoints (source hashes are verified during every docs build). These records do not certify the latest native candidate or behavioral acceptance; each checked source page states its checkpoint scope.\n\n' + examples.map(example => `- ${example.framework}: [read the checked consumer](/examples/${example.framework}-${exampleEvidence.indexOf(example) + 1}); ${link(example.sourcePath, 'download exact source')}; ${example.evidencePaths.map(path => link(path, 'compiler evidence')).join(', ')}.\n`).join('') : '\nNo per-component compiler evidence has been registered in the docs index yet. Native fixture sources are linked in the [examples directory](../compatibility/examples); source existence alone is not a compilation result.\n';
  page += `\n## Source identity and rights\n\nBaseline: \`${catalog.krdsBaselineId}\`. Official detail snapshot retrieved \`${component.source.retrievedAt}\`. SHA-256: \`${component.source.sha256}\`. ${link('catalog/components.json', 'Frozen component source records')} · [Official source](${component.canonicalUrl}). Raw original HTML remains reference evidence in the checkout and is not copied into this site.\n\nKRDS quoted or derived guidance retains its original terms. The independent code MIT grant does not relicense it, official assets, fonts, or third-party materials. Read [sources and rights](../legal/) before redistributing.\n`;
  await write(resolve(site, 'components', `${component.id}.md`), page);
  await write(resolve(root, 'docs/components', `${component.id}.md`), page.replaceAll('../compatibility/', '../compatibility/README.md').replaceAll('../legal/', '../legal/index.md'));
}
await write(resolve(site, 'components/index.md'), index);
await write(resolve(root, 'docs/components/README.md'), index);
let matrix = '# Framework compatibility\n\nVersions, peer ranges and support states are generated from the current native package manifests, compatibility targets and coverage records. A stable **target** is not a declaration that all 54 components have passed acceptance. Independent review, behavioral evidence, visuals, source rights and isolated consumption remain separate gates.\n\n| Native renderer | Package | Selected runtime/compiler | Public peers | Recorded coverage |\n| --- | --- | --- | --- | --- |\n';
for (const framework of frameworks) {
  const manifest = manifests.get(framework.id);
  matrix += `| ${framework.renderer}${framework.supportChannel.includes('preview') ? ' · **preview**' : ''} | \`${manifest.name}@${manifest.version}\` | ${Object.entries(framework.pins).map(([name, version]) => `\`${name}@${version}\``).join('<br>')} | ${prettyPeers(manifest)} | ${countStates(framework.id)} |\n`;
}
matrix += '\n## What the evidence means\n\n`planned` reserves work. `in-progress` records active work. `implemented` records implementation without full acceptance. `blocked` records an unresolved gate. `verified` requires the controller-owned native evidence and independent review defined by the coverage schema. Preview is isolated from stable totals. See each component for its recorded state.\n\n## Package and browser boundaries\n\nQwik uses Vite 7; the other selected native Vite workspaces use Vite 8. Angular owns its CLI/ng-packagr partial APF output and CVA forms. Solid 1 and Solid 2 have isolated runtime, compiler and renderer graphs. Svelte 2/3 are not current stable targets. The declared peer range is not evidence that every version within it has been tested.\n\n[Native examples and compiler evidence](./examples) · [Solid 1 → 2](./solid-migration) · [Testing roles](../getting-started/testing)\n';
await write(resolve(site, 'compatibility/index.md'), matrix);
await write(resolve(root, 'docs/compatibility/README.md'), matrix);
let examplesPage = '# Native examples\n\nEach implementation owns its fixture and Storybook. All seven stable native targets have compiler checkpoints mapping the 54 web entries. The exact source hashes and original compiler evidence are verified; a changed source invalidates the checkpoint during the docs build. Checkpoint scope is separate from the latest native candidate, behavioral acceptance and release readiness.\n\n## Checkpoint coverage\n\n| Framework | Exact component mappings | Scope |\n| --- | --- | --- |\n' + coverage.stableFrameworks.map(framework => `| [${framework}](#${framework}) | ${new Set(exampleEvidence.filter(example => example.framework === framework).flatMap(example => example.componentIds)).size} | producer compiler checkpoint; no native acceptance |\n`).join('') + '\n## Local native previews\n\nRun `node apps/docs/scripts/serve.mjs` after the docs build. This local server serves the docs and maps the following native output paths when those outputs exist. It does not rebuild native apps or manufacture missing outputs. Build each native workspace separately using its own manifest command. Missing outputs return an explicit 404. These preview links depend on that local server, not a remote host.\n\n';
for (const framework of frameworks) {
  const compatibilityPath = `docs/compatibility/${framework.id === 'solid-next' ? 'solid-2' : framework.id}.md`;
  examplesPage += `\n## ${framework.id}\n\n${link(`packages/${framework.id}/package.json`, 'Public package exports and scripts')} · ${link(`apps/fixture-${framework.id}/package.json`, 'Native fixture build scripts')} · ${existsSync(resolve(root, compatibilityPath)) ? link(compatibilityPath, 'Native limitations and evidence') : 'Native compatibility report not yet present'}\n\n${framework.id === 'qwik' ? 'Production fixture: run the native SSR/resume server and tests in its manifest; no static preview substitutes for resume.' : `[Open local fixture](/native/fixture-${framework.id}/)`} · ${framework.id !== 'solid-next' && existsSync(resolve(root, `apps/storybook-${framework.id}/package.json`)) ? `[Open local Storybook](/native/storybook-${framework.id}/)` : 'No supported native Storybook integration declared'}\n\n`;
  const registered = exampleEvidence.filter(example => example.framework === framework.id);
  for (const example of registered) examplesPage += `**Compiler checkpoint:** [read native source](/examples/${example.framework}-${exampleEvidence.indexOf(example) + 1}) · ${link(example.sourcePath, 'download exact source')}\n\n${(example.notes ?? []).map(note => `${safeProse(note)}\n\n`).join('')}Command: \`${example.command}\`. Component IDs: ${example.componentIds.map(id => `\`${id}\``).join(', ')}. Source SHA-256 \`${example.sourceSha256}\`. Evidence: ${example.evidencePaths.map(path => link(path)).join(', ')}.\n\n`;
  if (!registered.length) examplesPage += 'Per-component compiler evidence is not yet registered. The following are actual source references, not a compilation or support claim.\n\n';
  const candidates = ['CatalogExample.tsx','catalog-examples.tsx','examples.tsx','DocsConsumer.svelte','CatalogExamples.vue','ConsumerExample.vue','full-catalog.ts','fixture-app.ts','main.tsx'];
  for (const name of candidates) { const path = `apps/fixture-${framework.id}/src/${name}`; if (existsSync(resolve(root, path))) examplesPage += `- ${link(path)}\n`; }
}
await write(resolve(site, 'compatibility/examples.md'), examplesPage);
await write(resolve(site, 'compatibility/solid-migration.md'), '# Solid 1 → Solid 2\n\nSolid 2 is an isolated preview on exact `2.0.0-rc.19` runtime, renderer and compiler pins, not a peer-range widening of the stable Solid 1 adapter. Use `@unofficial-krds/solid-next` only with its own manifest toolchain and preview fixture. Do not mix `solid-js` generations, import `solid-js/web` for the Solid 2 renderer, or resolve all runtimes at the repository root.\n\nStart by moving semantic data, controlled values, callback payloads and CSS tokens. Then port native content/ref/lifecycle usage against the selected Solid 2 declarations and compiler. A Solid 1 JSX example is not automatically a Solid 2 example.\n\nThe preview does not have a supported upstream siheom or stable native Storybook integration. Native preview build, SSR and browser evidence are recorded separately. [Exact versions and states](./) · [Native source examples](./examples#solid-next).\n');
// Release manifests and tarballs are mutable ignored producer outputs. Only this
// reviewed historical checkpoint is an input to protected documentation source.
const artifactCheckpointPath = 'apps/docs/artifact-checkpoint.json';
const artifactCheckpoint = await trackedJson(artifactCheckpointPath);
if (artifactCheckpoint.schemaVersion !== 1 || artifactCheckpoint.kind !== 'historical-artifact-checkpoint' || artifactCheckpoint.currentCandidate !== false || artifactCheckpoint.publicationAuthorized !== false || !Array.isArray(artifactCheckpoint.inventories)) throw new Error('Invalid historical artifact checkpoint scope');
const artifactEvidence = artifactCheckpoint.inventories;
let artifactsPage = '# Historical local artifact records\n\nPackage identities, versions, local filenames and hashes below are captured historical observations from the reviewed documentation checkpoint. They are not rechecked during this docs build. This generator does not read or probe live artifact inventories, manifests or tarballs. These records do not establish a current native candidate, public npm availability or publication authorization.\n\n';
artifactsPage += `Checkpoint: ${link(artifactCheckpointPath, 'download exact historical record')}. Original metadata SHA-256: \`${artifactCheckpoint.origin.metadataSha256}\`. The original metadata path is a historical identity, not a claim about its current bytes.\n\n`;
artifactsPage += 'The current candidate record, when produced, is \`artifacts/manifest.json\` in the checkout. Use the T14 tarball inspector, outside consumers and T16 candidate verifier for current package bytes and source/build acceptance. This historical page does not report whether that mutable record currently exists. Follow the [local installation guide](./installation) and the exact current candidate producer records before installing tarballs.\n\n';
for (const inventory of artifactEvidence) {
  artifactsPage += `## ${inventory.path}\n\nHistorical recorded status: \`${inventory.status}\`. Debug-only at capture: **${inventory.debugOnly ? 'yes' : 'no'}**. This checkpoint authorizes no publication.\n\n| Package | Captured version | Historical local path | Recorded SHA-256 | Captured observed SHA-256 | Integrity at capture |\n| --- | --- | --- | --- | --- | --- |\n`;
  for (const entry of inventory.packages) artifactsPage += `| \`${entry.name}\` | \`${entry.version}\` | \`${entry.path}\` | \`${entry.recordedSha256}\` | \`${entry.observedSha256 ?? 'not observed'}\` | ${entry.integrity} |\n`;
}
artifactsPage += `\n${link('.superpowers/sdd/PLAN/task-T14-report.md', 'Original T14 producer report')} · [Sources and rights](../legal/). The separate original and repaired-Solid debug inventories must not be combined into a final acceptance claim.\n`;
await write(resolve(site, 'getting-started/artifacts.md'), artifactsPage);
const distributedSources = [];
for (const path of sourceLinks) {
  const source = await trackedRead(path);
  await write(resolve(site, 'public/sources', `${path}.txt`), source);
  distributedSources.push({ sourcePath: path, outputPath: `sources/${path}.txt`, bytes: Buffer.byteLength(source), sha256: hash(source) });
}
await write(resolve(site, 'public/docs-metadata.json'), JSON.stringify({ schemaVersion: 1, runKind: 'local-documentation-checkpoint', globalCandidate: false, baseline: catalog.krdsBaselineId, webEntryCount: web.length, stableFrameworks: coverage.stableFrameworks, previewFrameworks: coverage.previewFrameworks, examples: exampleEvidence, artifactEvidence, distributedSources, referenceOnlySources: [...referenceOnlySources].map(([sourcePath, url]) => ({ sourcePath, url })), sourceInputs: [...sourceInputs.values()] }, null, 2) + '\n');
console.log(`Generated ${web.length} component pages, ${frameworks.length} native profiles, ${exampleEvidence.length} registered compiler examples.`);
