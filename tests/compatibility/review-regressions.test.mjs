import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join,relative} from 'node:path';
import {spawnSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {root,snapshot} from './evidence.mjs';

// These are isolated infrastructure regressions, never renderer/browser evidence.
test('R1 explicitly retained served bundles, HTML and packed inputs enter the artifact inventory',async()=>{
 const directory=await mkdtemp(join(root,'test-results/t13-review-'));
 try{for(const name of ['client/client.js','server/server.js','server.html','angular/input.tgz','angular/dist/browser/index.html','angular/dist/server/main.mjs']){await mkdir(join(directory,name,'..'),{recursive:true});await writeFile(join(directory,name),name);}
 const report=await snapshot([],{outputs:true,artifactRoots:[directory]});
 for(const name of ['client/client.js','server/server.js','server.html','angular/input.tgz','angular/dist/browser/index.html','angular/dist/server/main.mjs'])assert.ok(report.files.some(file=>file.path===relative(root,join(directory,name))),`Missing actual retained artifact: ${name}`);
 }finally{await rm(directory,{recursive:true,force:true});}
});

async function isolatedVerifier(matrix){
 const directory=await mkdtemp(join(tmpdir(),'krds-matrix-regression-'));
 const fakeEvidence=join(directory,'evidence.mjs'),matrixFile=join(directory,'matrix.json');
 await writeFile(matrixFile,JSON.stringify(matrix));
 // Stabilize only the unrelated source-drift input; real matrix and installed
 // dependency metadata checks still execute. No production source/config edit.
 await writeFile(fakeEvidence,`export {sha256,root} from ${JSON.stringify(pathToFileURL(join(root,'tests/compatibility/evidence.mjs')).href)};export async function snapshot(){return {sha256:'controlled-unchanged-input',files:[]};}`);
 let source=await readFile(join(root,'tests/compatibility/verify.mjs'),'utf8');
 source=source.replace("'../../tools/check-node.mjs'",JSON.stringify(pathToFileURL(join(root,'tools/check-node.mjs')).href)).replace("'./evidence.mjs'",JSON.stringify(pathToFileURL(fakeEvidence).href)).replace("readFile(join(root,'compatibility/frameworks.json'),'utf8')",`readFile(${JSON.stringify(matrixFile)},'utf8')`);
 // Other sibling production helpers retain their real implementation.
 source=source.replaceAll(/from '(\.\/[^']+)'/g,(_,path)=>`from ${JSON.stringify(pathToFileURL(join(root,'tests/compatibility',path)).href)}`);
 const script=join(directory,'verify.mjs');await writeFile(script,source);
 try{return spawnSync(process.execPath,[script,'--metadata-only'],{env:{...process.env,KRDS_COMPAT_OUTPUT:join(directory,'reports')},encoding:'utf8',timeout:30000});}finally{await rm(directory,{recursive:true,force:true});}
}
test('R2 actual verifier rejects empty, incomplete and duplicate framework matrices before success',async()=>{
 const matrix=JSON.parse(await readFile(join(root,'compatibility/frameworks.json'),'utf8'));
 for(const frameworks of [[],matrix.frameworks.slice(1),[...matrix.frameworks,matrix.frameworks[0]]]){const result=await isolatedVerifier({...matrix,frameworks});assert.notEqual(result.status,0,`Malformed matrix accepted: ${frameworks.map(row=>row.id)}\n${result.stdout}`);assert.match(result.stderr,/matrix|framework|target|duplicate/i);}
});

async function isolatedVisibility(mode){
 const directory=await mkdtemp(join(tmpdir(),'krds-visibility-regression-'));
 const fakeHelper=join(directory,'headed-browser.mjs');
 await writeFile(fakeHelper,`let index=-1;let events=[];const states=${JSON.stringify(mode==='partial'?[false,true,true,true,true]:[false,false,false,false,false])};const page={async setContent(){},async bringToFront(){},async waitForFunction(){${mode==='timeout'?"throw new Error('Actual visibility transition timed out');":''}},async evaluate(){index++;const hidden=states[index]??false;if(index>0&&hidden!==states[index-1])events.push({hidden,state:hidden?'hidden':'visible'});return {hidden,visibilityState:hidden?'hidden':'visible',focused:!hidden,events:[...events]};}};const session={async send(method){if(method==='Browser.getWindowForTarget')return {windowId:1,bounds:{windowState:'normal'}};if(method==='Browser.getWindowBounds')return {bounds:{windowState:'minimized'}};return {};}};export async function launchSelectedHeadedChromium(){index=-1;events=[];return {context:{pages:()=>[page],newPage:async()=>page,newCDPSession:async()=>session},browser:{version:()=> 'unit-fixture'},executable:'unit-fixture',args:[],logs:[],cleanup:async()=>{}};}`);
 let source=await readFile(join(root,'tests/compatibility/visibility-probe.mjs'),'utf8');source=source.replace("'./headed-browser.mjs'",JSON.stringify(pathToFileURL(fakeHelper).href)).replaceAll(/from '(\.\/[^']+)'/g,(_,path)=>`from ${JSON.stringify(pathToFileURL(join(root,'tests/compatibility',path)).href)}`);
 const script=join(directory,'probe.mjs');await writeFile(script,source);
 try{return spawnSync(process.execPath,[script],{env:{...process.env,KRDS_VISIBILITY_OUTPUT:join(directory,'reports')},encoding:'utf8',timeout:30000});}finally{await rm(directory,{recursive:true,force:true});}
}
test('R3 real-transition timeout and partial hidden/restoration sequences both reject success',async()=>{
 for(const mode of ['timeout','partial']){const result=await isolatedVisibility(mode);assert.notEqual(result.status,0,`Incomplete visibility accepted (${mode}): ${result.stdout}`);}
});

