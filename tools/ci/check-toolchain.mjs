import {assertNode, readJson, yarn} from './common.mjs';
const selected = assertNode();
const manifest = readJson('package.json');
if (manifest.packageManager !== selected.packageManager.packageManagerField) throw new Error('packageManager/toolchain mismatch');
if (yarn(['--version']) !== selected.packageManager.version) throw new Error('Vendored Yarn version mismatch');
if (process.argv.includes('--installed') && yarn(['exec', 'corepack', '--version']) !== selected.packageManager.corepackVersion) throw new Error('Workspace Corepack version mismatch');
console.log(`Exact Node ${selected.node.version}, Yarn ${selected.packageManager.version}${process.argv.includes('--installed') ? `, Corepack ${selected.packageManager.corepackVersion}` : ''} verified`);
