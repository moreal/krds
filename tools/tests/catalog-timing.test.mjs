import test from 'node:test';
import assert from 'node:assert/strict';
import {installCatalogExposureTracking,beforeExposureDeadline,crossExposureDeadline,updateTimedState} from '../testing/catalog-timing.mjs';
import {expect} from '@playwright/test';

test('rendered exposure deadlines traverse real open Shadow DOM and include actual two-frame bridge acknowledgement',async()=>{
 const {chromium}=await import('playwright');const browser=await chromium.launch();
 try{
  for(const early of [false,true]){
   const context=await browser.newContext();const page=await context.newPage();await page.clock.install({time:new Date('2024-02-29T12:00:00.000Z')});await installCatalogExposureTracking(page);await page.setContent('<div id="host"></div>');
   await page.evaluate(early=>{const shadow=document.querySelector('#host').attachShadow({mode:'open'});shadow.innerHTML='<div data-krds-component="toast" data-krds-part="root"><div role="status">처리 결과</div></div>';let state={message:{id:'saved',text:'처리 결과'},durationMs:3000},timer;const listeners=[];window.__KRDS_FIXTURE__={getState:()=>state,subscribe(fn){listeners.push(fn);fn(state);return()=>{};}};window.__timingChanges=[];window.__timingPatch=async patch=>{state={...state,...patch};for(const listener of listeners)listener(state);const status=shadow.querySelector('[role=status]');status.textContent=state.message.text;clearTimeout(timer);Date.now();timer=setTimeout(()=>{window.__timingChanges.push('timeout');status.remove();},early?2500:state.durationMs);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));};},early);
   const driver={setState:patch=>page.evaluate(patch=>window.__timingPatch(patch),patch)};
   await updateTimedState(page,driver,{message:{id:'saved',text:'수정된 처리 결과'}});await beforeExposureDeadline(page,'toast',3000);
   if(early)await assert.rejects(expect(page.getByRole('status')).toHaveText('수정된 처리 결과'),/toHaveText/);
   else{await expect(page.getByRole('status')).toHaveText('수정된 처리 결과');await crossExposureDeadline(page);assert.deepEqual(await page.evaluate(()=>window.__timingChanges),['timeout']);}
   await context.close();
  }
 }finally{await browser.close();}
});

test('a paused fixture clock drives actual animation-frame UI after native activation without changing callback counts',async()=>{
 const {visibleAfterClockAction,pauseClockNow}=await import('../testing/catalog-timing.mjs');
 const {chromium}=await import('playwright');const browser=await chromium.launch();
 try{
  const page=await browser.newPage();await page.clock.install();await pauseClockNow(page);await page.setContent('<button>다음</button><p hidden>실제 프레임 결과</p>');
  await page.evaluate(()=>{window.__requests=0;document.querySelector('button').onclick=()=>{window.__requests++;requestAnimationFrame(()=>{document.querySelector('p').hidden=false;});};});
  await page.getByRole('button').click();await visibleAfterClockAction(page,{catalogClockManaged:true},page.getByText('실제 프레임 결과'));assert.equal(await page.evaluate(()=>window.__requests),1);
 }finally{await browser.close();}
});
