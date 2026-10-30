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
const kind=new URLSearchParams(location.search).get('case');const main=document.querySelector('main');
const bridge=createFixtureBridge('react',kind.startsWith('select')?{value:'seoul'}:{value:'2024-02-29',triggerVisible:true});
if(kind.startsWith('disabled')) {
  main.innerHTML=kind==='disabled-native'?'<button disabled>저장</button>':'<button aria-disabled="true">저장</button>';
  main.querySelector('button').addEventListener('click',()=>bridge.recordEvent('click',null));
} else if(kind.startsWith('select')) {
  main.innerHTML='<form><label>지역<select aria-label="지역"><option value="seoul" selected>서울</option><option value="busan">부산</option></select></label><button type="reset">초기화</button></form>';
  const select=main.querySelector('select');
  select.addEventListener('change',()=>{
    bridge.recordEvent('valueChange',{value:select.value});
    if(kind==='select-controlled-duplicate')bridge.recordEvent('valueChange',{value:select.value});
  });
  if(kind.startsWith('select-controlled'))bridge.subscribe(state=>{
    select.value=state.value;
    if(kind==='select-controlled-prop-event'&&state.value==='busan')bridge.recordEvent('valueChange',{value:state.value});
  });
  if(kind==='select-reset-event')main.querySelector('form').addEventListener('reset',()=>queueMicrotask(()=>bridge.recordEvent('valueChange',{value:'seoul'})));
} else if(kind.startsWith('calendar')) {
  const weekdays=['일요일','월요일','화요일','수요일','목요일','금요일','토요일'];
  main.innerHTML='<h2>2024년 2월</h2><table><caption>2024년 2월</caption><thead><tr></tr></thead><tbody></tbody></table><button id="confirm">확인</button>';
  for(const name of weekdays){const th=document.createElement('th');th.scope='col';th.textContent=name;main.querySelector('thead tr').append(th);}
  let tentative=null;
  for(let row=0;row<6;row++){
    const tr=document.createElement('tr');main.querySelector('tbody').append(tr);
    for(let column=0;column<7;column++){
      const day=new Date(Date.UTC(2024,0,28+row*7+column));const iso=day.toISOString().slice(0,10);
      const td=document.createElement('td');const button=document.createElement('button');button.type='button';button.textContent=String(day.getUTCDate());
      const name=day.getUTCFullYear()+'년 '+(day.getUTCMonth()+1)+'월 '+day.getUTCDate()+'일 '+weekdays[column];
      button.setAttribute('aria-label',name);button.setAttribute('aria-pressed','false');button.disabled=iso<'2024-02-01'||iso>'2024-03-31';
      button.addEventListener('click',()=>{
        tentative=iso;for(const selected of main.querySelectorAll('td button[aria-pressed="true"]'))selected.setAttribute('aria-pressed','false');
        button.setAttribute('aria-pressed','true');button.setAttribute('aria-label',name+', 선택됨');
        if(kind==='calendar-eager')bridge.recordEvent('valueChange',{value:iso});
      });td.append(button);tr.append(td);
    }
  }
  main.querySelector('#confirm').addEventListener('click',()=>{
    bridge.recordEvent('valueChange',{value:tentative});
    if(kind==='calendar-duplicate')bridge.recordEvent('valueChange',{value:tentative});
  });
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


test('controlled native select suppresses prop events and emits one user change',async()=>{
  assert.equal(typeof observations.assertNativeSelectControlled,'function','controlled native select observation is not implemented');
  await withInspection(async(browser,origin)=>{
    const page=await browser.newPage();const driver=createFixtureDriver(page,origin);
    try {
      await driver.open({framework:'react',componentId:'native-select',caseId:'select-controlled'});
      await observations.assertNativeSelectControlled(page,driver);
      await driver.open({framework:'react',componentId:'native-select',caseId:'select-controlled-prop-event'});
      await assert.rejects(observations.assertNativeSelectControlled(page,driver),/toEqual/);
      await driver.open({framework:'react',componentId:'native-select',caseId:'select-controlled-duplicate'});
      await assert.rejects(observations.assertNativeSelectControlled(page,driver),/toEqual/);
    }finally{await page.close();}
  });
});

test('uncontrolled native select resets user selection to its baseline without another change event',async()=>{
  assert.equal(typeof observations.assertNativeSelectReset,'function','uncontrolled reset observation is not implemented');
  await withInspection(async(browser,origin)=>{
    const page=await browser.newPage();const driver=createFixtureDriver(page,origin);
    try {
      await driver.open({framework:'react',componentId:'native-select',caseId:'select-reset'});
      await observations.assertNativeSelectReset(page,driver);
      assert.equal(await page.getByRole('combobox',{name:'지역',exact:true}).inputValue(),'seoul');
      await driver.open({framework:'react',componentId:'native-select',caseId:'select-reset-event'});
      await assert.rejects(observations.assertNativeSelectReset(page,driver),/toEqual/);
    }finally{await page.close();}
  });
});

test('standalone native table calendar keeps selection tentative and confirms exactly once',async()=>{
  assert.equal(typeof observations.assertCalendarSelectionConfirm,'function','calendar selection-confirm observation is not implemented');
  await withInspection(async(browser,origin)=>{
    const page=await browser.newPage();const driver=createFixtureDriver(page,origin);
    try {
      await driver.open({framework:'react',componentId:'calendar',caseId:'calendar-correct'});
      await observations.assertCalendarSelectionConfirm(page,driver);
      assert.deepEqual(await driver.readEvents(),[{name:'valueChange',detail:{value:'2024-02-29'}}]);
      await driver.open({framework:'react',componentId:'calendar',caseId:'calendar-eager'});
      await assert.rejects(observations.assertCalendarSelectionConfirm(page,driver),/toEqual/);
      await driver.open({framework:'react',componentId:'calendar',caseId:'calendar-duplicate'});
      await assert.rejects(observations.assertCalendarSelectionConfirm(page,driver),/toEqual/);
    }finally{await page.close();}
  });
});
