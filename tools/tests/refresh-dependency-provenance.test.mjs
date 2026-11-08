import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { refreshDependencyProvenance, lockResolutions } from '../refresh-dependency-provenance.mjs';

const sha = (text) => createHash('sha256').update(text).digest('hex');
const lockFor = (descriptors) => `# yarn lockfile\n\n"left-pad@npm:1.0.0":\n  version: 1.0.0\n  resolution: "left-pad@npm:1.0.0"\n\n"${descriptors}":\n  version: 4.5.0\n  resolution: "shiki@npm:4.5.0"\n`;

async function fixture(lock, packages) {
  const root = await mkdtemp(resolve(tmpdir(), 'krds-dep-provenance-'));
  await mkdir(resolve(root, 'compliance'), { recursive: true });
  await writeFile(resolve(root, 'compliance/license-policy.json'), JSON.stringify({ dependencyInventoryPath: 'compliance/provenance-dependencies.json' }));
  await writeFile(resolve(root, 'compliance/provenance-dependencies.json'), JSON.stringify({ schemaVersion: 1, lockfileSha256: sha('old lock'), lockResolutionCount: packages.length, missingManifests: [], packages: Object.fromEntries(packages.map(([name, version]) => [`${name}@${version}`, { name, version }])) }));
  await writeFile(resolve(root, 'yarn.lock'), lock);
  return root;
}

test('a lockfile whose descriptors changed but whose resolutions did not is rebound with the same count', async (t) => {
  const root = await fixture(lockFor('shiki@npm:4.5.0, shiki@npm:^4.5.0'), [['left-pad', '1.0.0'], ['shiki', '4.5.0']]);
  t.after(() => rm(root, { recursive: true, force: true }));
  const result = await refreshDependencyProvenance(root, { now: new Date('2026-11-08T00:00:00Z') });
  assert.deepEqual(result, { changed: true, lockfileSha256: sha(lockFor('shiki@npm:4.5.0, shiki@npm:^4.5.0')), lockResolutionCount: 2 });
  const inventory = JSON.parse(await readFile(resolve(root, 'compliance/provenance-dependencies.json'), 'utf8'));
  assert.equal(inventory.lockfileSha256, result.lockfileSha256);
  assert.equal(inventory.lastRefresh.observedAt, '2026-11-08T00:00:00.000Z');
  assert.deepEqual(await refreshDependencyProvenance(root), { changed: false, lockfileSha256: result.lockfileSha256, lockResolutionCount: 2 });
});

test('a resolution without captured original manifest and license bytes is refused, not invented', async (t) => {
  const root = await fixture(lockFor('shiki@npm:^4.5.0'), [['left-pad', '1.0.0']]);
  t.after(() => rm(root, { recursive: true, force: true }));
  await assert.rejects(refreshDependencyProvenance(root), /Unrecorded npm resolutions.*shiki@npm:4\.5\.0/);
  assert.equal(JSON.parse(await readFile(resolve(root, 'compliance/provenance-dependencies.json'), 'utf8')).lockfileSha256, sha('old lock'));
});

test('virtual descriptors collapse to their exact npm resolution like verify-licenses', () => {
  assert.deepEqual([...lockResolutions('  resolution: "vite@virtual:abc#npm:8.3.5"\n  resolution: "solid-js@npm:1.9.18"\n')], ['vite@npm:8.3.5', 'solid-js@npm:1.9.18']);
});
