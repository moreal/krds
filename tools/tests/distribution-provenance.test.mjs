import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { loadDistribution, distributionArtifacts } from '../distribution-provenance.mjs';
const hash = (s) => createHash('sha256').update(s).digest('hex');
async function fixture(t) {
  const root = await mkdtemp(join(tmpdir(), 'krds-distribution-'));
  t.after(() => rm(root, { recursive: true, force: true }));
  const put = async (path, bytes) => { await mkdir(join(root, path, '..'), { recursive: true }); await writeFile(join(root, path), bytes); };
  const asset = '<svg>independent geometry</svg>\n';
  const source = 'Independent explanation with an attributed KRDS excerpt.\n';
  const terms = ['LICENSES/MIT.txt', 'LICENSES/KRDS.html', 'LICENSES/FONT.txt'];
  for (const path of terms) await put(path, `Original complete terms: ${path}\n`);
  for (const path of ['apps/fixture/public/local-assets/asset.svg', 'apps/fixture/dist/local-assets/asset.svg']) await put(path, asset);
  for (const path of ['apps/docs/public/sources/spec.txt', 'apps/docs/dist/sources/spec.txt']) await put(path, source);
  const mapping = { sourcePath: 'specs/spec.md', outputPath: 'sources/spec.txt', bytes: Buffer.byteLength(source), sha256: hash(source) };
  const metadata = { distributedSources: [mapping], referenceOnlySources: [{ sourcePath: 'upstream/krds/raw/components/detail.html', url: 'https://www.krds.go.kr/detail' }] };
  await put('apps/docs/public/docs-metadata.json', JSON.stringify(metadata));
  const applications = ['fixture', 'docs'].map((name) => ({ path: `apps/${name}`, publicRoot: `apps/${name}/public`, buildRoot: `apps/${name}/dist`, assetRoot: `apps/${name}/public/local-assets` }));
  const inventory = { schemaVersion: 1, scope: 'Bounded fixture', independentCopyright: 'Copyright (c) 2026 Test Holder', applications, terms: { independent: [terms[0]], krds: [terms[1]], font: [terms[2]] }, termsHashes: Object.fromEntries(await Promise.all(terms.map(async (p) => [p, hash(await readFile(join(root, p)))]))), assets: [{ sourcePath: 'apps/fixture/public/local-assets/asset.svg', sha256: hash(asset), bytes: Buffer.byteLength(asset), rights: 'independent', rightsStatus: 'verified', evidence: ['generator'], destinations: ['apps/fixture/public/local-assets/asset.svg'] }], documentation: { metadataPath: 'apps/docs/public/docs-metadata.json', publicRoot: 'apps/docs/public/sources', buildRoot: 'apps/docs/dist/sources', referenceOnlySources: metadata.referenceOnlySources, records: [{ sourcePath: mapping.sourcePath, sha256: mapping.sha256, bytes: mapping.bytes, destination: 'apps/docs/public/sources/spec.txt', rights: 'krds-reference-adaptation' }] }, exclusions: [{ rightsStatus: 'unresolved', distributedIn: [] }] };
  const sourceEntries = [{ id: 'fixture-style-source', sha256: hash('original stylesheet'), licenseIdOrRef: 'LicenseRef-Fixture', licenseTextPath: terms[1], rightsStatus: 'verified', distributedIn: ['@fixture/styles'] }];
  inventory.sourceConditions = sourceEntries.map((entry) => ({ sourceId: entry.id, sourceSha256: entry.sha256, licenseIdOrRef: entry.licenseIdOrRef, licenseTextPath: entry.licenseTextPath, rightsStatus: entry.rightsStatus }));
  const policy = { independentCode: { termsPath: terms[0], copyrightNotice: inventory.independentCopyright }, fontPolicy: { licensePath: terms[2] }, relatedDocuments: {}, sourceDocuments: { ...inventory.termsHashes } };
  const save = async () => { await put('compliance/distribution-provenance.json', JSON.stringify(inventory)); await put('compliance/license-policy.json', JSON.stringify(policy)); await put('compliance/provenance.json', JSON.stringify(sourceEntries)); }; await save();
  return { root, inventory, put, save, policy, sourceEntries };
}
test('binds exact public/build bytes and emits linked text-only original terms without relicensing', async (t) => {
  const f = await fixture(t); const inventory = await loadDistribution(f.root);
  const outputs = await distributionArtifacts(f.root, inventory);
  assert.equal(outputs.get(join(f.root, 'apps/docs/public/_legal/LICENSES/KRDS.html.txt')).toString(), 'Original complete terms: LICENSES/KRDS.html\n');
  assert.equal(outputs.has(join(f.root, 'apps/docs/public/_legal/LICENSES/KRDS.html')), false);
  assert.match(outputs.get(join(f.root, 'apps/docs/dist/_legal/index.html')), /KRDS.html.txt/);
  assert.match(outputs.get(join(f.root, 'apps/docs/public/_legal/index.html')), /MIT grant covers independent project materials only/);
});
test('rejects changed specimen and stale built copy independently', async (t) => {
  const f = await fixture(t); await f.put('apps/fixture/dist/local-assets/asset.svg', 'changed build');
  await assert.rejects(loadDistribution(f.root), /hash mismatch.*dist/);
  await f.put('apps/fixture/public/local-assets/asset.svg', 'changed source');
  await assert.rejects(loadDistribution(f.root), /hash mismatch.*public/);
});
test('discovers unregistered new framework asset roots and built destinations', async (t) => {
  const f = await fixture(t); await f.put('apps/new-framework/public/local-assets/mystery.wav', 'unknown');
  await assert.rejects(loadDistribution(f.root), /Untracked web asset/);
  await rm(join(f.root, 'apps/new-framework'), { recursive: true });
  await f.put('apps/fixture/dist/local-assets/mystery.wav', 'unknown');
  await assert.rejects(loadDistribution(f.root), /Untracked built web asset/);
});
test('rejects unsafe or unregistered destinations', async (t) => {
  const f = await fixture(t); f.inventory.assets[0].destinations = ['../outside.svg']; await f.save();
  await assert.rejects(loadDistribution(f.root), /Invalid asset destination|Unsafe/);
});
test('rejects stale docs source maps and additional original HTML snapshots', async (t) => {
  const f = await fixture(t); f.inventory.documentation.records[0].sourcePath = 'different-source.md'; await f.save();
  await assert.rejects(loadDistribution(f.root), /mapping drift/);
  f.inventory.documentation.records[0].sourcePath = 'specs/spec.md'; await f.save();
  await f.put('apps/docs/public/sources/original.html', '<html>official source</html>');
  await assert.rejects(loadDistribution(f.root), /Untracked docs snapshot/);
});
test('rejects distribution of excluded voices and source-term hash drift', async (t) => {
  const f = await fixture(t); f.inventory.exclusions[0].distributedIn = ['apps/fixture']; await f.save();
  await assert.rejects(loadDistribution(f.root), /Excluded voice/);
  f.inventory.exclusions[0].distributedIn = []; await f.save();
  await f.put('LICENSES/KRDS.html', 'replaced with MIT');
  await assert.rejects(loadDistribution(f.root), /terms hash mismatch/);
});
test('rejects absent web inventory, duplicate destinations and invented independent holder', async (t) => {
  const f = await fixture(t);
  await assert.rejects(loadDistribution(f.root, { independentCopyright: 'Copyright (c) 2026 Different Holder' }), /copyright disagrees/);
  f.inventory.assets[0].destinations.push(f.inventory.assets[0].destinations[0]); await f.save();
  await assert.rejects(loadDistribution(f.root), /Duplicate distribution destination/);
  await rm(join(f.root, 'compliance/distribution-provenance.json'));
  await assert.rejects(loadDistribution(f.root), /Missing web distribution provenance/);
});
test('requires the authoritative KRDS related-term closure before generation', async (t) => {
  const f = await fixture(t);
  const project = new URL('../../', import.meta.url);
  const policy = JSON.parse(await readFile(new URL('compliance/license-policy.json', project), 'utf8'));
  const sourceEntries = JSON.parse(await readFile(new URL('compliance/provenance.json', project), 'utf8')).filter((entry) => entry.distributedIn.some((name) => name.endsWith('/styles')));
  f.inventory.independentCopyright = policy.independentCode.copyrightNotice;
  f.inventory.sourceConditions = sourceEntries.map((entry) => ({ sourceId: entry.id, sourceSha256: entry.sha256, licenseIdOrRef: entry.licenseIdOrRef, licenseTextPath: entry.licenseTextPath, rightsStatus: entry.rightsStatus }));
  f.inventory.terms = { independent: [policy.independentCode.termsPath], krds: ['LICENSES/KRDS-copyright-en.html', 'LICENSES/KOGL-license-policy.html'], font: [policy.fontPolicy.licensePath] };
  f.inventory.termsHashes = {};
  for (const path of Object.values(f.inventory.terms).flat()) {
    const bytes = await readFile(new URL(path, project)); await f.put(path, bytes); f.inventory.termsHashes[path] = hash(bytes);
  }
  await f.save();
  const options = { policy, sourceEntries };
  const baseline = await loadDistribution(f.root, options);
  const outputs = await distributionArtifacts(f.root, baseline);
  assert.ok([...outputs.keys()].some((path) => path.endsWith('/LICENSES/KOGL-license-policy.html.txt')));
  f.inventory.terms.krds = ['LICENSES/KRDS-copyright-en.html']; await f.save();
  await assert.rejects(loadDistribution(f.root, options), /Required distribution terms|term closure/);
});
test('rejects wrong, empty or unapproved term scopes using authoritative policy', async (t) => {
  const f = await fixture(t);
  f.inventory.terms.krds = f.inventory.terms.font; await f.save();
  await assert.rejects(loadDistribution(f.root), /Required distribution terms|term closure/);
  f.inventory.terms.krds = ['LICENSES/KRDS.html'];
  f.inventory.terms.independent = []; await f.save();
  await assert.rejects(loadDistribution(f.root), /Missing distribution condition scopes|Required distribution terms/);
  f.inventory.terms.independent = [f.policy.independentCode.termsPath];
  f.policy.sourceDocuments['LICENSES/KRDS.html'] = hash('a different preserved original'); await f.save();
  await assert.rejects(loadDistribution(f.root), /authoritative.*hash|term closure/);
});
