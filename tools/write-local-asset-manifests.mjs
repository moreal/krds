#!/usr/bin/env node
/**
 * Derive an app's local-assets/provenance.json from the manifest it was copied
 * from, so every entry names that app's own served specimen path. Entry bytes,
 * hashes, original `source` and rights are kept; a copied specimen whose bytes
 * differ from the recorded entry fails. --check only reports mislabels.
 * Write mode also rebinds compliance/distribution-provenance.json: the derived
 * manifest becomes its own verified independent record instead of a copy
 * destination of the original manifest.
 */
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, resolve } from 'node:path';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
// Owner-reported scope: Angular fixture/Storybook copies of the Vue manifests.
export const defaultApps = ['fixture-angular', 'storybook-angular'];
const manifestOf = app => `apps/${app}/public/local-assets/provenance.json`;
const serialize = value => `${JSON.stringify(value, null, 2)}\n`;
export function deriveManifest(root, app) {
 const path = manifestOf(app), current = readFileSync(resolve(root, path));
 const parsed = JSON.parse(current);
 if (!Array.isArray(parsed.assets)) throw new Error(`${path}: expected an assets array`);
 const mislabelled = [];
 const assets = parsed.assets.map(entry => {
  const own = `apps/${app}/public/local-assets/${basename(entry.path)}`;
  if (!existsSync(resolve(root, own))) throw new Error(`${path}: ${entry.path} has no served copy at ${own}`);
  if (digest(readFileSync(resolve(root, own))) !== entry.sha256) throw new Error(`${path}: ${own} bytes differ from the recorded entry`);
  if (entry.path !== own) mislabelled.push({ recorded: entry.path, served: own });
  return { ...entry, path: own };
 });
 const bytes = Buffer.from(serialize({ ...parsed, assets }));
 return { path, current, bytes, mislabelled, changed: !bytes.equals(current) };
}
export function rebindInventory(inventory, { path, bytes, sourceManifest }) {
 const sha256 = digest(bytes);
 const original = inventory.assets.find(record => record.sourcePath !== path && record.destinations.includes(path));
 if (original) original.destinations = original.destinations.filter(destination => destination !== path);
 let own = inventory.assets.find(record => record.sourcePath === path);
 if (!own) {
  own = { origin: `Derived local specimen metadata naming this app's served paths; entries, hashes and rights from ${sourceManifest}`, rights: 'independent', rightsStatus: 'verified', evidence: [sourceManifest, 'tools/write-local-asset-manifests.mjs'], sourcePath: path, sha256, bytes: bytes.length, destinations: [path] };
  inventory.assets.splice(original ? inventory.assets.indexOf(original) + 1 : inventory.assets.length, 0, own);
 } else Object.assign(own, { sha256, bytes: bytes.length });
 for (const record of inventory.lateCopyRegistrations ?? []) if (record.destination === path) Object.assign(record, { kind: 'derived-current-path-manifest', destinationSha256: sha256 });
 return inventory;
}
export function writeLocalAssetManifests({ root, apps = defaultApps, check = false }) {
 const inventoryPath = resolve(root, 'compliance/distribution-provenance.json');
 const inventory = JSON.parse(readFileSync(inventoryPath, 'utf8'));
 const results = [];
 for (const app of apps) {
  const derived = deriveManifest(root, app);
  const sourceManifest = inventory.assets.find(record => record.sourcePath !== derived.path && record.destinations.includes(derived.path))?.sourcePath ?? inventory.assets.find(record => record.sourcePath === derived.path)?.evidence?.[0] ?? derived.path;
  results.push({ app, path: derived.path, mislabelled: derived.mislabelled.length, changed: derived.changed });
  if (check || !derived.changed) continue;
  writeFileSync(resolve(root, derived.path), derived.bytes);
  rebindInventory(inventory, { path: derived.path, bytes: derived.bytes, sourceManifest });
 }
 if (!check && results.some(result => result.changed)) writeFileSync(inventoryPath, serialize(inventory));
 return results;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
 const check = process.argv.includes('--check');
 const apps = process.argv.slice(2).flatMap((arg, index, args) => arg === '--app' ? [args[index + 1]] : []);
 const results = writeLocalAssetManifests({ root: resolve(import.meta.dirname, '..'), check, ...(apps.length ? { apps } : {}) });
 console.log(JSON.stringify(results, null, 2));
 if (check && results.some(result => result.changed)) process.exitCode = 1;
}
