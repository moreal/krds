import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolve,join,relative} from 'node:path';
import {root,sha256,snapshotArtifacts} from './evidence.mjs';
import {readArtifactInventory,assertArtifactMatch} from './artifact-evidence.mjs';
export async function collectStageEvidence(framework,name,directory,sourceSha256){
 const metadata=[],files=new Map();
 async function json(file){const bytes=await readFile(file);metadata.push({path:relative(root,file),sha256:sha256(bytes),bytes:bytes.length});return JSON.parse(bytes);}
 let evidence;
 if(name==='production-build'){const result=await json(join(directory,'production-retention.json'));evidence={sourceSha256:result.sourceSha256,produced:result.artifacts};}
 else if(name==='native-server-hydration')evidence=(await json(join(directory,'results.json'))).artifactEvidence;
 else if(name==='partial-apf-ssr'){evidence=(await json(join(directory,'outside-consumer.json'))).artifactEvidence;await json(join(directory,'retention-map.json'));}
 else if(name==='native-hydration')evidence=(await json(join(directory,'hydration.json'))).artifactEvidence;
 else if(framework==='qwik'){const prefix=name==='precise-resume'?'precise':'cross-browser';evidence=await json(join(directory,`${prefix}-artifact-evidence.json`));await json(join(directory,name==='precise-resume'?'production-resume.json':'cross-browser.json'));}
 assert.ok(evidence,'Missing actual served artifact evidence');assert.equal(evidence.sourceSha256,sourceSha256,'Served artifacts belong to another source fingerprint');
 const references=evidence.produced?[evidence.produced]:[evidence.before,evidence.after,...(evidence.servedDocuments?[evidence.servedDocuments]:[])];
 if(!evidence.produced){assert.equal(evidence.unchanged,true,'Served artifacts changed during consumption');assertArtifactMatch(evidence.before,evidence.after);}
 for(const reference of references){assert.ok(reference?.path&&reference.fileCount>0,'Empty actual artifact inventory');const report=await readArtifactInventory(reference);assert.equal(report.sourceSha256,sourceSha256);await json(resolve(root,reference.path));for(const file of report.files)files.set(file.path,file);}
 const mandatory=name==='native-server-hydration'?['client/client.js','server/server.js','server.html']:framework==='angular'?['linked-consumer/input/angular.tgz','linked-consumer/dist/browser/index.html','linked-consumer/dist/server/main.server.mjs']:['production-inputs/server.mjs','production-inputs/dist/server/entry.ssr.js','production-inputs/dist/q-manifest.json'];
 for(const path of mandatory)assert.ok(files.has(relative(root,join(directory,path))),`Missing actual served stage artifact: ${path}`);
 if(framework==='qwik'&&name!=='production-build')assert.ok(evidence.servedDocuments?.fileCount>0,'Actual Qwik SSR response HTML was not retained');
 // Re-read retained bytes at collection time; manifests alone are insufficient.
 const actual=await snapshotArtifacts([...files.keys()]);assert.deepEqual(actual.files,[...files.values()].sort((a,b)=>a.path.localeCompare(b.path)),'Retained artifact bytes no longer match consumed evidence');
 return {sourceSha256,metadata,artifactInventories:references,files:actual.files};
}
