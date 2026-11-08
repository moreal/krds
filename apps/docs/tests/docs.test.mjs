import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import postcss from 'postcss';

const site = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const root = resolve(site, '../..');
const json = async path => JSON.parse(await readFile(resolve(root, path), 'utf8'));
const pages = async directory => (await Promise.all((await readdir(directory, { withFileTypes: true })).filter(entry => !['node_modules', 'dist', '.vitepress', 'public'].includes(entry.name)).map(entry => entry.isDirectory() ? pages(resolve(directory, entry.name)) : entry.name.endsWith('.md') ? [resolve(directory, entry.name)] : []))).flat();

test('54 distinct web entries retain exact source identity, states and native profiles', async () => {
  const catalog = await json('catalog/components.json');
  const coverage = await json('catalog/coverage.json');
  const web = catalog.components.filter(item => item.webApplicable);
  assert.equal(web.length, 54);
  const profileIds = [...coverage.stableFrameworks, ...coverage.previewFrameworks];
  const metadata = await json('apps/docs/public/docs-metadata.json');
  assert.equal(metadata.runKind, 'local-documentation-checkpoint');
  assert.equal(metadata.globalCandidate, false);
  for (const framework of coverage.stableFrameworks) {
    const mapped = new Set(metadata.examples.filter(example => example.framework === framework).flatMap(example => example.componentIds));
    assert.deepEqual([...mapped].sort(), web.map(item => item.id).sort(), `${framework}: all 54 compiler checkpoint mappings`);
  }
  for (const item of web) {
    const official = await readFile(resolve(root, item.source.localPath));
    assert.equal(createHash('sha256').update(official).digest('hex'), item.source.sha256, `${item.id}: official source bytes`);
    const text = await readFile(resolve(site, 'components', `${item.id}.md`), 'utf8');
    assert.ok(text.includes('/sources/catalog/components.json.txt'), `${item.id}: frozen source record`);
    assert.ok(!text.includes(item.source.sha256) && !text.includes(item.source.retrievedAt), `${item.id}: machine provenance stays in the record, not the page`);
    assert.ok(text.includes(item.canonicalUrl), `${item.id}: official source`);
    assert.ok(text.includes(`# ${item.nameEn} {#`), `${item.id}: English component title`);
    assert.ok(text.includes(item.nameKo), `${item.id}: Korean search name`);
    for (const framework of profileIds) {
      const row = coverage.coverage.find(record => record.componentId === item.id && record.framework === framework);
      assert.ok(text.includes(`| ${framework}${framework === 'solid-next' ? ' (미리보기)' : ''} |`), `${item.id}/${framework}: profile`);
      assert.ok(text.includes(`| ${row.status} |`), `${item.id}/${framework}: recorded state`);
    }
    assert.ok(text.includes('## 속성·이벤트·콘텐츠·기본값 {#props-events-content-and-defaults}'));
    assert.ok(text.includes('## 출처와 권리 {#source-identity-and-rights}'));
    assert.ok(!/\bas any\b/.test(text), `${item.id}: no example escape hatch`);
  }
});

test('every local Markdown destination resolves to a generated page or local preview route', async () => {
  const failures = [];
  for (const page of await pages(site)) {
    const content = await readFile(page, 'utf8');
    for (const match of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const target = match[1].split('#')[0].replace(/\.html$/, '');
      if (!target || /^https?:\/\//.test(target) || target.startsWith('/native/')) continue;
      const destination = target.startsWith('/sources/') || target.startsWith('/_legal/') ? resolve(site, 'public', `.${target}`) : target.startsWith('/') ? resolve(site, `.${target}`) : resolve(dirname(page), target);
      if (![destination, `${destination}.md`, resolve(destination, 'index.md')].some(existsSync)) failures.push(`${page}: ${target}`);
    }
  }
  assert.deepEqual(failures, []);
});

test('generated metadata binds current source bytes and compiler registrations', async t => {
  const metadata = await json('apps/docs/public/docs-metadata.json');
  assert.equal(metadata.webEntryCount, 54);
  assert.ok(metadata.sourceInputs.length > 60);
  for (const example of metadata.examples) {
    assert.equal(example.status, 'compiler-checked');
    assert.equal(example.publicPackageConsumption, true);
    assert.ok(example.componentIds.length > 0);
    assert.ok(example.evidencePaths.every(path => existsSync(resolve(root, path))));
    assert.equal(example.checkpointOnly, true);
    assert.equal(example.currentCandidate, false);
    assert.ok(example.notes.length > 0);
    const source = await readFile(resolve(site, 'public/sources', `${example.sourcePath}.txt`));
    assert.equal(createHash('sha256').update(source).digest('hex'), example.sourceSha256, `${example.framework}: actual source download`);
    for (const proof of example.proofInputs) {
      const bytes = await readFile(resolve(root, proof.path));
      assert.equal(createHash('sha256').update(bytes).digest('hex'), proof.sha256, proof.path);
    }
  }
  for (const source of metadata.distributedSources) {
    assert.ok(!source.sourcePath.endsWith('.html') || source.sourcePath.startsWith('LICENSES/'), `Raw official HTML must stay reference-only: ${source.sourcePath}`);
    const bytes = await readFile(resolve(site, 'public', source.outputPath));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), source.sha256, source.outputPath);
  }
  t.diagnostic(`Validated ${metadata.examples.length} exact compiler source/proof checkpoints and ${metadata.distributedSources.length} distributed snapshots; live-input freshness follows.`);
  for (const input of metadata.sourceInputs) {
    const bytes = await readFile(resolve(root, input.path));
    assert.equal(createHash('sha256').update(bytes).digest('hex'), input.sha256, input.path);
  }
});

