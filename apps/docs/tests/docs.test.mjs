import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';

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
    assert.ok(text.includes(item.source.sha256), `${item.id}: source SHA`);
    assert.ok(text.includes(item.canonicalUrl), `${item.id}: official source`);
    assert.ok(text.includes(item.nameKo), `${item.id}: Korean search name`);
    for (const framework of profileIds) {
      const row = coverage.coverage.find(record => record.componentId === item.id && record.framework === framework);
      assert.ok(text.includes(`| ${framework}${framework === 'solid-next' ? ' (preview)' : ''} |`), `${item.id}/${framework}: profile`);
      assert.ok(text.includes(`| ${row.status} |`), `${item.id}/${framework}: recorded state`);
    }
    assert.ok(text.includes('## Props, events, content and defaults'));
    assert.ok(text.includes('## Source identity and rights'));
    assert.ok(!/\bas any\b/.test(text), `${item.id}: no example escape hatch`);
  }
});

test('every local Markdown destination resolves to a generated page or local preview route', async () => {
  const failures = [];
  for (const page of await pages(site)) {
    const content = await readFile(page, 'utf8');
    for (const match of content.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
      const target = match[1].split('#')[0];
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
      const bytes = await readFile(resolve(site, 'public/sources', `${proof.path}.txt`));
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
      const target = match[1].replaceAll('&amp;', '&').split(/[?#]/)[0];
      if (!target || /^(?:https?:|mailto:|tel:)/.test(target) || target.startsWith('/native/')) continue;
      const path = target.startsWith('/') ? resolve(output, `.${target}`) : resolve(dirname(page), target);
      if (![path, `${path}.html`, resolve(path, 'index.html')].some(existsSync)) failures.push(`${page}: ${target}`);
    }
  }
  assert.deepEqual(failures, []);
});

test('site configuration keeps search local and documentation avoids external runtime assets', async () => {
  const config = await readFile(resolve(site, '.vitepress/config.mts'), 'utf8');
  assert.ok(config.includes("provider: 'local'"));
  const theme = await readFile(resolve(site, '.vitepress/theme/style.css'), 'utf8');
  assert.ok(theme.includes(':focus-visible'));
  assert.ok(theme.includes('prefers-reduced-motion'));
  const installation = await readFile(resolve(site, 'getting-started/installation.md'), 'utf8');
  const toolchain = await json('compatibility/toolchain.json');
  assert.ok(installation.includes(toolchain.node.version));
  assert.ok(installation.includes(toolchain.packageManager.version));
  const themeEntry = await readFile(resolve(site, '.vitepress/theme/index.ts'), 'utf8');
  assert.ok(themeEntry.includes('theme-without-fonts'));
  for (const page of await pages(site)) {
    const content = await readFile(page, 'utf8');
    assert.ok(!/<(?:script|iframe|img)[^>]+(?:src|href)=["']https?:/i.test(content), page);
  }
});