test('R1 temporary linked consumer survives cleanup and changed served bytes invalidate stage binding',async()=>{
 const {retainArtifactCopies,captureArtifactInventory,assertArtifactMatch}=await import('./artifact-evidence.mjs');
 const {collectStageEvidence}=await import('./stage-evidence.mjs');
 const directory=await mkdtemp(join(root,'test-results/t13-retention-')),temporary=await mkdtemp(join(tmpdir(),'krds-linked-input-'));
 try{
  await mkdir(join(temporary,'dist/browser'),{recursive:true});await mkdir(join(temporary,'dist/server'),{recursive:true});await writeFile(join(temporary,'input.tgz'),'actual packed input fixture');await writeFile(join(temporary,'dist/browser/index.html'),'<button>SSR fixture</button>');await writeFile(join(temporary,'dist/server/main.server.mjs'),'export const serverFixture = true;');
  const retained=join(directory,'linked-consumer');await retainArtifactCopies([{source:join(temporary,'input.tgz'),name:'input/angular.tgz'},{source:join(temporary,'dist'),name:'dist'}],retained);await assert.rejects(retainArtifactCopies([{source:join(temporary,'input.tgz'),name:'input/angular.tgz'}],retained),/fresh run directory/);await rm(temporary,{recursive:true,force:true});
  const before=await captureArtifactInventory(directory,'before',[retained],'controlled-source');const after=await captureArtifactInventory(directory,'after',[retained],'controlled-source');assertArtifactMatch(before,after);
  await writeFile(join(directory,'hydration.json'),JSON.stringify({artifactEvidence:{sourceSha256:'controlled-source',before,after,unchanged:true}}));
  await assert.rejects(collectStageEvidence('angular','native-hydration',directory,'another-source'),/another source/);const bound=await collectStageEvidence('angular','native-hydration',directory,'controlled-source');assert.equal(bound.files.length,3);assert.ok(bound.files.some(row=>row.path.endsWith('dist/server/main.server.mjs')));assert.ok(bound.metadata.some(row=>row.path.endsWith('hydration.json')));
  await writeFile(join(retained,'dist/browser/index.html'),'<button>replaced after consumption</button>');await assert.rejects(collectStageEvidence('angular','native-hydration',directory,'controlled-source'),/no longer match/);
  const changed=await captureArtifactInventory(directory,'changed',[retained],'controlled-source');assert.throws(()=>assertArtifactMatch(before,changed),/changed during consumption/);
 }finally{await rm(directory,{recursive:true,force:true});await rm(temporary,{recursive:true,force:true});}
});

test('R2 complete rows require exact full versus metadata-only check sets',async()=>{
 const {validateCompatibilityMatrix,validateCompatibilityRows,expectedCompatibilityChecks}=await import('./matrix-integrity.mjs');
 const matrix=JSON.parse(await readFile(join(root,'compatibility/frameworks.json'),'utf8')),toolchain=JSON.parse(await readFile(join(root,'compatibility/toolchain.json'),'utf8'));validateCompatibilityMatrix(matrix,toolchain);
 const makeRows=metadataOnly=>matrix.frameworks.map(framework=>({framework:framework.id,checks:expectedCompatibilityChecks(framework,toolchain,{metadataOnly}).map(key=>{const separator=key.indexOf(':');return {kind:key.slice(0,separator),name:key.slice(separator+1)||undefined};})}));
 for(const metadataOnly of[true,false]){const rows=makeRows(metadataOnly);validateCompatibilityRows(rows,matrix,toolchain,{metadataOnly});const missing=structuredClone(rows);missing[0].checks.pop();assert.throws(()=>validateCompatibilityRows(missing,matrix,toolchain,{metadataOnly}),/Incomplete/);const duplicate=structuredClone(rows);duplicate[0].checks.push(duplicate[0].checks[0]);assert.throws(()=>validateCompatibilityRows(duplicate,matrix,toolchain,{metadataOnly}),/Duplicate/);}
 assert.throws(()=>validateCompatibilityRows(makeRows(true),matrix,toolchain,{metadataOnly:false}),/Incomplete/);assert.throws(()=>validateCompatibilityRows([],matrix,toolchain,{metadataOnly:true}),/nonempty/);
});

test('R3 historical real observations pass, but any missing transition/event/bounds/configuration rejects',async()=>{
 const {validateVisibilityResults}=await import('./visibility-integrity.mjs');const historical=JSON.parse(await readFile(join(root,'tests/compatibility/fixtures/visibility-success.json'),'utf8'));validateVisibilityResults(historical.results);
 for(const modify of [rows=>rows.pop(),rows=>rows[0].observations.splice(2,1),rows=>rows[0].observations.find(row=>row.label==='first-native-window-restored').hidden=true,rows=>rows[0].observations.find(row=>row.label==='first-behind-second-real-tab').events=[],rows=>rows[0].observations.find(row=>row.label==='actual-window-bounds-minimized').bounds.windowState='normal',rows=>rows[0].status='capability-unavailable']){const rows=structuredClone(historical.results);modify(rows);assert.throws(()=>validateVisibilityResults(rows));}
});
