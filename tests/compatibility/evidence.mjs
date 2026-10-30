import {createHash} from 'node:crypto';
import {readdir,readFile,stat,lstat} from 'node:fs/promises';
import {join,relative,resolve} from 'node:path';
export const root=resolve(import.meta.dirname,'../..');
export const sha256=value=>createHash('sha256').update(value).digest('hex');
const omitted=new Set(['node_modules','test-results','coverage','.vite','.svelte-kit','.angular','__screenshots__']);
async function collect(paths,{outputs=false,required=false}={}){
 const records=new Map();
 async function visit(path){let info;try{info=await lstat(path);}catch(error){if(!required&&error.code==='ENOENT')return;throw error;}
  if(info.isSymbolicLink()){if(required)throw new Error(`Artifact symlink is not retained evidence: ${path}`);return;}
  if(info.isDirectory()){for(const entry of(await readdir(path,{withFileTypes:true})).sort((a,b)=>a.name.localeCompare(b.name))){if((required||!omitted.has(entry.name))&&(outputs||entry.name!=='dist')&&!entry.name.endsWith('.tsbuildinfo')&&entry.name!=='.DS_Store')await visit(join(path,entry.name));}}
  else if(info.isFile()){const bytes=await readFile(path),record={path:relative(root,path),sha256:sha256(bytes),bytes:bytes.length};records.set(record.path,record);}
  else if(required)throw new Error(`Artifact is not a regular file: ${path}`);
 }
 for(const path of [...new Set(paths.map(path=>resolve(root,path)))]){const count=records.size;await visit(path);if(required&&count===records.size)throw new Error(`Empty or duplicate artifact root: ${path}`);}
 const files=[...records.values()].sort((a,b)=>a.path.localeCompare(b.path));return {sha256:sha256(JSON.stringify(files)),files};
}
export async function snapshotArtifacts(paths){if(!Array.isArray(paths)||!paths.length)throw new Error('Actual artifact roots must be nonempty');return collect(paths,{outputs:true,required:true});}
export async function snapshot(frameworks,{outputs=false,artifactRoots=[]}={}){
 const roots=['package.json','.yarnrc.yml','yarn.lock','tools/yarn.mjs','tools/check-node.mjs','compatibility/toolchain.json','compatibility/frameworks.json','compatibility/testing.json','tools/run-ssr-tests.mjs','tools/testing/support.mjs',...frameworks.flatMap(id=>[`packages/${id}`,`apps/fixture-${id}`]),'packages/contracts','packages/styles','packages/tokens','packages/test-contracts','tests/ssr','tests/compatibility'];
 const workspace=await collect(roots,{outputs});if(!artifactRoots.length)return workspace;
 const artifacts=await snapshotArtifacts(artifactRoots),byPath=new Map([...workspace.files,...artifacts.files].map(file=>[file.path,file]));const files=[...byPath.values()].sort((a,b)=>a.path.localeCompare(b.path));return {sha256:sha256(JSON.stringify(files)),files};
}
