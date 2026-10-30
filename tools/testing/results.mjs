export function summarizeContract(document) {
  const tests=[];
  function visit(suite) {
    for(const spec of suite.specs??[]) for(const test of spec.tests??[]) {
      const result=test.results?.at(-1); if(!result) continue;
      const healthy=result.attachments?.some(item=>item.name==='native-health.json')??false;
      const error=result.error?.message;
      const classification=!healthy?'infrastructure-failed':result.status==='passed'?'passed':error?.includes('Required KRDS feature not implemented:')?'missing-implementation':'behavior-failed';
      tests.push({title:spec.title,browser:test.projectName,status:result.status,nativeHealth:healthy,classification,error});
    }
    for(const child of suite.suites??[])visit(child);
  }
  for(const suite of document.suites??[])visit(suite);
  return {status:!tests.length||tests.some(item=>item.classification==='infrastructure-failed')?'infrastructure-failed':tests.every(item=>item.classification==='passed')?'passed':'failed',tests};
}
