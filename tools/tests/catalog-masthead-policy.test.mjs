import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {assertMastheadPolicy,officialMastheadSentence} from '../testing/catalog-masthead-inspection.mjs';
const cases=JSON.parse(await readFile(new URL('../../catalog/full-catalog-scenarios.json',import.meta.url),'utf8')).cases;
test('Masthead simulations require exact visible adjacent nonofficial notice; false eligibility cannot assert the official sentence',async()=>{
 const {chromium}=await import('playwright');const browser=await chromium.launch();
 try{
  for(const mode of ['simulated','missing-notice','hidden-notice','far-notice','false-safe','false-claim']){
   const page=await browser.newPage();const fixture=cases.find(item=>item.componentId==='masthead'&&item.caseId===(mode.startsWith('false')?'outcome-03':'outcome-01'));
   try{
    const notice=`<p ${mode==='hidden-notice'?'style="opacity:0"':''}>${fixture.host.specimenLabel}</p>`;
    const claim=`<masthead-host></masthead-host>`;
    await page.setContent('<!doctype html><html lang="ko"><meta charset="utf-8"><body>'+(mode==='missing-notice'?'':notice)+(mode==='far-notice'?'<main><h1>다른 본문 영역</h1></main>':'')+claim+'</body></html>');
    await page.evaluate(({mode,sentence})=>{const host=document.querySelector('masthead-host');if(mode==='false-safe')return;const shadow=host.attachShadow({mode:'open'});const text=document.createElement('p');text.dataset.krdsComponent='masthead';text.dataset.krdsPart='root';text.textContent=sentence;shadow.append(text);},{mode,sentence:officialMastheadSentence});
    const run=assertMastheadPolicy(page,fixture);
    if(['simulated','false-safe'].includes(mode))await run;else await assert.rejects(run,/toHaveCount|toBe/);
   }finally{await page.close();}
  }
 }finally{await browser.close();}
});
