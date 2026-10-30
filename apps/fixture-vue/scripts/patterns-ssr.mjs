import assert from 'node:assert/strict';
import {mkdtemp,symlink,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {build} from 'vite';
import vue from '@vitejs/plugin-vue';
const directory=await mkdtemp('/private/tmp/krds-vue-pattern-ssr-');
await symlink(join(process.cwd(),'node_modules'),join(directory,'node_modules'),'dir');
assert.equal(typeof document,'undefined');
await build({configFile:false,plugins:[vue()],build:{ssr:'tests/patterns/ssr-entry.ts',outDir:directory,emptyOutDir:false,rollupOptions:{output:{entryFileNames:'entry.mjs'}}}});
const {renderSnapshots}=await import(pathToFileURL(join(directory,'entry.mjs')).href);
const rendered=await renderSnapshots();assert.equal(rendered.length,16);
for(const entry of rendered){assert.match(entry.html,/data-pattern-kind=/);assert.doesNotMatch(entry.html,/undefined|Component not implemented/);}
for(const entry of rendered.filter(x=>x.id.startsWith('krds-pattern-form-errors')))assert.match(entry.html,/<form[^>]*novalidate/);
await writeFile(join(directory,'rendered.json'),JSON.stringify(rendered,null,2));
console.log(`16 real Vue presentation SSR snapshots rendered without DOM globals: ${directory}`);
console.log('Fixture route is CSR; this independent presentation SSR does not establish route SSR or hydration.');
