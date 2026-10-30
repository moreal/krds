import test from 'node:test';
import assert from 'node:assert/strict';
import {fileURLToPath} from 'node:url';
const cli = await import('../testing/selection.mjs').catch(() => ({}));
const network = await import('../testing/network.mjs').catch(() => ({}));
const driver = await import('../../packages/test-contracts/dist/driver.js').catch(() => ({}));

test('CLI selects exactly requested frameworks and rejects empty/unsupported selections', () => {
  assert.equal(typeof cli.selectOptions, 'function', 'selection behavior is not implemented');
  assert.deepEqual(cli.selectOptions(['--framework','react,vue','--probe'],'contract').frameworks,['react','vue']);
  assert.equal(cli.selectOptions(['--all-stable'],'story').frameworks.length,7);
  assert.equal(cli.selectOptions(['--supported'],'siheom').frameworks.length,6);
  assert.throws(()=>cli.selectOptions(['--framework','bogus'],'contract'), /Unknown framework/);
  assert.throws(()=>cli.selectOptions([],'contract'), /Select/);
  assert.throws(()=>cli.selectOptions(['--framework','lit'],'siheom'), /unsupported/);
  assert.throws(()=>cli.selectOptions(['--framework','react','--wat'],'contract'), /Unknown option/);
});

test('story allowlist permits only real production assets and blocks APIs/external paths', () => {
  assert.equal(typeof network.allowedRequest, 'function', 'network policy is not implemented');
  const assets = new Set(['/iframe.html','/index.json','/assets/chunk.js','/font.woff2']);
  const origin = 'http://127.0.0.1:5011';
  assert.equal(network.allowedRequest(`${origin}/iframe.html?id=x`,'document',origin,assets),true);
  assert.equal(network.allowedRequest(`${origin}/assets/chunk.js`,'script',origin,assets),true);
  assert.equal(network.allowedRequest(`${origin}/font.woff2`,'font',origin,assets),true);
  assert.equal(network.allowedRequest(`${origin}/api/state`,'fetch',origin,assets),false);
  assert.equal(network.allowedRequest('https://example.invalid/image.png','image',origin,assets),false);
  assert.equal(network.allowedRequest(`${origin}/index.json`,'eventsource',origin,assets),false);
});

test('fixture bridge merges serializable state, notifies subscribers and snapshots events', async () => {
  assert.equal(typeof driver.createFixtureBridge,'function','fixture bridge is not implemented');
  globalThis.window = {requestAnimationFrame: cb => setTimeout(cb,0)};
  const bridge = driver.createFixtureBridge('react',{count:0});
  const states=[]; const unsub=bridge.subscribe(state=>states.push(state));
  await bridge.setState({count:7,label:'Changed'});
  assert.deepEqual(bridge.getState(),{count:7,label:'Changed'});
  assert.equal(states.length,2);
  bridge.recordEvent('change',{value:8});
  const events=bridge.readEvents(); events[0].detail.value=999;
  assert.deepEqual(bridge.readEvents(),[{name:'change',detail:{value:8}}]);
  await assert.rejects(bridge.setState({callback:()=>{}}), /serializable/);
  unsub(); bridge.dispose(); assert.equal(window.__KRDS_FIXTURE__,undefined);
  await assert.rejects(bridge.setState({count:8}), /disposed/);
  delete globalThis.window;
});

test('production server assigns unique ports, serves allowlisted assets, rejects traversal and closes', async () => {
  const support=await import('../testing/support.mjs').catch(()=>({}));
  assert.equal(typeof support.serveProduction,'function','production server is not implemented');
  const {mkdtemp,writeFile,rm}=await import('node:fs/promises'); const {tmpdir}=await import('node:os'); const {join}=await import('node:path');
  const dir=await mkdtemp(join(tmpdir(),'krds-server-test-'));
  await writeFile(join(dir,'index.html'),'native page');
  const first=await support.serveProduction(dir,{fixture:true}); const second=await support.serveProduction(dir);
  try {
    assert.notEqual(first.origin,second.origin);
    assert.equal(await (await fetch(`${first.origin}/fixtures/__probe?case=native-state`)).text(),'native page');
    assert.equal((await fetch(`${second.origin}/api/state`)).status,404);
    assert.equal(first.assets.has('/index.html'),true);
    assert.equal((await fetch(`${second.origin}/%2e%2e%2fpackage.json`)).status,403);
  } finally { await first.close(); await second.close(); await rm(dir,{recursive:true,force:true}); }
  await assert.rejects(fetch(first.origin));
});

test('request guard refuses mutation methods even when URL is a build asset',()=>{
  assert.equal(network.allowedRequest('http://127.0.0.1:5011/index.json','fetch','http://127.0.0.1:5011',new Set(['/index.json']),'POST'),false);
});

test('bridge refuses renderer objects instead of silently coercing them to semantic JSON',async()=>{
  globalThis.window={requestAnimationFrame:cb=>setTimeout(cb,0)};
  const bridge=driver.createFixtureBridge('lit');
  try {await assert.rejects(bridge.setState({date:new Date('2024-02-29')}),/serializable/);}finally{bridge.dispose();delete globalThis.window;}
});

test('real CLI reports invalid selection and zero canonical cases nonzero without server startup',async()=>{
  const {execFile}=await import('node:child_process');const {promisify}=await import('node:util');
  const exec=promisify(execFile);
  for(const args of [['--framework','bogus'],['--framework','react','--component','absent']]) {
    await assert.rejects(exec(process.execPath,[fileURLToPath(new URL('../run-contract-tests.mjs',import.meta.url)),...args]),error=>{
      assert.equal(error.code,1);assert.match(error.stdout,/Report:/);return true;
    });
  }
});

test('contract summaries distinguish feature RED after health from startup failure and zero execution',async()=>{
  const module=await import('../testing/results.mjs').catch(()=>({}));
  assert.equal(typeof module.summarizeContract,'function','failure classification is not implemented');
  const doc=results=>({suites:[{specs:[{title:'button/disabled',tests:[{results}]}]}]});
  assert.equal(module.summarizeContract(doc([{status:'failed',attachments:[{name:'native-health.json'}],error:{message:'Required KRDS feature not implemented: button/disabled; native health passed'}}])).tests[0].classification,'missing-implementation');
  assert.equal(module.summarizeContract(doc([{status:'failed',error:{message:'browserType.launch failed'}}])).tests[0].classification,'infrastructure-failed');
  assert.equal(module.summarizeContract({suites:[]}).status,'infrastructure-failed');
});

test('built shared scenario definitions and canonical manifests cover the same non-probe pilot IDs',async()=>{
  const scenarios=await import('../../packages/test-contracts/dist/scenarios/index.js').catch(()=>({}));
  assert.equal(Array.isArray(scenarios.pilotScenarios),true,'public pilot scenarios are not implemented');
  const {readFile}=await import('node:fs/promises');const manifest=JSON.parse(await readFile(new URL('../../catalog/fixture-cases.json',import.meta.url),'utf8'));
  assert.deepEqual(scenarios.pilotScenarios.map(item=>`${item.componentId}/${item.caseId}`),manifest.cases.map(item=>`${item.componentId}/${item.caseId}`));
  assert.equal(scenarios.pilotScenarios.some(item=>item.componentId==='__probe'),false);
});
