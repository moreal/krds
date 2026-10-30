import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,writeFileSync,rmSync,mkdirSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {createHash} from 'node:crypto';
const module = await import('./verify-release.mjs').catch(()=>({}));
const {milestones,validateBinding,validateSnapshot}=module;
const candidate={sourceCommit:'a'.repeat(40),sourceFingerprint:'b'.repeat(64),repositorySourceSha256:'e'.repeat(64),lockfileSha256:'c'.repeat(64),artifactManifestSha256:'d'.repeat(64)};
test('M1 evidence survives blocked M2 and M3 remains nonzero',()=>{
 assert.equal(typeof milestones,'function','release milestone reducer must exist');
 const result=milestones([{id:'stable',milestone:'M1',status:'passed'},{id:'preview',milestone:'M2',status:'blocked'},{id:'rights',milestone:'M3',status:'passed'}]);
 assert.deepEqual(result,{M1:'passed',M2:'blocked',M3:'blocked',exitCode:1});
});
test('every required milestone must pass; failure takes precedence over blocked',()=>{
 assert.equal(typeof milestones,'function');
 for(const m1 of ['passed','failed','blocked'])for(const m2 of ['passed','failed','blocked']){
  const result=milestones([{milestone:'M1',status:m1},{milestone:'M2',status:m2},{milestone:'M3',status:'passed'}]);
  assert.equal(result.M1,m1);assert.equal(result.M2,m2);
  assert.equal(result.exitCode,m1==='passed'&&m2==='passed'?0:1);
 }
 assert.equal(milestones([]).M3,'blocked');
 assert.equal(milestones([{milestone:'M1',status:'blocked'},{milestone:'M1',status:'failed'}]).M1,'failed');
});
test('cross-candidate evidence fails even when its status says passed',()=>{
 assert.equal(typeof validateBinding,'function');
 assert.deepEqual(validateBinding({...candidate},candidate),[]);
 for(const key of Object.keys(candidate)){
  assert.ok(validateBinding({...candidate,[key]:'0'.repeat(candidate[key].length)},candidate).some(error=>error.includes(key)),key);
  const incomplete={...candidate};delete incomplete[key];assert.ok(validateBinding(incomplete,candidate).length,key);
 }
});
test('snapshot validation rejects changed bytes and forged aggregate hashes',()=>{
 assert.equal(typeof validateSnapshot,'function');
 const root=mkdtempSync(join(tmpdir(),'krds-release-test-'));try{
  const bytes=Buffer.from('native source');writeFileSync(join(root,'source.ts'),bytes);
  const hash=value=>createHash('sha256').update(value).digest('hex');
  const files=[{path:'source.ts',sha256:hash(bytes),bytes:bytes.length}];const snapshot={sha256:hash(JSON.stringify(files)),files};
  assert.deepEqual(validateSnapshot(root,snapshot),[]);
  writeFileSync(join(root,'source.ts'),'stale');assert.ok(validateSnapshot(root,snapshot).some(error=>error.includes('source.ts')));
  assert.ok(validateSnapshot(root,{...snapshot,sha256:'0'.repeat(64)}).some(error=>error.includes('aggregate')));
  assert.ok(validateSnapshot(root,{sha256:hash('[]'),files:[]}).length,'zero files cannot pass');
 }finally{rmSync(root,{recursive:true,force:true});}
});
test('zero, skipped, unsupported and manual-not-performed outcomes never pass',()=>{
 const validate=module.validateExecutedRows;assert.equal(typeof validate,'function');
 const row={id:'native',status:'passed',executed:true,exitCode:0,observations:['real DOM outcome']};
 assert.deepEqual(validate([row],['native']),[]);
 for(const rows of [[],[{...row,executed:false}],[{...row,status:'unsupported'}],[{...row,skipped:true}],[{...row,observations:[]}],[row,row]])assert.ok(validate(rows,['native']).length);
});
test('native browser acceptance requires all nine real engine/timezone outcomes',()=>{
 const validate=module.validateBrowserRows;assert.equal(typeof validate,'function');
 const rows=['chromium','firefox','webkit'].flatMap(browser=>['UTC','Asia/Seoul','America/Los_Angeles'].map(timezoneId=>({browser,timezoneId,version:'1.0',status:'passed',checks:['DOM-free official server rendering','SSR node reuse','first button one event','first select one event','date-only canonical form value','label/tab IDs','open-modal unmount cleanup','no page/hydration errors','no remote requests']})));
 assert.deepEqual(validate(rows),[]);
 for(const invalid of [[],rows.slice(1),[...rows.slice(1),rows[1]],rows.map((row,i)=>i?row:{...row,status:'skipped'}),rows.map((row,i)=>i?row:{...row,checks:[]})])assert.ok(validate(invalid).length);
});
// Review regressions exercise the same acceptance functions used by the CLI.
test('F1 self-asserted indexed rows and empty hashed logs cannot award acceptance',async()=>{
 const inspect=module.inspectIndexedEvidence;assert.equal(typeof inspect,'function');
 const root=mkdtempSync(join(tmpdir(),'krds-release-index-'));try{
  writeFileSync(join(root,'empty.log'),'');
  const report={kind:'native-pattern-acceptance',candidate,status:'passed',executed:true,exitCode:0,command:'true',rows:[{id:'solid:application',status:'passed',executed:true,exitCode:0,observations:['asserted'],logPath:'empty.log',logSha256:createHash('sha256').update('').digest('hex')}]};
  writeFileSync(join(root,'report.json'),JSON.stringify(report));
  const result=await inspect(root,'patterns',{candidate,reports:{patterns:{path:'report.json',sha256:createHash('sha256').update(JSON.stringify(report)).digest('hex')}}},candidate);
  assert.equal(result.status,'blocked');assert.match(result.details.join(' '),/evidence|index|producer|trusted|implemented/u);
 }finally{rmSync(root,{recursive:true,force:true});}
});
test('F3 adding untested native input invalidates complete snapshot inventory',()=>{
 const root=mkdtempSync(join(tmpdir(),'krds-release-inventory-'));try{
  const bytes=Buffer.from('old native');writeFileSync(join(root,'source.ts'),bytes);
  const files=[{path:'source.ts',sha256:createHash('sha256').update(bytes).digest('hex'),bytes:bytes.length}];
  const old={files,sha256:createHash('sha256').update(JSON.stringify(files)).digest('hex')};
  assert.deepEqual(validateSnapshot(root,old),[]);
  writeFileSync(join(root,'new-native-source.ts'),'untested');assert.ok(validateSnapshot(root,old).some(error=>/inventory|path set/u.test(error)));
 }finally{rmSync(root,{recursive:true,force:true});}
});
test('F5 dirty or untracked source cannot be attributed to the reviewed Git tree',()=>{
 const validate=module.validateGitTree;assert.equal(typeof validate,'function');
 const root=mkdtempSync(join(tmpdir(),'krds-release-tree-'));try{
  writeFileSync(join(root,'source.ts'),'reviewed');
  const blob=bytes=>createHash('sha1').update(`blob ${Buffer.byteLength(bytes)}\0`).update(bytes).digest('hex');
  const tree=[{path:'source.ts',oid:blob('reviewed')}];
  assert.deepEqual(validate(root,tree,['source.ts']),[]);
  writeFileSync(join(root,'source.ts'),'modified');assert.ok(validate(root,tree,['source.ts']).length);
  writeFileSync(join(root,'untracked.ts'),'new');assert.ok(validate(root,tree,['source.ts','untracked.ts']).some(error=>error.includes('untracked')));
 }finally{rmSync(root,{recursive:true,force:true});}
});
test('F6 browser passed flags cannot conceal skipped, unexecuted or nonzero outcomes',()=>{
 const rows=['chromium','firefox','webkit'].flatMap(browser=>['UTC','Asia/Seoul','America/Los_Angeles'].map(timezoneId=>({browser,timezoneId,version:'1.0',status:'passed',checks:['DOM-free official server rendering','SSR node reuse','first button one event','first select one event','date-only canonical form value','label/tab IDs','open-modal unmount cleanup','no page/hydration errors','no remote requests'],skipped:true,executed:false,exitCode:1})));
 assert.ok(module.validateBrowserRows(rows).length);
});

