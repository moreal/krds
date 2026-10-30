import './check-node.mjs';
import { inspectWorkspace, workspaces } from './check-workspace.mjs';
import { mkdir, writeFile, readFile } from 'node:fs/promises';
import { resolve } from 'node:path';
const root = resolve(import.meta.dirname, '..');
const errors = await inspectWorkspace(root);
if (errors.length) throw new Error(errors.join('\n'));
const selected = JSON.parse(await readFile(`${root}/compatibility/toolchain.json`, 'utf8'));
await mkdir(`${root}/tools/dist`, { recursive: true });
await writeFile(`${root}/tools/dist/workspace-summary.json`, JSON.stringify({
  node: selected.node.version,
  yarn: selected.packageManager.version,
  nodeLinker: selected.packageManager.nodeLinker,
  projects: (await workspaces(root)).map(({ project }) => project.name).sort(),
}, null, 2) + '\n');
console.log('Built tools/dist/workspace-summary.json from the verified workspace.');
