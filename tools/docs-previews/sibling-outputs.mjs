#!/usr/bin/env node
/**
 * Prove a fixture's docs-preview build and its ordinary build never delete or
 * rewrite each other's dist outputs (including Nx cache restores). The runner
 * is injected so unit tests can model destructive builders without building.
 */
import { existsSync, lstatSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createHash } from 'node:crypto';
import { frameworks } from './contract.mjs';
const digest = bytes => createHash('sha256').update(bytes).digest('hex');
const SENTINEL = '__krds-sibling-sentinel.txt';
function snapshot(directory, { include = () => true } = {}) {
 const result = new Map();
 const walk = relative => {
  const absolute = resolve(directory, relative);
  if (!existsSync(absolute)) return;
  for (const entry of readdirSync(absolute, { withFileTypes: true })) {
   const path = relative ? `${relative}/${entry.name}` : entry.name;
   if (!include(path)) continue;
   if (entry.isSymbolicLink()) result.set(path, 'symlink');
   else if (entry.isDirectory()) walk(path);
   else result.set(path, digest(readFileSync(resolve(directory, path))));
  }
 };
 walk('');
 return result;
}
function compare(before, after, label) {
 const lost = [...before].filter(([path, hash]) => after.get(path) !== hash).map(([path]) => path);
 if (lost.length) throw new Error(`${label} deleted or rewrote sibling output: ${lost.slice(0, 10).join(', ')}`);
}
const isPreview = path => path === 'docs-preview' || path.startsWith('docs-preview/');
/** run(target) builds `docs-preview` or `build` for the fixture; it may be async. */
export async function verifySiblingPreservation({ root, framework, run, rounds = ['fresh'] }) {
 if (!frameworks.includes(framework)) throw new Error(`Unknown framework: ${framework}`);
 const dist = resolve(root, `apps/fixture-${framework}/dist`);
 mkdirSync(dist, { recursive: true });
 if (existsSync(resolve(dist, 'docs-preview')) && lstatSync(resolve(dist, 'docs-preview')).isSymbolicLink()) throw new Error('docs-preview output must not be a symlink');
 writeFileSync(resolve(dist, SENTINEL), `${framework} sibling sentinel\n`);
 try {
  for (const round of rounds) {
   const ordinary = snapshot(dist, { include: path => !isPreview(path) });
   await run('docs-preview', round);
   compare(ordinary, snapshot(dist, { include: path => !isPreview(path) }), `${framework} docs-preview (${round})`);
   if (!existsSync(resolve(dist, 'docs-preview/artifact-manifest.json'))) throw new Error(`${framework} docs-preview (${round}) produced no artifact manifest`);
   const preview = snapshot(dist, { include: isPreview });
   await run('build', round);
   compare(preview, snapshot(dist, { include: path => isPreview(path) }), `${framework} ordinary build (${round})`);
   if (!existsSync(resolve(dist, SENTINEL))) throw new Error(`${framework} ordinary build (${round}) deleted an unowned dist file`);
  }
 } finally { rmSync(resolve(dist, SENTINEL), { force: true }); }
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
 const root = resolve(import.meta.dirname, '../..');
 const args = process.argv.slice(2);
 const selected = args.includes('--all') ? frameworks : args.flatMap((arg, index) => arg === '--framework' ? [args[index + 1]] : []);
 if (!selected.length) throw new Error('Usage: sibling-outputs.mjs --framework <id> | --all');
 const env = { ...process.env, NX_DAEMON: 'false', NX_NO_CLOUD: 'true', NX_TUI: 'false' };
 for (const framework of selected) {
  // fresh: real builders; cached: Nx restores both outputs from its local cache.
  await verifySiblingPreservation({ root, framework, rounds: ['fresh', 'cached'], run: (target, round) => {
   const result = spawnSync(process.execPath, ['tools/yarn.mjs', 'exec', 'nx', 'run', `fixture-${framework}:${target}`, '--exclude-task-dependencies', ...(round === 'fresh' ? ['--skip-nx-cache'] : [])], { cwd: root, env, stdio: 'inherit' });
   if (result.status !== 0) throw new Error(`fixture-${framework}:${target} failed (${round})`);
  } });
  console.log(`${framework}: docs-preview and ordinary outputs preserved each other (fresh and cache-restored)`);
 }
}
