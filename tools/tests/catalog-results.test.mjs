import test from 'node:test';
import assert from 'node:assert/strict';
import {summarizeCatalogContract} from '../testing/catalog-results.mjs';
const report=results=>({suites:[{specs:results.map((result,index)=>({title:`solid catalog component/outcome-${index}`,tests:[{projectName:'chromium',results:[result]}]}))}]});
test('actual catalog blocker attachments preserve required failure and distinguish manual review from browser capability',()=>{
 const summary=summarizeCatalogContract(report([
  {status:'failed',attachments:[{name:'native-health.json'},{name:'manual-blocker.json'}],error:{message:'Manual catalog observation required: accessible-media/outcome-03: timed sound equivalence review'}},
  {status:'failed',attachments:[{name:'native-health.json'},{name:'browser-capability-blocker.json'}],error:{message:'Actual hidden state unavailable; browser-capability-blocked'}},
  {status:'passed',attachments:[{name:'native-health.json'}]},
 ]));
 assert.equal(summary.status,'failed');assert.deepEqual(summary.tests.map(test=>test.classification),['manual-required','browser-capability-blocked','passed']);assert.ok(summary.tests.slice(0,2).every(test=>test.status==='failed'&&test.blockedReason));
});
test('blocker wording without actual health and blocker attachment does not disguise ordinary failures or startup problems',()=>{
 const summary=summarizeCatalogContract(report([
  {status:'failed',error:{message:'Manual catalog observation required: unavailable browser'}},
  {status:'failed',attachments:[{name:'native-health.json'}],error:{message:'Manual catalog observation required: fake host wording'}},
 ]));
 assert.equal(summary.status,'infrastructure-failed');assert.deepEqual(summary.tests.map(test=>test.classification),['infrastructure-failed','behavior-failed']);assert.equal(summarizeCatalogContract({suites:[]}).status,'infrastructure-failed');
});