test('F7 latest failed, stale or unfinished selected matrix never falls back to older pass',()=>{
 const select=module.selectMatrixRun;assert.equal(typeof select,'function');
 const root=mkdtempSync(join(tmpdir(),'krds-release-matrix-'));try{
  const base=join(root,'test-results/t13/ssr-runs');mkdirSync(join(base,'01'),{recursive:true});mkdirSync(join(base,'02'));
  const report=status=>({status,options:{frameworks:['react']}});
  writeFileSync(join(base,'01/results.json'),JSON.stringify(report('passed')));
  writeFileSync(join(base,'02/results.json'),JSON.stringify(report('failed')));
  assert.match(select(root,'ssr',['react']).path,/02\/results/u);
  writeFileSync(join(base,'02/results.json'),JSON.stringify({...report('passed'),sourceChangedDuringRun:true}));
  assert.match(select(root,'ssr',['react']).path,/02\/results/u);
  rmSync(join(base,'02/results.json'));assert.equal(select(root,'ssr',['react']).status,'blocked');
 }finally{rmSync(root,{recursive:true,force:true});}
});
test('F7 evidence absence/staleness is blocked; current actual failure is failed',()=>{
 const classify=module.executionStatus;assert.equal(typeof classify,'function');
 assert.equal(classify({current:false,status:'failed',exitCode:1}),'blocked');
 assert.equal(classify({current:true,status:'passed',skipped:true,exitCode:0}),'blocked');
 assert.equal(classify({current:true,status:'failed',exitCode:1}),'failed');
 assert.equal(classify({current:true,status:'passed',exitCode:0}),'passed');
});

