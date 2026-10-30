import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile, mkdtemp, mkdir, writeFile, rm, cp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {spawnSync} from 'node:child_process';
const api = await import('./collect-release-evidence.mjs').catch(() => ({}));
const options = {directory:'test-results/release/example', ssrDirectory:'test-results/t13/ssr-runs/example'};

test('recorder and orchestrator can bootstrap immutable installation without installed TypeScript', () => {
  const module=new URL('./collect-release-evidence.mjs',import.meta.url).href;
  const run=spawnSync(process.execPath,['--input-type=module','-e',`import {registerHooks} from 'node:module';registerHooks({resolve(specifier,context,next){if(specifier==='typescript')throw new Error('TypeScript is not installed before ci:install');return next(specifier,context);}});await import(${JSON.stringify(module)});`],{encoding:'utf8'});
  assert.equal(run.status,0,run.stderr);
});

test('bare checkout describes ci:install and captures/validates a real child without node_modules', async () => {
  const bare=await mkdtemp(join(tmpdir(),'krds-bare-ci-'));
  try{
    const source=new URL('../../',import.meta.url);
    const paths=['compatibility/toolchain.json','tests/consumers/lib.mjs','tools/ci/collect-release-evidence.mjs','tools/ci/common.mjs','tools/ci/check-release-phase.mjs','tools/verify-release.mjs',...['record','record-support','producers','receipts','receipt-step','patterns','ci-outputs'].map(name=>`tools/release-evidence/${name}.mjs`)];
    for(const path of paths){const destination=join(bare,path);await mkdir(join(destination,'..'),{recursive:true});await cp(new URL(path,source),destination);}
    const described=spawnSync(process.execPath,['tools/release-evidence/record.mjs','--recipe','ci:install'],{cwd:bare,encoding:'utf8'});
    assert.equal(described.status,0,described.stderr);const description=JSON.parse(described.stdout);
    assert.deepEqual(description.command.args,['tools/yarn.mjs','install','--immutable']);assert.equal(description.executionPerformed,false);
    const code=`import './tools/ci/collect-release-evidence.mjs';import {captureStep,nodeCommand,validateStep} from './tools/release-evidence/receipts.mjs';const command=nodeCommand(process.cwd(),['-e',"console.log('bare-checkout')"]);const receipt=await captureStep('bare',command,{baseRoot:process.cwd(),output:process.cwd()+'/test-results/probe'});await validateStep(receipt,{baseRoot:process.cwd(),expectedCommand:command});console.log(JSON.stringify(receipt));`;
    const captured=spawnSync(process.execPath,['--input-type=module','-e',code],{cwd:bare,encoding:'utf8'});
    assert.equal(captured.status,0,captured.stderr);const receipt=JSON.parse(captured.stdout);assert.equal(receipt.schemaVersion,2);assert.equal(receipt.exitCode,0);
    const consumer=await import('../../tests/consumers/evidence.mjs'),primitive=await import('../release-evidence/receipt-step.mjs');
    assert.equal(consumer.captureStep,primitive.captureStep);assert.equal(consumer.validateStep,primitive.validateStep);
  }finally{await rm(bare,{recursive:true,force:true});}
});

test('release emits every accepted CI selector once, without a second broad Chromium invocation', () => {
  assert.equal(typeof api.releaseSteps, 'function');
  const steps=api.releaseSteps(options), recipes=steps.filter(s=>s.recipe?.startsWith('ci:')).map(s=>s.recipe);
  const expected=['install','workspace','catalog','coverage','selection','affected','targets','cache'].map(id=>`ci:${id}`);
  for(const id of ['solid','react','svelte','vue','lit','qwik','angular']) for(const tool of ['contracts','stories']) for(const mode of ['pilot','catalog']) expected.push(`ci:${tool}:${id}:${mode}`);
  for(const id of ['solid','react','svelte','vue','qwik','angular']) expected.push(`ci:siheom:${id}`);
  assert.equal(recipes.length,42); assert.deepEqual([...recipes].sort(),expected.sort());
  for(const recipe of recipes){const step=steps.find(s=>s.recipe===recipe);assert.ok(step.args.includes('--execute'));assert.equal(step.args[0],'tools/release-evidence/record.mjs');}
  const additional=steps.filter(s=>s.args[0]==='tools/yarn.mjs' && ['test:contract','test:stories'].includes(s.args[1]));
  assert.equal(additional.length,8);
  for(const browser of ['firefox','webkit']) for(const tool of ['test:contract','test:stories']) for(const catalog of [false,true]) assert.equal(additional.filter(s=>JSON.stringify(s.args)===JSON.stringify(['tools/yarn.mjs',tool,'--all-stable',...(catalog?['--catalog']:[]),'--browser',browser])).length,1);
});

