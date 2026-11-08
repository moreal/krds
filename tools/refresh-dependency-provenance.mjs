#!/usr/bin/env node
/**
 * Rebind compliance/provenance-dependencies.json to the current yarn.lock when the
 * lockfile bytes changed without changing the exact npm resolution set (for example a
 * workspace declaring a package the lock already resolved). Every resolution must
 * already be recorded; a new package needs its original manifest and license bytes
 * captured first, which this script refuses to invent.
 */
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

export const lockResolutions = (lock) => {
  const resolutions = new Set();
  for (const match of lock.matchAll(/^  resolution: "([^"\n]+)"/gmu)) {
    const value = match[1];
    if (value.includes('@npm:')) resolutions.add(value);
    else if (value.includes('#npm:')) resolutions.add(`${value.split('@virtual:')[0]}@npm:${value.split('#npm:').at(-1)}`);
  }
  return resolutions;
};

export async function refreshDependencyProvenance(root, { now = new Date() } = {}) {
  const policy = JSON.parse(await readFile(resolve(root, 'compliance/license-policy.json'), 'utf8'));
  const inventoryPath = resolve(root, policy.dependencyInventoryPath);
  const inventory = JSON.parse(await readFile(inventoryPath, 'utf8'));
  const lock = await readFile(resolve(root, 'yarn.lock'));
  const lockfileSha256 = createHash('sha256').update(lock).digest('hex');
  const resolutions = lockResolutions(lock.toString());
  const recorded = new Set((inventory.missingManifests ?? []).map(([name, version]) => `${name}@npm:${version}`));
  for (const entry of Object.values(inventory.packages ?? {})) recorded.add(`${entry.name}@npm:${entry.version}`);
  const unrecorded = [...resolutions].filter((entry) => !recorded.has(entry));
  if (unrecorded.length) throw new Error(`Unrecorded npm resolutions need original manifest and license capture before rebinding: ${unrecorded.join(', ')}`);
  const unresolved = [...recorded].filter((entry) => !resolutions.has(entry));
  if (unresolved.length) throw new Error(`Inventory records resolutions the lock no longer has: ${unresolved.join(', ')}`);
  if (lockfileSha256 === inventory.lockfileSha256) return { changed: false, lockfileSha256, lockResolutionCount: resolutions.size };
  inventory.lockfileSha256 = lockfileSha256;
  inventory.lockResolutionCount = resolutions.size;
  inventory.lastRefresh = { observedAt: now.toISOString(), lockfileSha256, method: 'Lockfile bytes rebound; the exact npm resolution set, original manifests and license bytes are unchanged and re-verified against the inventory.' };
  await writeFile(inventoryPath, JSON.stringify(inventory, null, 2) + '\n');
  return { changed: true, lockfileSha256, lockResolutionCount: resolutions.size };
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await refreshDependencyProvenance(resolve(fileURLToPath(import.meta.url), '../..'));
  console.log(JSON.stringify(result));
}
