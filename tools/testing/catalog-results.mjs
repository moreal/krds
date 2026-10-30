import {summarizeContract} from './results.mjs';

/** Catalog blockers remain required failures and never become skips or passes. */
export function summarizeCatalogContract(document) {
  const summary=summarizeContract(document);
  const results=[];
  function visit(suite){
    for(const spec of suite.specs??[])for(const test of spec.tests??[]){const result=test.results?.at(-1);if(result)results.push(result);}
    for(const child of suite.suites??[])visit(child);
  }
  for(const suite of document.suites??[])visit(suite);
  return {...summary,tests:summary.tests.map((test,index)=>{
    if(!test.nativeHealth||test.classification==='passed')return test;
    const names=new Set((results[index].attachments??[]).map(item=>item.name));
    if(names.has('manual-blocker.json')&&test.error?.includes('Manual catalog observation required:'))return {...test,classification:'manual-required',blockedReason:test.error};
    if(names.has('browser-capability-blocker.json')&&test.error?.includes('browser-capability-blocked'))return {...test,classification:'browser-capability-blocked',blockedReason:test.error};
    return test;
  })};
}
