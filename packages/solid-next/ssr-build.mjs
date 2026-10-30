import { build } from 'vite';
import solid from '@solidjs/vite-plugin';
import { fileURLToPath } from 'node:url';
const base=fileURLToPath(new URL('../../tests/ssr/solid-next/',import.meta.url));
const root=fileURLToPath(new URL('./',import.meta.url));
for(const target of ['client','server']) await build({root,configFile:false,plugins:[solid({ssr:true})],resolve:{alias:{'@unofficial-krds/solid-next':fileURLToPath(new URL(target==='server'?'./dist/server/index.js':'./dist/index.js',import.meta.url))}},build:{outDir:`dist/ssr-${target}`,emptyOutDir:true,ssr:target==='server',lib:{entry:`${base}${target}.tsx`,formats:['es'],fileName:()=>`${target}.js`},rollupOptions:target==='server'?{external:['solid-js','@solidjs/web','@unofficial-krds/contracts']}:{}}});
