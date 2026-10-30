import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {helpOutcomes} from '../testing/catalog-help-outcomes.mjs';

const fixture=JSON.parse(await readFile(new URL('../../catalog/full-catalog-scenarios.json',import.meta.url),'utf8')).cases.find(item=>item.componentId==='coach-mark'&&item.caseId==='outcome-11');

// Plain DOM specimens inspect the observer only; they award zero native/catalog coverage.
test('Coach11 observes the actual delayed close request and committed rejection before teardown, rejecting accepted/no-op/stale/duplicate/linked/focus failures',async()=>{
  const {chromium}=await import('playwright');const browser=await chromium.launch();
  try{
    for(const mode of ['accepted','correct','correct-opaque-host','no-request','duplicate','linked-stop','step-change','wrong-focus','stale-model']){
      const page=await browser.newPage();
      try{
        await page.setContent('<!doctype html><html lang="ko"><meta charset="utf-8"><body><div data-krds-component="coach-mark" data-krds-part="root"><section data-krds-component="coach-mark" data-krds-part="popover"><button type="button" data-krds-component="coach-mark" data-krds-part="stop">그만보기</button></section></div><button type="button" data-krds-host="outside-action">다음 작업</button></body></html>');
        await page.evaluate(({fixture,mode})=>{
          window.__state={...fixture.initialState,...(mode==='correct-opaque-host'?{}:{__host:{...fixture.host}})};window.__events=[];window.__KRDS_FIXTURE__={getState:()=>structuredClone(window.__state)};
          const root=document.querySelector('[data-krds-part=root]'),stop=document.querySelector('[data-krds-part=stop]'),outside=document.querySelector('[data-krds-host=outside-action]');
          stop.onclick=()=>setTimeout(()=>{
            if(!root.isConnected)return;
            if(mode==='no-request')return;
            const request={name:'openChange',detail:{open:false}};
            window.__events.push(mode==='linked-stop'?{name:'stop',detail:{reason:'stop'}}:request);
            if(mode==='duplicate')window.__events.push(request);
            if(mode==='step-change')window.__events.push({name:'stepChange',detail:{id:'two',reason:'next'}});
            if(['accepted','stale-model'].includes(mode))window.__state.open=false;
            if(mode==='accepted')root.remove();
            if(mode==='wrong-focus'||mode==='accepted')outside.focus();
          },80);
          window.__patch=patch=>{
            window.__state={...window.__state,...patch};
            if(patch.__host?.routeChange){root.remove();outside.focus();}
          };
        },{fixture,mode});
        const driver={readEvents:()=>page.evaluate(()=>structuredClone(window.__events)),setState:patch=>page.evaluate(async patch=>{window.__patch(patch);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));},patch)};
        const run=()=>helpOutcomes['coach-mark'][11](page,driver,fixture);
        if(mode.startsWith('correct')){
          await run();
          assert.deepEqual(await driver.readEvents(),[{name:'openChange',detail:{open:false}}]);
          assert.equal(await page.locator('[data-krds-part=root]').count(),0);
        }else await assert.rejects(run(),/toEqual|toBe|toBeVisible|toBeFocused/);
      }finally{await page.close();}
    }
  }finally{await browser.close();}
});
