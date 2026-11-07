import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { writeLocalAssetManifests } from '../write-local-asset-manifests.mjs';
const hash = value => createHash('sha256').update(value).digest('hex');
async function fixture(t) {
 const root = await mkdtemp(join(tmpdir(), 'krds-local-manifests-'));
 t.after(() => rm(root, { recursive: true, force: true }));
 const put = async (path, value) => { await mkdir(join(root, path, '..'), { recursive: true }); await writeFile(join(root, path), value); };
 const svg = '<svg>independent</svg>\n';
 for (const app of ['fixture-vue', 'fixture-angular']) await put(`apps/${app}/public/local-assets/logo.svg`, svg);
 const manifest = `${JSON.stringify({ assets: [{ path: 'apps/fixture-vue/public/local-assets/logo.svg', sha256: hash(svg), source: 'apps/fixture-solid/public/local-assets/logo.svg', rights: 'Independent local specimen.' }], manualReview: 'pending' }, null, 2)}\n`;
 for (const app of ['fixture-vue', 'fixture-angular']) await put(`apps/${app}/public/local-assets/provenance.json`, manifest);
 const inventory = { assets: [{ origin: 'Owner authored', rights: 'independent', rightsStatus: 'verified', evidence: ['apps/fixture-vue/public/local-assets/provenance.json'], sourcePath: 'apps/fixture-vue/public/local-assets/provenance.json', sha256: hash(manifest), bytes: Buffer.byteLength(manifest), destinations: ['apps/fixture-vue/public/local-assets/provenance.json', 'apps/fixture-angular/public/local-assets/provenance.json'] }], lateCopyRegistrations: [{ kind: 'angular-existing-independent-copy', source: 'apps/fixture-vue/public/local-assets/provenance.json', destination: 'apps/fixture-angular/public/local-assets/provenance.json', sourceSha256: hash(manifest), destinationSha256: hash(manifest) }] };
 await put('compliance/distribution-provenance.json', JSON.stringify(inventory, null, 2) + '\n');
 return { root, put, manifest, svg };
}

test('check reports copied manifests that name another app without writing', async t => {
 const f = await fixture(t);
 assert.deepEqual(writeLocalAssetManifests({ root: f.root, apps: ['fixture-angular', 'fixture-vue'], check: true }), [
  { app: 'fixture-angular', path: 'apps/fixture-angular/public/local-assets/provenance.json', mislabelled: 1, changed: true },
  { app: 'fixture-vue', path: 'apps/fixture-vue/public/local-assets/provenance.json', mislabelled: 0, changed: false },
 ]);
 assert.equal(await readFile(join(f.root, 'apps/fixture-angular/public/local-assets/provenance.json'), 'utf8'), f.manifest);
});

test('write names the served paths and rebinds the inventory to a separate verified record', async t => {
 const f = await fixture(t);
 writeLocalAssetManifests({ root: f.root, apps: ['fixture-angular'] });
 const written = await readFile(join(f.root, 'apps/fixture-angular/public/local-assets/provenance.json'));
 const parsed = JSON.parse(written);
 assert.equal(parsed.assets[0].path, 'apps/fixture-angular/public/local-assets/logo.svg');
 assert.equal(parsed.assets[0].source, 'apps/fixture-solid/public/local-assets/logo.svg', 'original source kept');
 assert.equal(parsed.manualReview, 'pending');
 const inventory = JSON.parse(await readFile(join(f.root, 'compliance/distribution-provenance.json'), 'utf8'));
 assert.deepEqual(inventory.assets[0].destinations, ['apps/fixture-vue/public/local-assets/provenance.json']);
 assert.equal(inventory.assets[0].sha256, hash(f.manifest), 'Vue original untouched');
 assert.deepEqual(inventory.assets[1], { origin: "Derived local specimen metadata naming this app's served paths; entries, hashes and rights from apps/fixture-vue/public/local-assets/provenance.json", rights: 'independent', rightsStatus: 'verified', evidence: ['apps/fixture-vue/public/local-assets/provenance.json', 'tools/write-local-asset-manifests.mjs'], sourcePath: 'apps/fixture-angular/public/local-assets/provenance.json', sha256: hash(written), bytes: written.length, destinations: ['apps/fixture-angular/public/local-assets/provenance.json'] });
 assert.deepEqual([inventory.lateCopyRegistrations[0].kind, inventory.lateCopyRegistrations[0].destinationSha256], ['derived-current-path-manifest', hash(written)]);
 assert.deepEqual(writeLocalAssetManifests({ root: f.root, apps: ['fixture-angular'], check: true })[0].changed, false, 'idempotent');
});

test('rejects a copied specimen whose bytes differ from the recorded entry', async t => {
 const f = await fixture(t);
 await f.put('apps/fixture-angular/public/local-assets/logo.svg', '<svg>altered</svg>');
 assert.throws(() => writeLocalAssetManifests({ root: f.root, apps: ['fixture-angular'], check: true }), /logo\.svg bytes differ from the recorded entry/);
});
