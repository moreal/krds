import { execFileSync } from 'node:child_process';
import { readdirSync, readFileSync, writeFileSync, rmSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
const root = fileURLToPath(new URL('../../../..', import.meta.url));
const dist = resolve(root, 'apps/fixture-solid-next/dist');
const run = target => execFileSync(process.execPath, ['tools/yarn.mjs','nx','run',`fixture-solid-next:${target}`,'--excludeTaskDependencies','--output-style=static'], {cwd:root,encoding:'utf8'});
function snapshot(preview) {
  const files={};
  function walk(path='') { for(const entry of readdirSync(resolve(dist,path),{withFileTypes:true})) {
    if(!path && (entry.name==='docs-preview')!==preview) continue;
    const p=path?`${path}/${entry.name}`:entry.name;
    if(entry.isDirectory()) walk(p); else files[p]=createHash('sha256').update(readFileSync(resolve(dist,p))).digest('hex');
  }}
  walk();return files;
}
run('build');run('docs-preview');
const ordinary=snapshot(false), preview=snapshot(true);
const ordinaryRestore=run('build');
assert.match(ordinaryRestore,/cache/i);assert.deepEqual(snapshot(true),preview);
const previewRestore=run('docs-preview');
assert.match(previewRestore,/cache/i);assert.deepEqual(snapshot(false),ordinary);
// Delete each target's real output and require cache restoration without losing its sibling.
rmSync(resolve(dist,'index.html'));rmSync(resolve(dist,'assets'),{recursive:true,force:true});
const ordinaryDeleted=run('build');console.log('ORDINARY RESTORE LOG\n'+ordinaryDeleted);assert.match(ordinaryDeleted,/local cache|existing outputs match the cache/i);
assert.deepEqual(snapshot(false),ordinary);assert.deepEqual(snapshot(true),preview);
rmSync(resolve(dist,'docs-preview'),{recursive:true});
const previewDeleted=run('docs-preview');console.log('PREVIEW RESTORE LOG\n'+previewDeleted);assert.match(previewDeleted,/local cache|existing outputs match the cache/i);
assert.deepEqual(snapshot(false),ordinary);assert.deepEqual(snapshot(true),preview);
writeFileSync(resolve(root,'.superpowers/sdd/2026-11-01-native-live-previews/solid-next-browser/cache-restoration.json'), JSON.stringify({ordinary,preview,ordinaryDeleted,previewDeleted},null,2)+'\n');
console.log('PASS: both real Nx cache restore orders preserve sibling outputs byte-for-byte.');