test('F6 unrelated placeholder observations cannot substitute for native producer checks',()=>{
 const rows=['chromium','firefox','webkit'].flatMap(browser=>['UTC','Asia/Seoul','America/Los_Angeles'].map(timezoneId=>({browser,timezoneId,version:'1.0',status:'passed',checks:['placeholder']})));
 assert.ok(module.validateBrowserRows(rows).length);
});
test('F2 legacy consumer flag strings and unrelated nonempty logs stay blocked',async()=>{
 const inspect=module.inspectConsumerEvidence;assert.equal(typeof inspect,'function');
 const root=mkdtempSync(join(tmpdir(),'krds-release-consumer-'));try{
  writeFileSync(join(root,'unrelated.log'),'unrelated text');
  const row={id:'react',profile:'minimum',status:'passed-development-snapshot',checks:Object.fromEntries(['install','types','build','ssr','browser','candidate-bytes-and-runtime-compiler-resolution'].map(key=>[key,'passed'])),logs:['unrelated.log'],lockfileSha256:'a'.repeat(64)};
  const result=await inspect(root,{schemaVersion:1,rows:[row]},'stable',{});
  assert.equal(result.status,'blocked');assert.match(result.details.join(' '),/producer|step|resolution|evidence/u);
 }finally{rmSync(root,{recursive:true,force:true});}
});
test('F4 stable evidence selection has no dependency on preview rows or package identities',()=>{
 const select=module.selectScope;assert.equal(typeof select,'function');
 const packages=['assets','contracts','fonts','styles','tokens','solid','react','svelte','vue','lit','qwik','angular'].map(id=>({name:`@unofficial-krds/${id}`,version:'1.0.0'}));
 assert.equal(select(packages,'stable').length,12);assert.equal(select(packages,'preview').length,5);
 const withPreview=[...packages,{name:'@unofficial-krds/solid-next',version:'1.0.0-next.0'}];
 assert.deepEqual(select(withPreview,'stable'),select(packages,'stable'));
 assert.equal(select(withPreview,'preview').length,6);assert.equal(select(withPreview,'all').length,13);
});
test('F3/F4 stable matrix inventory survives preview-only edits but rejects new stable/shared files',()=>{
 const root=mkdtempSync(join(tmpdir(),'krds-release-scoped-inventory-'));try{
  for(const id of ['react','solid-next','contracts']){mkdirSync(join(root,`packages/${id}/src`),{recursive:true});writeFileSync(join(root,`packages/${id}/src/index.ts`),id);}
  const old=module.inventorySnapshot(root),stableOld=module.scopedSnapshot(old,['react']),previewOld=module.scopedSnapshot(old,['solid-next']);
  writeFileSync(join(root,'packages/solid-next/src/index.ts'),'changed RC');
  const current=module.inventorySnapshot(root);
  assert.deepEqual(validateSnapshot(root,stableOld,module.scopedSnapshot(current,['react'])),[]);
  assert.ok(validateSnapshot(root,previewOld,module.scopedSnapshot(current,['solid-next'])).length);
  writeFileSync(join(root,'packages/react/src/new.ts'),'untested stable');
  assert.ok(validateSnapshot(root,stableOld,module.scopedSnapshot(module.inventorySnapshot(root),['react'])).some(error=>error.includes('inventory')));
  writeFileSync(join(root,'packages/contracts/src/new.ts'),'untested shared');
  assert.ok(validateSnapshot(root,previewOld,module.scopedSnapshot(module.inventorySnapshot(root),['solid-next'])).some(error=>error.includes('inventory')));
 }finally{rmSync(root,{recursive:true,force:true});}
});
test('F6 each contradictory browser execution field independently blocks acceptance',()=>{
 const checks=['DOM-free official server rendering','SSR node reuse','first button one event','first select one event','date-only canonical form value','label/tab IDs','open-modal unmount cleanup','no page/hydration errors','no remote requests'];
 const rows=['chromium','firefox','webkit'].flatMap(browser=>['UTC','Asia/Seoul','America/Los_Angeles'].map(timezoneId=>({browser,timezoneId,version:'1.0',status:'passed',checks})));
 for(const contradiction of [{skipped:true},{executed:false},{exitCode:1}])assert.ok(module.validateBrowserRows(rows.map((row,index)=>index?row:{...row,...contradiction})).length);
});
test('F2 canonical consumer command receipts reject tampered original log bytes',async()=>{
 const {captureStep,validateStep}=await import('../tests/consumers/evidence.mjs');
 const {node}=await import('../tests/consumers/lib.mjs');
 const root=mkdtempSync('/private/tmp/krds-release-real-receipt-');try{
  const command={executable:node,args:['--version'],cwd:root};
  const step=await captureStep('identity-probe',command,{baseRoot:root,output:join(root,'proof')});
  await validateStep(step,{baseRoot:root,expectedCommand:command});
  writeFileSync(join(root,step.log.path),'unrelated nonempty text');
  await assert.rejects(validateStep(step,{baseRoot:root,expectedCommand:command}),error=>error.code==='EVIDENCE_BLOCKED');
 }finally{rmSync(root,{recursive:true,force:true});}
});
test('F3 current expected inventory hashes are compared as well as its paths',()=>{
 const root=mkdtempSync(join(tmpdir(),'krds-release-expected-content-'));try{
  writeFileSync(join(root,'source.ts'),'current');const actual=module.inventorySnapshot(root);
  const wrong=structuredClone(actual);wrong.files[0].sha256='0'.repeat(64);
  assert.ok(validateSnapshot(root,actual,wrong).some(error=>error.includes('inventory')));
 }finally{rmSync(root,{recursive:true,force:true});}
});
test('fix2 R2 rejects truncated artifact inventories and forwards only canonical inspected packages',()=>{
 const validate=module.canonicalArtifactHandoff;assert.equal(typeof validate,'function');
 const p={name:'@unofficial-krds/react',sha256:'c'.repeat(64),normalizedContentSha256:'d'.repeat(64),files:[{path:'dist/button.js',sha256:'a'.repeat(64),size:3}],packedManifest:{name:'@unofficial-krds/react',version:'1.0.0'}};
 const canonical={packages:[p],scopes:{stable:{artifactSetSha256:'b'.repeat(64)}}};
 assert.deepEqual(validate(canonical,canonical).packages,[p]);
 assert.throws(()=>validate({...canonical,packages:[{...p,files:[]}]},canonical),/inventory|metadata/u);
 assert.throws(()=>validate({...canonical,packages:[{...p,packedManifest:{...p.packedManifest,version:'2.0.0'}}]},canonical),/metadata/u);
});
test('fix2 R3 executable identity and SSR Node version cannot be replaced while preserving argv tail',()=>{
 const validate=module.validateMatrixCommand;assert.equal(typeof validate,'function');
 const args=['tests/ssr/native.mjs','react'];
 assert.deepEqual(validate([process.execPath,...args],args,process.versions.node),[]);
 assert.ok(validate(['/bin/sh',...args],args,process.versions.node).length);
 assert.ok(validate([process.execPath,...args],args,'26.0.0').length);
});
test('fix2 R1 uses authentic retained stage inventories instead of a workspace-only output guess',async()=>{
 const validate=module.collectRetainedStageInventory;assert.equal(typeof validate,'function');
 const {captureArtifactInventory}=await import('../tests/compatibility/artifact-evidence.mjs');
 const {collectStageEvidence}=await import('../tests/compatibility/stage-evidence.mjs');
 const root=join(import.meta.dirname,'../test-results');mkdirSync(root,{recursive:true});const dir=mkdtempSync(join(root,'t16-artifact-contract-'));
 try{
  const source='a'.repeat(64);for(const path of ['client/client.js','server/server.js','server.html']){mkdirSync(join(dir,'react',path,'..'),{recursive:true});writeFileSync(join(dir,'react',path),'retained genuine-format test bytes');}
  const ref=await captureArtifactInventory(join(dir,'react'),'before',[join(dir,'react/client'),join(dir,'react/server'),join(dir,'react/server.html')],source);
  writeFileSync(join(dir,'react/results.json'),JSON.stringify({artifactEvidence:{sourceSha256:source,before:ref,after:ref,unchanged:true}}));
  const evidence=await collectStageEvidence('react','native-server-hydration',join(dir,'react'),source);
  const report={sourceBeforeSha256:source,stages:[{framework:'react',name:'native-server-hydration',status:'passed',artifactEvidence:evidence}]};
  const files=await validate(report,dir,['react']);assert.ok(files.some(file=>file.path.endsWith('server.html')));assert.ok(files.some(file=>file.path.endsWith('results.json')));
  writeFileSync(join(dir,'react/server.html'),'changed');await assert.rejects(validate(report,dir,['react']));
 }finally{rmSync(dir,{recursive:true,force:true});}
});

