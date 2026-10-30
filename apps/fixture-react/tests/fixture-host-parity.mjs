import {strict as assert} from 'node:assert';
import {readFile,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import {chromium} from 'playwright';
import {root,serveProduction} from '../../../tools/testing/support.mjs';
const directory=process.env.KRDS_REACT_FIXTURE_SNAPSHOT;
if(!directory)throw new Error('Immutable actual fixture snapshot required');
const scenario=JSON.parse(await readFile(join(root,'catalog/full-catalog-scenarios.json'),'utf8')).cases.find(item=>item.componentId==='badge'&&item.caseId==='outcome-01');
const server=await serveProduction(directory,{fixture:true});
const browser=await chromium.launch();
try{
 const context=await browser.newContext();const page=await context.newPage();
 await page.goto(`${server.origin}/fixtures/badge?case=outcome-01`);
 await page.waitForFunction(()=>window.__KRDS_FIXTURE__?.protocol===1);
 const actual=await page.evaluate(()=>window.__KRDS_FIXTURE__.getState());
 const {__host,...initial}=actual;
 const evidence={productionDirectory:directory,componentId:'badge',caseId:'outcome-01',expectedInitialState:scenario.initialState,actualInitialState:initial,expectedHost:scenario.host,actualHost:__host,coverageAwarded:false};
 const output=join(root,'.superpowers/sdd/PLAN/t10-react-logs/final-data-replay/'+(process.env.KRDS_HOST_PARITY_OUTPUT??'parity')+'.json');
 await writeFile(output,JSON.stringify(evidence,null,2)+'\n');
 assert.deepEqual(initial,scenario.initialState,'Bridge must preserve actual supplied initial state');
 assert.deepEqual(__host,scenario.host,'Bridge must preserve actual supplied host without forced flags');
 console.log('PASS: actual initial state and host equal supplied source bytes; no injected route/remove flags.');
 await context.close();
}finally{await browser.close();await server.close();}
