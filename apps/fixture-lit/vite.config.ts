import { defineConfig } from 'vite';
import {readdirSync,rmSync,existsSync} from 'node:fs';
import {resolve} from 'node:path';
const ordinaryOutputs=['index.html','harness.html','hydrate.html','gallery.html','assets','local','local-assets','_legal'];
export default defineConfig({ plugins: [{name:'scoped-lit-fixture-cleanup',buildStart(){const dist=resolve('dist');if(!existsSync(dist))return;for(const entry of readdirSync(dist)){if(entry==='docs-preview')continue;if(!ordinaryOutputs.includes(entry))throw Error('Unowned Lit fixture output: '+entry);rmSync(resolve(dist,entry),{recursive:true,force:true});}}}], build: { rollupOptions: {output:{manualChunks:(id:string)=>id.includes('lit-html')?'lit-html':undefined},input: {main:'index.html',harness:'harness.html',hydrate:'hydrate.html',gallery:'gallery.html'}}, outDir: 'dist', emptyOutDir:false } });
