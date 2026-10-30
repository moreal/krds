import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createRequire} from 'node:module';
import {serveProduction} from '../../../tools/testing/support.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH='/private/tmp/krds-playwright-1.64.1';
const root=resolve(import.meta.dirname,'../../..'),directory=resolve(root,'.superpowers/sdd/PLAN/t11-qwik-logs'),output=resolve(directory,'visual-review');await mkdir(output,{recursive:true});
const require=createRequire(resolve(root,'apps/fixture-qwik/package.json')),{chromium}=require('playwright');
const b=JSON.parse(await readFile(resolve(directory,'browser.json'),'utf8')),s=JSON.parse(await readFile(resolve(directory,'stories/report.json'),'utf8'));
const sets={flows:b.screens.map(item=>({label:item.flow+'/'+item.mode,path:item.path})),stories:s.results.map(item=>({label:item.id,path:resolve(directory,'stories',item.id+'.png')}))};
for(const [name,items] of Object.entries(sets)){const cards=await Promise.all(items.map(async item=>`<figure><figcaption>${item.label}</figcaption><img src="data:image/png;base64,${(await readFile(item.path)).toString('base64')}"></figure>`));await writeFile(resolve(output,name+'.html'),`<!doctype html><html><meta charset="utf-8"><style>body{font:12px system-ui;margin:0;background:#ddd}.grid{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}figure{margin:0;background:white;border:1px solid #555;overflow:hidden}figcaption{height:32px;overflow-wrap:anywhere;padding:4px}img{width:100%;height:340px;object-fit:contain;object-position:top}</style><div class="grid">${cards.join('')}</div></html>`);}
await writeFile(resolve(output,'index.html'),'<a href="flows.html">Flow screenshots</a><a href="stories.html">Story screenshots</a>');
const server=await serveProduction(output),browser=await chromium.launch();try{const page=await browser.newPage({viewport:{width:1440,height:1000}});for(const name of Object.keys(sets)){await page.goto(server.origin+'/'+name+'.html',{waitUntil:'networkidle'});await page.screenshot({path:resolve(output,name+'.png'),fullPage:true});}}finally{await browser.close();await server.close();}
console.log('Final service and story screenshot contact sheets retained for visual inspection');
