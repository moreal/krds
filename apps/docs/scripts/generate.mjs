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
const prettyPeers = manifest => Object.entries(manifest.peerDependencies ?? {}).map(([name, version]) => `\`${name}@${version}\``).join('<br>') || '선언된 런타임 피어 없음';
const countStates = id => {
  const rows = coverage.coverage.filter(row => row.framework === id);
  return [...new Set(rows.map(row => row.status))].map(status => `${rows.filter(row => row.status === status).length} ${status}`).join(', ');
};
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
  const nameOf = id => web.find(component => component.id === id)?.nameEn ?? id;
  const title = example.componentIds.length === 1 ? `${nameOf(example.componentIds[0])} · ${example.framework} {#${example.componentIds[0]}-·-${example.framework}}` : `${example.framework} · 컴포넌트 ${example.componentIds.length}개 {#${example.framework}-·-${example.componentIds.length}-components}`;
  examplePages.push({ path: resolve(site, 'examples', `${example.framework}-${exampleEvidence.length}.md`), text: `# ${title}\n\n공개 \`@unofficial-krds/${example.framework}\` 패키지를 사용하는 예제 코드입니다. 컴파일 검사를 통과한 소스를 그대로 싣습니다. ${link(example.sourcePath, '소스 파일 내려받기')}.\n\n${code(source, extname(example.sourcePath).slice(1))}\n` });
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
  let page = `---\ntitle: '${component.nameEn.replaceAll("'", "''")}'\n---\n\n# ${component.nameEn} {#${titleAnchor}}\n\n${component.nameKo} · \`${component.exportName}\`\n\n[KRDS 공식 안내](${component.canonicalUrl}) · ${link(component.specPath, '전체 명세')} · [프레임워크 지원](../compatibility/)\n\n## 네이티브 지원 현황 {#native-availability}\n\n상태는 기록된 커버리지 기준입니다. [상태의 의미](../compatibility/#what-the-evidence-means)를 참고하세요.\n\n| 프레임워크 | 패키지 버전 | 상태 | 예제 |\n| --- | --- | --- | --- |\n`;
  for (const framework of frameworks) {
    const manifest = manifests.get(framework.id);
    const record = coverage.coverage.find(row => row.framework === framework.id && row.componentId === component.id);
    page += `| ${framework.id}${framework.supportChannel.includes('preview') ? ' (미리보기)' : ''} | \`${manifest.version}\` | ${record?.status ?? '기록 없음'} | [${framework.id} 예제](../compatibility/examples#${framework.id}) |\n`;
  }
  page += '\n## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}\n\n모든 프레임워크가 공유하는 의미 계약입니다. 콜백 이름과 detail 타입은 그대로 씁니다. 네이티브 콘텐츠, ref, 이벤트 전달은 각 어댑터가 맡습니다. 선택 속성의 기본값은 자동으로 채워지지 않으므로 아래 안내의 명시적 기본값을 씁니다.\n';
  if (contract) page += code(contract);
  else page += `\n공개 API는 아래 검토된 안내와 각 네이티브 공개 선언이 정의합니다. ${link('packages/contracts/src/types.ts', '공유 이벤트·날짜 타입')}.\n`;
  const properties = semanticProperties(component.exportName);
  if (properties.length) page += '\n| 속성 / 콜백 | 필수 | 타입 | 역할 |\n| --- | --- | --- | --- |\n' + properties.map(([name, property]) => `| \`${name}\` | ${property.required ? '예' : '아니요'} | \`${property.type.replaceAll('|', '\\|')}\` | ${property.event ? '이벤트' : '데이터 / 상태'} |\n`).join('') + '';
  page += '\n### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}\n\nReact와 Solid는 JSX/콘텐츠 prop, Svelte는 snippet, Vue는 슬롯, Angular는 input·output·콘텐츠 투영, Lit은 custom element 속성·슬롯·DOM 이벤트, Qwik은 QRL 이벤트 경계를 씁니다. 정확한 이름과 필수 콘텐츠는 각 패키지의 공개 선언에서 확인합니다. 아래 콜백 이름이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.\n';
  for (const section of selected) page += `\n### ${section.heading} {#${section.anchor}}\n\n${safeProse(section.body.replaceAll(/\[([^\]]+)\]\(([^)]+)\)/g, (all, label, path) => /^https?:/.test(path) ? all : link(relative(root, resolve(root, 'specs/components', path)), label)))}\n`;
  page += `\n## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}\n\n케이스: ${component.variants.map(value => `\`${value}\``).join(', ')}. 프로젝트가 정한 축이며 공식 KRDS 유형 이름은 아닙니다.\n`;
  page += '\n### 로컬 네이티브 스토리 {#local-native-stories}\n\n이 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/`에 조립된 네이티브 미리보기입니다. 픽스처와 Storybook은 로컬 전용이며 이 사이트에 올리지 않습니다. Solid 2에는 Storybook 통합이 없고, Qwik 프로덕션 SSR/resume은 실제 서버가 필요합니다.\n';
  const examples = exampleEvidence.filter(example => example.componentIds.includes(component.id));
  page += examples.length ? `\n프레임워크별 예제 코드: ${examples.map(example => `[${example.framework}](/examples/${example.framework}-${exampleEvidence.indexOf(example) + 1})`).join(' · ')}.\n` : '\n이 컴포넌트의 예제 코드는 아직 없습니다. [예제 목록](../compatibility/examples)을 참고하세요.\n';
  page += `\n## 출처와 권리 {#source-identity-and-rights}\n\n이 안내는 [공식 KRDS 문서](${component.canonicalUrl})를 바탕으로 합니다. 수집 시각과 원본 해시는 ${link('catalog/components.json', '출처 기록')}에 있습니다. 원본 HTML은 이 사이트에 복사하지 않습니다.\n\nKRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.\n`;
  await write(resolve(site, 'components', `${component.id}.md`), page);
  await write(resolve(root, 'docs/components', `${component.id}.md`), page.replaceAll('../compatibility/', '../compatibility/README.md').replaceAll('../legal/', '../legal/index.md'));
}
await write(resolve(site, 'components/index.md'), index);
await write(resolve(root, 'docs/components/README.md'), index);
let matrix = '# 프레임워크 호환성 {#framework-compatibility}\n\n버전, 피어 범위, 지원 상태는 현재 네이티브 패키지 매니페스트, 호환성 대상, 커버리지 기록에서 생성합니다. 안정 **대상**이라고 해서 54개 컴포넌트가 모두 인수를 통과했다는 뜻은 아닙니다. 독립 리뷰, 동작 근거, 시각 검사, 출처 권리, 격리된 소비는 각각 별도 관문입니다.\n\n| 네이티브 렌더러 | 패키지 | 선택한 런타임/컴파일러 | 공개 피어 | 기록된 커버리지 |\n| --- | --- | --- | --- | --- |\n';
for (const framework of frameworks) {
  const manifest = manifests.get(framework.id);
  matrix += `| ${framework.renderer}${framework.supportChannel.includes('preview') ? ' · **미리보기**' : ''} | \`${manifest.name}@${manifest.version}\` | ${Object.entries(framework.pins).map(([name, version]) => `\`${name}@${version}\``).join('<br>')} | ${prettyPeers(manifest)} | ${countStates(framework.id)} |\n`;
}
matrix += '\n## 근거의 의미 {#what-the-evidence-means}\n\n`planned`는 작업을 예약한 상태입니다. `in-progress`는 진행 중인 작업을 기록합니다. `implemented`는 완전한 인수 없이 구현만 기록합니다. `blocked`는 해결되지 않은 관문을 기록합니다. `verified`에는 커버리지 스키마가 정한 컨트롤러 소유 네이티브 근거와 독립 리뷰가 필요합니다. 미리보기는 안정 합계와 분리됩니다. 기록된 상태는 각 컴포넌트 페이지에서 확인합니다.\n\n## 패키지와 브라우저 경계 {#package-and-browser-boundaries}\n\nQwik은 Vite 7을 씁니다. 나머지 선택된 네이티브 Vite 워크스페이스는 Vite 8을 씁니다. Angular는 자체 CLI/ng-packagr의 partial APF 출력과 CVA 폼을 맡습니다. Solid 1과 Solid 2는 런타임, 컴파일러, 렌더러 그래프가 서로 격리됩니다. Svelte 2/3은 현재 안정 대상이 아닙니다. 선언된 피어 범위가 그 안의 모든 버전을 테스트했다는 근거는 아닙니다.\n\n[네이티브 예제](./examples) · [Solid 1 → 2](./solid-migration) · [테스트 역할](../getting-started/testing)\n';
await write(resolve(site, 'compatibility/index.md'), matrix);
await write(resolve(root, 'docs/compatibility/README.md'), matrix);
let examplesPage = '# 네이티브 예제 {#native-examples}\n\n프레임워크마다 공개 패키지를 사용하는 예제 코드와 조립된 미리보기가 있습니다. 예제는 컴파일 검사를 통과한 소스이며, 동작 검증이나 릴리스 준비를 뜻하지는 않습니다.\n\n## 예제 커버리지 {#checkpoint-coverage}\n\n| 프레임워크 | 예제가 있는 컴포넌트 수 |\n| --- | --- |\n' + coverage.stableFrameworks.map(framework => `| [${framework}](#${framework}) | ${new Set(exampleEvidence.filter(example => example.framework === framework).flatMap(example => example.componentIds)).size} |\n`).join('') + '\n## 로컬 네이티브 미리보기 {#local-native-previews}\n\n각 프레임워크의 미리보기는 `/krds/previews/<framework>/`에 조립됩니다. 문서를 빌드한 뒤 `node apps/docs/scripts/serve.mjs`를 실행하면 같은 트리를 로컬에서 볼 수 있습니다. 이 서버는 네이티브 앱을 다시 빌드하지 않으며 없는 파일에는 404를 반환합니다.\n\n';
for (const framework of frameworks) {
  const compatibilityPath = `docs/compatibility/${framework.id === 'solid-next' ? 'solid-2' : framework.id}.md`;
  examplesPage += `\n## ${framework.id} {#${framework.id}}\n\n${link(`packages/${framework.id}/package.json`, '패키지 매니페스트')}${existsSync(resolve(root, compatibilityPath)) ? ` · ${link(compatibilityPath, '호환성 보고서')}` : ''}\n\n미리보기: \`/krds/previews/${framework.id}/\`${framework.id === 'qwik' ? ' (사전 렌더링된 정적 페이지입니다. 프로덕션 SSR/resume은 네이티브 서버가 필요합니다)' : ''}${framework.id === 'solid-next' ? ' · Storybook 통합 없음' : ''}\n\n`;
  const registered = exampleEvidence.filter(example => example.framework === framework.id);
  for (const example of registered) examplesPage += `- [예제 코드 보기](/examples/${example.framework}-${exampleEvidence.indexOf(example) + 1}) · ${link(example.sourcePath, '소스 파일 내려받기')} · 컴포넌트 ${example.componentIds.length}개\n`;
  if (!registered.length) examplesPage += '등록된 예제 코드가 아직 없습니다. 아래는 픽스처 소스입니다.\n\n';
  const candidates = ['CatalogExample.tsx','catalog-examples.tsx','examples.tsx','DocsConsumer.svelte','CatalogExamples.vue','ConsumerExample.vue','full-catalog.ts','fixture-app.ts','main.tsx'];
  for (const name of candidates) { const path = `apps/fixture-${framework.id}/src/${name}`; if (existsSync(resolve(root, path))) examplesPage += `- ${link(path)}\n`; }
}
await write(resolve(site, 'compatibility/examples.md'), examplesPage);
await write(resolve(site, 'compatibility/solid-migration.md'), '# Solid 1 → Solid 2 {#solid-1-→-solid-2}\n\nSolid 2는 `2.0.0-rc.19` 런타임, 렌더러, 컴파일러로 고정한 격리된 미리보기입니다. 안정 Solid 1 어댑터의 피어 범위를 넓힌 것이 아닙니다. `@unofficial-krds/solid-next`는 자기 매니페스트 도구 체인과 미리보기 픽스처에서만 씁니다. `solid-js` 세대를 섞지 않습니다. Solid 2 렌더러에 `solid-js/web`을 import하지 않습니다. 모든 런타임을 저장소 루트에서 해석하지 않습니다.\n\n먼저 의미 데이터, 제어(controlled) 값, 콜백 페이로드, CSS 토큰을 옮깁니다. 그다음 선택된 Solid 2 선언과 컴파일러에 맞춰 네이티브 콘텐츠·ref·생명주기 사용을 옮깁니다. Solid 1 JSX 예제가 자동으로 Solid 2 예제가 되지는 않습니다.\n\n미리보기에는 지원되는 upstream siheom이나 안정 네이티브 Storybook 통합이 없습니다. 네이티브 미리보기 빌드, SSR, 브라우저 근거는 따로 기록합니다. [버전과 상태](./) · [네이티브 소스 예제](./examples#solid-next).\n');
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
