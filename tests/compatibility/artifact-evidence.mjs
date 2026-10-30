import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile,stat,lstat} from 'node:fs/promises';
import {join,relative,resolve,dirname} from 'node:path';
import {root,sha256,snapshotArtifacts} from './evidence.mjs';
export async function captureArtifactInventory(directory,name,paths,sourceSha256){
 assert.ok(sourceSha256,'Artifact evidence requires a source fingerprint');
 const inventory=await snapshotArtifacts(paths);const report={schemaVersion:1,sourceSha256,roots:paths.map(path=>relative(root,resolve(path))),...inventory};const file=join(directory,`${name}.json`),bytes=JSON.stringify(report,null,2);await mkdir(directory,{recursive:true});await writeFile(file,bytes);
 return {path:relative(root,file),sha256:sha256(bytes),inventorySha256:inventory.sha256,fileCount:inventory.files.length};
}
export async function readArtifactInventory(reference){
 const bytes=await readFile(resolve(root,reference.path));assert.equal(sha256(bytes),reference.sha256,'Artifact manifest bytes changed');const report=JSON.parse(bytes);assert.equal(sha256(JSON.stringify(report.files)),reference.inventorySha256,'Artifact inventory digest changed');assert.equal(report.sha256,reference.inventorySha256);assert.ok(report.files.length>0);assert.equal(report.files.length,reference.fileCount,'Artifact file count changed');return report;
}
export async function retainArtifactCopies(entries,destination){
 assert.ok(entries.length>0,'No actual inputs to retain');try{await lstat(destination);throw new Error('Retained artifact destination already exists; use a fresh run directory');}catch(error){if(error.code!=='ENOENT')throw error;}const mappings=[];
 for(const entry of entries){assert.ok(entry.name&&!entry.name.startsWith('/')&&!entry.name.split('/').includes('..'),'Retained name must stay inside evidence');const source=resolve(entry.source),before=await snapshotArtifacts([source]),directory=(await stat(source)).isDirectory();
  for(const file of before.files){const original=resolve(root,file.path),suffix=directory?relative(source,original):'',retained=join(destination,entry.name,suffix),bytes=await readFile(original);assert.equal(sha256(bytes),file.sha256,'Producer artifact changed during retention');await mkdir(dirname(retained),{recursive:true});await writeFile(retained,bytes);mappings.push({source:file.path,retained:relative(root,retained),sha256:file.sha256,bytes:file.bytes});}
  assert.equal((await snapshotArtifacts([source])).sha256,before.sha256,'Producer changed while artifacts were retained');
 }
 return mappings.sort((a,b)=>a.retained.localeCompare(b.retained));
}
export function assertArtifactMatch(before,after){assert.equal(after.inventorySha256,before.inventorySha256,'Actual served artifacts changed during consumption');}
