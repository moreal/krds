import { readFile, readdir, lstat } from 'node:fs/promises';
import { join } from 'node:path';
import { createHash } from 'node:crypto';
import { safePath } from './generate-notices.mjs';
import { verifyNativeInventory } from './docs-previews/provenance.mjs';
const termsDestination = (path) => path.endsWith('.html') ? `${path}.txt` : path;
const hash = (bytes) => createHash('sha256').update(bytes).digest('hex');
const json = async (path) => JSON.parse(await readFile(path, 'utf8'));
const exists = async (path) => { try { await lstat(path); return true; } catch (error) { if (error.code === 'ENOENT') return false; throw error; } };
async function files(root, path) {
  const result = [];
  if (!await exists(safePath(root, path))) return result;
  for (const entry of await readdir(safePath(root, path), { withFileTypes: true })) {
    const name = `${path}/${entry.name}`;
    if (entry.isSymbolicLink()) throw new Error(`Distribution symlink is forbidden: ${name}`);
    if (entry.isDirectory()) result.push(...await files(root, name));
    else if (entry.isFile()) result.push(name);
  }
  return result;
}
async function checkBytes(root, path, record) {
  const target = safePath(root, path);
  if ((await lstat(target)).isSymbolicLink()) throw new Error(`Distribution symlink is forbidden: ${path}`);
  const bytes = await readFile(target);
  if (bytes.length !== record.bytes || hash(bytes) !== record.sha256) throw new Error(`Distribution byte/hash mismatch: ${path}`);
}
export async function loadDistribution(root, { independentCopyright, sourceEntries, policy } = {}) {
  const path = join(root, 'compliance/distribution-provenance.json');
  if (!await exists(path)) {
    if (await exists(join(root, 'apps'))) throw new Error('Missing web distribution provenance inventory');
    return null; // Small package-only verifier fixtures have no web distribution.
  }
  const inventory = await json(path);
  if (inventory.schemaVersion !== 1 || !Array.isArray(inventory.assets) || !Array.isArray(inventory.applications)) throw new Error('Invalid web distribution provenance inventory');
  policy ??= await json(join(root, 'compliance/license-policy.json'));
  sourceEntries ??= await json(join(root, 'compliance/provenance.json'));
  independentCopyright ??= policy.independentCode?.copyrightNotice;
  if (independentCopyright && inventory.independentCopyright !== independentCopyright) throw new Error('Distribution copyright disagrees with confirmed independent grant');
  for (const [path, expected] of Object.entries(inventory.termsHashes)) {
    if (hash(await readFile(safePath(root, path))) !== expected) throw new Error(`Distribution terms hash mismatch: ${path}`);
  }
  for (const paths of Object.values(inventory.terms)) for (const path of paths) if (!inventory.termsHashes[path]) throw new Error(`Unhashed distribution terms: ${path}`);
  if (!inventory.terms.independent?.length || !inventory.terms.krds?.length || !inventory.terms.font?.length) throw new Error('Missing distribution condition scopes');
  if (sourceEntries) {
    const expectedSources = sourceEntries.filter((entry) => entry.distributedIn.some((name) => name.endsWith('/styles'))).map((entry) => entry.id).sort();
    const actualSources = (inventory.sourceConditions ?? []).map((entry) => entry.sourceId).sort();
    if (JSON.stringify(actualSources) !== JSON.stringify(expectedSources)) throw new Error('Missing or extra shared stylesheet source conditions');
  }
  for (const condition of inventory.sourceConditions ?? []) {
    const source = sourceEntries?.find((entry) => entry.id === condition.sourceId);
    if (sourceEntries && (!source || source.sha256 !== condition.sourceSha256 || source.licenseIdOrRef !== condition.licenseIdOrRef || source.licenseTextPath !== condition.licenseTextPath || source.rightsStatus !== condition.rightsStatus || source.rightsStatus !== 'verified')) throw new Error(`Distribution source condition drift: ${condition.sourceId}`);
  }
  // The selection cannot weaken authoritative source obligations. Related full
  // documents are a transitive condition, not optional supplemental notices.
  const termClosure = (roots) => {
    const result = new Set();
    const visit = (path) => {
      if (typeof path !== 'string' || !path.trim()) throw new Error('Missing authoritative distribution term closure');
      safePath(root, path);
      if (result.has(path)) return;
      result.add(path);
      for (const related of policy.relatedDocuments?.[path] ?? []) visit(related);
    };
    roots.forEach(visit);
    return [...result].sort();
  };
  const requiredTerms = {
    independent: termClosure([policy.independentCode?.termsPath]),
    krds: termClosure((inventory.sourceConditions ?? []).map((condition) => condition.licenseTextPath)),
    font: termClosure([policy.fontPolicy?.licensePath]),
  };
  if (JSON.stringify(Object.keys(inventory.terms).sort()) !== JSON.stringify(Object.keys(requiredTerms).sort())) throw new Error('Unknown distribution term closure scope');
  for (const [scope, required] of Object.entries(requiredTerms)) {
    if (!required.length || JSON.stringify([...inventory.terms[scope]].sort()) !== JSON.stringify(required)) throw new Error(`Required distribution terms missing or mismatched in ${scope} term closure`);
    for (const path of required) if (!policy.sourceDocuments?.[path] || policy.sourceDocuments[path] !== inventory.termsHashes[path]) throw new Error(`Distribution authoritative terms hash mismatch: ${path}`);
  }
  const declared = new Set();
  const add = (path) => { safePath(root, path); if (declared.has(path)) throw new Error(`Duplicate distribution destination: ${path}`); declared.add(path); };
  const apps = new Map(inventory.applications.map((app) => [app.path, app]));
  for (const app of inventory.applications) {
    if (app.publicRoot !== `${app.path}/public` || app.buildRoot !== `${app.path}/dist` || app.assetRoot !== `${app.publicRoot}/local-assets`) throw new Error(`Invalid application distribution roots: ${app.path}`);
  }
  for (const record of inventory.assets) {
    if (record.rightsStatus !== 'verified' || record.rights !== 'independent' || !record.evidence?.length || !record.destinations?.length) throw new Error(`Unverified specimen distribution: ${record.sourcePath}`);
    await checkBytes(root, record.sourcePath, record);
    for (const destination of record.destinations) {
      const app = apps.get(destination.split('/').slice(0, 2).join('/'));
      if (!app || !(destination.startsWith(`${app.assetRoot}/`) || destination.startsWith(`${app.publicRoot}/local/`) || destination === 'apps/docs/public/mark.svg')) throw new Error(`Invalid asset destination: ${destination}`);
      add(destination); await checkBytes(root, destination, record);
      const build = destination.replace(`${app.publicRoot}/`, `${app.buildRoot}/`);
      if (await exists(safePath(root, app.buildRoot))) await checkBytes(root, build, record);
    }
  }
  if (inventory.bundledDependencies?.length) {
    const dependencies = await json(join(root, policy.dependencyInventoryPath));
    for (const record of inventory.bundledDependencies) {
      const original = dependencies.packages[`${record.name}@${record.version}`];
      if (!original || !record.modules?.length || !record.licenseDocuments?.length || original.manifestPath !== record.manifestPath || original.manifestSha256 !== record.manifestSha256 || JSON.stringify(original.licenseDocuments) !== JSON.stringify(record.licenseDocuments)) throw new Error(`Bundled dependency original provenance drift: ${record.name}`);
      if (hash(await readFile(safePath(root, record.manifestPath))) !== record.manifestSha256) throw new Error(`Bundled dependency manifest drift: ${record.name}`);
      for (const terms of record.licenseDocuments) if (hash(await readFile(safePath(root, terms.localPath))) !== terms.sha256) throw new Error(`Bundled dependency license drift: ${record.name}`);
    }
  }
  // Bundlers emit original font bytes into hashed build destinations. Keep their
  // original rights separate from independent specimen assets and text snapshots.
  const fontDestinations = new Set();
  for (const record of inventory.fontAssets ?? []) {
    const original = sourceEntries.find(entry => entry.id === record.sourceId);
    if (!original || original.rightsStatus !== 'verified' || original.modified || record.modified !== false || !original.localPaths.includes(record.sourcePath) || original.sha256 !== record.sha256 || !inventory.terms.font.includes(original.licenseTextPath) || !record.destinations?.length) throw new Error(`Invalid font source provenance: ${record.sourcePath}`);
    await checkBytes(root, record.sourcePath, record);
    for (const destination of record.destinations) {
      if (!/^apps\/docs\/dist\/_astro\/[^/]+\.woff2$/u.test(destination) || fontDestinations.has(destination)) throw new Error(`Invalid font destination: ${destination}`);
      fontDestinations.add(destination);
      if (await exists(safePath(root, 'apps/docs/dist'))) await checkBytes(root, destination, record);
    }
  }
  for (const path of await files(root, 'apps/docs/dist/_astro')) if (/\.(?:woff2?|ttf|otf)$/iu.test(path) && !fontDestinations.has(path)) throw new Error(`Untracked built font: ${path}`);
  // Discover roots independently: a new framework asset root cannot escape registration.
  for (const app of await readdir(join(root, 'apps'), { withFileTypes: true })) {
    if (!app.isDirectory()) continue;
    for (const path of [...await files(root, `apps/${app.name}/public/local-assets`), ...await files(root, `apps/${app.name}/public/local`)]) if (!declared.has(path)) throw new Error(`Untracked web asset: ${path}`);
    const buildRoot = `apps/${app.name}/dist/local-assets`;
    for (const path of [...await files(root, buildRoot), ...await files(root, `apps/${app.name}/dist/local`)]) if (!declared.has(path.replace('/dist/', '/public/'))) throw new Error(`Untracked built web asset: ${path}`);
  }
  const docs = inventory.documentation;
  if (docs.publicRoot !== 'apps/docs/public/sources' || docs.buildRoot !== 'apps/docs/dist/sources') throw new Error('Invalid docs distribution roots');
  const metadataBytes = await readFile(safePath(root, docs.metadataPath));
  if (docs.metadataSha256 && hash(metadataBytes) !== docs.metadataSha256) throw new Error('Docs metadata snapshot hash drift');
  const metadata = JSON.parse(metadataBytes);
  const referencePaths = new Set(docs.referenceOnlySources.map((entry) => entry.sourcePath));
  if (JSON.stringify(metadata.referenceOnlySources) !== JSON.stringify(docs.referenceOnlySources)) throw new Error('Docs reference-only mapping drift');
  const expected = new Map(metadata.distributedSources.map((r) => [`apps/docs/public/${r.outputPath}`, r]));
  if (expected.size !== docs.records.length) throw new Error('Docs distribution mapping count drift');
  for (const record of docs.records) {
    if (!['independent', 'krds-reference-adaptation', 'mixed-record', 'preserved-terms'].includes(record.rights)) throw new Error(`Unknown docs rights scope: ${record.sourcePath}`);
    const original = expected.get(record.destination);
    if (!original || original.sha256 !== record.sha256 || original.bytes !== record.bytes || original.sourcePath !== record.sourcePath) throw new Error(`Docs source/destination mapping drift: ${record.destination}`);
    if (!record.destination.startsWith(`${docs.publicRoot}/`) || referencePaths.has(record.sourcePath) || record.sourcePath.startsWith('upstream/krds/raw/components/') || /docs\/patterns\/evidence\/.*\.html$/u.test(record.sourcePath)) throw new Error(`Reference-only original cannot be distributed: ${record.sourcePath}`);
    if (record.rights === 'preserved-terms' && inventory.termsHashes[record.sourcePath] !== record.sha256) throw new Error(`Unverified preserved terms snapshot: ${record.sourcePath}`);
    add(record.destination); await checkBytes(root, record.destination, record);
    const build = record.destination.replace(docs.publicRoot, docs.buildRoot);
    if (await exists(safePath(root, 'apps/docs/dist'))) await checkBytes(root, build, record);
  }
  for (const path of await files(root, docs.publicRoot)) if (!declared.has(path)) throw new Error(`Untracked docs snapshot: ${path}`);
  for (const path of await files(root, docs.buildRoot)) if (!declared.has(path.replace(docs.buildRoot, docs.publicRoot))) throw new Error(`Untracked built docs snapshot: ${path}`);
  for (const record of inventory.exclusions) if (record.rightsStatus !== 'unresolved' || record.distributedIn.length) throw new Error('Excluded voice material must remain unresolved and undistributed');
  // Native preview bytes keep their own inventory; re-check rights evidence, not only destination hashes.
  if (inventory.nativePreviews) {
    if (!policy.dependencyInventoryPath) throw new Error('Native preview runtime notices require the dependency inventory');
    verifyNativeInventory(root, inventory.nativePreviews, { sourceEntries: sourceEntries ?? [], dependencies: await json(join(root, policy.dependencyInventoryPath)), distribution: inventory });
  }
  return inventory;
}
export async function distributionArtifacts(root, inventory) {
  const outputs = new Map();
  if (!inventory) return outputs;
  for (const app of inventory.applications) {
    const assets = inventory.assets.filter((record) => record.destinations.some((path) => path.startsWith(`${app.publicRoot}/`)));
    const docs = app.path === 'apps/docs' ? inventory.documentation : null;
    const dependencies = docs ? [...inventory.bundledDependencies ?? [], ...inventory.nativePreviews?.artifacts.flatMap(artifact => artifact.bundledDependencies) ?? []] : [];
    const dependencyTerms = dependencies.flatMap(record => record.licenseDocuments);
    const allTermHashes = {...inventory.termsHashes,...Object.fromEntries(dependencyTerms.map(record=>[record.localPath,record.sha256]))};
    const terms = [...new Set([...inventory.terms.independent, ...inventory.terms.krds, ...(docs ? inventory.terms.font : []),...dependencyTerms.map(record=>record.localPath)])];
    const local = { schemaVersion: 1, application: app.path, inventory: 'compliance/distribution-provenance.json', scope: inventory.scope, independentCopyright: inventory.independentCopyright, assets, sourceConditions: inventory.sourceConditions ?? [], sourceConditionsNote: inventory.sourceConditionsNote, ...(docs ? { documentation: docs, fontAssets: inventory.fontAssets ?? [], bundledDependencies: dependencies, ...(inventory.nativePreviews ? { nativePreviews: inventory.nativePreviews } : {}) } : {}), termsCopies: terms.map((path) => ({ sourcePath: path, destination: termsDestination(path), sha256: allTermHashes[path] })), termsHashes: Object.fromEntries(terms.map((path) => [path, allTermHashes[path]])), exclusions: inventory.exclusions };
    const index = `<!doctype html><html lang="en"><meta charset="utf-8"><title>Source and license notices</title><main><h1>Source and license notices</h1><p>${inventory.independentCopyright.replaceAll('<', '&lt;').replaceAll('>', '&gt;')}. The MIT grant covers independent project materials only.</p><p>Official KRDS excerpts and adaptations retain Ministry of the Interior and Safety attribution and KRDS/KOGL conditions. Original policy and font texts retain their own terms and Reserved Font Names. No government affiliation, sponsorship or endorsement is implied.</p><p>Fixture audio is an arithmetic test tone; video is simple geometry. These specimens are not speech or authentic sign-language interpretations. Apple System Voices/Yuna output is excluded.</p><ul>${terms.map((path) => `<li><a href="${termsDestination(path)}">${path}</a></li>`).join('')}<li><a href="provenance.json">Exact source and destination inventory</a></li></ul></main></html>\n`;
    const roots = [`${app.publicRoot}/_legal`];
    if (await exists(safePath(root, app.buildRoot))) roots.push(`${app.buildRoot}/_legal`);
    for (const base of roots) {
      outputs.set(safePath(root, `${base}/index.html`), index);
      outputs.set(safePath(root, `${base}/provenance.json`), `${JSON.stringify(local, null, 2)}\n`);
      for (const path of terms) outputs.set(safePath(root, `${base}/${termsDestination(path)}`), await readFile(safePath(root, path)));
    }
  }
  return outputs;
}
