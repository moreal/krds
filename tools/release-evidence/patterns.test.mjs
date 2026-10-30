import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,mkdtemp,mkdir,writeFile,rm,stat} from 'node:fs/promises';
import {join,resolve,dirname} from 'node:path';
import * as api from './producers.mjs';
const root=resolve(import.meta.dirname,'../..');
const retained={
 solid:'.superpowers/sdd/PLAN/t11-solid-logs/browser-results.json',
 react:'.superpowers/sdd/PLAN/t11-react-logs/native-final/results.json',
 svelte:'.superpowers/sdd/PLAN/t11-svelte-logs/browser-producer10-final/results.json',
 vue:'.superpowers/sdd/PLAN/t11-vue-logs/31-browser-selected-cache/results.json',
 lit:'.superpowers/sdd/PLAN/t11-lit-logs/browser-accepted/report.json',
 qwik:'.superpowers/sdd/PLAN/t11-qwik-logs/browser.json',
 angular:'.superpowers/sdd/PLAN/t11-angular-logs/consumer-browser-c267-final/results.json'
};
const load=async path=>JSON.parse(await readFile(join(root,path),'utf8'));
const required=['form-errors/error-summary-focus','form-errors/retry-success','form-errors/reset-cancels-pending','search-results/filter-resets-page','search-results/empty-results','search-results/retry-success','search-results/query-during-loading','consent-confirmation/required-refusal','consent-confirmation/optional-refusal-success','consent-confirmation/modal-focus-return','consent-confirmation/retry-in-dialog','service-layout/skip-main','service-layout/navigate-current','service-layout/narrow-navigation','service-layout/footer-policy'];
for(const [framework,path]of Object.entries(retained))test(`R5 actual retained ${framework} report binds all fifteen canonical cases`,async()=>{
 const raw=await load(path),before=JSON.stringify(raw),parsed=api.parsePatterns(raw,framework);
 assert.deepEqual(parsed.caseIds,required);assert.equal(parsed.requiredCases,15);assert.equal(JSON.stringify(raw),before,'Parsing must preserve original native observations');
});
for(const framework of ['svelte','angular','qwik'])test(`R5 ${framework} exact native identities reject missing, duplicate, failed, skipped and malformed rows`,async()=>{
 const raw=await load(retained[framework]);
 for(const mutate of [r=>r.results.splice(0,1),r=>r.results.push({...r.results[0]}),r=>r.results[0].status='failed',r=>r.results[0].skipped=true,r=>r.results[0].executed=false,r=>r.results[0].passed=false,r=>r.results[0].exitCode=1,r=>r.results[0].error='actual failure',r=>r.results[0]=null,r=>r.results[0][framework==='qwik'?'name':'id']+='-invented',r=>r.errors=['page error']]){
  const invalid=structuredClone(raw);mutate(invalid);assert.throws(()=>api.parsePatterns(invalid,framework));
 }
});
test('R5 each enumerated recipe resolves an existing actual entry and source inventory binds imported root producers',async()=>{
 for(const framework of ['solid','react','svelte','vue','lit','qwik','angular']){
  const args=api.recipe('patterns',framework),entry=args[0]==='tools/yarn.mjs'?`apps/fixture-${framework}/${args.at(-1)}`:args[0];
  assert.equal((await stat(join(root,entry))).isFile(),true,`${framework}: ${entry}`);
 }
 const temporary=await mkdtemp('/private/tmp/krds-pattern-source-unit-');try{
  for(const path of ['scripts/patterns-svelte-browser.mjs','scripts/patterns-angular.mjs','scripts/unrelated.mjs','tests/patterns/svelte.browser.mjs','tests/patterns/angular.browser.mjs','tests/patterns/qwik/browser.mjs']){await mkdir(dirname(join(temporary,path)),{recursive:true});await writeFile(join(temporary,path),'unit source');}
  const inventory=await api.inventory(temporary,api.sourceRoots('patterns',['svelte','angular','qwik']));
  assert.ok(inventory.files.some(row=>row.path==='scripts/patterns-svelte-browser.mjs'));
  assert.ok(inventory.files.some(row=>row.path==='scripts/patterns-angular.mjs'));
  assert.ok(inventory.files.some(row=>row.path==='tests/patterns/qwik/browser.mjs'));
  assert.ok(!inventory.files.some(row=>row.path==='scripts/unrelated.mjs'));
  await writeFile(join(temporary,'scripts/patterns-svelte-browser.mjs'),'changed actual imported producer');await assert.rejects(api.validateInventory(temporary,inventory,api.sourceRoots('patterns',['svelte','angular','qwik'])));
 }finally{await rm(temporary,{recursive:true,force:true});}
});
test('R5 stdout checks consume actual Lit and three status-producer formats, rejecting unrelated and contradictory output',async()=>{
 assert.equal(typeof api.validatePatternStdout,'function');
 const cases=[['lit','.superpowers/sdd/PLAN/t11-lit-logs/browser-accepted.log'],['svelte','.superpowers/sdd/PLAN/t11-svelte-logs/55-full-producer10-final-browser.log'],['qwik','.superpowers/sdd/PLAN/t11-qwik-logs/browser-v3.log']];
 for(const [framework,path]of cases){const raw=await load(retained[framework]),stdout=await readFile(join(root,path),'utf8');api.validatePatternStdout(stdout,raw,framework);assert.throws(()=>api.validatePatternStdout('unrelated successful command',raw,framework));assert.throws(()=>api.validatePatternStdout(stdout+'\nFAIL actual-native-case\n',raw,framework));}
 // The retained Angular owner packet has raw results, but no original browser stdout.
 // This literal is a unit fixture for that actual CLI's printed summary, not execution evidence.
 const angular=await load(retained.angular);api.validatePatternStdout('{"passed":21,"failed":0,"errors":[],"externalRequests":[]}',angular,'angular');
 assert.throws(()=>api.validatePatternStdout('{"passed":20,"failed":0,"errors":[],"externalRequests":[]}',angular,'angular'));
});
test('R5 fresh output retention rejects historical result substitution, changed closure, stdout and environment',async()=>{
 const {preparePatternOutputs,retainPatternOutputs,patternEnvironment}=await import('./patterns.mjs'),{captureStep,nodeCommand}=await import('./receipts.mjs');
 const temporary=await mkdtemp('/private/tmp/krds-pattern-capture-unit-');try{
  const destination=join(temporary,'test-results/capture');await mkdir(destination,{recursive:true});
  const state=await preparePatternOutputs(temporary,'svelte',destination),environment=patternEnvironment(temporary,'svelte',destination),raw=await load(retained.svelte);raw.artifact=environment.KRDS_RELEASE_PATTERN_ARTIFACT;
  const script=`const fs=require('node:fs');const raw=${JSON.stringify(raw)};fs.writeFileSync(${JSON.stringify(join(destination,'native-output/results.json'))},JSON.stringify(raw));console.log(JSON.stringify({results:raw.results,external:raw.external,errors:raw.errors}));`;
  const execution=await captureStep('unit-pattern-output',nodeCommand(temporary,['-e',script],environment),{baseRoot:temporary,output:join(destination,'process')});assert.equal(execution.exitCode,0);
  const candidate={sourceCommit:null},outputs=await retainPatternOutputs(temporary,'svelte',destination,state,execution,candidate),capture={framework:'svelte',candidate,execution,outputs,result:outputs.result};
  assert.equal((await api.validatePatternResultBinding(temporary,capture,capture.result)).raw.results.length,20);
  await writeFile(join(temporary,'historical.json'),JSON.stringify(raw));await assert.rejects(api.validatePatternResultBinding(temporary,capture,await api.ref(temporary,'historical.json')));
  const forged=structuredClone(capture);forged.execution.command.environment.KRDS_RELEASE_PATTERN_OUTPUT='/wrong';await assert.rejects(api.validatePatternResultBinding(temporary,forged,forged.result));
  await writeFile(join(destination,'native-output/extra.json'),'changed closure');await assert.rejects(api.validatePatternResultBinding(temporary,capture,capture.result));await rm(join(destination,'native-output/extra.json'));
  await writeFile(join(temporary,execution.stdout.path),'unrelated successful subprocess');await assert.rejects(api.validatePatternResultBinding(temporary,capture,capture.result));
 }finally{await rm(temporary,{recursive:true,force:true});}
});
test('R5 Qwik output/root-only redirect preserves the original assertion body and rejects changed producer anchors',async()=>{
 const {redirectQwikProducer}=await import('./patterns.mjs'),source=await readFile(join(root,'tests/patterns/qwik/browser.mjs'),'utf8'),output='/private/tmp/unit-qwik-output';
 const derived=redirectQwikProducer(source,root,output);
 assert.equal(derived.replace(`const root=${JSON.stringify(root)},require=`,"const root=resolve(import.meta.dirname,'../../..'),require=").replace(`const directory=${JSON.stringify(output)},production=`,"const directory=resolve(root,'.superpowers/sdd/PLAN/t11-qwik-logs'),production="),source);
 assert.throws(()=>redirectQwikProducer(source.replace("'../../..'","'changed-root'"),root,output));
});
test('R5 all native output destinations are capture-local and refuse pre-existing output directories',async()=>{
 const {preparePatternOutputs,patternEnvironment}=await import('./patterns.mjs'),temporary=await mkdtemp('/private/tmp/krds-pattern-fresh-unit-');try{
  for(const framework of ['solid','react','svelte','vue','lit','qwik','angular']){
   const destination=join(temporary,'test-results',framework);await mkdir(destination,{recursive:true});const state=await preparePatternOutputs(temporary,framework,destination),environment=patternEnvironment(temporary,framework,destination);
   assert.equal(state.sourceDirectory,`test-results/${framework}/native-output`);await assert.rejects(preparePatternOutputs(temporary,framework,destination));
   if(framework==='solid')assert.equal(environment.PATTERN_OUTPUT,join(destination,'native-output'));
  }
 }finally{await rm(temporary,{recursive:true,force:true});}
});
