import {readFile,writeFile,mkdir,copyFile} from 'node:fs/promises';
import {join,resolve,relative} from 'node:path';
import {root,hash} from './lib.mjs';
import {scopePackageIds} from './scopes.mjs';
export async function archiveReplacedCandidates({baseRoot=root,scope='all',inventoryPath='artifacts/debug-inventory.json'}={}){
 let bytes;try{bytes=await readFile(join(baseRoot,inventoryPath));}catch(error){if(error.code==='ENOENT')return null;throw error;}const replacements=scopePackageIds(scope).flatMap(id=>[`artifacts/tarballs/${id}.tgz`,`artifacts/${id}.dry-run.ndjson`,`artifacts/${id}.pack.ndjson`]),archive=join(baseRoot,'artifacts/debug-archive',hash(bytes),scope),mapping={};await mkdir(archive,{recursive:true});
 // Archival preserves the exact relevant historical bytes even when corrupt. It
 // is not a current candidate acceptance gate and never reads unrelated archives.
 for(const original of replacements){const source=resolve(baseRoot,original);if(!source.startsWith(`${baseRoot}/`))throw new Error('Historical archive path escapes root');let data;try{data=await readFile(source);}catch(error){if(error.code==='ENOENT'){mapping[original]={missing:true};continue;}throw error;}const destination=join(archive,original.replace(/^artifacts\//u,''));await mkdir(resolve(destination,'..'),{recursive:true});await writeFile(destination,data);mapping[original]={archive:relative(baseRoot,destination),sha256:hash(data),size:data.length};}await writeFile(join(archive,'inventory.json'),bytes);await writeFile(join(archive,'archive-map.json'),JSON.stringify(mapping,null,2)+'\n');return mapping;
}
