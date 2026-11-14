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
// Declaration snapshots are explicit historical inputs, independent of a local
// package's optional dist. Read before recreating public/sources below.
const declarationCheckpoint = await trackedJson('apps/docs/declaration-checkpoint.json');
if (declarationCheckpoint.kind !== 'historical-declaration-checkpoint' || declarationCheckpoint.currentCandidate !== false) throw new Error('Invalid declaration checkpoint scope');
const frozenDeclarations = new Map();
for (const record of declarationCheckpoint.records) {
  if (record.checkpointPath !== `apps/docs/public/sources/${record.sourcePath}.txt`) throw new Error('Invalid declaration snapshot destination');
  const bytes = await trackedRead(record.checkpointPath);
  if (Buffer.byteLength(bytes) !== record.bytes || hash(bytes) !== record.sha256) throw new Error(`Historical declaration snapshot changed: ${record.checkpointPath}`);
  frozenDeclarations.set(record.sourcePath, bytes);
}
const frameworks = (await trackedJson('compatibility/frameworks.json')).frameworks;
const catalog = await trackedJson('catalog/components.json');
const coverage = await trackedJson('catalog/coverage.json');
const stories = await trackedJson('catalog/full-catalog-stories.json');
const web = catalog.components.filter(component => component.webApplicable);
// Reader-facing one-sentence summaries, written for this site (not KRDS text).
const summaries = (await trackedJson('catalog/component-summaries.json')).summaries;
for (const component of web) if (!summaries[component.id]?.trim()) throw new Error(`Missing component summary: ${component.id}`);
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
// Reader-facing names. The ids stay the package and URL identifiers.
const frameworkLabel = { react: 'React', solid: 'Solid 1', svelte: 'Svelte', vue: 'Vue', lit: 'Lit', qwik: 'Qwik', angular: 'Angular', 'solid-next': 'Solid 2' };
const partVocabulary = (await trackedJson('packages/styles/src/parts.json')).components;
const manifests = new Map();
for (const framework of frameworks) manifests.set(framework.id, await trackedJson(`packages/${framework.id}/package.json`));
const prettyPeers = manifest => Object.entries(manifest.peerDependencies ?? {}).map(([name, version]) => `\`${name}@${version}\``).join('<br>') || '선언된 런타임 피어 없음';
// Spec `## 제목 {#anchor}` sections republished on component pages, selected by stable anchor.
// Derived once from apps/docs/tests/fixtures/vitepress-baseline.json: the h3 ids of every
// components/*.html page minus its h1 and the six fixed generator anchors. Not read at runtime.
const selectedSpecAnchors = new Set([
  'asset-integration-and-composition-completion', 'calendar-integration', 'dismissal-and-focus-policy',
  'editing-commits-and-notifications', 'focus-and-activation-policy', 'form-states-and-acceptance',
  'form-structure-and-acceptance', 'forms-reset-and-composition', 'keyboard-and-accessibility',
  'keyboard-focus-and-state-transitions', 'keyboard-form-and-structure', 'native-structure-and-mandatory-ordering',
  'official-requirements', 'plain-semantic-api', 'project-api-and-defaults', 'responsive-mobile-requirements',
  'stable-parts-and-states', 'structure-and-acceptance', 'translation-and-accessible-feedback', 'view-and-date-interaction',
]);
// Same pure slug algorithm as `slugify` in ./content.mjs (VitePress 1.6.4). Inlined because this
// generator runs standalone (artifact-checkpoint.test.mjs copies only this file).
const slugify = value => value.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[\u0000-\u001f]/g, '').replace(/[\s~`!@#$%^&*()\-_+=[\]{}|\\;:"'“”‘’<>,.?/]+/g, '-').replace(/-{2,}/g, '-').replace(/^-+|-+$/g, '').replace(/^(\d)/, '_$1').toLowerCase();
const anchorPattern = /^[A-Za-z0-9_][A-Za-z0-9_\-.]*$/;
const specSections = (spec, path) => spec.split(/^## /m).slice(1).map(section => {
  const line = section.split('\n')[0].trimEnd();
  const match = line.match(/^(.+?)\s*\{#([^}]+)\}$/);
  if (!match || !anchorPattern.test(match[2])) throw new Error(`Spec heading needs an explicit {#anchor}: ${path}: ## ${line}`);
  return { heading: match[1], anchor: match[2], body: section.slice(section.indexOf('\n') + 1).trim() };
});
const docPages = [];
for (const group of ['getting-started', 'legal']) {
  const directory = resolve(root, 'docs', group);
  for (const name of (await readdir(directory)).sort()) if (name.endsWith('.md')) {
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
  await write(resolve(site, 'patterns', name === 'README.md' ? 'index.md' : name), content + '\n\n> 보존된 공식 원본 HTML은 이 사이트로 배포하지 않습니다. 위 공식 링크가 1차 출처입니다.\n');
}
await mkdir(resolve(site, 'components'), { recursive: true });
let index = '# 컴포넌트 목록 {#component-catalog}\n\nKRDS 웹 컴포넌트 54개입니다. 검색(Ctrl/Cmd+K)으로 영문 이름, 한국어 이름, API, 키보드 안내를 찾을 수 있습니다. 스플래시 화면(Splash screen)은 플랫폼 전용이라 제외합니다.\n\n프레임워크별 지원 상태는 각 컴포넌트 페이지에 있습니다. Solid 2는 별도 미리보기입니다.\n\n| 컴포넌트 | 한국어 이름 |\n| --- | --- |\n';
const exampleRegistryPath = 'apps/docs/example-evidence.json';
const exampleRegistry = existsSync(resolve(root, exampleRegistryPath)) ? await trackedJson(exampleRegistryPath) : { examples: [] };
const exampleEvidence = [];
const exampleSources = new Map();
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
  exampleSources.set(example, source);
}
const nameOf = id => web.find(component => component.id === id)?.nameEn ?? id;
for (const framework of frameworks) {
  const registered = exampleEvidence.filter(example => example.framework === framework.id);
  if (!registered.length) continue;
  const label = frameworkLabel[framework.id];
  let text = `# ${label} 예제 {#${framework.id}-examples}\n\n\`@unofficial-krds/${framework.id}\` 패키지로 각 컴포넌트를 쓰는 예제 코드입니다.\n`;
  for (const example of registered) {
    const single = example.componentIds.length === 1;
    const file = example.sourcePath.split('/').at(-1);
    text += single ? `\n## ${nameOf(example.componentIds[0])} {#${example.componentIds[0]}}\n\n` : `\n## \`${file}\` {#${slugify(file)}}\n\n컴포넌트 ${example.componentIds.length}개를 다룹니다. `;
    text += `${link(example.sourcePath, '소스 파일 내려받기')}\n${code(exampleSources.get(example), extname(example.sourcePath).slice(1))}`;
  }
  examplePages.push({ path: resolve(site, 'examples', `${framework.id}.md`), text });
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
  const selected = specSections(spec, component.specPath).filter(section => selectedSpecAnchors.has(section.anchor));
  const contract = semanticContract(component.exportName);
  index += `| [${component.nameEn}](./${component.id}) | ${component.nameKo} |\n`;
  // The h1 anchor keeps the English-name slug the published URLs already use (e.g. `critical-alerts`).
  const titleAnchor = slugify(component.nameEn);
  if (!anchorPattern.test(titleAnchor)) throw new Error(`Component title anchor is not a valid explicit anchor: ${component.id}: ${titleAnchor}`);
  const properties = semanticProperties(component.exportName);
  // Reader-facing guide, written for this site. The spec stays an internal contract and is only linked.
  const guide = await trackedJson(`catalog/component-guides/${component.id}.json`);
  const at = `catalog/component-guides/${component.id}.json`;
  const prose = (value, where) => { if (typeof value !== 'string' || !value.trim() || /[|\n]/.test(value)) throw new Error(`${at}: ${where} must be one line of prose without "|"`); return safeProse(value.trim()); };
  for (const key of ['usage', 'props', 'keyboard', 'accessibility', 'notes']) if (!Array.isArray(guide[key])) throw new Error(`${at}: ${key} must be a list`);
  if (!guide.usage.length || !guide.accessibility.length) throw new Error(`${at}: usage and accessibility are required`);
  if (properties.length && guide.props.map(prop => prop.name).join() !== properties.map(([name]) => name).join()) throw new Error(`${at}: props must list exactly ${properties.map(([name]) => name).join(', ')}`);
  const list = (items, where) => items.map((item, index) => `- ${prose(item, `${where}[${index}]`)}\n`).join('');
  let page = `---\ntitle: '${component.nameEn.replaceAll("'", "''")}'\n---\n\n# ${component.nameEn} {#${titleAnchor}}\n\n**${component.nameKo}** — ${summaries[component.id]}\n\n## 사용법 {#usage}\n\n${list(guide.usage, 'usage')}`;
  if (guide.props.length) {
    page += '\n## 속성 {#props}\n\n| 이름 | 타입 | 기본값 | 설명 |\n| --- | --- | --- | --- |\n';
    for (const prop of guide.props) {
      const declared = properties.find(([name]) => name === prop.name)?.[1];
      const type = declared?.type ?? prop.type;
      if (typeof type !== 'string' || !type.trim()) throw new Error(`${at}: ${prop.name} needs a type`);
      const required = declared ? declared.required : prop.required === true;
      page += `| \`${prop.name}\`${required ? ' **필수**' : ''} | \`${type.replaceAll('|', '\\|')}\` | ${prop.default == null ? '—' : prose(prop.default, `${prop.name}.default`)} | ${prose(prop.description, `${prop.name}.description`)} |\n`;
    }
    page += '\n모든 프레임워크가 같은 속성 이름과 타입을 씁니다. 콘텐츠와 이벤트를 넘기는 문법은 [프레임워크마다 다릅니다](../compatibility/#native-content-and-event-transport).\n';
    if (contract) page += '\n표에 나온 타입의 정의입니다.\n' + code(contract);
  }
  if (guide.keyboard.length) page += '\n## 키보드 조작 {#keyboard}\n\n| 키 | 동작 |\n| --- | --- |\n' + guide.keyboard.map((row, index) => `| ${prose(row.keys, `keyboard[${index}].keys`)} | ${prose(row.action, `keyboard[${index}].action`)} |\n`).join('');
  page += `\n## 접근성 {#accessibility}\n\n${list(guide.accessibility, 'accessibility')}`;
  if (guide.notes.length) page += `\n## 알아 둘 점 {#notes}\n\n${list(guide.notes, 'notes')}`;
  const vocabulary = partVocabulary[component.id];
  if (vocabulary?.parts.length) page += `\n## 스타일링 {#styling}\n\n각 부분에는 \`data-krds-part\` 속성이 붙어 있어 CSS 선택자로 고를 수 있습니다. 상태는 \`data-krds-state\`에 공백으로 구분해 담깁니다.\n\n| 파트 | 상태 값 |\n| --- | --- |\n${vocabulary.parts.map(part => `| \`${part}\` | ${(vocabulary.states[part] ?? []).map(state => `\`${state}\``).join(', ') || '없음'} |\n`).join('')}\n\`\`\`css\n[data-krds-component="${component.id}"][data-krds-part="${vocabulary.parts[0]}"] { /* ... */ }\n\`\`\`\n`;
  page += `\n## 참고 {#references}\n\n- [KRDS 공식 안내](${component.canonicalUrl})\n- ${link(component.specPath, '상세 명세')}\n- KRDS에서 가져온 내용의 이용 조건은 [출처와 권리](../legal/)를 따릅니다.\n`;
  // Downloads the spec sections used to link stay published, so existing URLs keep working.
  for (const section of selected) section.body.replaceAll(/\[([^\]]+)\]\(([^)]+)\)/g, (all, label, path) => /^(?:https?:|#)/.test(path) ? all : link(relative(root, resolve(root, 'specs/components', path)), label));
  for (const path of ['packages/contracts/src/types.ts', 'catalog/components.json']) sourceLinks.add(path);
  await write(resolve(site, 'components', `${component.id}.md`), page);
  await write(resolve(root, 'docs/components', `${component.id}.md`), page.replaceAll('../compatibility/', '../compatibility/README.md').replaceAll('../legal/', '../legal/index.md'));
}
await write(resolve(site, 'components/index.md'), index);
await write(resolve(root, 'docs/components/README.md'), index);
let matrix = '# 프레임워크 호환성 {#framework-compatibility}\n\n프레임워크마다 패키지가 따로 있습니다. 아래는 각 패키지를 빌드하고 테스트할 때 쓰는 런타임과 컴파일러 버전, 그리고 설치할 때 필요한 피어 의존성입니다. 패키지는 아직 npm에 게시하지 않았습니다.\n\n| 프레임워크 | 패키지 | 빌드·테스트에 쓰는 버전 | 피어 의존성 |\n| --- | --- | --- | --- |\n';
for (const framework of frameworks) {
  const manifest = manifests.get(framework.id);
  matrix += `| ${frameworkLabel[framework.id]}${framework.supportChannel.includes('preview') ? ' · **미리보기**' : ''} | \`${manifest.name}@${manifest.version}\` | ${Object.entries(framework.pins).map(([name, version]) => `\`${name}@${version}\``).join('<br>')} | ${prettyPeers(manifest)} |\n`;
}
matrix += '\nSolid 2는 미리보기 단계라 일부 컴포넌트만 제공합니다. 제공 여부는 각 컴포넌트 페이지의 Solid 2 탭에서 확인합니다.\n\n## 프레임워크별 콘텐츠와 이벤트 {#native-content-and-event-transport}\n\n속성 이름과 타입은 모든 프레임워크가 같습니다. 콘텐츠를 넣고 이벤트를 받는 문법만 각 프레임워크의 방식을 따릅니다.\n\n- React, Solid: JSX와 콘텐츠 prop\n- Svelte: snippet\n- Vue: 슬롯\n- Angular: input, output, 콘텐츠 투영\n- Lit: custom element 속성, 슬롯, DOM 이벤트\n- Qwik: QRL 이벤트\n\n정확한 문법은 각 컴포넌트 페이지의 코드 탭에서 프레임워크별로 확인합니다. 속성 표의 `on…` 콜백 이름이 Lit의 DOM 이벤트 이름과 같다는 뜻은 아닙니다.\n\n## 버전을 고를 때 {#package-and-browser-boundaries}\n\n- Qwik은 Vite 7, 나머지 Vite 기반 프레임워크는 Vite 8에 맞췄습니다.\n- Angular 패키지는 ng-packagr로 만든 partial APF 형식이고, 폼 컴포넌트는 `ControlValueAccessor`로 연결합니다.\n- Solid 1과 Solid 2는 패키지가 다릅니다. 한 앱에서 섞어 쓰지 않습니다.\n- Svelte는 5 버전만 지원합니다.\n- 피어 의존성 범위 안의 모든 버전을 테스트하지는 않았습니다. 표의 버전이 가장 확실합니다.\n\n[프레임워크별 예제](./examples) · [Solid 1 → 2](./solid-migration) · [테스트 역할](../getting-started/testing)\n';
await write(resolve(site, 'compatibility/index.md'), matrix);
await write(resolve(root, 'docs/compatibility/README.md'), matrix);
let examplesPage = '# 프레임워크별 예제 {#native-examples}\n\n프레임워크별로 54개 컴포넌트를 쓰는 예제 코드를 모았습니다. 컴포넌트 하나의 예제만 필요하면 그 컴포넌트 페이지의 코드 탭이 더 빠릅니다.\n\n| 프레임워크 | 패키지 | 예제 |\n| --- | --- | --- |\n';
for (const framework of frameworks) {
  const compatibilityPath = `docs/compatibility/${framework.id === 'solid-next' ? 'solid-2' : framework.id}.md`;
  const registered = exampleEvidence.filter(example => example.framework === framework.id);
  examplesPage += `| ${frameworkLabel[framework.id]} | \`${manifests.get(framework.id).name}\` | ${registered.length ? `[컴포넌트 ${new Set(registered.flatMap(example => example.componentIds)).size}개 예제](/examples/${framework.id})` : '아직 없음'} |\n`;
  // These stay published downloads although the page no longer lists them.
  link(`packages/${framework.id}/package.json`); if (existsSync(resolve(root, compatibilityPath))) link(compatibilityPath);
  for (const example of registered) link(example.sourcePath);
  for (const name of ['CatalogExample.tsx','catalog-examples.tsx','examples.tsx','DocsConsumer.svelte','CatalogExamples.vue','ConsumerExample.vue','full-catalog.ts','fixture-app.ts','main.tsx']) { const path = `apps/fixture-${framework.id}/src/${name}`; if (existsSync(resolve(root, path))) link(path); }
}
examplesPage += '\n## 로컬에서 미리보기 열기 {#local-native-previews}\n\n문서를 빌드한 뒤 `node apps/docs/scripts/serve.mjs`를 실행하면 이 사이트와 미리보기를 로컬에서 볼 수 있습니다. 자세한 순서는 [로컬에서 시작하기](../getting-started/installation)에 있습니다.\n';
await write(resolve(site, 'compatibility/examples.md'), examplesPage);
await write(resolve(site, 'compatibility/solid-migration.md'), '# Solid 1 → Solid 2 {#solid-1-→-solid-2}\n\nSolid 2 지원은 미리보기 단계입니다. `@unofficial-krds/solid-next`는 Solid `2.0.0-rc.19`에 맞춘 별도 패키지이고, 아직 일부 컴포넌트만 제공합니다. Solid 1용 `@unofficial-krds/solid`와 한 앱에서 섞어 쓸 수 없습니다.\n\n옮길 때는 이 순서를 권합니다.\n\n1. 의존성을 Solid 2의 `solid-js`와 `@solidjs/web`으로 바꾸고, 컴포넌트 패키지를 `@unofficial-krds/solid-next`로 교체합니다.\n2. `solid-js/web`을 import하던 코드는 `@solidjs/web`으로 바꿉니다.\n3. 속성 이름, 제어 값, 콜백이 받는 값, CSS 토큰은 그대로 씁니다.\n4. 콘텐츠 전달, ref, 생명주기 코드는 Solid 2 문법에 맞게 고칩니다. Solid 1용 JSX 예제가 그대로 동작하지는 않습니다.\n\nSolid 2용 Storybook 통합은 아직 없습니다.\n\n[프레임워크 호환성](./) · [프레임워크별 예제](./examples)\n');
// Release manifests and tarballs are mutable ignored producer outputs. Only this
// reviewed historical checkpoint is an input to protected documentation source.
const artifactCheckpointPath = 'apps/docs/artifact-checkpoint.json';
const artifactCheckpoint = await trackedJson(artifactCheckpointPath);
if (artifactCheckpoint.schemaVersion !== 1 || artifactCheckpoint.kind !== 'historical-artifact-checkpoint' || artifactCheckpoint.currentCandidate !== false || artifactCheckpoint.publicationAuthorized !== false || !Array.isArray(artifactCheckpoint.inventories)) throw new Error('Invalid historical artifact checkpoint scope');
const artifactEvidence = artifactCheckpoint.inventories;
// Keep every reviewed historical declaration download, even if current exports change.
for (const path of frozenDeclarations.keys()) sourceLinks.add(path);
const distributedSources = [];
for (const path of sourceLinks) {
  const source = frozenDeclarations.get(path) ?? await trackedRead(path);
  await write(resolve(site, 'public/sources', `${path}.txt`), source);
  distributedSources.push({ sourcePath: path, outputPath: `sources/${path}.txt`, bytes: Buffer.byteLength(source), sha256: hash(source) });
}
await write(resolve(site, 'public/docs-metadata.json'), JSON.stringify({ schemaVersion: 1, runKind: 'local-documentation-checkpoint', globalCandidate: false, baseline: catalog.krdsBaselineId, webEntryCount: web.length, stableFrameworks: coverage.stableFrameworks, previewFrameworks: coverage.previewFrameworks, examples: exampleEvidence, artifactEvidence, distributedSources, referenceOnlySources: [...referenceOnlySources].map(([sourcePath, url]) => ({ sourcePath, url })), sourceInputs: [...sourceInputs.values()] }, null, 2) + '\n');
console.log(`Generated ${web.length} component pages, ${frameworks.length} native profiles, ${exampleEvidence.length} registered compiler examples.`);
