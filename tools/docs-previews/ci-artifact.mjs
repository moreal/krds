#!/usr/bin/env node
/**
 * CI hand-off for one native preview artifact.
 * stage:   validate the fresh dist/docs-preview, copy only manifest-allowlisted files
 *          plus the manifest into an empty directory, and record its revision.
 * restore: in the assembly job, accept only an exact same-revision artifact and
 *          replace solely apps/fixture-<framework>/dist/docs-preview.
 */
import { existsSync, lstatSync, mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { frameworks, readContained, sha256 } from './contract.mjs';
const ORIGIN = 'artifact-origin.json';
const outputOf = framework => `apps/fixture-${framework}/dist/docs-preview`;
function listFiles(directory) {
 const found = [];
 const walk = relative => {
  for (const entry of readdirSync(resolve(directory, relative), { withFileTypes: true })) {
   const path = relative ? `${relative}/${entry.name}` : entry.name;
   if (entry.isSymbolicLink()) throw new Error(`${path}: symlink rejected`);
   if (entry.isDirectory()) walk(path);
   else if (entry.isFile()) found.push(path);
   else throw new Error(`${path}: unsupported file type`);
  }
 };
 if (existsSync(directory)) walk('');
 return found.sort();
}
function checkFramework(framework) { if (!frameworks.includes(framework)) throw new Error(`Unknown framework: ${framework}`); }
function checkRevision(revision) { if (!/^[0-9a-f]{40}$/.test(revision ?? '')) throw new Error('A full 40-hex source revision is required'); }
/** Exact allowlisted copy; validator receives (manifest, outputDir, framework). */
export async function stage({ root = process.cwd(), framework, out, revision, validate = defaultValidate }) {
 checkFramework(framework); checkRevision(revision);
 const outputDir = resolve(root, outputOf(framework));
 const manifestBytes = readContained(outputDir, 'artifact-manifest.json');
 const manifest = JSON.parse(manifestBytes.toString());
 if (manifest.framework !== framework) throw new Error(`${framework}: wrong artifact framework`);
 await validate(manifest, outputDir, framework, root);
 if (existsSync(out) && readdirSync(out).length) throw new Error(`Stage directory must be empty: ${out}`);
 const copies = manifest.files.map(file => {
  const bytes = readContained(outputDir, file.path);
  if (sha256(bytes) !== file.sha256 || bytes.length !== file.size) throw new Error(`${framework}/${file.path}: stale artifact file`);
  return [file.path, bytes];
 });
 const target = resolve(out, 'docs-preview');
 for (const [path, bytes] of copies) {
  mkdirSync(dirname(resolve(target, path)), { recursive: true });
  writeFileSync(resolve(target, path), bytes);
 }
 writeFileSync(resolve(target, 'artifact-manifest.json'), manifestBytes);
 const origin = { schemaVersion: 1, framework, revision, artifactSha256: sha256(manifestBytes), files: manifest.files.length };
 writeFileSync(resolve(out, ORIGIN), JSON.stringify(origin, null, 2) + '\n');
 return origin;
}
export function restore({ root = process.cwd(), framework, from, revision }) {
 checkFramework(framework); checkRevision(revision);
 const origin = JSON.parse(readContained(from, ORIGIN).toString());
 if (origin.schemaVersion !== 1 || origin.framework !== framework) throw new Error(`${framework}: artifact origin names ${origin.framework}`);
 if (origin.revision !== revision) throw new Error(`${framework}: artifact revision ${origin.revision} differs from checkout ${revision}`);
 const source = resolve(from, 'docs-preview');
 const manifestBytes = readContained(source, 'artifact-manifest.json');
 if (sha256(manifestBytes) !== origin.artifactSha256) throw new Error(`${framework}: artifact manifest hash differs from its origin record`);
 const manifest = JSON.parse(manifestBytes.toString());
 if (manifest.framework !== framework) throw new Error(`${framework}: wrong artifact framework`);
 const expected = [...manifest.files.map(file => file.path), 'artifact-manifest.json'].sort();
 const actual = listFiles(source);
 if (JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error(`${framework}: downloaded artifact is not exactly the manifest allowlist`);
 const copies = manifest.files.map(file => {
  const bytes = readContained(source, file.path);
  if (sha256(bytes) !== file.sha256 || bytes.length !== file.size) throw new Error(`${framework}/${file.path}: downloaded bytes differ from manifest`);
  return [file.path, bytes];
 });
 const destination = resolve(root, outputOf(framework));
 if (existsSync(destination) && lstatSync(destination).isSymbolicLink()) throw new Error(`${framework}: docs-preview destination is a symlink`);
 // Only this framework's preview subtree is replaced; ordinary fixture dist output is untouched.
 rmSync(destination, { recursive: true, force: true });
 for (const [path, bytes] of [...copies, ['artifact-manifest.json', manifestBytes]]) {
  mkdirSync(dirname(resolve(destination, path)), { recursive: true });
  writeFileSync(resolve(destination, path), bytes);
 }
 return origin;
}
async function defaultValidate(manifest, outputDir, framework, root) {
 const { validateArtifact } = await import('./contract.mjs');
 const { loadAcceptance } = await import('./contract.mjs');
 const { loadDefinitions, validateFrameworkReferences } = await import('./assemble.mjs');
 const { nativePreviewInventory } = await import('./provenance.mjs');
 const loaded = loadDefinitions({ root });
 const definitions = { schemaVersion: 1, demos: loaded.demos.filter(demo => demo.framework === framework) };
 validateArtifact(manifest, definitions, { root, outputDir });
 // Same reference policy as assemble(): acceptance-derived intentionally absent URLs are tolerated.
 validateFrameworkReferences(manifest, outputDir, { framework, definitions, acceptance: loadAcceptance(root) });
 // Rights failures surface in the matrix job instead of after every worker finishes.
 nativePreviewInventory({ root, frameworks: [framework], manifests: { [framework]: manifest } });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
 const [command, ...args] = process.argv.slice(2);
 const option = name => { const index = args.indexOf(`--${name}`); if (index < 0 || !args[index + 1]) throw new Error(`--${name} is required`); return args[index + 1]; };
 const root = resolve(import.meta.dirname, '../..');
 const result = command === 'stage' ? await stage({ root, framework: option('framework'), out: resolve(option('out')), revision: option('revision') })
  : command === 'restore' ? restore({ root, framework: option('framework'), from: resolve(option('from')), revision: option('revision') })
  : (() => { throw new Error('Usage: ci-artifact.mjs stage|restore --framework <id> --revision <sha> (--out <dir> | --from <dir>)'); })();
 console.log(JSON.stringify(result));
}
