import { readFile, readdir, realpath, stat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, join, relative } from 'node:path';
import { spawnSync } from 'node:child_process';
export const root = resolve(import.meta.dirname, '../..');
export const hash = bytes => createHash('sha256').update(bytes).digest('hex');
export const json = async path => JSON.parse(await readFile(path, 'utf8'));
export const config = await json(join(root, 'compatibility/toolchain.json'));
export const node = process.versions.node === config.node.version ? process.execPath : config.node.installedBinary;
export function run(args, { cwd = root, allowFailure = false, env = {} } = {}) {
 const result = spawnSync(node, args, { cwd, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024, env: { ...process.env, PATH: `${resolve(node, '..')}:${process.env.PATH}`, NODE_PATH: '', NG_CLI_ANALYTICS: 'false', NX_NO_CLOUD: 'true', NX_DAEMON: 'false', ...env } });
 if (result.error) throw result.error;
 if (result.status && !allowFailure) throw new Error(`${args.join(' ')} failed (${result.status})\n${result.stdout}\n${result.stderr}`);
 return { status: result.status, signal: result.signal ?? null, stdout: result.stdout, stderr: result.stderr };
}
export const yarn = (args, options) => run([join(root, '.yarn/releases', `yarn-${config.packageManager.version}.cjs`), ...args], options);
export async function packages() {
 const found = [];
 for (const dir of (await readdir(join(root, 'packages'))).sort()) {
  const folder = join(root, 'packages', dir); let pkg;
  try { pkg = await json(join(folder, 'package.json')); } catch (error) { if (error.code === 'ENOENT') continue; throw error; }
  if (!pkg.private) found.push({ dir, folder, pkg });
 }
 if (found.length !== 13) throw new Error(`Expected 13 public packages, found ${found.length}`);
 return found;
}
export async function files(folder, prefix = '') {
 const result = [];
 for (const entry of (await readdir(join(folder, prefix), { withFileTypes: true })).sort((a,b)=>a.name.localeCompare(b.name))) {
  if (['node_modules', '.git', '.yarn', '.nx', '.angular', '.svelte-kit', '.vite', '.DS_Store'].includes(entry.name)) continue;
  const path = join(prefix, entry.name);
  if (entry.isSymbolicLink()) throw new Error(`Unexpected source symlink: ${join(folder,path)}`);
  if (entry.isDirectory()) result.push(...await files(folder, path)); else result.push(path);
 }
 return result;
}
export async function fingerprint(options = {}) {
 const {sourceSnapshot}=await import('./scopes.mjs');return (await sourceSnapshot(options)).sha256;
}
export function internalRange(version, range) {
 // The project emits canonical exact, caret and tilde internal ranges. Unsupported
 // range syntax fails closed; the candidate override never widens these ranges.
 const parse=value=>{const match=/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-([0-9A-Za-z.-]+))?$/u.exec(value);if(!match)return null;const pre=match[4]?.split('.')??[];if(pre.some(part=>!part||/^0\d+$/u.test(part)))return null;return {tuple:match.slice(1,4).map(Number),pre};};
 const actual=parse(version);if(!actual)return false;
 const exact=range.startsWith('=')?range.slice(1):range;if(parse(exact))return exact===version;
 const op=range[0];if(op!=='^'&&op!=='~')return false;const minimum=parse(range.slice(1));if(!minimum)return false;
 const cmp=(a,b)=>{for(let i=0;i<a.length;i++){if(a[i]!==b[i])return a[i]<b[i]?-1:1;}return 0;};
 const tuples=cmp(actual.tuple,minimum.tuple);if(tuples<0)return false;
 if(actual.pre.length && (!minimum.pre.length || tuples!==0))return false;
 if(tuples===0 && minimum.pre.length){if(actual.pre.length){let order=0;for(let i=0;i<Math.max(actual.pre.length,minimum.pre.length);i++){const a=actual.pre[i],b=minimum.pre[i];if(a===b)continue;if(a===undefined){order=-1;break;}if(b===undefined){order=1;break;}const numericA=/^\d+$/u.test(a),numericB=/^\d+$/u.test(b);order=numericA&&numericB?Math.sign(Number(a)-Number(b)):numericA?-1:numericB?1:a<b?-1:1;break;}if(order<0)return false;}}
 const [major,minor,patch]=minimum.tuple;const maximum=op==='~'?[major,minor+1,0]:major?[major+1,0,0]:minor?[0,minor+1,0]:[0,0,patch+1];return cmp(actual.tuple,maximum)<0;
}
export async function requireOutside(path) { const resolved=await realpath(path); if (resolved===root || resolved.startsWith(`${root}/`)) throw new Error('Consumer must be outside repository'); return resolved; }
export function runtimeFramework(name) {
 if(name.startsWith('@unofficial-krds/')&&['react','solid','solid-next','svelte','vue','lit','qwik','angular'].includes(name.slice('@unofficial-krds/'.length)))return name.slice('@unofficial-krds/'.length);
 if(['react','react-dom','react-reconciler'].includes(name))return 'react';
 if(name==='solid-js')return 'solid';
 if(name==='@solidjs/web')return 'solid-next';
 if(name==='vue'||/^@vue\/(?:runtime-|reactivity|shared)/u.test(name))return 'vue';
 if(name==='svelte')return 'svelte';
 if(['lit','lit-html','lit-element','@lit/reactive-element'].includes(name))return 'lit';
 if(name==='@builder.io/qwik')return 'qwik';
 if(name.startsWith('@angular/'))return 'angular';
 return null;
}
export async function auditBundleModules(ids,id) {
 const observed=new Map();
 for(const module of ids) {
  if(/(?:storybook|siheom|vitest|playwright)/u.test(module))throw new Error(`Test tool in production bundle ${module}`);
  if(module.includes(root))throw new Error(`Repository source/module leakage ${module}`);
  const match=/^(.*\/node_modules\/\.store\/[^/]+\/package)\//u.exec(module);if(!match)continue;
  let pkg=observed.get(match[1]);if(!pkg){pkg=await json(join(match[1],'package.json'));observed.set(match[1],pkg);}
  const framework=runtimeFramework(pkg.name);
  if(framework && framework!==id && !(id==='solid-next' && pkg.name==='solid-js'))throw new Error(`Foreign runtime in ${id} bundle: ${pkg.name}@${pkg.version}`);
  if(/\/(?:all|fonts)\.css(?:\?|$)/u.test(module))throw new Error(`Single-component bundle included aggregate CSS/fonts: ${module}`);
 }
 return [...observed.values()].map(({name,version})=>({name,version}));
}
