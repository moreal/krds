import test from 'node:test';
import assert from 'node:assert/strict';
import {resizeWithNativeReadiness} from '../testing/catalog-resize-readiness.mjs';
import {insideViewport} from '../testing/catalog-outcome-helpers.mjs';

test('resize readiness requires a real trusted target-size event and two native frames, retaining strict geometry and rejecting no-op/synthetic-only changes',async()=>{
  const {chromium}=await import('playwright');const browser=await chromium.launch();
  try{
    for(const mode of ['correct','no-resize','synthetic-only','bad-box']){
      const page=await browser.newPage({viewport:mode==='synthetic-only'?{width:360,height:600}:{width:1280,height:800}});
      try{
        await page.setContent('<!doctype html><html lang="ko"><meta charset="utf-8"><body><div id="popover" style="position:fixed;left:8px;top:8px;width:600px;height:100px">Plain geometry inspection</div></body></html>');
        await page.evaluate(mode=>{
          addEventListener('resize',()=>{if(mode==='bad-box')return;requestAnimationFrame(()=>requestAnimationFrame(()=>document.getElementById('popover').style.width='300px'));});
          return new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));
        },mode);
        if(mode==='no-resize')page.setViewportSize=async()=>{};
        if(mode==='synthetic-only')page.setViewportSize=async()=>page.evaluate(()=>dispatchEvent(new Event('resize')));
        const run=async()=>{const proof=await resizeWithNativeReadiness(page,{width:360,height:600},{timeoutMs:['no-resize','synthetic-only'].includes(mode)?150:5000});await insideViewport(page,page.locator('#popover'));return proof;};
        if(mode==='correct'){
          const proof=await run();assert.equal(proof.ready,true);assert.equal(proof.frames,2);assert.ok(proof.events.some(item=>item.trusted===true&&item.width===360&&item.height===600));
        }else{
          await assert.rejects(run(),/Timeout|resize|toBeLessThanOrEqual/);
          const proof=page.__krdsNativeResizeEvidence.at(-1);
          if(mode==='synthetic-only'){assert.equal(proof.ready,false);assert.ok(proof.events.some(item=>item.trusted===false));}
          if(mode==='bad-box')assert.equal(proof.ready,true);
        }
      }finally{await page.close();}
    }
  }finally{await browser.close();}
});
