import {join} from 'node:path';
import {readFile,mkdir,writeFile} from 'node:fs/promises';
import {summarizeContract} from './testing/results.mjs';
import {summarizeCatalogContract} from './testing/catalog-results.mjs';
import {selectOptions} from './testing/selection.mjs';
import {root,fixtureDist,serveProduction,reportDirectory,writeReport,runSelected} from './testing/support.mjs';
const directory=await reportDirectory('contract');const report={kind:'contract',mode:'pilot',results:[]};
try {
  const options=selectOptions(process.argv.slice(2),'contract');report.mode=options.probe?'probe':options.catalog?'catalog':'pilot';
  const manifest=JSON.parse(await readFile(join(root,options.catalog?'catalog/full-catalog-scenarios.json':'catalog/fixture-cases.json'),'utf8'));
  if(!options.probe && !manifest.cases.some(item=>(!options.component || item.componentId===options.component) && (!options.caseId || item.caseId===options.caseId))) throw new Error('Zero required scenarios selected');
  for(const framework of options.frameworks) {
    let server;
    try {
      const frameworkDirectory=join(directory,framework);await mkdir(frameworkDirectory);
      const navigation=options.catalog?{ledger:join(frameworkDirectory,'navigation-responses.ndjson'),snapshot:join(frameworkDirectory,'navigation-artifact.json')}:null;
      server=await serveProduction(await fixtureDist(framework),{fixture:true,...(navigation?{responseLedger:navigation.ledger}:{})});
      if(navigation)await writeFile(navigation.snapshot,JSON.stringify(server.snapshot,null,2)+'\n');
      const result=await runSelected(['exec','playwright','test','--config',join(root,options.catalog?'tools/testing/catalog.config.ts':'playwright.config.ts'),'--project',options.browser],{browserName:options.browser,...(options.catalog?{timeoutMs:1800000}:{}),env:{KRDS_FRAMEWORK:framework,KRDS_FIXTURE_ORIGIN:server.origin,KRDS_REPORT_DIR:frameworkDirectory,KRDS_TEST_MODE:report.mode,KRDS_COMPONENT:options.component??'',KRDS_CASE:options.caseId??'',...(navigation?{KRDS_NAVIGATION_LEDGER:navigation.ledger,KRDS_NAVIGATION_SNAPSHOT:navigation.snapshot}:{})},log:join(frameworkDirectory,'command.log')});
      const summary=(options.catalog?summarizeCatalogContract:summarizeContract)(JSON.parse(await readFile(join(frameworkDirectory,'playwright.json'),'utf8')));
      report.results.push({framework,origin:server.origin,artifactSnapshot:server.snapshot,...summary,status:result.code===0?summary.status:summary.status==='passed'?'infrastructure-failed':summary.status,exitCode:result.code,evidence:frameworkDirectory,canonicalSelection:!options.probe&&!options.catalog,sourceCandidate:options.catalog?'catalog/full-catalog-scenarios.json':null,coverageAwarded:false});
    } catch(error) {report.results.push({framework,status:'infrastructure-failed',error:String(error)});}
    finally {await server?.close();}
  }
} catch(error) {report.error=String(error);}
await writeReport(directory,report);if(report.error || !report.results.length || report.results.some(result=>result.status!=='passed'))process.exitCode=1;
