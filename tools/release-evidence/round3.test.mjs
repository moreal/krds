import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import * as api from './producers.mjs';
const current=(decision)=>`# Independent scoped release review\n\n## Current decision\n\n\`\`\`krds-review-decision\n${JSON.stringify(decision)}\n\`\`\`\n\n## History\nHistorical Accepted text is not the current verdict.\n`;
const decision={schemaVersion:1,scope:'release',subject:'release',current:true,spec:'accepted',quality:'accepted',findings:[]};
test('R5 long current rejected decision cannot be promoted by historical acceptance words',()=>{
 const text=`# Independent scoped release review\n${'Context only. '.repeat(350)}\n## Current decision\n\`\`\`krds-review-decision\n${JSON.stringify({...decision,spec:'rejected',quality:'rejected'})}\n\`\`\`\n## History\nAccepted historical component.\n`;
 assert.throws(()=>api.parseReview(text,'release',{...decision,spec:'rejected',quality:'rejected'}));
});
test('R5 explicit current accepted decision and resolved dispositions validate without treating history as current',()=>{
 const resolved={...decision,findings:[{id:'R-old',severity:'important',resolved:true,disposition:'Fixed and re-reviewed current source'}]};
 const text=current(resolved)+'\nEarlier review was NOT ACCEPTED / REQUEST CHANGES.\n';assert.equal(api.parseReview(text,'release',resolved).approved,true);
 assert.throws(()=>api.parseReview(current({...resolved,findings:[{...resolved.findings[0],resolved:false}]}),'release',{...resolved,findings:[{...resolved.findings[0],resolved:false}]}));
 assert.throws(()=>api.parseReview(text,'release',{...resolved,quality:'rejected'}));
});
test('R6 original genuine-format fixture drift cannot be replaced by two identical current submitted snapshots',async()=>{
 assert.equal(typeof api.validateCapture,'function');const root=await mkdtemp('/private/tmp/krds-capture-closure-unit-');try{
  const roots=['apps/fixture-react/dist','packages/react/dist','packages/test-contracts/dist'];for(const path of roots){await mkdir(join(root,path),{recursive:true});await writeFile(join(root,path,'index.js'),'original');}
  await mkdir(join(root,'source'));await writeFile(join(root,'source/input.ts'),'unit source');const source=await api.inventory(root,['source']),before=await api.inventory(root,roots,{outputs:true});await writeFile(join(root,roots[0],'index.js'),'changed while actual run was active');const after=await api.inventory(root,roots,{outputs:true});
  await writeFile(join(root,'result.json'),'[]');const result=await api.ref(root,'result.json'),expected={sourceCommit:'a'.repeat(40)},execution={exitCode:0};const report={kind:'patterns',sourceBefore:source,sourceAfter:source};
  const capture={schemaVersion:3,kind:'captured-recipe',recipe:'patterns',framework:'react',candidate:expected,sourceUnchanged:true,sourceBefore:source,sourceAfter:source,execution,result,artifactsBefore:before,artifactsAfter:after};await writeFile(join(root,'capture.json'),JSON.stringify(capture));
  await assert.rejects(api.validateCapture(root,await api.ref(root,'capture.json'),report,expected,'patterns',execution,result,{framework:'react',artifactsBefore:after,artifactsAfter:after}));
  capture.artifactsBefore=after;await writeFile(join(root,'capture.json'),JSON.stringify(capture));await api.validateCapture(root,await api.ref(root,'capture.json'),report,expected,'patterns',execution,result,{framework:'react',artifactsBefore:after,artifactsAfter:after});
 }finally{await rm(root,{recursive:true,force:true});}
});
test('R7 actual CI adapter rejects a substituted historical result reference for the same execution receipt',async()=>{
 assert.equal(typeof api.validateCIResultBinding,'function');const root=await mkdtemp('/private/tmp/krds-ci-result-unit-');try{
  await mkdir(join(root,'outputs'));await writeFile(join(root,'outputs/current.json'),JSON.stringify({scope:{mode:'full'},projects:['current']}));await writeFile(join(root,'historical.json'),JSON.stringify({scope:{mode:'full'},projects:['old']}));
  const execution={rawResult:{sha256:'c'.repeat(64)}},candidate={sourceCommit:'a'.repeat(40)},ci={provider:'github-actions',runId:'1',attempt:'1',sourceSha:candidate.sourceCommit};
  const outputs={schemaVersion:1,recipe:'ci:selection',inputBinding:candidate,ci,executionResultSha256:execution.rawResult.sha256,kind:'retained-producer-output',producerState:{recipe:'ci:selection',clearedBeforeExecution:true,preparedOutputs:['test-results/ci/selection.json']},sourceResult:'test-results/ci/selection.json',retainedDirectory:'outputs',result:await api.ref(root,'outputs/current.json'),inventory:await api.inventory(root,['outputs'],{outputs:true}),files:[await api.ref(root,'outputs/current.json')]};const capture={recipe:'ci:selection',candidate,ci,execution,result:outputs.result,outputs};
  await api.validateCIResultBinding(root,capture,outputs.result);
  await assert.rejects(api.validateCIResultBinding(root,capture,await api.ref(root,'historical.json')));
 }finally{await rm(root,{recursive:true,force:true});}
});
test('R6 docs served reference is bound to the original capture, not replaced with a current report',async()=>{
 const root=await mkdtemp('/private/tmp/krds-docs-capture-unit-');try{
  for(const path of ['apps/docs/dist','apps/docs/public','source']){await mkdir(join(root,path),{recursive:true});await writeFile(join(root,path,'index.txt'),'unit fixture');}
  const source=await api.inventory(root,['source']),artifacts=await api.inventory(root,['apps/docs/dist','apps/docs/public'],{outputs:true});await writeFile(join(root,'result.json'),'[]');await writeFile(join(root,'served-original.json'),'original served bytes');await writeFile(join(root,'served-substitute.json'),'different current served bytes');
  const result=await api.ref(root,'result.json'),served=await api.ref(root,'served-original.json'),expected={sourceCommit:'a'.repeat(40)},execution={exitCode:0},report={kind:'documentation',sourceBefore:source,sourceAfter:source};const capture={schemaVersion:3,kind:'captured-recipe',recipe:'docs-browser',candidate:expected,sourceUnchanged:true,sourceBefore:source,sourceAfter:source,execution,result,served,artifactsBefore:artifacts,artifactsAfter:artifacts};await writeFile(join(root,'capture.json'),JSON.stringify(capture));const captureRef=await api.ref(root,'capture.json');
  await api.validateCapture(root,captureRef,report,expected,'docs-browser',execution,result,{artifactsBefore:artifacts,artifactsAfter:artifacts,served});
  await assert.rejects(api.validateCapture(root,captureRef,report,expected,'docs-browser',execution,result,{artifactsBefore:artifacts,artifactsAfter:artifacts,served:await api.ref(root,'served-substitute.json')}));
 }finally{await rm(root,{recursive:true,force:true});}
});
async function nativeCapture(root,tool,report,rawFiles){
 const directory='test-results/record/outputs/current';await mkdir(join(root,directory,'vue'),{recursive:true});await writeFile(join(root,directory,'report.json'),JSON.stringify(report));for(const [path,value]of Object.entries(rawFiles))await writeFile(join(root,directory,'vue',path),Buffer.isBuffer(value)?value:JSON.stringify(value));const result=await api.ref(root,`${directory}/report.json`),candidate={sourceCommit:'a'.repeat(40)},ci={provider:'github-actions',runId:'1',attempt:'1'},execution={rawResult:{sha256:'e'.repeat(64)}},recipe=`ci:${tool}:vue:pilot`;await writeFile(join(root,'capture-stdout.log'),`Report: ${join(root,`test-results/t05/${tool==='contracts'?'contract':'stories'}-new/report.json`)}\n`);execution.stdout=await api.ref(root,'capture-stdout.log');const snapshot=await api.inventory(root,[directory],{outputs:true});return {recipe,candidate,ci,execution,result,outputs:{schemaVersion:1,kind:'retained-producer-output',recipe,inputBinding:candidate,ci,executionResultSha256:execution.rawResult.sha256,producerStdoutSha256:execution.stdout.sha256,result,sourceDirectory:`test-results/t05/${tool==='contracts'?'contract':'stories'}-new`,sourceResult:`test-results/t05/${tool==='contracts'?'contract':'stories'}-new/report.json`,producerState:{beforeDirectories:[]},retainedDirectory:directory,inventory:snapshot,files:snapshot.files}};
}
async function fixtureSnapshot(root,kind){const path=`apps/${kind}-vue/dist`;await mkdir(join(root,path),{recursive:true});await writeFile(join(root,path,'index.html'),'unit fixture HTML');await writeFile(join(root,path,'iframe.html'),'unit native story HTML');const inventory=await api.inventory(root,[path],{outputs:true});return {stableVerified:true,files:inventory.files.map(row=>({...row,path:row.path.slice(path.length)}))};}
test('R7 actual CI native adapter requires raw matching health even when summary says passed',async()=>{
 const root=await mkdtemp('/private/tmp/krds-ci-health-unit-');try{
  const snapshot=await fixtureSnapshot(root,'fixture'),title='vue button/disabled';const report={kind:'contract',mode:'pilot',results:[{framework:'vue',status:'passed',exitCode:0,artifactSnapshot:snapshot,tests:[{title,status:'passed',classification:'passed',nativeHealth:true}]}]};const health={healthy:true,framework:'vue',fixture:{componentId:'button',caseId:'disabled'}};const raw={suites:[{specs:[{title,tests:[{expectedStatus:'passed',results:[{status:'passed',attachments:[{name:'native-health.json',body:Buffer.from(JSON.stringify(health)).toString('base64')}]}]}]}]}]};let capture=await nativeCapture(root,'contracts',report,{'playwright.json':raw});const options={framework:'vue',tool:'contracts',mode:'pilot',count:1,identities:[title]};await api.validateCapturedNative(root,capture,capture.result,options);
  raw.suites[0].specs[0].tests[0].results[0].attachments[0].body=Buffer.from(JSON.stringify({...health,framework:'react'})).toString('base64');capture=await nativeCapture(root,'contracts',report,{'playwright.json':raw});await assert.rejects(api.validateCapturedNative(root,capture,capture.result,options));
 }finally{await rm(root,{recursive:true,force:true});}
});
test('R7 actual CI story adapter rejects forbidden business requests despite passed summary strings',async()=>{
 const root=await mkdtemp('/private/tmp/krds-ci-request-unit-');try{
  const snapshot=await fixtureSnapshot(root,'storybook'),id='krds-button--disabled',png=Buffer.alloc(40);Buffer.from([137,80,78,71,13,10,26,10]).copy(png);const story={id,status:'passed',requests:[{url:'http://127.0.0.1:1234/iframe.html?id=example',kind:'document'}],violations:[],axe:{violations:[]}};const report={kind:'stories',mode:'pilot',results:[{framework:'vue',status:'passed',artifactSnapshot:snapshot,stories:[story]}]};let capture=await nativeCapture(root,'stories',report,{[`${id}.png`]:png});const options={framework:'vue',tool:'stories',mode:'pilot',count:1,identities:[id]};await api.validateCapturedNative(root,capture,capture.result,options);story.requests.push({url:'http://127.0.0.1:1234/api/business-state',kind:'fetch'});capture=await nativeCapture(root,'stories',report,{[`${id}.png`]:png});await assert.rejects(api.validateCapturedNative(root,capture,capture.result,options));
 }finally{await rm(root,{recursive:true,force:true});}
});
test('R7 recorder removes and preserves prior fixed outputs, then retains only the newly produced result',async()=>{
 const root=await mkdtemp('/private/tmp/krds-ci-fresh-output-unit-');try{
  const destination=join(root,'test-results/record');await mkdir(join(root,'test-results/ci'),{recursive:true});await mkdir(destination,{recursive:true});await writeFile(join(root,'test-results/ci/selection.json'),JSON.stringify({old:true}));
  const state=await api.prepareCIOutputs(root,'ci:selection',destination);await assert.rejects(readFile(join(root,'test-results/ci/selection.json')));assert.equal(JSON.parse((await api.readRef(root,state.backups[0])).toString()).old,true);
  await writeFile(join(root,'test-results/ci/selection.json'),JSON.stringify({scope:{mode:'full'},projects:['new']}));const execution={rawResult:{sha256:'e'.repeat(64)},stdout:{path:'stdout.log',sha256:'f'.repeat(64)}};const candidate={sourceCommit:'a'.repeat(40)},ci={provider:'github-actions',runId:'1'};const outputs=await api.retainCIOutputs(root,'ci:selection',destination,state,execution,candidate,ci);const capture={recipe:'ci:selection',candidate,ci,execution,result:outputs.result,outputs};assert.equal((await api.validateCIResultBinding(root,capture,outputs.result)).projects[0],'new');await assert.rejects(api.validateCIResultBinding(root,capture,state.backups[0]));
 }finally{await rm(root,{recursive:true,force:true});}
});
test('R5 actual independent-review adapter accepts a current complete decision and rejects its later rejected verdict',async()=>{
 const root=await mkdtemp('/private/tmp/krds-review-current-unit-');try{
  for(const path of ['tools','tests','packages/test-contracts','docs/reviews','compatibility','test-results'])await mkdir(join(root,path),{recursive:true});await writeFile(join(root,'tools/input.mjs'),'unit source');
  const candidate={sourceCommit:'a'.repeat(40),lockfileSha256:'b'.repeat(64),sourceFingerprint:'c'.repeat(64),repositorySourceSha256:'d'.repeat(64),artifactManifestSha256:'e'.repeat(64)},source=await api.inventory(root,api.sourceRoots('independentReview'));
  const d={...decision,sourceInventorySha256:source.sha256,sourceFingerprint:candidate.sourceFingerprint};await writeFile(join(root,'test-results/review.md'),current(d));await writeFile(join(root,'test-results/support.txt'),'Unit substantive observation support; no actual release approval claimed');
  const review={subject:'release',independent:true,person:'Unit independent reviewer',implementer:'Unit implementation author',role:'independent-reviewer',performedAt:'2026-10-30T00:00:00Z',sources:source.files,findings:[],sourceInventory:source,sourceFingerprint:candidate.sourceFingerprint,artifactManifestSha256:candidate.artifactManifestSha256,decision:d,report:await api.ref(root,'test-results/review.md')};const report={schemaVersion:3,kind:'independentReview',candidate:api.candidateBinding('independentReview',candidate,{}),sourceBefore:source,sourceAfter:source,review,checks:await Promise.all(['native-boundaries','catalog-completeness','actual-tarballs','licenses','ssr','user-flows'].map(async id=>({id,passed:true,observations:['Unit performed observation, not real candidate acceptance'],evidence:[await api.ref(root,'test-results/support.txt')]})))};
  await writeFile(join(root,'test-results/report.json'),JSON.stringify(report));let index={schemaVersion:3,reports:{independentReview:await api.ref(root,'test-results/report.json')}};assert.equal((await api.inspectReleaseEvidence(root,'independentReview',index,candidate,{})).status,'passed');
  const rejected={...d,spec:'rejected'};await writeFile(join(root,'test-results/review.md'),current(rejected)+'\nHistorical Accepted\n');report.review.report=await api.ref(root,'test-results/review.md');await writeFile(join(root,'test-results/report.json'),JSON.stringify(report));index={schemaVersion:3,reports:{independentReview:await api.ref(root,'test-results/report.json')}};assert.equal((await api.inspectReleaseEvidence(root,'independentReview',index,candidate,{})).status,'blocked');
 }finally{await rm(root,{recursive:true,force:true});}
});
