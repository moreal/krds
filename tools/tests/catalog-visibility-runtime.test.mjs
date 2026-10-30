import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {catalogBrowserRuntime,requiresNativeVisibility} from '../testing/catalog-browser-runtime.mjs';
import {observeCatalogCase} from '../testing/catalog-observations.mjs';
import {pauseClockNow} from '../testing/catalog-timing.mjs';
const manifest=JSON.parse(await readFile(new URL('../../catalog/full-catalog-scenarios.json',import.meta.url),'utf8')).cases;
test('bounded real headed default-context visibility executes the required timer observation and rejects a timer ignoring actual hiding',async()=>{
 const {chromium}=await import('playwright');const ordinary=await chromium.launch();const defaultPage=await ordinary.newPage();
 const fixture=manifest.find(item=>item.componentId==='toast'&&item.caseId==='outcome-05');
 assert.equal(requiresNativeVisibility(fixture),true);assert.equal(requiresNativeVisibility({...fixture,caseId:'outcome-04'}),false);
 try{
  for(const mode of ['correct','ignores-real-hidden']){
   const runtime=await catalogBrowserRuntime(defaultPage,fixture),page=runtime.page;
   try{
    assert.equal(runtime.evidence.nativeVisibilityContext,true);assert.equal(runtime.evidence.actualBrowser,'chromium');
    await page.clock.install({time:new Date('2024-02-29T12:00:00.000Z')});await pauseClockNow(page);
    // A real navigation preserves the runtime init-script evidence hook.
    // document.open(), used by setContent(), removes Window event listeners.
    await page.goto('data:text/html;charset=utf-8,'+encodeURIComponent('<!doctype html><html lang="ko"><meta charset="utf-8"><body><div data-krds-component="toast" data-krds-part="root"><div role="status"></div></div></body></html>'));
    await page.evaluate(({fixture,mode})=>{
     window.__events=[];window.__state={...fixture.initialState,__host:fixture.host};window.__KRDS_FIXTURE__={getState:()=>window.__state};
     const root=document.querySelector('[data-krds-part=root]'),status=root.querySelector('[role=status]');status.textContent=fixture.initialState.message.text;
     const timeout=setTimeout(()=>{window.__events.push({name:'dismiss',detail:{id:fixture.initialState.message.id,reason:'timeout',generation:1}});root.remove();},fixture.initialState.durationMs);
     document.addEventListener('visibilitychange',()=>{if(document.hidden&&mode==='correct')clearTimeout(timeout);});
     window.__patch=async patch=>{window.__state={...window.__state,...patch};if(patch.__host?.mounted===false){clearTimeout(timeout);root.remove();}await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));};
    },{fixture,mode});
    const driver={readEvents:()=>page.evaluate(()=>window.__events),setState:patch=>page.evaluate(patch=>window.__patch(patch),patch)};
    const run=observeCatalogCase(page,driver,fixture);
    if(mode==='correct')await run;else await assert.rejects(run,/toContainText|toEqual/);
    const actual=await runtime.readVisibilityEvidence();
    assert.equal(actual.actualDefaultContext,true);
    assert.ok(actual.samples.some(sample=>sample.type==='visibilitychange'&&sample.trusted===true&&sample.hidden===true&&sample.visibilityState==='hidden'));
    assert.ok(actual.samples.some(sample=>sample.type==='visibilitychange'&&sample.trusted===true&&sample.hidden===false&&sample.visibilityState==='visible'));
   }finally{console.log(JSON.stringify({mode,runtime:runtime.evidence,visibility:await runtime.readVisibilityEvidence()}));await runtime.cleanup();}
  }
 }finally{await ordinary.close();}
});
