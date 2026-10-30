import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {root,serveProduction,runSelected} from '../../../tools/testing/support.mjs';
import {summarizeCatalogContract} from '../../../tools/testing/catalog-results.mjs';
if(!process.argv.includes('--catalog'))throw new Error('Full catalog requires explicit --catalog');
const reportDir=join(root,'.superpowers/sdd/PLAN/t10-react-logs/'+(process.env.KRDS_REACT_CATALOG_OUTPUT??'fixround1/catalog-final'));
await mkdir(reportDir,{recursive:true});
const ledger=join(reportDir,'navigation-responses.ndjson');
const snapshot=join(reportDir,'navigation-artifact.json');
const server=await serveProduction(process.env.KRDS_REACT_FIXTURE_SNAPSHOT??join(root,'apps/fixture-react/dist'),{fixture:true,responseLedger:ledger});
await writeFile(snapshot,JSON.stringify(server.snapshot,null,2)+'\n');
try {
 const result=await runSelected(['exec','playwright','test','--config',join(root,'tools/testing/catalog.config.ts'),'--project','chromium','--workers','4','--fully-parallel','--timeout','30000',...(process.env.KRDS_REACT_CATALOG_GREP?['--grep',process.env.KRDS_REACT_CATALOG_GREP]:[])],{timeoutMs:1800000,env:{KRDS_FRAMEWORK:'react',KRDS_FIXTURE_ORIGIN:server.origin,KRDS_REPORT_DIR:reportDir,KRDS_TEST_MODE:'catalog',KRDS_NAVIGATION_LEDGER:ledger,KRDS_NAVIGATION_SNAPSHOT:snapshot},log:join(reportDir,'command.log')});
 const report=summarizeCatalogContract(JSON.parse(await readFile(join(reportDir,'playwright.json'),'utf8')));
 await writeFile(join(reportDir,'summary.json'),JSON.stringify({mode:'catalog',framework:'react',coverageAwarded:false,fullRequiredOutcomes:315,selectionPattern:process.env.KRDS_REACT_CATALOG_GREP??null,...report},null,2)+'\n');
 process.exitCode=result.code;
}finally{await server.close();}
