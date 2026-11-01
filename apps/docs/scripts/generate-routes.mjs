import { mkdir, writeFile, rm } from 'node:fs/promises';
import { resolve, relative, dirname } from 'node:path';
import { buildPages, buildSearchRecords, buildNavigation } from './content.mjs';
const site=resolve(import.meta.dirname,'..');
const routesDirectory=resolve(site,'src/pages'); const generatedDirectory=resolve(site,'src/generated');
const pages=await buildPages(site);
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
