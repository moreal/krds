import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile,access} from 'node:fs/promises';
import {join,resolve,relative} from 'node:path';
import {pathToFileURL} from 'node:url';
import {root,snapshot,sha256} from '../../compatibility/evidence.mjs';
import {retainArtifactCopies,captureArtifactInventory,readArtifactInventory,assertArtifactMatch} from '../../compatibility/artifact-evidence.mjs';
export async function prepareProductionEvidence(directory,name,sourceFingerprint){
 const sourceSha256=sourceFingerprint??process.env.KRDS_SSR_SOURCE_SHA256??(await snapshot(['qwik'])).sha256;
 const production=join(directory,'production-inputs'),pointer=join(directory,'production-retention.json');let produced;
 try{produced=JSON.parse(await readFile(pointer,'utf8'));assert.equal(produced.sourceSha256,sourceSha256,'Retained Qwik production belongs to another source fingerprint');await readArtifactInventory(produced.artifacts);}catch(error){if(error.code!=='ENOENT')throw error;await mkdir(directory,{recursive:true});const copies=await retainArtifactCopies([{source:join(root,'apps/fixture-qwik/server.mjs'),name:'server.mjs'},{source:join(root,'apps/fixture-qwik/dist'),name:'dist'}],production);const artifacts=await captureArtifactInventory(directory,'production-input-artifacts',[join(production,'server.mjs'),join(production,'dist')],sourceSha256);produced={sourceSha256,copies,artifacts};await writeFile(pointer,JSON.stringify(produced,null,2));}
 const roots=[join(production,'server.mjs'),join(production,'dist')];const before=await captureArtifactInventory(directory,`${name}-artifacts-before`,roots,sourceSha256);assertArtifactMatch(produced.artifacts,before);
 const {startProductionSsr}=await import(pathToFileURL(join(production,'server.mjs')));
 return {sourceSha256,production,produced:produced.artifacts,startProductionSsr,async retainDocument(label,html){const file=join(directory,`${name}-served-documents`,`${label.replaceAll(/[^A-Za-z0-9_-]/g,'_')}.html`);await mkdir(join(file,'..'),{recursive:true});await writeFile(file,html);return {path:relative(root,file),sha256:sha256(html),bytes:Buffer.byteLength(html)};},async finish(){const after=await captureArtifactInventory(directory,`${name}-artifacts-after`,roots,sourceSha256);const documents=await captureArtifactInventory(directory,`${name}-served-documents`,[join(directory,`${name}-served-documents`)],sourceSha256);const report={sourceSha256,before,after,servedDocuments:documents,unchanged:before.inventorySha256===after.inventorySha256};await writeFile(join(directory,`${name}-artifact-evidence.json`),JSON.stringify(report,null,2));assertArtifactMatch(before,after);return report;}};
}
