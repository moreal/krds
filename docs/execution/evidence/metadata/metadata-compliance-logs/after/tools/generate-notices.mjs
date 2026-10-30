#!/usr/bin/env node
import { readFile, writeFile, readdir, mkdir, rm, lstat } from 'node:fs/promises';
import { resolve, relative, dirname, isAbsolute, join } from 'node:path';
import { createHash } from 'node:crypto';
import { pathToFileURL } from 'node:url';
export const noticeFiles = ['LICENSE.md', 'LICENSES', 'ATTRIBUTION.md', 'THIRD-PARTY-NOTICES.md', 'provenance.json'];
const digest = (bytes) => createHash('sha256').update(bytes).digest('hex');
const json = async (path) => JSON.parse(await readFile(path, 'utf8'));
const nonempty = (value) => typeof value === 'string' && /\S/u.test(value);
export function safePath(root, path) {
  if (!nonempty(path) || isAbsolute(path) || path.split(/[\\/]/u).includes('..')) throw new Error(`Unsafe local path: ${path}`);
  const result = resolve(root, path);
  if (relative(root, result).startsWith('..')) throw new Error(`Path escapes root: ${path}`);
  return result;
}
// Only the vocabulary used by provenance.schema.json is accepted. Unknown schema keywords
// fail closed so a future policy change cannot silently bypass validation.
export function validateSchema(value, schema, document = schema, at = '$') {
  const known = new Set(['$schema', '$id', '$defs', '$ref', 'title', 'description', 'type', 'enum', 'const', 'anyOf', 'allOf', 'if', 'then', 'properties', 'required', 'additionalProperties', 'items', 'minItems', 'maxItems', 'uniqueItems', 'minLength', 'pattern', 'format']);
  for (const key of Object.keys(schema)) if (!known.has(key)) throw new Error(`Unsupported schema keyword: ${key}`);
  if (schema.$ref) {
    const target = schema.$ref.split('/').slice(1).reduce((node, key) => node[key], document);
    return validateSchema(value, target, document, at);
  }
  const fail = (message) => { throw new Error(`Provenance schema ${at}: ${message}`); };
  if (schema.anyOf && !schema.anyOf.some((branch) => { try { validateSchema(value, branch, document, at); return true; } catch { return false; } })) fail('does not match any allowed value');
  if (schema.type) {
    const actual = value === null ? 'null' : Array.isArray(value) ? 'array' : typeof value;
    if (actual !== schema.type) fail(`expected ${schema.type}, received ${actual}`);
  }
  if (schema.enum && !schema.enum.includes(value)) fail('value outside enum');
  if ('const' in schema && value !== schema.const) fail(`expected ${schema.const}`);
  if (typeof value === 'string') {
    if (schema.minLength && value.length < schema.minLength) fail('empty string');
    if (schema.pattern && !new RegExp(schema.pattern, 'u').test(value)) fail('invalid or whitespace string');
    if (schema.format === 'uri') { try { const u = new URL(value); if (!['https:', 'http:'].includes(u.protocol)) fail('expected http(s) URL'); } catch { fail('invalid URL'); } }
    if (schema.format === 'date-time' && (!/^\d{4}-\d{2}-\d{2}T.*(?:Z|[+-]\d{2}:\d{2})$/u.test(value) || !Number.isFinite(Date.parse(value)))) fail('invalid retrieval timestamp');
  }
  if (Array.isArray(value)) {
    if (schema.minItems !== undefined && value.length < schema.minItems) fail(`requires at least ${schema.minItems} items`);
    if (schema.maxItems !== undefined && value.length > schema.maxItems) fail(`allows at most ${schema.maxItems} items`);
    if (schema.uniqueItems && new Set(value.map((x) => JSON.stringify(x))).size !== value.length) fail('duplicate items');
    if (schema.items) value.forEach((item, i) => validateSchema(item, schema.items, document, `${at}[${i}]`));
  }
  if (value !== null && typeof value === 'object' && !Array.isArray(value)) {
    for (const key of schema.required ?? []) if (!(key in value)) fail(`missing ${key}`);
    for (const [key, item] of Object.entries(value)) {
      if (schema.properties?.[key]) validateSchema(item, schema.properties[key], document, `${at}.${key}`);
      else if (schema.additionalProperties === false) fail(`unexpected field ${key}`);
    }
  }
  for (const branch of schema.allOf ?? []) validateSchema(value, branch, document, at);
  if (schema.if) {
    let matches = true;
    try { validateSchema(value, schema.if, document, at); } catch { matches = false; }
    if (matches && schema.then) validateSchema(value, schema.then, document, at);
  }
}
async function walk(path) {
  const result = [];
  for (const entry of await readdir(path, { withFileTypes: true })) {
    if (entry.isSymbolicLink()) throw new Error(`Symlink is not a provenance source: ${path}/${entry.name}`);
    if (entry.isDirectory()) result.push(...await walk(join(path, entry.name)));
    else if (entry.isFile()) result.push(join(path, entry.name));
  }
  return result;
}
export async function loadCompliance(root) {
  const entries = await json(join(root, 'compliance/provenance.json'));
  const policy = await json(join(root, 'compliance/license-policy.json'));
  // Fixture roots use the same authoritative schema; callers cannot substitute weaker schemas.
  const schema = await json(resolve(import.meta.dirname, '../compliance/provenance.schema.json'));
  validateSchema(entries, schema);
  const ids = new Set();
  const packages = [];
  for (const dir of await readdir(join(root, 'packages'), { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    const folder = join(root, 'packages', dir.name);
    const pkg = await json(join(folder, 'package.json'));
    if (!pkg.private) packages.push({ folder, pkg });
  }
  const packageNames = new Set(packages.map(({ pkg }) => pkg.name));
  for (const [path, expected] of Object.entries(policy.sourceDocuments ?? {})) {
    const actual = digest(await readFile(safePath(root, path)));
    if (actual !== expected) throw new Error(`License/policy sha256 hash mismatch: ${path}`);
  }
  for (const entry of entries) {
    if (ids.has(entry.id)) throw new Error(`Duplicate provenance id: ${entry.id}`);
    ids.add(entry.id);
    for (const packageName of entry.distributedIn) if (!packageNames.has(packageName)) throw new Error(`${entry.id}: unknown distributedIn package ${packageName}`);
    for (const [i, path] of entry.localPaths.entries()) {
      const bytes = await readFile(safePath(root, path));
      if ((i === 0 || !entry.modified) && digest(bytes) !== entry.sha256) throw new Error(`${entry.id}: source sha256 hash mismatch: ${path}`);
    }
    if (entry.rightsStatus === 'verified') {
      if (!policy.sourceDocuments?.[entry.licenseTextPath]) throw new Error(`${entry.id}: full license terms need a preserved source hash`);
      const text = await readFile(safePath(root, entry.licenseTextPath), 'utf8');
      if (!nonempty(text)) throw new Error(`${entry.id}: full license terms are empty`);
      if (entry.copyrightNotice && !text.includes(entry.copyrightNotice)) throw new Error(`${entry.id}: original copyright is missing from preserved terms`);
    }
    for (const packageName of entry.distributedIn) {
      const folder = relative(root, packages.find(({ pkg }) => pkg.name === packageName).folder).split('\\').join('/');
      if (!entry.localPaths.some((p) => p.startsWith(`${folder}/`))) throw new Error(`${entry.id}: no actual asset path in distributed package ${packageName}`);
    }
  }
  const trackedBinary = (file) => {
    if (!/\.(?:svg|png|jpe?g|gif|webp|avif|ico|woff2?|ttf|otf)$/iu.test(file)) return;
    const path = relative(root, file).split('\\').join('/');
    const owner = packages.find(({ folder }) => file.startsWith(`${folder}/`));
    if (!owner) throw new Error(`Untracked asset outside public package: ${path}`);
    if (!entries.some((e) => e.rightsStatus === 'verified' && e.localPaths.includes(path) && e.distributedIn.includes(owner.pkg.name))) throw new Error(`Untracked shipped asset lacks verified provenance: ${path}`);
  };
  const assetRoots = new Set((policy.staticAssetRoots ?? []).map((path) => safePath(root, path)));
  for (const { folder, pkg } of packages) {
    for (const file of pkg.files ?? []) {
      if (/[*?{}[\]()]|(?:^|\/)!/u.test(file)) throw new Error(`${pkg.name}: unsupported files pattern ${file}; use literal file or directory roots so all shipped assets can be checked against provenance.`);
      if (file === 'LICENSES') continue;
      const path = safePath(folder, file);
      let status;
      try { status = await lstat(path); } catch (error) { if (error.code === 'ENOENT') continue; throw error; }
      if (status.isSymbolicLink()) throw new Error(`Symlink in public package: ${path}`);
      if (status.isDirectory()) assetRoots.add(path);
      else trackedBinary(path);
    }
  }
  for (const assetRoot of assetRoots) for (const file of await walk(assetRoot)) trackedBinary(file);
  return { root, entries, policy, packages };
}
function noticeBody(entries) {
  if (!entries.length) return 'No third-party material is copied or bundled in this package at this snapshot. External dependencies retain their own package notices.\n';
  return entries.map((entry) => `## ${entry.name}\n\n- Source: [${entry.upstreamUrl}](${entry.upstreamUrl})\n- Version/commit: ${entry.versionOrCommit ?? 'Not provided by original; see metadata notes.'}\n- Upstream path: ${entry.upstreamPath ?? 'Not provided by original.'}\n- SHA-256: \`${entry.sha256}\`\n- Conditions: ${entry.licenseIdOrRef}; [preserved full text](${entry.licenseTextPath})\n- Copyright: ${entry.copyrightNotice ?? 'No material-specific copyright notice provided by original; no holder/year inferred.'}\n- Changes: ${entry.changeSummary}\n- Local paths: ${entry.localPaths.map((p) => `\`${p}\``).join(', ')}\n${entry.metadataNotes.map((n) => `- Source note: ${n}\n`).join('')}`).join('\n');
}
export async function expectedArtifacts(state) {
  const { root, entries, packages } = state;
  const rootLicense = await readFile(join(root, 'LICENSE.md'), 'utf8');
  const attribution = await readFile(join(root, 'ATTRIBUTION.md'), 'utf8');
  const outputs = new Map();
  for (const { folder, pkg } of packages) {
    const selected = entries.filter((entry) => entry.distributedIn.includes(pkg.name));
    const directTexts = selected.map((entry) => entry.licenseTextPath);
    const texts = [...new Set(directTexts.flatMap((path) => [path, ...(state.policy.relatedDocuments?.[path] ?? [])]))].sort();
    const body = noticeBody(selected);
    outputs.set(join(folder, 'LICENSE.md'), `${rootLicense.trim()}\n\n## Package scope: ${pkg.name}\n\n${body}`);
    outputs.set(join(folder, 'ATTRIBUTION.md'), selected.some((entry) => entry.licenseIdOrRef === 'LicenseRef-KRDS-KOGL-Type-1') ? attribution : `# Attribution: ${pkg.name}\n\n${selected.length ? 'Included materials are attributed in THIRD-PARTY-NOTICES.md.\n' : 'No KRDS originals or third-party assets are distributed in this package at this snapshot.\n'}\nThis independent project does not imply government affiliation, sponsorship, certification or endorsement.\n`);
    outputs.set(join(folder, 'THIRD-PARTY-NOTICES.md'), `# Third-party notices: ${pkg.name}\n\n${body}`);
    outputs.set(join(folder, 'provenance.json'), `${JSON.stringify(selected, null, 2)}\n`);
    // Preserve the declared independent-code grant separately from upstream terms.
    // Holder evidence and publication authorization remain distinct metadata.
    const independentTerms = state.policy.independentCode?.termsPath ?? 'LICENSES/MIT-intended.txt';
    try { outputs.set(safePath(folder, independentTerms), await readFile(safePath(root, independentTerms))); } catch (error) { if (error.code !== 'ENOENT') throw error; }
    if (!texts.length) outputs.set(join(folder, 'LICENSES/README.md'), 'No upstream code/assets copied or bundled at this snapshot. See LICENSE.md and the declared independent-code grant for its terms.\n');
    for (const text of texts) outputs.set(safePath(folder, text), await readFile(safePath(root, text)));
  }
  outputs.set(join(root, 'THIRD-PARTY-NOTICES.md'), `# Third-party notices\n\nGenerated from compliance/provenance.json. Only material actually distributed in public packages appears below. The complete external development/runtime dependency inventory is separate from copied/bundled material.\n\n${noticeBody(entries.filter((entry) => entry.distributedIn.length))}`);
  return outputs;
}
export async function generate(root) {
  const state = await loadCompliance(root);
  const outputs = await expectedArtifacts(state);
  for (const { folder } of state.packages) await rm(join(folder, 'LICENSES'), { recursive: true, force: true });
  for (const [path, content] of outputs) { await mkdir(dirname(path), { recursive: true }); await writeFile(path, content); }
  console.log(`Generated notices for ${state.packages.length} public packages from ${state.entries.length} provenance records.`);
}
export function commandRoot() { const i = process.argv.indexOf('--root'); return i < 0 ? resolve(import.meta.dirname, '..') : resolve(process.argv[i + 1]); }
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  try { await generate(commandRoot()); } catch (error) { console.error(error.message); process.exitCode = 1; }
}
