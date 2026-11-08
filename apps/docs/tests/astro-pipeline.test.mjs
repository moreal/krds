import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { moveNativeAvailabilityLast } from '../scripts/demo-placement.mjs';

const site = resolve(import.meta.dirname, '..');
const root = resolve(site, '../..');
const json = async path => JSON.parse(await readFile(path, 'utf8'));
const hash = bytes => createHash('sha256').update(bytes).digest('hex');

test('Astro pipeline retains directory indexes and .html pages with public Solid SSR', async () => {
  assert.ok(existsSync(resolve(site, 'astro.config.mjs')), 'Astro pipeline configuration must exist');
  const baseline = await json(resolve(site, 'tests/fixtures/vitepress-baseline.json'));
  const routes = await json(resolve(site, 'src/generated/routes.json'));
  const pages = await json(resolve(site, 'src/generated/pages.json'));
  const navigation = await json(resolve(site, 'src/generated/navigation.json'));
  assert.deepEqual(navigation.flatMap(section => (section.children??[section]).map(page => page.id)).sort(), pages.filter(page => page.sourcePath && page.sourcePath !== 'index.md').map(page => page.currentId).sort(), 'each non-home document belongs to one navigation section or direct leaf');
  assert.deepEqual(routes.map(route => route.outputPath).sort(), baseline.pages.map(page => page.path).sort());
  for (const route of routes) assert.ok(existsSync(resolve(site, 'dist', route.outputPath)), route.outputPath);
  const html = await readFile(resolve(site, 'dist/components/button.html'), 'utf8');
  assert.match(html, /data-krds-component="link"/);
  assert.match(html, /data-krds-component="table"/);
  assert.match(html, /속성·이벤트·콘텐츠·기본값/);
  // Component pages with native demos apply exactly the documented availability relocation
  // (shared rule); every other page keeps the baseline order strictly.
  const demoPages = new Set(pages.filter(page => page.demos?.length && /^components\/[^/]+\.md$/.test(page.sourcePath ?? '')).map(page => page.outputPath));
  for (const page of baseline.pages) {
    const built = await readFile(resolve(site, 'dist', page.path), 'utf8');
    const headings = [...built.matchAll(/<h([1-6])\b[^>]*\bid="([^"]+)"/g)].map(match => ({ level: Number(match[1]), id: match[2] }));
    const ids = headings.map(heading => heading.id);
    assert.equal(new Set(ids).size, ids.length, `${page.path}: heading IDs are unique`);
    assert.deepEqual([...ids].sort(), [...page.headingIds].sort(), `${page.path}: every baseline heading ID occurs exactly once`);
    const level = new Map(headings.map(heading => [heading.id, heading.level]));
    const expected = demoPages.has(page.path) ? moveNativeAvailabilityLast(page.headingIds, id => ({ id, level: level.get(id) })) : page.headingIds;
    assert.deepEqual(ids, expected, page.path);
  }
  assert.match(html, /\/krds\//);
  assert.doesNotMatch(html, /_astro\/[^" ]*solid-next/);
});

test('migration downloads and historical identities follow the explicit current-input allowlist', async () => {
  const baseline = await json(resolve(site, 'tests/fixtures/vitepress-baseline.json'));
  const allowlist = await json(resolve(site, 'migration-current-inputs.json'));
  const metadata = await json(resolve(site, 'public/docs-metadata.json'));
  assert.equal(baseline.downloads.length, 547);
  assert.equal(baseline.declarations.length, 385);
  assert.equal(baseline.checkpoints.length, 62);
  const current = new Map(metadata.distributedSources.map(record => [record.outputPath, record]));
  assert.deepEqual([...current.keys()].sort(), baseline.downloads.map(record => record.outputPath));
  const changed = [];
  for (const before of baseline.downloads) {
    const bytes = await readFile(resolve(site, 'public', before.outputPath));
    const after = { bytes: bytes.length, sha256: hash(bytes) };
    assert.equal(after.sha256, current.get(before.outputPath).sha256, before.outputPath);
    if (before.sha256 !== after.sha256) {
      const allowed = allowlist.records.find(record => record.sourcePath === before.sourcePath);
      assert.ok(allowed && before.kind === 'current-input', `unlisted or historical change: ${before.sourcePath}`);
      assert.equal(after.sha256, hash(await readFile(resolve(root, before.sourcePath))), `current bytes: ${before.sourcePath}`);
      changed.push({ sourcePath: before.sourcePath, before: before.sha256, after: after.sha256, reason: allowed.reason });
    }
  }
  for (const record of baseline.declarations) assert.equal(hash(await readFile(resolve(root, record.checkpointPath))), record.sha256, record.checkpointPath);
  for (const checkpoint of baseline.checkpoints) for (const proof of checkpoint.proofInputs) assert.equal(hash(await readFile(resolve(root, proof.path))), proof.sha256, proof.path);
  const report = await json(resolve(site, 'migration-current-input-diff.json'));
  assert.deepEqual(report.changes, changed);
});
