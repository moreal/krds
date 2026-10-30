#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { dirname, resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const { node, packageManager } = JSON.parse(readFileSync(`${root}/compatibility/toolchain.json`));
// Bootstrap under the selected binary even when invoked by an ambient Node shim.
const binary = process.versions.node === node.version ? process.execPath : node.installedBinary;
const result = spawnSync(binary, [`${root}/.yarn/releases/yarn-${packageManager.version}.cjs`, ...process.argv.slice(2)], {
  cwd: process.cwd(), stdio: 'inherit', env: { ...process.env, PATH: `${dirname(binary)}:${process.env.PATH}`, NX_DAEMON: 'false', NX_ISOLATE_PLUGINS: 'false' },
});
if (result.error) throw result.error;
if (result.signal) console.error(`Selected Yarn process terminated by ${result.signal}.`);
process.exit(result.status ?? 1);
