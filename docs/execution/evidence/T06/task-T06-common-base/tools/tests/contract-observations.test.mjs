import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,readFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {browserPath,serveProduction,root} from '../testing/support.mjs';
import {createFixtureDriver} from '../../packages/test-contracts/dist/driver.js';
const observations=await import('../testing/observations.mjs').catch(()=>({}));
process.env.PLAYWRIGHT_BROWSERS_PATH??=browserPath;

// Deliberate plain-DOM inspection fixtures, never native adapter/KRDS coverage.
const html=`<!doctype html><html lang="ko"><meta charset="utf-8"><title>Contract observation inspection only</title><body>
<div role="status" aria-label="Fixture health">ready</div><main></main>
<script type="module">
import {createFixtureBridge} from '/bridge.js';
const bridge=createFixtureBridge('react',{value:'2024-02-29',triggerVisible:true});
const kind=new URLSearchParams(location.search).get('case');const main=document.querySelector('main');
if(kind.startsWith('disabled')) {
  main.innerHTML=kind==='disabled-native'?'<button disabled>저장</button>':'<button aria-disabled="true">저장</button>';
  main.querySelector('button').addEventListener('click',()=>bridge.recordEvent('click',null));
} else if(kind.startsWith('date')) {
  main.innerHTML='<label>날짜<input aria-label="날짜"></label>';
  bridge.subscribe(state=>{
    let value=state.value;
    if(kind==='date-timestamp') {const date=new Date(value);value=date.getFullYear()+'-'+String(date.getMonth()+1).padStart(2,'0')+'-'+String(date.getDate()).padStart(2,'0');}
    main.querySelector('input').value=value;
  });
  if(kind==='date-mount-event')bridge.recordEvent('valueChange',{value:'2024-02-29'});
} else {
  main.innerHTML='<button id="trigger">열기</button><button id="fallback">다음 작업</button>';
  let dialog;
  main.querySelector('#trigger').addEventListener('click',()=>{
    dialog=document.createElement('div');dialog.setAttribute('role','dialog');dialog.setAttribute('aria-label','확인');dialog.innerHTML='<button>닫기</button>';main.append(dialog);dialog.querySelector('button').focus();
  });
  bridge.subscribe(state=>{if(!state.triggerVisible)main.querySelector('#trigger')?.remove();});
  window.addEventListener('keydown',event=>{if(event.key==='Escape'&&dialog){dialog.remove();if(kind==='modal-correct')main.querySelector('#fallback').focus();}});
}
</script></body></html>`;

async function withInspection(run) {
  const {chromium}=await import('playwright');
  const directory=await mkdtemp(join(tmpdir(),'krds-observation-inspection-'));
  await writeFile(join(directory,'index.html'),html);
  await writeFile(join(directory,'bridge.js'),await readFile(join(root,'packages/test-contracts/dist/driver.js')));
  const server=await serveProduction(directory,{fixture:true});let browser;
  try {browser=await chromium.launch();await run(browser,server.origin);}
  finally {await browser?.close();await server.close();await rm(directory,{recursive:true,force:true});}
}

test('native disabled pointer activation is suppressed; an active aria-disabled handler is rejected',async()=>{
  assert.equal(typeof observations.assertDisabledButton,'function','disabled observation is not implemented');
  await withInspection(async(browser,origin)=>{
    const page=await browser.newPage();const driver=createFixtureDriver(page,origin);
    try {
      await driver.open({framework:'react',componentId:'button',caseId:'disabled-native'});
      await observations.assertDisabledButton(page,driver);assert.deepEqual(await driver.readEvents(),[]);
      await driver.open({framework:'react',componentId:'button',caseId:'disabled-active'});
      await assert.rejects(observations.assertDisabledButton(page,driver),/toEqual/);
      assert.deepEqual(await driver.readEvents(),[{name:'click',detail:null}]);
    }finally{await page.close();}
  });
});

test('semantic date is invariant in positive and negative UTC zones; timestamp shifts and mount events are rejected',async()=>{
  assert.equal(typeof observations.assertTimezoneInvariant,'function','timezone observation is not implemented');
  await withInspection(async(browser,origin)=>{
    const healthy=[];
    const result=await observations.assertTimezoneInvariant(browser,origin,{framework:'react',componentId:'date-input',caseId:'date-correct'},entry=>healthy.push(entry));
    assert.deepEqual(result.map(entry=>entry.value),['2024-02-29','2024-02-29']);
    assert.deepEqual(healthy.map(entry=>entry.timezoneId),['Pacific/Kiritimati','America/Los_Angeles']);
    assert.ok(healthy.every(entry=>entry.healthy));assert.equal(browser.contexts().length,0);
    await assert.rejects(observations.assertTimezoneInvariant(browser,origin,{framework:'react',componentId:'date-input',caseId:'date-timestamp'}),/toHaveValue/);
    assert.equal(browser.contexts().length,0);
    await assert.rejects(observations.assertTimezoneInvariant(browser,origin,{framework:'react',componentId:'date-input',caseId:'date-mount-event'}),/toEqual/);
    assert.equal(browser.contexts().length,0);
  });
});

test('removed trigger restores exact alternate target; connected document body alone is rejected',async()=>{
  assert.equal(typeof observations.assertModalFocus,'function','modal fallback observation is not implemented');
  await withInspection(async(browser,origin)=>{
    const page=await browser.newPage();const driver=createFixtureDriver(page,origin);
    try {
      await driver.open({framework:'react',componentId:'modal',caseId:'modal-correct'});
      await observations.assertModalFocus(page,driver,{triggerRemoved:true});
      await driver.open({framework:'react',componentId:'modal',caseId:'modal-no-restore'});
      await assert.rejects(observations.assertModalFocus(page,driver,{triggerRemoved:true}),/toBeFocused/);
      assert.equal(await page.evaluate(()=>document.activeElement===document.body&&document.activeElement.isConnected),true);
    }finally{await page.close();}
  });
});
