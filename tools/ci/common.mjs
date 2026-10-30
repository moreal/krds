import {spawnSync} from 'node:child_process';
import {readFileSync, mkdirSync, writeFileSync} from 'node:fs';
import {resolve} from 'node:path';

export const root = resolve(import.meta.dirname, '../..');
export const readJson = path => JSON.parse(readFileSync(resolve(root, path), 'utf8'));
export const env = {...process.env, NX_DAEMON: 'false', NX_ISOLATE_PLUGINS: 'false', NX_NO_CLOUD: 'true', NX_TUI: 'false', NX_INTERACTIVE: 'false', CI: 'true'};
export function command(binary, args, options = {}) {
  const result = spawnSync(binary, args, {cwd: root, env, encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, ...options});
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${binary} ${args.join(' ')} failed (${result.status ?? result.signal})\n${result.stdout ?? ''}${result.stderr ?? ''}`);
  return result.stdout?.trim() ?? '';
}
export const yarn = (args, options) => command(process.execPath, ['tools/yarn.mjs', ...args], options);
export const git = args => command('git', ['-c', 'core.fsmonitor=false', ...args]);
export function writeJson(path, value) {
  const destination = resolve(root, path);
  mkdirSync(resolve(destination, '..'), {recursive: true});
  writeFileSync(destination, `${JSON.stringify(value, null, 2)}\n`);
}
export function assertNode() {
  const selected = readJson('compatibility/toolchain.json');
  if (process.versions.node !== selected.node.version) throw new Error(`Use node tools/yarn.mjs exec node <script>; expected Node ${selected.node.version}, received ${process.versions.node}`);
  return selected;
}
