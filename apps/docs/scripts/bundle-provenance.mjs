import {readFileSync,existsSync} from 'node:fs';
import {mkdir,writeFile} from 'node:fs/promises';
import {dirname,resolve,relative} from 'node:path';

// Audit real client chunks without emitting another deployed asset. Astro also
// injects its own island runtime inline, so preserve its original notice too.
export function bundleProvenance() {
 return {name:'krds-docs-bundle-provenance',applyToEnvironment:environment=>environment.name==='client',async generateBundle(_options,bundle) {
  if(this.environment.name!=='client')return;
  const dependencies=new Map();
  for(const chunk of Object.values(bundle)) {
   if(chunk.type!=='chunk')continue;
   for(const id of Object.keys(chunk.modules)) {
    if(id.startsWith('\0')||!id.includes('/node_modules/'))continue;
    const path=id.split('?')[0];let directory=dirname(path),manifest;
    while(directory!==dirname(directory)) {
     const candidate=resolve(directory,'package.json');
     if(existsSync(candidate)){const value=JSON.parse(readFileSync(candidate,'utf8'));if(value.name&&value.version){manifest=value;break;}}
     directory=dirname(directory);
    }
    if(!manifest)throw Error(`No published source package for client module ${id}`);
    if(manifest.name.startsWith('@unofficial-krds/'))continue;
    const key=`${manifest.name}@${manifest.version}`;
    if(!dependencies.has(key))dependencies.set(key,{name:manifest.name,version:manifest.version,modules:[]});
    dependencies.get(key).modules.push(relative(directory,path));
   }
  }
  if(!dependencies.has('astro@7.4.4'))dependencies.set('astro@7.4.4',{name:'astro',version:'7.4.4',modules:['runtime/client/astro-island (inline runtime)']});
  const records=[...dependencies.values()].sort((a,b)=>a.name.localeCompare(b.name,'en')).map(record=>({...record,modules:[...new Set(record.modules)].sort()}));
  const directory=resolve(import.meta.dirname,'../.astro');await mkdir(directory,{recursive:true});await writeFile(resolve(directory,'client-dependencies.json'),JSON.stringify(records,null,2)+'\n');
 }};
}