test('built HTML navigation and source-download destinations exist', async () => {
  const output = resolve(site, 'dist');
  assert.ok(existsSync(resolve(output, 'index.html')), 'Build the docs before checking rendered links');
  const visit = async directory => (await Promise.all((await readdir(directory, { withFileTypes: true })).map(entry => entry.isDirectory() ? visit(resolve(directory, entry.name)) : entry.name.endsWith('.html') ? [resolve(directory, entry.name)] : []))).flat();
  const failures = [];
  for (const page of await visit(output)) {
    const html = await readFile(page, 'utf8');
    for (const match of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/g)) {
      let target = match[1].replaceAll('&amp;', '&').split(/[?#]/)[0];
      if (target.startsWith('/krds/')) target = target.slice('/krds'.length);
      else if (target.startsWith('/')) failures.push(`${page}: link escapes Pages base: ${target}`);
      if (!target || /^(?:https?:|mailto:|tel:)/.test(target) || target.startsWith('/native/')) continue;
      const path = target.startsWith('/') ? resolve(output, `.${target}`) : resolve(dirname(page), target);
      if (![path, `${path}.html`, resolve(path, 'index.html')].some(existsSync)) failures.push(`${page}: ${target}`);
    }
  }
  assert.deepEqual(failures, []);
});

test('Astro configuration keeps search local and documentation avoids external runtime assets', async () => {
  const config = await readFile(resolve(site, 'astro.config.mjs'), 'utf8');
  assert.ok(config.includes("base: '/krds/'"));
  assert.ok(config.includes("format: 'preserve'"));
  assert.ok(config.includes('solid()'));
  const search = await readFile(resolve(site, 'src/components/SearchDialog.tsx'), 'utf8');
  assert.ok(search.includes("fetch('/krds/search-index.json')"));
  const theme = await readFile(resolve(site, 'src/styles/layout.css'), 'utf8');
  assert.ok(theme.includes('prefers-reduced-motion'));
  const installation = await readFile(resolve(site, 'getting-started/installation.md'), 'utf8');
  const toolchain = await json('compatibility/toolchain.json');
  assert.ok(installation.includes(toolchain.node.version));
  assert.ok(installation.includes(toolchain.packageManager.version));
  for (const page of await pages(site)) assert.ok(!/<(?:script|iframe|img)[^>]+(?:src|href)=["']https?:/i.test(await readFile(page, 'utf8')), page);
});

test('Pages home is server-rendered with public Solid controls and historical downloads', async () => {
  const html = await readFile(resolve(site, 'dist/index.html'), 'utf8');
  assert.equal([...html.matchAll(/<astro-island\b/g)].length, 1);
  assert.equal([...html.matchAll(/<main\b/g)].length, 1);
  assert.ok(html.includes('id="docs-main"'));
  for (const component of ['skip-link', 'header', 'main-menu', 'side-navigation', 'breadcrumb', 'in-page-navigation', 'footer', 'structured-list', 'link', 'badge', 'button', 'switch']) assert.ok(html.includes(`data-krds-component="${component}"`), component);
  assert.ok(html.replace(/<!--.*?-->/g, '').includes('알림 꺼짐 · 버튼 0회 누름'));
  assert.ok(html.includes('id="docs-home-notifications"'));
  assert.ok(html.includes('href="/krds/getting-started/installation.html"'));
  assert.ok(html.includes('lang="ko-KR"'));
  for (const path of ['components/button.html', 'legal/index.html']) {
    const article = await readFile(resolve(site, 'dist', path), 'utf8');
    assert.ok(article.includes('<html lang="ko-KR"'), `${path}: Korean shell`);
    assert.match(article, /<article[^>]*lang="ko-KR"/, `${path}: Korean article`);
  }
  const korean = await readFile(resolve(site, 'dist/getting-started/installation.html'), 'utf8');
  assert.match(korean, /<article[^>]*lang="ko-KR"/, 'Korean quickstart article');
  const metadata = await json('apps/docs/public/docs-metadata.json');
  assert.ok(!metadata.sourceInputs.some(input => /^(?:packages\/[^/]+|apps\/storybook-[^/]+)\/dist\//.test(input.path)), 'live optional dist must not become public inputs');
  const checkpoint = await json('apps/docs/declaration-checkpoint.json');
  assert.equal(checkpoint.records.length, 385);
  assert.equal(checkpoint.currentCandidate, false);
  for (const record of checkpoint.records) assert.equal(createHash('sha256').update(await readFile(resolve(root, record.checkpointPath))).digest('hex'), record.sha256);
  for (const page of await pages(site)) assert.ok(!/\]\(\/native\//.test(await readFile(page, 'utf8')), `${page}: public site must not link unhosted previews`);
});

test('docs compose public Solid widgets and unmodified registered fonts globally', async () => {
  const components = resolve(site, 'src/components');
  const imports = new Set();
  for (const entry of await readdir(components)) {
    const source = await readFile(resolve(components, entry), 'utf8');
    // Semantic prose and host layout are native; catalog widgets must come from public subpaths.
    assert.doesNotMatch(source, /<(?:button|input|select|textarea|a|ul|ol|li|table|thead|tbody|tr|th|td)\b/, entry);
    assert.doesNotMatch(source, /data-krds-(?:component|part)\s*=/, `${entry}: no identity decoration`);
    assert.doesNotMatch(source, /(?:@unofficial-krds\/(?:vue|react|lit|solid-next)|packages\/solid\/src)/, entry);
    for (const match of source.matchAll(/from ['"]@unofficial-krds\/solid\/([^'"]+)['"]/g)) imports.add(match[1]);
  }
  for (const component of ['skip-link','header','side-navigation','breadcrumb','in-page-navigation','footer','modal','text-input','structured-list','link','badge','button','switch','text-list','table']) assert.ok(imports.has(component), component);
  const layout = await readFile(resolve(site, 'src/layouts/Document.astro'), 'utf8');
  assert.ok(layout.includes("import '@unofficial-krds/styles/reset.css'"));
  assert.ok(layout.includes("import '@unofficial-krds/fonts/fonts.css'"));
  assert.ok(layout.includes('client:load'));
  const assets = resolve(site, 'dist/_astro');
  const css = (await Promise.all((await readdir(assets)).filter(path => path.endsWith('.css')).map(path => readFile(resolve(assets, path), 'utf8')))).join('\n');
  const tree = postcss.parse(css); let fonts = 0; let tokens = 0;
  tree.walkAtRules('font-face', rule => { fonts++; assert.match(rule.toString(), /Pretendard GOV/); });
  tree.walkDecls(decl => { if (decl.prop.startsWith('--krds-')) tokens++; });
  assert.equal(fonts, 3); assert.ok(tokens > 0);
  assert.doesNotMatch(layout, /<(?:button|input|select|textarea|a|ul|ol|li|table|thead|tbody|tr|th|td)\b/);
  const distribution = await json('compliance/distribution-provenance.json');
  const audit = await json('apps/docs/.astro/client-dependencies.json');
  assert.deepEqual(distribution.bundledDependencies.map(({name,version,modules})=>({name,version,modules})), audit);
  for (const record of distribution.bundledDependencies) for (const license of record.licenseDocuments) {
    const source = await readFile(resolve(root, license.localPath));
    assert.equal(createHash('sha256').update(source).digest('hex'), license.sha256);
    for (const target of ['public','dist']) assert.deepEqual(await readFile(resolve(site,target,'_legal',license.localPath)), source);
  }
  assert.equal(distribution.fontAssets.length, 3);
  for (const record of distribution.fontAssets) {
    const source = await readFile(resolve(root, record.sourcePath));
    assert.equal(record.modified, false);
    assert.equal(createHash('sha256').update(source).digest('hex'), record.sha256);
    assert.equal(record.bytes, source.length);
    for (const path of record.destinations) assert.deepEqual(await readFile(resolve(root, path)), source, path);
  }
});