test('source-before, all broad writers, final candidate and native captures stay ordered', () => {
  assert.equal(typeof api.releaseSteps,'function');
  const steps=api.releaseSteps(options), at=id=>steps.findIndex(s=>s.id===id);
  for(const [before,after] of [['ci:install','phase'],['phase','ci:workspace'],['ci:selection','ci:targets'],['ci:targets','ci:cache'],['compatibility','ssr-stable'],['ssr-stable','ssr-preview'],['ssr-preview','pack'],['pack','candidate'],['candidate','ci:contracts:solid:pilot'],['preview-build','final-output-check'],['consumers','final-output-check'],['final-output-check','assemble-ci']]) assert.ok(at(before)>=0&&at(before)<at(after),`${before} before ${after}`);
  assert.deepEqual(steps.find(s=>s.id==='pack').args,['tools/yarn.mjs','pack:all','--build']);
  assert.deepEqual(steps.find(s=>s.id==='ssr-preview').args,['tools/run-ssr-tests.mjs','--framework','solid-next']);
  assert.equal(steps.find(s=>s.id==='ssr-stable').environment.KRDS_SSR_REPORT_DIR,options.ssrDirectory+'-stable');
  const qwik=steps.find(s=>s.id==='patterns-qwik');
  assert.equal(qwik.args[qwik.args.indexOf('--artifact')+1],options.ssrDirectory+'-stable/qwik/production-inputs');
});

test('all machine and human kinds use existing assembly, forwarding only supplied extras', () => {
  assert.equal(typeof api.releaseSteps,'function');
  const extras={patterns:'test-results/real-pattern-review.json',documentation:'test-results/real-doc-review.json',manualAccessibility:'test-results/real-sessions.json',independentReview:'test-results/real-release-review.json'};
  const steps=api.releaseSteps({...options,extras});
  assert.equal(steps.filter(s=>s.recipe==='patterns').length,7);
  for(const kind of ['patterns','documentation','preview','ci','manualAccessibility','independentReview']){
    const step=steps.find(s=>s.id===`assemble-${kind}`);assert.ok(!step.stopOnFailure);assert.deepEqual(step.dependsOn,['final-output-check']);assert.equal(step.args[0],'tools/release-evidence/assemble.mjs');
    assert.equal(step.args.includes('--extras'),Boolean(extras[kind]));if(extras[kind])assert.equal(step.args[step.args.indexOf('--extras')+1],extras[kind]);
  }
  const plain=api.releaseSteps(options);assert.ok(plain.every(s=>!s.args?.includes('--extras')));
  assert.ok(steps.every(s=>!Object.keys(s.environment??{}).some(key=>key.startsWith('GITHUB_'))));
});

