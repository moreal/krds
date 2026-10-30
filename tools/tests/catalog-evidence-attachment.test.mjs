import test from 'node:test';
import assert from 'node:assert/strict';
import {createComponentEventEvidence} from '../testing/catalog-event-evidence.mjs';
import {attachComponentEventEvidence} from '../testing/catalog-evidence-attachment.mjs';

test('a genuinely closed page cannot mask an already failed native action, while missing evidence still fails otherwise-passed behavior',async()=>{
  const {chromium}=await import('playwright');const browser=await chromium.launch();const page=await browser.newPage();
  try{
    await page.setContent('<!doctype html><html lang="ko"><meta charset="utf-8"><body>Evidence inspection</body></html>');
    await page.evaluate(()=>{window.__events=[{name:'request',detail:{action:'play'}},{name:'request',detail:{action:'play'}}];window.__KRDS_FIXTURE__={protocol:1,framework:'vue',readEvents:()=>structuredClone(window.__events)};});
    const collector=await createComponentEventEvidence(page);
    const actualPrefix=collector.observedSnapshots();
    const evidence=collector;
    await page.close();
    const artifacts=[];const info={attach:async(name,value)=>artifacts.push({name,value:JSON.parse(value.body)})};
    const original=new Error('Actual native action failed before page closure');
    let caught;
    try{try{throw original;}finally{await attachComponentEventEvidence(info,evidence,{behaviorFailed:true});}}catch(error){caught=error;}
    assert.equal(caught,original);assert.match(caught.stack,/Actual native action failed/);
    const incomplete=artifacts.find(item=>item.name==='component-event-ledger-error.json').value;
    assert.equal(incomplete.complete,false);assert.deepEqual(incomplete.observedSnapshots.slice(0,actualPrefix.length),actualPrefix);
    assert.equal(incomplete.observedSnapshots[0].events.length,2); // Never filter duplicates from diagnostic evidence.
    await assert.rejects(attachComponentEventEvidence(info,evidence,{behaviorFailed:false}),/closed/i);
  }finally{await browser.close();}
});
