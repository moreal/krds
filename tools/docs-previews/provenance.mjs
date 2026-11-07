/** Separate rights inventory for native preview bytes; never extends legacy downloads. */
import { existsSync, readdirSync, lstatSync } from 'node:fs';
import { resolve } from 'node:path';
import { frameworks as allFrameworks, readContained, sha256 } from './contract.mjs';
const json = (root, path) => JSON.parse(readContained(root, path));
const fontFile = /\.(?:woff2?|ttf|otf|eot)$/i;
// Builder-emitted code/markup. Everything else must be classified to an original.
const compiled = /\.(?:[cm]?js|css|html|map|json)$/i;
const previewDestination = /^apps\/docs\/(?:public|dist)\/previews\/(react|solid|svelte|vue|angular|lit|qwik|solid-next)\/[^]+$/u;
const scope = 'Additional native previews only; 609 legacy downloads and three legacy font records remain separate.';
export function classifyOriginal(path, digest, { root, sources, distribution }) {
 const bytes = readContained(root, path);
 if (sha256(bytes) !== digest) throw new Error(`Stale native source: ${path}`);
 const original = sources.find(record => record.localPaths.includes(path));
 if (original) {
  if (original.rightsStatus !== 'verified' || (!original.modified && original.sha256 !== digest)) throw new Error(`Modified/unverified recorded source: ${path}`);
  return { rights: fontFile.test(path) ? 'font-original' : 'krds-reference-adaptation', sourceId: original.id, licenseTextPath: original.licenseTextPath, modified: Boolean(original.modified) };
 }
 const asset = distribution.assets.find(record => record.sourcePath === path || record.destinations.includes(path));
 if (asset) {
  if (asset.rightsStatus !== 'verified' || asset.sha256 !== digest) throw new Error(`Unverified native media: ${path}`);
  return { rights: 'independent-specimen', evidence: asset.evidence };
 }
 if (fontFile.test(path) || !compiled.test(path) && /\.(?:svg|png|jpe?g|gif|webp|avif|ico|wav|mp[34]|webm|ogg|vtt)$/i.test(path)) throw new Error(`Unclassified native media/font: ${path}`);
 if (/^(?:apps\/fixture-[a-z-]+\/src\/|packages\/[a-z-]+\/|tools\/docs-previews\/)/.test(path) && !path.includes('/node_modules/')) return { rights: 'independent', licenseTextPath: 'LICENSES/MIT.txt' };
 throw new Error(`Unclassified native source: ${path}`);
}
export function bindDependency(mod, { root, dependencies }) {
 const original = dependencies.packages[`${mod.package}@${mod.version}`];
 if (!original?.licenseDocuments?.length || !mod.id || !mod.sha256) throw new Error(`Native bundled module lacks original notice/module identity: ${mod.package}@${mod.version}`);
 if (sha256(readContained(root, original.manifestPath)) !== original.manifestSha256) throw new Error(`Native dependency manifest drift: ${mod.package}`);
 for (const term of original.licenseDocuments) if (sha256(readContained(root, term.localPath)) !== term.sha256) throw new Error(`Native dependency notice drift: ${mod.package}`);
 return { name: mod.package, version: mod.version, manifestPath: original.manifestPath, manifestSha256: original.manifestSha256, licenseDocuments: original.licenseDocuments };
}
function publicCopies(root, framework) {
 const base = `apps/fixture-${framework}/public`, found = new Map();
 const walk = path => {
  if (!existsSync(resolve(root, path))) return;
  for (const entry of readdirSync(resolve(root, path), { withFileTypes: true })) {
   const child = `${path}/${entry.name}`;
   if (entry.isDirectory()) walk(child);
   else if (entry.isFile()) found.set(sha256(readContained(root, child)), child);
  }
 };
 walk(base);
 return found;
}
const destinationsOf = (framework, path) => [`apps/docs/public/previews/${framework}/${path}`, `apps/docs/dist/previews/${framework}/${path}`];
/** Inventory one validated native artifact without reading any other framework. */
export function inventoryArtifact(framework, manifest, context) {
 const { root, distribution } = context;
 const output = `apps/fixture-${framework}/dist/docs-preview`;
 if (manifest.framework !== framework || !manifest.modules?.length) throw new Error(`Missing native module identity: ${framework}`);
 const bundled = new Map(), originals = new Map();
 for (const mod of manifest.modules) {
  if (!mod.id || !mod.package || !mod.version || !mod.sha256) throw new Error(`Missing native module identity: ${framework}`);
  if (!mod.package.startsWith('@unofficial-krds/')) {
   const record = bindDependency(mod, context), key = `${record.name}@${record.version}`;
   if (!bundled.has(key)) bundled.set(key, { ...record, modules: [] });
   bundled.get(key).modules.push({ id: mod.id, sha256: mod.sha256 });
  }
  for (const input of mod.originals ?? []) {
   if (input.path.includes('/node_modules/') || input.path.startsWith('node_modules/')) {
    if (sha256(readContained(root, input.path)) !== input.sha256) throw new Error(`Stale native dependency source: ${input.path}`);
    continue;
   }
   originals.set(input.path, { ...input, ...classifyOriginal(input.path, input.sha256, context) });
  }
 }
 const copies = publicCopies(root, framework);
 const files = manifest.files.map(file => {
  const bytes = readContained(root, `${output}/${file.path}`);
  if (sha256(bytes) !== file.sha256 || bytes.length !== file.size) throw new Error(`Stale native output: ${framework}/${file.path}`);
  const record = { ...file, rights: 'compiled-code' };
  const original = [...originals.values()].find(input => input.sha256 === file.sha256 && ['font-original', 'independent-specimen', 'krds-reference-adaptation'].includes(input.rights));
  const asset = distribution.assets.find(entry => entry.sha256 === file.sha256 && entry.rightsStatus === 'verified' && entry.rights === 'independent' && [entry.sourcePath, ...entry.destinations].some(path => path.startsWith(`apps/fixture-${framework}/public/`)));
  if (original) Object.assign(record, { rights: original.rights, sourcePath: original.path, ...(original.sourceId ? { sourceId: original.sourceId } : {}) });
  else if (asset && !fontFile.test(file.path)) {
   if (sha256(readContained(root, asset.sourcePath)) !== asset.sha256) throw new Error(`Unverified native media: ${asset.sourcePath}`);
   Object.assign(record, { rights: 'independent-specimen', sourcePath: asset.sourcePath });
  } else if (copies.has(file.sha256)) throw new Error(`Unclassified copied public file: ${framework}/${file.path}`);
  else if (framework === 'angular' && file.path === '3rdpartylicenses.txt') record.rights = 'bundler-generated-notice';
  else if (!compiled.test(file.path)) throw new Error(`Unclassified native output media/font: ${framework}/${file.path}`);
  return { ...record, destinations: destinationsOf(framework, file.path) };
 });
 return { framework, artifactSha256: sha256(readContained(root, `${output}/artifact-manifest.json`)), identity: manifest.identity, files, sources: [...originals.values()].sort((a, b) => a.path.localeCompare(b.path)), bundledDependencies: [...bundled.values()].sort((a, b) => a.name.localeCompare(b.name)) };
}
function fontAssetsOf(artifacts, sources) {
 const fonts = new Map();
 for (const artifact of artifacts) for (const file of artifact.files) if (file.rights === 'font-original') {
  const source = sources.find(entry => entry.id === file.sourceId);
  if (!fonts.has(file.sourceId)) fonts.set(file.sourceId, { sourceId: file.sourceId, sourcePath: file.sourcePath, sha256: source.sha256, bytes: file.size, modified: false, destinations: [] });
  fonts.get(file.sourceId).destinations.push(...file.destinations);
 }
 return [...fonts.values()].sort((a, b) => a.sourceId.localeCompare(b.sourceId));
}
export function nativePreviewInventory({ root = process.cwd(), frameworks = allFrameworks, manifests, distribution = json(root, 'compliance/distribution-provenance.json'), sources = json(root, 'compliance/provenance.json'), dependencies = json(root, 'compliance/provenance-dependencies.json') } = {}) {
 if (!frameworks.length || frameworks.some(framework => !allFrameworks.includes(framework)) || new Set(frameworks).size !== frameworks.length) throw new Error('Invalid native preview framework selection');
 const context = { root, sources, distribution, dependencies };
 const artifacts = frameworks.map(framework => inventoryArtifact(framework, manifests?.[framework] ?? json(root, `apps/fixture-${framework}/dist/docs-preview/artifact-manifest.json`), context));
 return { schemaVersion: 1, scope, artifacts, fontAssets: fontAssetsOf(artifacts, sources) };
}
/** Re-check a committed inventory against current rights evidence and any deployed bytes. */
export function verifyNativeInventory(root, inventory, { sourceEntries, dependencies, distribution }) {
 if (inventory.schemaVersion !== 1 || inventory.scope !== scope || !Array.isArray(inventory.artifacts)) throw new Error('Invalid native preview inventory');
 const fontDestinations = new Map();
 for (const record of inventory.fontAssets ?? []) {
  const original = sourceEntries.find(entry => entry.id === record.sourceId);
  if (!original || original.rightsStatus !== 'verified' || original.modified || record.modified !== false || !original.localPaths.includes(record.sourcePath) || original.sha256 !== record.sha256 || sha256(readContained(root, record.sourcePath)) !== record.sha256) throw new Error(`Invalid native font source provenance: ${record.sourcePath}`);
  for (const destination of record.destinations) fontDestinations.set(destination, record);
 }
 const seen = new Set();
 for (const artifact of inventory.artifacts) {
  for (const file of artifact.files) {
   for (const destination of file.destinations) {
    const match = destination.match(previewDestination);
    if (!match || match[1] !== artifact.framework || seen.has(destination) || destination.split('/').includes('..')) throw new Error(`Invalid native preview destination: ${destination}`);
    seen.add(destination);
   }
   if (file.rights === 'font-original') {
    const source = sourceEntries.find(entry => entry.id === file.sourceId);
    if (!source || source.rightsStatus !== 'verified' || source.modified || source.sha256 !== file.sha256 || !source.localPaths.includes(file.sourcePath)) throw new Error(`Invalid native font source provenance: ${file.sourcePath}`);
    for (const destination of file.destinations) if (fontDestinations.get(destination)?.sourceId !== file.sourceId) throw new Error(`Unaccounted native font destination: ${destination}`);
   } else if (fontFile.test(file.path)) throw new Error(`Unclassified native output media/font: ${artifact.framework}/${file.path}`);
   if (file.rights === 'independent-specimen' && !distribution.assets.some(asset => asset.sourcePath === file.sourcePath && asset.sha256 === file.sha256 && asset.rightsStatus === 'verified') && !(file.sourcePath && sha256(readContained(root, file.sourcePath)) === file.sha256)) throw new Error(`Unverified native media: ${file.sourcePath}`);
  }
  for (const record of artifact.bundledDependencies) {
   const original = dependencies.packages[`${record.name}@${record.version}`];
   if (!original?.licenseDocuments?.length || !record.modules?.length || original.manifestPath !== record.manifestPath || original.manifestSha256 !== record.manifestSha256 || JSON.stringify(original.licenseDocuments) !== JSON.stringify(record.licenseDocuments)) throw new Error(`Native dependency original provenance drift: ${record.name}`);
   if (sha256(readContained(root, record.manifestPath)) !== record.manifestSha256) throw new Error(`Native dependency manifest drift: ${record.name}`);
   for (const term of record.licenseDocuments) if (sha256(readContained(root, term.localPath)) !== term.sha256) throw new Error(`Native dependency notice drift: ${record.name}`);
  }
 }
 for (const destination of fontDestinations.keys()) if (!seen.has(destination)) throw new Error(`Unaccounted native font destination: ${destination}`);
 validateNativeDestinations(root, inventory);
}
export function validateNativeDestinations(root, inventory) {
 const declared = new Map();
 for (const artifact of inventory.artifacts) for (const file of artifact.files) for (const path of file.destinations) declared.set(path, file);
 const artifacts = new Map(inventory.artifacts.map(artifact => [artifact.framework, artifact]));
 const walk = path => {
  if (!existsSync(resolve(root, path))) return;
  for (const entry of readdirSync(resolve(root, path), { withFileTypes: true })) {
   const child = `${path}/${entry.name}`;
   if (entry.isSymbolicLink()) throw new Error(`Native distribution symlink: ${child}`);
   if (entry.isDirectory()) walk(child);
   else if (/^apps\/docs\/(?:public|dist)\/previews\/[^/]+\/artifact-manifest\.json$/u.test(child)) {
    const artifact = artifacts.get(child.split('/')[4]);
    if (!artifact || sha256(readContained(root, child)) !== artifact.artifactSha256) throw new Error(`Native artifact manifest drift: ${child.split('/')[4]}`);
   } else {
    const record = declared.get(child);
    if (!record || sha256(readContained(root, child)) !== record.sha256) throw new Error(`Untracked/modified native destination: ${child}`);
   }
  }
 };
 walk('apps/docs/public/previews'); walk('apps/docs/dist/previews');
 for (const [path, record] of declared) {
  const tree = path.split('/previews/')[0] + '/previews';
  if (existsSync(resolve(root, tree)) && (!existsSync(resolve(root, path)) || lstatSync(resolve(root, path)).isSymbolicLink() || sha256(readContained(root, path)) !== record.sha256)) throw new Error(`Missing/modified native destination: ${path}`);
 }
}
/** Reviewable destination-level change set between two committed native inventories. */
export function nativeDistributionDiff(previous, next) {
 const index = inventory => {
  const files = new Map(), dependencies = new Set();
  for (const artifact of inventory?.artifacts ?? []) {
   for (const file of artifact.files) for (const destination of file.destinations) files.set(destination, { destination, framework: artifact.framework, path: file.path, sha256: file.sha256, rights: file.rights, ...(file.sourcePath ? { sourcePath: file.sourcePath } : {}) });
   for (const record of artifact.bundledDependencies) dependencies.add(`${record.name}@${record.version}`);
  }
  return { files, dependencies };
 };
 const before = index(previous), after = index(next), sorted = list => list.sort((a, b) => a.destination.localeCompare(b.destination));
 return {
  schemaVersion: 1,
  added: sorted([...after.files.values()].filter(file => !before.files.has(file.destination))),
  removed: sorted([...before.files.values()].filter(file => !after.files.has(file.destination))),
  changed: sorted([...after.files.values()].filter(file => before.files.has(file.destination) && (before.files.get(file.destination).sha256 !== file.sha256 || before.files.get(file.destination).rights !== file.rights)).map(file => ({ destination: file.destination, framework: file.framework, path: file.path, before: before.files.get(file.destination).sha256, after: file.sha256, rightsBefore: before.files.get(file.destination).rights, rights: file.rights }))),
  dependencies: { added: [...after.dependencies].filter(key => !before.dependencies.has(key)).sort(), removed: [...before.dependencies].filter(key => !after.dependencies.has(key)).sort() },
 };
}