test('raw failures block explicit dependents while independent commands retain their real results', async () => {
  assert.equal(typeof api.runSteps,'function');
  const command=code=>['-e',`process.exit(${code})`];
  const run=step=>{const child=spawnSync(process.execPath,step.args);return {exitCode:child.status,signal:child.signal};};
  const result=await api.runSteps([{id:'failed',args:command(7)},{id:'must-not-run',args:command(0),dependsOn:['failed']},{id:'independent',args:command(0)}],run);
  assert.equal(result.results.find(row=>row.id==='must-not-run').executed,false);assert.deepEqual(result.results.find(row=>row.id==='must-not-run').blockedBy,['failed']);
  assert.equal(result.results.find(row=>row.id==='independent').exitCode,0);assert.equal(result.exitCode,7);
  const blocked=await api.runSteps([{id:'blocked',args:command(3)},{id:'remaining',args:command(0)}],run);
  assert.deepEqual(blocked.results.map(r=>r.id),['blocked','remaining']);assert.equal(blocked.exitCode,3);
  const signal=await api.runSteps([{id:'signal',args:[]}],()=>({exitCode:null,signal:'SIGTERM'}));assert.notEqual(signal.exitCode,0);
});

test('coverage failure preserves its result and continues independent build SSR and native producers', async () => {
  const attempted=[];
  const result=await api.runSteps(api.releaseSteps(options),step=>{attempted.push(step.id);return {exitCode:step.id==='ci:coverage'?7:0,signal:null};});
  assert.equal(result.exitCode,7);assert.equal(result.results.find(row=>row.id==='ci:coverage').exitCode,7);
  for(const id of ['ci:selection','ci:targets','ci:cache','compatibility','ssr-stable','ssr-preview','pack','ci:contracts:solid:pilot','patterns-qwik','docs-browser','preview-contracts','consumers'])assert.ok(attempted.includes(id),id);
});

test('framework and docs failures leave other frameworks docs preview and consumers independently runnable', async () => {
  const attempted=[];
  const failed=new Map([['ci:contracts:solid:pilot',5],['docs-tests',8]]);
  const result=await api.runSteps(api.releaseSteps(options),step=>{attempted.push(step.id);return {exitCode:failed.get(step.id)??0,signal:null};});
  assert.equal(result.exitCode,5);assert.equal(result.results.find(row=>row.id==='docs-tests').exitCode,8);
  for(const id of ['ci:contracts:solid:catalog','ci:contracts:react:pilot','stories-webkit-catalog','patterns-angular','docs-browser','preview-contracts','consumers','final-output-check','assemble-ci','assemble-documentation'])assert.ok(attempted.includes(id),id);
});

test('missing actual prerequisites block their dependents while independent producer branches continue', async () => {
  for(const [failure,blocked,unaffected] of [
    ['ci:selection',['ci:targets','ci:cache','final-output-check','assemble-ci'],['compatibility','ssr-stable','pack','docs-tests']],
    ['pack',['tarballs','candidate','ci:contracts:solid:pilot','patterns-solid','consumers','final-output-check','assemble-ci'],['contract-firefox-pilot','ssr-preview']],
    ['browsers',['ssr-stable','ci:contracts:react:catalog','docs-browser','preview-contracts'],['compatibility','pack','docs-tests','preview-types']],
  ]){
    const attempted=[];
    const result=await api.runSteps(api.releaseSteps(options),step=>{attempted.push(step.id);return {exitCode:step.id===failure?4:0,signal:null};});
    assert.equal(result.exitCode,4);
    for(const id of blocked){assert.ok(!attempted.includes(id),`${failure} must block ${id}`);assert.equal(result.results.find(row=>row.id===id).executed,false);}
    for(const id of unaffected)assert.ok(attempted.includes(id),`${failure} must allow ${id}`);
  }
});

test('installation and source guards stop the run and failed final-output guards prevent every assembly', async () => {
  for(const failure of ['ci:install','toolchain','phase','candidate','final-output-check']){
    const attempted=[];
    const result=await api.runSteps(api.releaseSteps(options),step=>{attempted.push(step.id);return {exitCode:step.id===failure?6:0,signal:null};});
    assert.equal(result.exitCode,6);assert.equal(attempted.at(-1),failure);
    assert.ok(!attempted.includes('assemble-ci'));assert.ok(!attempted.includes('assemble-preview'));
  }
});