await import('./release-evidence/producers.test.mjs');

test('fix2 R2 a genuine retained tarball cannot hand off a truncated installed-byte inventory',async()=>{
 const {unpack}=await import('./inspect-tarballs.mjs');const {readFileSync}=await import('node:fs');
 const bytes=readFileSync(join(import.meta.dirname,'../artifacts/tarballs/contracts.tgz'));const entries=unpack(bytes),hash=value=>createHash('sha256').update(value).digest('hex');
 const files=[...entries].sort(([a],[b])=>a.localeCompare(b)).map(([path,data])=>({path,size:data.length,sha256:hash(data)}));
 const p={name:'@unofficial-krds/contracts',files,packedManifest:JSON.parse(entries.get('package.json')),sha256:hash(bytes),normalizedContentSha256:hash(JSON.stringify(files))};const actual={packages:[p]};
 assert.deepEqual(module.canonicalArtifactHandoff(actual,actual).packages[0].files,files);
 const truncated={packages:[{...p,files:files.slice(1)}]};assert.equal(truncated.packages[0].normalizedContentSha256,p.normalizedContentSha256);assert.throws(()=>module.canonicalArtifactHandoff(truncated,actual),/inventory|metadata/u);
});
test('fix2 R1 actual frozen Angular retained-input report is consumable without its original temporary directory',async()=>{
 const {readFileSync}=await import('node:fs');const directory=join(import.meta.dirname,'../test-results/t13/fix1/angular-final-binding');
 const report=JSON.parse(readFileSync(join(directory,'results.json'),'utf8'));
 const records=await module.collectRetainedStageInventory(report,directory,['angular']);assert.ok(records.length>=150);assert.ok(records.some(row=>row.path.endsWith('linked-consumer/input/angular.tgz')));assert.ok(records.some(row=>row.path.endsWith('linked-consumer/dist/server/main.server.mjs')));
});

await import("./release-evidence/round3.test.mjs");
