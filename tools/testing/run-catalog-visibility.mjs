import {join} from 'node:path';
import {readFile} from 'node:fs/promises';
import {summarizeContract} from './results.mjs';
import {summarizeCatalogContract} from './catalog-results.mjs';
import {selectOptions} from './selection.mjs';
import {root,fixtureDist,serveProduction,reportDirectory,writeReport,runSelected} from './support.mjs';
const directory=await reportDirectory('contract');const report={kind:'contract',mode:'pilot',results:[]};
try {
  const options=selectOptions([...process.argv.slice(2),'--catalog'],'contract');report.mode=options.probe?'probe':options.catalog?'catalog':'pilot';
  const manifest=JSON.parse(await readFile(join(root,options.catalog?'catalog/full-catalog-scenarios.json':'catalog/fixture-cases.json'),'utf8'));
  manifest.cases=manifest.cases.filter(item=>(item.componentId==='toast'&&item.caseId==='outcome-05')||(item.componentId==='snackbar'&&item.caseId==='outcome-12'));
  report.selection={scope:'required-native-visibility-subset',fullCatalogRequired:315,requiredSubset:2,sourceCandidate:'catalog/full-catalog-scenarios.json',coverageAwarded:false};
  if(!options.probe && !manifest.cases.some(item=>(!options.component || item.componentId===options.component) && (!options.caseId || item.caseId===options.caseId))) throw new Error('Zero required scenarios selected');
  for(const framework of options.frameworks) {
    let server;
    try {
      server=await serveProduction(await fixtureDist(framework),{fixture:true});
      const frameworkDirectory=join(directory,framework);const {mkdir}=await import('node:fs/promises');await mkdir(frameworkDirectory);
      const result=await runSelected(['exec','playwright','test','--config',join(root,options.catalog?'tools/testing/catalog-visibility.config.ts':'playwright.config.ts'),'--project',options.browser],{browserName:options.browser,...(options.catalog?{timeoutMs:1800000}:{}),env:{KRDS_FRAMEWORK:framework,KRDS_FIXTURE_ORIGIN:server.origin,KRDS_REPORT_DIR:frameworkDirectory,KRDS_TEST_MODE:report.mode,KRDS_COMPONENT:options.component??'',KRDS_CASE:options.caseId??''},log:join(frameworkDirectory,'command.log')});
      const summary=(options.catalog?summarizeCatalogContract:summarizeContract)(JSON.parse(await readFile(join(frameworkDirectory,'playwright.json'),'utf8')));
      report.results.push({framework,origin:server.origin,artifactSnapshot:server.snapshot,...summary,status:result.code===0?summary.status:summary.status==='passed'?'infrastructure-failed':summary.status,exitCode:result.code,evidence:frameworkDirectory,canonicalSelection:!options.probe&&!options.catalog,sourceCandidate:options.catalog?'catalog/full-catalog-scenarios.json':null,coverageAwarded:false});
    } catch(error) {report.results.push({framework,status:'infrastructure-failed',error:String(error)});}
    finally {await server?.close();}
  }
} catch(error) {report.error=String(error);}
await writeReport(directory,report);if(report.error || !report.results.length || report.results.some(result=>result.status!=='passed'))process.exitCode=1;