test('final output check rejects changed bytes, changed candidate and incomplete SSR evidence', async () => {
  assert.equal(typeof api.validateFinalOutputs,'function');
  const root=await mkdtemp(join(tmpdir(),'krds-ci-final-output-'));
  try{
    await mkdir(join(root,'packages/react/dist'),{recursive:true});await mkdir(join(root,'apps'));
    await writeFile(join(root,'packages/react/dist/index.js'),'current');
    const {inventory}=await import('../release-evidence/producers.mjs');
    const target={producedArtifacts:await inventory(root,['packages/react/dist'],{outputs:true})};
    const before={candidate:{sourceCommit:'a'.repeat(40),lockfileSha256:'b'.repeat(64),artifactManifestSha256:'c'.repeat(64)}};
    const current={...before,checks:['M1-compatibility-types-build','M2-compatibility-types-build','M1-ssr-hydration-browser-timezones','M2-ssr-hydration-browser-timezones'].map(id=>({id,status:'passed'}))};
    await api.validateFinalOutputs(root,before,current,target);
    await assert.rejects(()=>api.validateFinalOutputs(root,before,{...current,candidate:{...before.candidate,artifactManifestSha256:'d'.repeat(64)}},target),/candidate.*changed/i);
    await assert.rejects(()=>api.validateFinalOutputs(root,before,{...current,checks:current.checks.slice(0,3)},target),/M2-ssr/);
    await writeFile(join(root,'packages/react/dist/index.js'),'changed');
    await assert.rejects(()=>api.validateFinalOutputs(root,before,current,target),/stale|incomplete/);
  }finally{await rm(root,{recursive:true,force:true});}
});

test('index merge includes only supplied successful fragments that pass current validation', async () => {
  assert.equal(typeof api.mergeIndexes,'function');
  const root=await mkdtemp(join(tmpdir(),'krds-ci-index-'));
  try{
    await mkdir(join(root,'evidence'));
    const passed={schemaVersion:3,reports:{preview:{path:'evidence/preview.json',bytes:1,sha256:'a'.repeat(64)}}};
    const blocked={schemaVersion:3,reports:{ci:{path:'evidence/ci.json',bytes:1,sha256:'b'.repeat(64)}}};
    await writeFile(join(root,'evidence/preview.index.json'),JSON.stringify(passed));await writeFile(join(root,'evidence/ci.index.json'),JSON.stringify(blocked));
    const result=await api.mergeIndexes(root,[{kind:'preview',path:'evidence/preview.index.json'},{kind:'ci',path:'evidence/ci.index.json'}],{}, {},async(_root,kind)=>({status:kind==='preview'?'passed':'blocked',details:['authentic hosted run missing']}));
    assert.deepEqual(result.index,{schemaVersion:3,reports:passed.reports});assert.equal(result.blocked.length,1);
    assert.deepEqual((await api.mergeIndexes(root,[],{},{})).index,{schemaVersion:3,reports:{}});
    await writeFile(join(root,'evidence/ci.index.json'),JSON.stringify({schemaVersion:3,reports:{ci:blocked.reports.ci,manualAccessibility:blocked.reports.ci}}));
    await assert.rejects(()=>api.mergeIndexes(root,[{kind:'ci',path:'evidence/ci.index.json'}],{},{}),/fragment/i);
  }finally{await rm(root,{recursive:true,force:true});}
});

test('workflow invokes the serial evidence producer with optional real inputs and preserves phase/publication restrictions', async () => {
  const workflow=await readFile(new URL('../../.github/workflows/release-prepare.yml',import.meta.url),'utf8');
  const prepare=workflow.split('\n  prepare:\n')[1].split('\n  verify-release:\n')[0];
  assert.match(prepare,/node tools\/ci\/collect-release-evidence.mjs/);
  assert.doesNotMatch(prepare,/node tools\/yarn.mjs (?:install|test:contract|test:stories|pack:all|test:ssr)/);
  assert.match(workflow,/PLAYWRIGHT_BROWSERS_PATH: \/private\/tmp\/krds-playwright-1\.64\.1/);
  assert.match(workflow,/contents: read/);assert.match(workflow,/persist-credentials: false/);
  assert.doesNotMatch(workflow,/--apply|npm publish|git push|GITHUB_TOKEN:/);
});
