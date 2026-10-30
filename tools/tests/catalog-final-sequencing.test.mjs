import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {observeCatalogCase} from '../testing/catalog-observations.mjs';
const cases=JSON.parse(await readFile(new URL('../../catalog/full-catalog-scenarios.json',import.meta.url),'utf8')).cases;
const find=(id,n)=>cases.find(item=>item.componentId===id&&item.caseId===`outcome-${String(n).padStart(2,'0')}`);

// Plain native DOM specimens inspect only the observer. They award zero renderer coverage.
async function inspect(browser,fixture,markup,setup,mode){
  const page=await browser.newPage();
  await page.setContent('<!doctype html><html lang="ko"><meta charset="utf-8"><body>'+markup+'</body></html>');
  await page.evaluate(({fixture,mode})=>{window.__state={...fixture.initialState,__host:fixture.host};window.__mode=mode;window.__events=[];window.__KRDS_FIXTURE__={getState:()=>window.__state};},{fixture,mode});
  await page.evaluate(setup);
  const driver={readEvents:()=>page.evaluate(()=>window.__events),setState:patch=>page.evaluate(async patch=>{window.__state={...window.__state,...patch};window.__patch?.(patch);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));},patch)};
  return {run:()=>observeCatalogCase(page,driver,fixture),close:()=>page.close()};
}

test('StructuredList row activation waits for real authoritative checked commit and exactly one request, rejecting stale/missing/duplicate outcomes',async()=>{
  const {chromium}=await import('playwright');const browser=await chromium.launch();const fixture=find('structured-list',4);
  const markup='<ul data-krds-component="structured-list" data-krds-part="root">'+fixture.initialState.items.map(item=>`<li data-krds-part="item"><label><input type="checkbox" value="${item.id}" ${fixture.initialState.selection.ids.includes(item.id)?'checked':''}>${item.title} 선택</label></li>`).join('')+'</ul>';
  function setup(){document.querySelector('input[value=b]').onclick=event=>{const input=event.currentTarget;input.checked=false;setTimeout(()=>{input.checked=window.__mode!=='stale';if(window.__mode!=='missing'){window.__events.push({name:'selectionChange',detail:{ids:['a','b']}});if(window.__mode==='duplicate')window.__events.push({name:'selectionChange',detail:{ids:['a','b']}});}},80);};}
  try{
    for(const mode of ['correct','stale','missing','duplicate']){
      const instance=await inspect(browser,fixture,markup,setup,mode);
      try{if(mode==='correct')await instance.run();else await assert.rejects(instance.run(),/toBeChecked|toBe|toHaveLength/);}finally{await instance.close();}
    }
  }finally{await browser.close();}
});

test('ContextualHelp lifecycle requires actual accepted opening and configured fallback restoration before teardown, rejecting no-op/stale/wrong-focus/late-event hosts',async()=>{
  const {chromium}=await import('playwright');const browser=await chromium.launch();const original=find('contextual-help',6);
  const fixture={...original,initialState:{...original.initialState,fallbackFocusId:'contextual-help-fallback'},host:{...original.host,removeTrigger:false,removeTriggerAction:true,fallbackFocusId:'contextual-help-fallback',fallbackLabel:'다음 작업'}};
  const markup=`<div data-krds-component="contextual-help" data-krds-part="root"><button type="button" data-krds-component="contextual-help" data-krds-part="trigger" aria-expanded="false">${fixture.initialState.triggerLabel}</button><section role="dialog" aria-label="${fixture.initialState.title}" data-krds-component="contextual-help" data-krds-part="popover" tabindex="-1" hidden>${fixture.initialState.content}</section></div><button type="button" id="contextual-help-fallback">다음 작업</button><button type="button" data-krds-host="outside-action">다른 작업</button>`;
  function setup(){
    const root=document.querySelector('[data-krds-part=root]'),trigger=root.querySelector('button'),popover=root.querySelector('section'),fallback=document.getElementById('contextual-help-fallback'),outside=document.querySelector('[data-krds-host=outside-action]');
    trigger.onclick=()=>setTimeout(()=>{if(!root.isConnected||window.__mode==='never-opens')return;popover.hidden=false;trigger.setAttribute('aria-expanded','true');popover.focus();window.__events.push({name:'openChange',detail:{open:true}});},80);
    window.__patch=patch=>{
      if(patch.__host?.removeTrigger){
        if(window.__mode!=='retained-root')root.remove();
        if(window.__mode==='missing-fallback')fallback.remove();
        if(['wrong-focus','missing-fallback'].includes(window.__mode))outside.focus();else fallback.focus();
      }
      if(patch.__host?.mounted===false)root.remove();
    };
    outside.onclick=()=>{if(window.__mode==='late-event')window.__events.push({name:'openChange',detail:{open:false}});};
  }
  try{
    for(const mode of ['correct','never-opens','retained-root','missing-fallback','wrong-focus','late-event']){
      const instance=await inspect(browser,fixture,markup,setup,mode);
      try{if(mode==='correct')await instance.run();else await assert.rejects(instance.run(),/toBeVisible|toHaveCount|toBeFocused|toEqual/);}finally{await instance.close();}
    }
  }finally{await browser.close();}
});

test('ContextualHelp narrow geometry waits for actual visible commit and still rejects never-open or offscreen popovers',async()=>{
  const {chromium}=await import('playwright');const browser=await chromium.launch();const fixture=find('contextual-help',5);
  const markup=`<div data-krds-component="contextual-help" data-krds-part="root"><button>${fixture.initialState.triggerLabel}</button><section data-krds-component="contextual-help" data-krds-part="popover" role="dialog" aria-label="${fixture.initialState.title}" hidden style="position:fixed;left:8px;top:8px;width:344px;height:220px">${fixture.initialState.content}</section></div>`;
  function setup(){document.querySelector('button').onclick=()=>setTimeout(()=>{if(window.__mode==='never-open')return;const popover=document.querySelector('section');popover.hidden=false;if(window.__mode==='offscreen')popover.style.top='500px';},80);}
  try{for(const mode of ['correct','never-open','offscreen']){const instance=await inspect(browser,fixture,markup,setup,mode);try{if(mode==='correct')await instance.run();else await assert.rejects(instance.run(),/toBeVisible|toBeLessThanOrEqual/);}finally{await instance.close();}}}finally{await browser.close();}
});
