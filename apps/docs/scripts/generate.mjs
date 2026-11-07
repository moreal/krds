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
  await write(resolve(site, 'patterns', name === 'README.md' ? 'index.md' : name), content + '\n\n> 저장소 참고: 보존된 공식 원본 HTML은 체크아웃의 근거 트리에만 둡니다. 사이트 콘텐츠로 배포하지 않습니다. 위 공식 링크가 1차 출처입니다. 고정된 출처 기록에 수집 시각과 해시가 남아 있습니다.\n');
}
await mkdir(resolve(site, 'components'), { recursive: true });
let index = '# 컴포넌트 목록 {#component-catalog}\n\n고정된 카탈로그에서 생성한 웹 적용 항목 54개입니다. 검색 버튼(또는 Ctrl/Cmd+K)으로 영문 이름, 한국어 이름, API, 키보드 안내를 검색합니다. 스플래시 화면(Splash screen)은 플랫폼 전용이므로 이 웹 카탈로그에서 제외합니다.\n\n**지원 현황은 기록된 커버리지에서 가져옵니다.** export나 컴파일러 검사 성공만으로는 네이티브 동작이 검증되지 않습니다. Solid 2는 격리된 미리보기입니다. 안정 커버리지에 절대 포함되지 않습니다.\n\n| 컴포넌트 | 한국어 이름 | 완료 종류 | 케이스 |\n| --- | --- | --- | --- |\n';
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
  const title = example.componentIds.length === 1 ? `${example.componentIds[0]} · ${example.framework} {#${example.componentIds[0]}-·-${example.framework}}` : `${example.framework} · 컴포넌트 ${example.componentIds.length}개 {#${example.framework}-·-${example.componentIds.length}-components}`;
  const notes = (example.notes ?? []).map(note => `- ${safeProse(note)}\n`).join('');
  examplePages.push({ path: resolve(site, 'examples', `${example.framework}-${exampleEvidence.length}.md`), text: `# ${title}\n\n이 컴파일러 체크포인트는 아래 소스를 생산자의 공개 빌드 패키지 검사에 묶습니다. 원래의 import와 로컬 상태를 포함합니다. 최신 네이티브 후보, 동작, SSR/resume, 릴리스를 인증하지 않습니다.\n\n${notes}\n소스: ${link(example.sourcePath)}. SHA-256: \`${example.sourceSha256}\`.\n\n명령: \`${example.command}\`. ${example.evidencePaths.map(path => link(path, '원본 컴파일러 근거')).join(' · ')}.\n\n${code(source, extname(example.sourcePath).slice(1))}\n` });
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
  index += `| [${component.nameEn}](./${component.id}) | ${component.nameKo} | ${component.kind} | ${component.variants.map(value => `\`${value}\``).join(', ')} |\n`;
  // The h1 anchor keeps the English-name slug the published URLs already use (e.g. `critical-alerts`).
  const titleAnchor = slugify(component.nameEn);
  if (!anchorPattern.test(titleAnchor)) throw new Error(`Component title anchor is not a valid explicit anchor: ${component.id}: ${titleAnchor}`);
  let page = `---\ntitle: '${component.nameKo.replaceAll("'", "''")} · ${component.nameEn.replaceAll("'", "''")}'\n---\n\n# ${component.nameKo} {#${titleAnchor}}\n\n${component.nameEn} · \`${component.exportName}\` · ${component.kind}\n\n[KRDS 공식 안내](${component.canonicalUrl}) · ${link(component.specPath, '검토된 전체 명세')} · [프레임워크 지원](../compatibility/)\n\n## 네이티브 지원 현황 {#native-availability}\n\n아래 상태는 \`catalog/coverage.json\`에서 그대로 가져옵니다. export, 예제, 테스트 실행기 종료 코드에서 추론하지 않습니다.\n\n| 프레임워크 | 패키지 버전 | 기록된 상태 | export 선언 | 네이티브 예제와 스토리 |\n| --- | --- | --- | --- | --- |\n`;
  for (const framework of frameworks) {
    const manifest = manifests.get(framework.id);
    const record = coverage.coverage.find(row => row.framework === framework.id && row.componentId === component.id);
    const exported = Object.hasOwn(manifest.exports ?? {}, `./${component.id}`);
    const publicEntry = manifest.exports?.[`./${component.id}`] ?? manifest.exports?.['.'];
    const typesEntry = typeof publicEntry === 'object' ? publicEntry.types : undefined;
    const typePath = typesEntry ? `packages/${framework.id}/${typesEntry.replace(/^\.\//, '')}` : undefined;
    const declarationLink = link(`packages/${framework.id}/package.json`, exported ? '현재 하위 경로 매니페스트' : '현재 루트 매니페스트') + (typePath && frozenDeclarations.has(typePath) ? `; ${link(typePath, '과거 선언 체크포인트')}` : '');
    page += `| ${framework.id}${framework.supportChannel.includes('preview') ? ' (미리보기)' : ''} | \`${manifest.version}\` | ${record?.status ?? '기록 없음'} | ${declarationLink} | [${framework.id} 소스와 미리보기 정책](../compatibility/examples#${framework.id}) |\n`;
  }
  page += '\n## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}\n\n아래 의미 계약은 공유 데이터일 뿐입니다. 네이티브 콘텐츠, ref, 이벤트 전달은 각 어댑터가 맡습니다. 계약의 콜백 이름과 detail 타입은 그대로 씁니다. 머신 객체를 전달하지 않습니다. 선택 속성에는 기본값이 자동으로 채워지지 않습니다. 아래 안내의 명시적 기본값을 씁니다.\n';
  if (contract) page += code(contract);
  else page += `\n공개 API는 아래 검토된 안내와 각 네이티브 공개 선언이 정의합니다. ${link('packages/contracts/src/types.ts', '공유 이벤트·날짜 타입')}.\n`;
  const properties = semanticProperties(component.exportName);
  if (properties.length) page += '\n| 의미 속성 / 콜백 | 필수 | 정확한 타입 | 역할 |\n| --- | --- | --- | --- |\n' + properties.map(([name, property]) => `| \`${name}\` | ${property.required ? '예' : '아니요'} | \`${property.type.replaceAll('|', '\\|')}\` | ${property.event ? '의미 이벤트 요청' : '데이터 / 상태'} |\n`).join('') + '\n선택 값과 명시적 기본값은 다릅니다. 기본값과 네이티브 콘텐츠 요구사항은 아래 검토된 안내에 있습니다.\n';
  page += '\n### 네이티브 콘텐츠와 이벤트 전달 {#native-content-and-event-transport}\n\nReact와 Solid는 네이티브 JSX/콘텐츠 prop을 씁니다. Svelte는 네이티브 snippet을 씁니다. Vue는 네이티브 슬롯을 씁니다. Angular는 네이티브 input, output, 콘텐츠 투영을 씁니다. Lit은 custom element 속성, 슬롯, DOM 이벤트를 씁니다. Qwik은 네이티브 QRL 이벤트 경계를 씁니다. 이 전달 방식은 서로 바꿔 쓸 수 없습니다. 정확한 이름과 필수 콘텐츠는 링크된 공개 패키지 선언에서 확인합니다. 아래 의미 콜백이 같은 이름의 Lit DOM 이벤트를 뜻하지는 않습니다.\n';
  for (const section of selected) page += `\n### ${section.heading} {#${section.anchor}}\n\n${safeProse(section.body.replaceAll(/\[([^\]]+)\]\(([^)]+)\)/g, (all, label, path) => /^https?:/.test(path) ? all : link(relative(root, resolve(root, 'specs/components', path)), label)))}\n`;
  const cases = stories.cases.filter(item => (item.componentId ?? item.id?.split('--')[0]) === component.id);
  page += `\n## 상태 예제와 네이티브 검사 {#state-examples-and-native-checks}\n\n지원하는 케이스 축: ${component.variants.map(value => `\`${value}\``).join(', ')}. 이 케이스 이름은 프로젝트의 독립 축입니다. 공식 KRDS 유형 이름이나 완료된 커버리지를 뜻하지 않습니다.\n\n${link('catalog/full-catalog-stories.json', '필수 네이티브 스토리 매니페스트')} · ${link('catalog/story-cases.json', '파일럿 스토리 매니페스트')} · ${link('catalog/coverage.json', '커버리지 근거와 네이티브 리뷰 링크')}\n`;
  if (cases.length) page += `\n필수 전체 카탈로그 스토리: ${cases.map(item => `\`${item.storyId ?? item.id}\``).join(', ')}.\n`;
  page += '\n### 로컬 네이티브 스토리 {#local-native-stories}\n\n픽스처와 Storybook 출력은 로컬 전용입니다. 이 공개 문서 사이트에 올리지 않습니다. 로컬 문서 서버도 그쪽으로 리디렉션하지 않습니다. 각 네이티브 Storybook은 자기 워크스페이스 스크립트로 실행합니다. 컴포넌트 페이지에서 조작할 수 있는 예제는 `/krds/previews/<framework>/` 아래에 조립된 네이티브 미리보기입니다. Solid 2에는 지원되는 네이티브 Storybook 통합이 없습니다. Qwik 프로덕션 SSR/resume에는 실제 서버가 필요합니다. 정적 미리보기로 대신할 수 없습니다. 스토리가 있다고 동작 인수가 성립하지는 않습니다.\n';
  const examples = exampleEvidence.filter(example => example.componentIds.includes(component.id));
  page += examples.length ? '\n네이티브 컴파일러 체크포인트입니다. 소스 해시는 문서를 빌드할 때마다 검증합니다. 이 기록은 최신 네이티브 후보나 동작 인수를 인증하지 않습니다. 검사된 소스 페이지마다 체크포인트 범위가 적혀 있습니다.\n\n' + examples.map(example => `- ${example.framework}: [검사된 소비 코드 보기](/examples/${example.framework}-${exampleEvidence.indexOf(example) + 1}); ${link(example.sourcePath, '소스 그대로 내려받기')}; ${example.evidencePaths.map(path => link(path, '컴파일러 근거')).join(', ')}.\n`).join('') : '\n문서 색인에 등록된 컴포넌트별 컴파일러 근거가 아직 없습니다. 네이티브 픽스처 소스는 [예제 목록](../compatibility/examples)에 링크되어 있습니다. 소스가 있다는 사실만으로는 컴파일 결과가 아닙니다.\n';
  page += `\n## 출처와 권리 {#source-identity-and-rights}\n\n기준선: \`${catalog.krdsBaselineId}\`. 공식 상세 스냅숏 수집 시각: \`${component.source.retrievedAt}\`. SHA-256: \`${component.source.sha256}\`. ${link('catalog/components.json', '고정된 컴포넌트 출처 기록')} · [공식 출처](${component.canonicalUrl}). 원본 HTML은 체크아웃의 참고 근거로만 남습니다. 이 사이트에 복사하지 않습니다.\n\nKRDS에서 인용하거나 파생한 안내는 원래 조건을 따릅니다. 독립 코드의 MIT 허가는 이 안내, 공식 자산, 글꼴, 제3자 자료를 재라이선스하지 않습니다. 재배포 전에 [출처와 권리](../legal/)를 읽어야 합니다.\n`;
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
matrix += '\n## 근거의 의미 {#what-the-evidence-means}\n\n`planned`는 작업을 예약한 상태입니다. `in-progress`는 진행 중인 작업을 기록합니다. `implemented`는 완전한 인수 없이 구현만 기록합니다. `blocked`는 해결되지 않은 관문을 기록합니다. `verified`에는 커버리지 스키마가 정한 컨트롤러 소유 네이티브 근거와 독립 리뷰가 필요합니다. 미리보기는 안정 합계와 분리됩니다. 기록된 상태는 각 컴포넌트 페이지에서 확인합니다.\n\n## 패키지와 브라우저 경계 {#package-and-browser-boundaries}\n\nQwik은 Vite 7을 씁니다. 나머지 선택된 네이티브 Vite 워크스페이스는 Vite 8을 씁니다. Angular는 자체 CLI/ng-packagr의 partial APF 출력과 CVA 폼을 맡습니다. Solid 1과 Solid 2는 런타임, 컴파일러, 렌더러 그래프가 서로 격리됩니다. Svelte 2/3은 현재 안정 대상이 아닙니다. 선언된 피어 범위가 그 안의 모든 버전을 테스트했다는 근거는 아닙니다.\n\n[네이티브 예제와 컴파일러 근거](./examples) · [Solid 1 → 2](./solid-migration) · [테스트 역할](../getting-started/testing)\n';
await write(resolve(site, 'compatibility/index.md'), matrix);
await write(resolve(root, 'docs/compatibility/README.md'), matrix);
let examplesPage = '# 네이티브 예제 {#native-examples}\n\n각 구현은 자기 픽스처와 Storybook을 소유합니다. 안정 네이티브 대상 7개 모두 웹 항목 54개를 매핑하는 컴파일러 체크포인트가 있습니다. 소스 해시와 원본 컴파일러 근거를 검증합니다. 소스가 바뀌면 문서 빌드에서 체크포인트가 무효가 됩니다. 체크포인트 범위는 최신 네이티브 후보, 동작 인수, 릴리스 준비와 별개입니다.\n\n## 체크포인트 커버리지 {#checkpoint-coverage}\n\n| 프레임워크 | 컴포넌트 매핑 수 | 범위 |\n| --- | --- | --- |\n' + coverage.stableFrameworks.map(framework => `| [${framework}](#${framework}) | ${new Set(exampleEvidence.filter(example => example.framework === framework).flatMap(example => example.componentIds)).size} | 생산자 컴파일러 체크포인트, 네이티브 인수 아님 |\n`).join('') + '\n## 로컬 네이티브 미리보기 {#local-native-previews}\n\n각 프레임워크는 자기 `docs-preview` 아티팩트를 빌드합니다. 문서 빌드는 이 아티팩트를 검증해 `/krds/previews/<framework>/`에 조립합니다. 이 사이트가 게시하는 트리와 같습니다. 문서를 빌드한 뒤 `node apps/docs/scripts/serve.mjs`를 실행하면 조립된 `/krds/` 트리를 로컬에서 제공합니다. 이 서버는 네이티브 앱을 다시 빌드하지 않습니다. 픽스처나 Storybook 서버로 리디렉션하지 않습니다. 없는 출력을 만들어 내지도 않습니다. 없는 파일에는 명시적인 404를 반환합니다.\n\n';
for (const framework of frameworks) {
  const compatibilityPath = `docs/compatibility/${framework.id === 'solid-next' ? 'solid-2' : framework.id}.md`;
  examplesPage += `\n## ${framework.id} {#${framework.id}}\n\n${link(`packages/${framework.id}/package.json`, '공개 패키지 export와 스크립트')} · ${link(`apps/fixture-${framework.id}/package.json`, '네이티브 픽스처 빌드 스크립트')} · ${existsSync(resolve(root, compatibilityPath)) ? link(compatibilityPath, '네이티브 제약과 근거') : '네이티브 호환성 보고서가 아직 없습니다'}\n\n조립된 미리보기 루트: \`/krds/previews/${framework.id}/\`${framework.id === 'qwik' ? ' (사전 렌더링된 정적 컴포넌트 페이지입니다. 프로덕션 SSR/resume 픽스처 테스트는 여전히 매니페스트의 네이티브 서버를 씁니다)' : ''} · ${framework.id !== 'solid-next' && existsSync(resolve(root, `apps/storybook-${framework.id}/package.json`)) ? '네이티브 Storybook: 로컬 워크스페이스 스크립트 전용' : '지원되는 네이티브 Storybook 통합이 선언되지 않았습니다'}\n\n`;
  const registered = exampleEvidence.filter(example => example.framework === framework.id);
  for (const example of registered) examplesPage += `**컴파일러 체크포인트:** [네이티브 소스 보기](/examples/${example.framework}-${exampleEvidence.indexOf(example) + 1}) · ${link(example.sourcePath, '소스 그대로 내려받기')}\n\n${(example.notes ?? []).map(note => `${safeProse(note)}\n\n`).join('')}명령: \`${example.command}\`. 컴포넌트 ID: ${example.componentIds.map(id => `\`${id}\``).join(', ')}. 소스 SHA-256 \`${example.sourceSha256}\`. 근거: ${example.evidencePaths.map(path => link(path)).join(', ')}.\n\n`;
  if (!registered.length) examplesPage += '컴포넌트별 컴파일러 근거가 아직 등록되지 않았습니다. 아래는 실제 소스 참조입니다. 컴파일 결과나 지원 주장이 아닙니다.\n\n';
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
let artifactsPage = '# 과거 로컬 아티팩트 기록 {#historical-local-artifact-records}\n\n아래 패키지 식별자, 버전, 로컬 파일 이름, 해시는 검토된 문서 체크포인트에서 캡처한 과거 관측값입니다. 이번 문서 빌드에서 다시 확인하지 않습니다. 이 생성기는 현재 아티팩트 인벤토리, 매니페스트, 타르볼을 읽거나 조회하지 않습니다. 이 기록은 현재 네이티브 후보, 공개 npm 제공, 게시 허가를 뜻하지 않습니다.\n\n';
artifactsPage += `체크포인트: ${link(artifactCheckpointPath, '과거 기록 그대로 내려받기')}. 원본 메타데이터 SHA-256: \`${artifactCheckpoint.origin.metadataSha256}\`. 원본 메타데이터 경로는 과거 식별자입니다. 현재 바이트에 대한 주장이 아닙니다.\n\n`;
artifactsPage += '현재 후보 기록이 만들어지면 체크아웃의 \`artifacts/manifest.json\`에 있습니다. 현재 패키지 바이트와 소스/빌드 인수는 T14 타르볼 검사기, 외부 소비자, T16 후보 검증기로 확인합니다. 이 과거 페이지는 그 가변 기록이 지금 있는지 알려 주지 않습니다. 타르볼을 설치하기 전에 [로컬 설치 안내](./installation)와 현재 후보 생산자 기록을 따라야 합니다.\n\n';
for (const inventory of artifactEvidence) {
  artifactsPage += `## ${inventory.path}\n\n기록된 과거 상태: \`${inventory.status}\`. 캡처 시 디버그 전용: **${inventory.debugOnly ? '예' : '아니요'}**. 이 체크포인트는 어떤 게시도 허가하지 않습니다.\n\n| 패키지 | 캡처된 버전 | 과거 로컬 경로 | 기록된 SHA-256 | 캡처 시 관측된 SHA-256 | 캡처 시 무결성 |\n| --- | --- | --- | --- | --- | --- |\n`;
  for (const entry of inventory.packages) artifactsPage += `| \`${entry.name}\` | \`${entry.version}\` | \`${entry.path}\` | \`${entry.recordedSha256}\` | \`${entry.observedSha256 ?? '관측 안 됨'}\` | ${entry.integrity} |\n`;
}
artifactsPage += `\n${link('docs/execution/evidence/T14/reports/task-T14-report.md', '원본 T14 생산자 보고서')} · [출처와 권리](../legal/). 원본 디버그 인벤토리와 Solid 수정 디버그 인벤토리는 서로 다릅니다. 둘을 합쳐 최종 인수 주장으로 삼아서는 안 됩니다.\n`;
await write(resolve(site, 'getting-started/artifacts.md'), artifactsPage);
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
