import { mkdir, writeFile, rm, readFile } from 'node:fs/promises';
import { readFileSync } from 'node:fs';
import { resolve, relative, dirname } from 'node:path';
import { validateRegistry } from '../../../tools/docs-previews/contract.mjs';
import { buildPages, buildSearchRecords, buildNavigation } from './content.mjs';
import { demoFiles } from './demo-files.mjs';
import { moveNativeAvailabilityLast } from './demo-placement.mjs';
const site=resolve(import.meta.dirname,'..');
const routesDirectory=resolve(site,'src/pages'); const generatedDirectory=resolve(site,'src/generated');
const pages=await buildPages(site);
// Explicit catalog page identity; prose/headings never determine demo insertion.
const registryPath=resolve(site,'public/demo-registry.json');
let registry=[];try{registry=JSON.parse(await readFile(registryPath,'utf8'));}catch(error){if(error.code!=='ENOENT')throw error;}
// Every published full-file download and range excerpt is re-hashed against the registry.
const publicSource=url=>resolve(site,'public',url.replace(/^\/krds\//,''));
const readSource=url=>readFileSync(publicSource(url));
validateRegistry(registry,undefined,{readSource});
const catalog=JSON.parse(await readFile(resolve(site,'../../catalog/components.json'),'utf8'));
const componentPages=new Map(catalog.components.filter(component=>component.id!=='splash-screen').map(component=>[`components/${component.id}.md`,component.id]));
for(const page of pages){
 const componentId=componentPages.get(page.sourcePath);
 const records=registry.filter(record=>record.componentId===componentId);
 if(!componentId||!records.length)continue;
 page.demos=await Promise.all(records.map(async record=>({...record,files:await demoFiles(record,url=>readFile(publicSource(url)))})));
 const title=page.blocks.findIndex(block=>block.type==='heading'&&block.level===1);
 const summary=page.blocks[title+1]?.type==='paragraph'?1:0;
 page.blocks.splice(title+1+summary,0,{type:'demo',componentId});
 // Availability is historical evidence; preserve its IDs while placing it below API.
 page.blocks=moveNativeAvailabilityLast(page.blocks,block=>block.type==='heading'?{id:block.id,level:block.level}:null);
 const finalHeadingOrder=new Map(page.blocks.flatMap((block,index)=>block.type==='heading'?[[block.id,index]]:[]));
 page.headings.sort((a,b)=>finalHeadingOrder.get(a.id)-finalHeadingOrder.get(b.id));
}

const routes=pages.map(page=>({sourcePath:page.sourcePath,outputPath:page.outputPath,title:page.title}));
routes.push({sourcePath:'public/_legal/index.html',outputPath:'_legal/index.html',title:'Source and license notices',kind:'static'});
routes.sort((a,b)=>a.outputPath.localeCompare(b.outputPath,'en'));
await rm(routesDirectory,{recursive:true,force:true});await mkdir(generatedDirectory,{recursive:true});
await writeFile(resolve(generatedDirectory,'pages.json'),JSON.stringify(pages)+'\n');
const navigation=buildNavigation(pages);
await writeFile(resolve(generatedDirectory,'navigation.json'),JSON.stringify(navigation)+'\n');
await writeFile(resolve(generatedDirectory,'routes.json'),JSON.stringify(routes,null,2)+'\n');
await writeFile(resolve(generatedDirectory,'route-map.json'),JSON.stringify(Object.fromEntries(pages.filter(page=>page.sourcePath).map(page=>[page.sourcePath,page.route])),null,2)+'\n');
await writeFile(resolve(site,'public/search-index.json'),JSON.stringify(buildSearchRecords(pages))+'\n');
for(const page of pages){
 const file=resolve(routesDirectory,page.outputPath.replace(/\.html$/,'.astro'));
 const from=path=>{const value=relative(dirname(file),path).replaceAll('\\','/');return JSON.stringify(value.startsWith('.')?value:'./'+value);};
 await mkdir(dirname(file),{recursive:true});
 await writeFile(file,`---\nimport Document from ${from(resolve(site,'src/layouts/Document.astro'))};\nimport pages from ${from(resolve(generatedDirectory,'pages.json'))};\nimport type { DocPage } from ${from(resolve(site,'src/content'))};\nconst page = pages.find(page => page.outputPath === ${JSON.stringify(page.outputPath)}) as DocPage;\n---\n<Document page={page} />\n`);
}
console.log(`Generated ${routes.length} original route records, ${pages.length} typed documents and local search records.`);
