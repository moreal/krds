import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { verifySiblingPreservation } from './sibling-outputs.mjs';

function fixture(t) {
 const root = mkdtempSync(join(tmpdir(), 'preview-siblings-'));
 t.after(() => rmSync(root, { recursive: true, force: true }));
 const dist = join(root, 'apps/fixture-react/dist');
 const put = (path, value) => { mkdirSync(join(dist, path, '..'), { recursive: true }); writeFileSync(join(dist, path), value); };
 put('index.html', 'ordinary'); put('assets/ordinary.js', 'ordinary');
 const builders = {
  'docs-preview': () => { rmSync(join(dist, 'docs-preview'), { recursive: true, force: true }); put('docs-preview/index.html', 'preview'); put('docs-preview/artifact-manifest.json', '{}'); },
  build: () => { for (const owned of ['index.html', 'assets']) rmSync(join(dist, owned), { recursive: true, force: true }); put('index.html', 'ordinary'); put('assets/ordinary.js', 'ordinary'); },
 };
 return { root, dist, put, builders };
}

test('accepts builders that only replace their own outputs and removes the sentinel', async t => {
 const f = fixture(t), calls = [];
 await verifySiblingPreservation({ root: f.root, framework: 'react', rounds: ['fresh', 'cached'], run: (target, round) => { calls.push(`${target}:${round}`); f.builders[target](); } });
 assert.deepEqual(calls, ['docs-preview:fresh', 'build:fresh', 'docs-preview:cached', 'build:cached']);
 assert.ok(!existsSync(join(f.dist, '__krds-sibling-sentinel.txt')));
 assert.equal(readFileSync(join(f.dist, 'docs-preview/index.html'), 'utf8'), 'preview');
});

test('rejects a preview builder that empties the whole dist directory', async t => {
 const f = fixture(t);
 await assert.rejects(verifySiblingPreservation({ root: f.root, framework: 'react', run: target => {
  if (target === 'docs-preview') { rmSync(f.dist, { recursive: true, force: true }); f.builders['docs-preview'](); } else f.builders.build();
 } }), /react docs-preview \(fresh\) deleted or rewrote sibling output: .*index\.html/);
});

test('rejects an ordinary build that deletes the docs-preview subtree', async t => {
 const f = fixture(t);
 await assert.rejects(verifySiblingPreservation({ root: f.root, framework: 'react', run: target => {
  if (target === 'build') { rmSync(f.dist, { recursive: true, force: true }); f.builders.build(); } else f.builders['docs-preview']();
 } }), /react ordinary build \(fresh\) deleted or rewrote sibling output: docs-preview\//);
});

test('rejects an ordinary build that deletes unowned dist files', async t => {
 const f = fixture(t);
 await assert.rejects(verifySiblingPreservation({ root: f.root, framework: 'react', run: target => {
  f.builders[target]();
  if (target === 'build') rmSync(join(f.dist, '__krds-sibling-sentinel.txt'));
 } }), /deleted an unowned dist file/);
});

test('rejects a preview build without an artifact manifest', async t => {
 const f = fixture(t);
 await assert.rejects(verifySiblingPreservation({ root: f.root, framework: 'react', run: target => { if (target === 'build') f.builders.build(); } }), /produced no artifact manifest/);
});
