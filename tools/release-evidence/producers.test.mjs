import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync,mkdtempSync,writeFileSync,rmSync} from 'node:fs';
import {join,resolve} from 'node:path';
await import('./patterns.test.mjs');
const api=await import('./producers.mjs').catch(()=>({}));
const root=resolve(import.meta.dirname,'../..');
const json=path=>JSON.parse(readFileSync(join(root,path),'utf8'));
test('F1 parses actual React, Solid and Vue fifteen native binding results without promoting historical evidence',()=>{
 assert.equal(typeof api.parsePatterns,'function');
 for(const [framework,path]of [['react','.superpowers/sdd/PLAN/t11-react-logs/native-final/results.json'],['solid','.superpowers/sdd/PLAN/t11-solid-logs/browser-results.json'],['vue','.superpowers/sdd/PLAN/t11-vue-logs/31-browser-selected-cache/results.json']]){
  const result=api.parsePatterns(json(path),framework);assert.equal(result.requiredCases,15);
 }
});
test('F1 native parser rejects empty, filtered, failed, skipped and invented case identities',()=>{
 assert.equal(typeof api.parsePatterns,'function');const raw=json('.superpowers/sdd/PLAN/t11-react-logs/native-final/results.json');
 for(const value of [[],raw.slice(1),raw.map((row,i)=>i?row:{...row,passed:false}),raw.map((row,i)=>i?row:{...row,executed:false}),raw.map((row,i)=>i?row:{...row,external:['https://invalid.test']}),raw.map((row,i)=>i?row:{...row,id:'invented'})])assert.throws(()=>api.parsePatterns(value,'react'));
});
test('F1 parses real docs browser output and exact five-test Node stdout',()=>{
 assert.equal(typeof api.parseDocsBrowser,'function');assert.equal(typeof api.parseNodeTests,'function');
 assert.equal(api.parseDocsBrowser(json('.superpowers/sdd/PLAN/t12-docs-logs/browser/report.json')).engines,2);
 const stdout=readFileSync(join(root,'.superpowers/sdd/PLAN/t12-docs-logs/tests-core-input-refresh.log'),'utf8');assert.equal(api.parseNodeTests(stdout,5).passed,5);
 assert.throws(()=>api.parseNodeTests(stdout.replace('fail 0','fail 1'),5));
 const raw=json('.superpowers/sdd/PLAN/t12-docs-logs/browser/report.json');raw.results[0].externalRequests.push('https://invalid.test');assert.throws(()=>api.parseDocsBrowser(raw));
});
test('F1 explicit manual identity/session/support is necessary and legitimate attestation can be validated',()=>{
 assert.equal(typeof api.parseHumanSession,'function');
 const session={person:'Unit fixture human',role:'manual-reviewer',performed:true,startedAt:'2026-10-30T00:00:00Z',finishedAt:'2026-10-30T00:10:00Z',environment:{os:'fixture OS',browser:'fixture browser',assistiveTechnology:'fixture speech reader'},observations:[{id:'speech-output',actions:['Focused named native input'],expected:'Name and state spoken',actual:'Name and state spoken',passed:true,supportingArtifacts:['speech.txt']}],limitations:[]};
 assert.equal(api.parseHumanSession(session,['speech-output']).observed,1);
 for(const value of [{...session,person:''},{...session,performed:false},{...session,observations:[]},{...session,observations:[{...session.observations[0],supportingArtifacts:[]}]}])assert.throws(()=>api.parseHumanSession(value,['speech-output']));
});
test('F1 actual scoped review Markdown is parsed as scoped review, not a release approval',()=>{
 assert.equal(typeof api.parseReview,'function');
 for(const [id,path]of [['react','task-T11-react-review.md'],['solid','task-T11-solid-review.md'],['vue','task-T11-vue-review.md'],['docs','task-T12-docs-core-review.md']])assert.equal(api.parseReview(readFileSync(join(root,'.superpowers/sdd/PLAN',path),'utf8'),id).scope,id);
 assert.throws(()=>api.parseReview('passed','react'));
});
test('F1 bundle does not accept a generic all-passed index or absent current command receipts',async()=>{
 assert.equal(typeof api.inspectReleaseEvidence,'function');
 const result=await api.inspectReleaseEvidence(root,'patterns',{candidate:{},reports:{patterns:{status:'passed',rows:[{executed:true,observations:['true']}]}}},{},{});
 assert.equal(result.status,'blocked');
});
test('F1 complete explicitly attested same-candidate manual envelope is accepted; missing transcript is blocked',async()=>{
 const root=mkdtempSync('/private/tmp/krds-manual-protocol-unit-');try{
  const fs=await import('node:fs');for(const dir of ['tools/release-evidence','docs/reviews','compatibility','test-results','docs/releases/1.0.0'])fs.mkdirSync(join(root,dir),{recursive:true});
  for(const path of ['tools/release-evidence/producers.mjs','docs/reviews/session-source.txt','yarn.lock','compatibility/toolchain.json','compatibility/frameworks.json'])writeFileSync(join(root,path),'unit fixture source only');
  const candidate={sourceCommit:'a'.repeat(40),lockfileSha256:'b'.repeat(64)},scopes={stable:{sourceFingerprint:'c'.repeat(64),artifactSetSha256:'d'.repeat(64)}};
  const binding=api.candidateBinding('manualAccessibility',candidate,scopes);const snapshot=await api.inventory(root,api.sourceRoots('manualAccessibility'));
  const sessions=[];for(const framework of api.stable){fs.mkdirSync(join(root,`apps/fixture-${framework}/dist`),{recursive:true});writeFileSync(join(root,`apps/fixture-${framework}/dist/index.html`),'Unit protocol artifact; no actual human review claimed');const observations=api.manualCases.map(id=>({id,actions:['Unit fixture action; no real human acceptance claimed'],expected:'Unit expected outcome',actual:'Unit performed observation',passed:true,supportingArtifacts:[`test-results/${framework}.json`]}));for(const observation of observations){if(['zoom-200-400','forced-colors','focus-visibility'].includes(observation.id)){const png=Buffer.alloc(40);Buffer.from([137,80,78,71,13,10,26,10]).copy(png);png.writeUInt32BE(100,16);png.writeUInt32BE(100,20);writeFileSync(join(root,`test-results/${framework}-${observation.id}.png`),png);observation.screenshots=[{...await api.ref(root,`test-results/${framework}-${observation.id}.png`),mediaType:'image/png'}];if(observation.id==='zoom-200-400'){observation.method='real-browser-ui';observation.factors=[2,4];}if(observation.id==='forced-colors')observation.method='operating-system-high-contrast';}if(observation.id==='media-equivalence'){observation.originalSources=[];for(const role of ['video','audio','captions','transcript','audio-description','sign-language']){const path=`test-results/${framework}-${role}.unit`;writeFileSync(join(root,path),'Unit original-source schema fixture; no real source clearance claimed');const artifact=await api.ref(root,path);const record=`${path}.json`;writeFileSync(join(root,record),JSON.stringify({sha256:artifact.sha256,sourceKind:'upstream-media',upstreamUrl:'https://example.invalid/unit-fixture',retrievedAt:'2026-10-30T00:00:00Z'}));observation.originalSources.push({role,artifact,provenance:await api.ref(root,record)});}}}const session={framework,person:'Synthetic protocol fixture',role:'manual-reviewer',performed:true,startedAt:'2026-10-30T00:00:00Z',finishedAt:'2026-10-30T00:10:00Z',environment:{os:'Fixture OS',browser:'Fixture browser',assistiveTechnology:'Fixture AT'},observations,limitations:[],sourceInventorySha256:snapshot.sha256,hostArtifacts:await api.inventory(root,[`apps/fixture-${framework}/dist`],{outputs:true})};writeFileSync(join(root,`test-results/${framework}.json`),JSON.stringify({...session,candidate:binding,sourceFingerprint:binding.sourceFingerprint,artifactSetSha256:binding.artifactSetSha256,hostArtifactSha256:session.hostArtifacts.sha256}));session.artifacts=[{...await api.ref(root,`test-results/${framework}.json`),mediaType:'application/json',kind:'session-transcript'}];sessions.push(session);}
  const report={schemaVersion:3,kind:'manualAccessibility',candidate:binding,sourceBefore:snapshot,sourceAfter:snapshot,sessions};writeFileSync(join(root,'docs/releases/1.0.0/manual.json'),JSON.stringify(report));const index={schemaVersion:3,reports:{manualAccessibility:await api.ref(root,'docs/releases/1.0.0/manual.json')}};
  assert.equal((await api.inspectReleaseEvidence(root,'manualAccessibility',index,candidate,scopes)).status,'passed');
  rmSync(join(root,'test-results/react.json'));assert.equal((await api.inspectReleaseEvidence(root,'manualAccessibility',index,candidate,scopes)).status,'blocked');
 }finally{rmSync(root,{recursive:true,force:true});}
});
test('F1 native CI parser accepts a real canonical ten-case runner report and rejects missing raw health',()=>{
 const raw=json('docs/execution/evidence/T07-vue/runners/contract-1793330785493-60282-98f51f03/report.json');
 assert.equal(api.parseNativeRunner(raw,{framework:'vue',tool:'contracts',mode:'pilot',count:10}).count,10);
 const damaged=structuredClone(raw);damaged.results[0].tests[0].nativeHealth=false;assert.throws(()=>api.parseNativeRunner(damaged,{framework:'vue',tool:'contracts',mode:'pilot',count:10}));
});
test('F1 docs consumed-response closure rejects changed built HTML while preserving claimed response hashes',async()=>{
 const root=mkdtempSync('/private/tmp/krds-docs-response-unit-');try{
  const fs=await import('node:fs');fs.mkdirSync(join(root,'apps/docs/dist/components'),{recursive:true});writeFileSync(join(root,'apps/docs/dist/index.html'),'Unit home fixture');writeFileSync(join(root,'apps/docs/dist/components/badge.html'),'Unit Badge fixture');
  const responses=[];for(const browser of ['chromium','webkit'])for(const path of ['apps/docs/dist/index.html','apps/docs/dist/components/badge.html'])responses.push({browser,...await api.ref(root,path)});
  const raw={schemaVersion:1,kind:'actual-docs-responses',responses};assert.equal((await api.validateServedDocs(root,raw)).responses,4);writeFileSync(join(root,'apps/docs/dist/components/badge.html'),'changed');await assert.rejects(api.validateServedDocs(root,raw));
 }finally{rmSync(root,{recursive:true,force:true});}
});
test('F1 a current request-changes release review cannot be mistaken for historical accepted text',()=>{
 assert.throws(()=>api.parseReview(readFileSync(join(root,'.superpowers/sdd/PLAN/task-T16-verifier-review.md'),'utf8'),'release'));
});
test('F1 CI source-before/output-after binding cannot relabel a different commit, lock or input inventory',()=>{
 const source={sha256:'a'.repeat(64)},expected={sourceCommit:'b'.repeat(40),lockfileSha256:'c'.repeat(64)};const captured={bindingMode:'source-before/outputs-after',...expected,sourceInventorySha256:source.sha256};
 assert.equal(api.capturedCandidateMatches('ci',captured,expected,source),true);
 for(const key of ['sourceCommit','lockfileSha256','sourceInventorySha256'])assert.equal(api.capturedCandidateMatches('ci',{...captured,[key]:'wrong'},expected,source),false);
});
test('F1 recorder description cannot launch a job and declares the actual production roots',async()=>{
 const {record}=await import('./record.mjs');const result=await record({recipeName:'patterns',framework:'solid'});
 assert.equal(result.executionPerformed,false);assert.match(result.command.environment.PATTERN_STATIC_ROOT,/apps\/fixture-solid\/dist$/u);assert.equal(result.command.executable,process.execPath);
});
test('F1 docs producer redirect preserves every original assertion and shares the actual browser types',async()=>{
 const source=readFileSync(join(root,'apps/docs/tests/browser.mjs'),'utf8'),output='/private/tmp/unit-docs-output';const redirected=api.redirectDocsProducer(source,root,output);
 assert.equal(redirected.replace(`const root = ${JSON.stringify(root)};`,"const root = resolve(dirname(fileURLToPath(import.meta.url)), '../../..');").replace(`const evidence = ${JSON.stringify(output)};`,"const evidence = resolve(root, '.superpowers/sdd/PLAN/t12-docs-logs/browser');"),source);
 const {createRequire}=await import('node:module');const original=createRequire(join(root,'apps/docs/package.json'))('@playwright/test'),retained=createRequire(join(root,'test-results/redirected-producer.mjs'))('@playwright/test');assert.equal(original.chromium,retained.chromium);assert.equal(original.webkit,retained.webkit);
});
