import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { hashCode, instanceId, normalizeClientManifest } from './qwik-manifest.mjs';
const root = join(import.meta.dirname, '../..');

// Pages CI builds each preview on Linux and re-hashes it against the inventory refreshed from a
// macOS checkout, so no deployable byte may depend on the build host or the checkout path.
test('qwik client manifest normalization removes host-dependent order, OS name and recomputes the optimizer hash', () => {
 const linux = { version: '1', options: {}, bundles: { 'q-a.js': {} }, assets: { 'assets/b.svg': { size: 1 }, 'assets/a.svg': { size: 2 } }, symbols: {}, manifestHash: 'x', platform: { qwik: '1.20.3', env: 'node', os: 'linux', node: '24.18.0' } };
 const darwin = { ...linux, assets: { 'assets/a.svg': { size: 2 }, 'assets/b.svg': { size: 1 } }, manifestHash: 'y', platform: { ...linux.platform, os: 'darwin' } };
 const a = normalizeClientManifest(linux), b = normalizeClientManifest(darwin);
 assert.equal(JSON.stringify(a), JSON.stringify(b));
 assert.deepEqual(Object.keys(a), ['version', 'options', 'bundles', 'assets', 'symbols', 'manifestHash', 'platform']);
 assert.deepEqual(Object.keys(a.assets), ['assets/a.svg', 'assets/b.svg']);
 assert.equal('os' in a.platform, false);
 assert.equal(a.platform.node, '24.18.0');
 const { manifestHash, platform, ...hashed } = a;
 assert.equal(manifestHash, hashCode(JSON.stringify(hashed)), 'hash covers exactly what the optimizer hashes');
 assert.match(manifestHash, /^[0-9a-z]+$/);
});
test('qwik instance ids are stable per preview identity and valid base-36 tokens', () => {
 assert.equal(instanceId('badge', 'default'), instanceId('badge', 'default'));
 assert.notEqual(instanceId('badge', 'default'), instanceId('button', 'default'));
 assert.match(instanceId('badge', 'default'), /^[0-9a-z]+$/);
});
test('qwik builder hands the normalized manifest to the SSR stage and sets q:instance', () => {
 const build = readFileSync(join(root, 'apps/fixture-qwik/src/docs-preview/build.mjs'), 'utf8');
 assert.match(build, /normalizeClientManifest\(/);
 assert.match(build, /QWIK_DOCS_CLIENT_MANIFEST/);
 const config = readFileSync(join(root, 'apps/fixture-qwik/vite.docs-preview.config.ts'), 'utf8');
 assert.match(config, /manifestInput: JSON\.parse\(readFileSync\(process\.env\.QWIK_DOCS_CLIENT_MANIFEST/);
 const ssr = readFileSync(join(root, 'apps/fixture-qwik/src/docs-preview/entry.ssr.tsx'), 'utf8');
 assert.match(ssr, /const stable = instanceId\(componentId, exampleId\)/);
 assert.match(ssr, /result\.html\.replaceAll\(generated, stable\)/);
});
test('svelte preview scopes CSS by repository-relative filename, never the absolute checkout path', () => {
 const config = readFileSync(join(root, 'apps/fixture-svelte/vite.docs-preview.config.ts'), 'utf8');
 assert.match(config, /cssHash: \(\{ hash, css, filename \}\) => `svelte-\$\{hash\(filename \? relative\(root, filename\)/);
});
