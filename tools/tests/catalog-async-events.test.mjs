import test from 'node:test';
import assert from 'node:assert/strict';
import {request} from '../testing/catalog-outcome-helpers.mjs';
test('positive semantic callbacks await the exact lazy-native request while eager and duplicate requests remain rejected',async()=>{
 for(const mode of ['correct','eager','duplicate']){
  const events=mode==='eager'?[{name:'mountRequest',detail:{}}]:[];
  const timer=setTimeout(()=>{events.push({name:'valueChange',detail:{value:2}});if(mode==='duplicate')events.push({name:'valueChange',detail:{value:2}});},40);
  try{
   const run=request({readEvents:async()=>structuredClone(events)},'valueChange',{value:2});
   if(mode==='correct')await run;else await assert.rejects(run,/toEqual/);
  }finally{clearTimeout(timer);}
 }
});
