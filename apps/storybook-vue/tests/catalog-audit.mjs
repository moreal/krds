import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {fullCatalogStoryCases} from '@unofficial-krds/test-contracts';
import {serveProduction,browserPath} from '../../../tools/testing/support.mjs';
import {guardStoryNetwork} from '../../../tools/testing/network.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH??=browserPath;
const directory=join(process.cwd(),'../../.superpowers/sdd/PLAN/t10-vue-logs/story-audit');await mkdir(directory,{recursive:true});
const server=await serveProduction(join(process.cwd(),'dist'));const browser=await chromium.launch();const results=[];
try{
 for(const story of fullCatalogStoryCases){
  const context=await browser.newContext({viewport:story.environment.viewport,locale:'ko-KR',reducedMotion:story.environment.reducedMotion,colorScheme:story.environment.colorMode,serviceWorkers:'block'});
  const policy=await guardStoryNetwork(context,server.origin,server.assets),errors=[];const page=await context.newPage();page.on('pageerror',error=>errors.push(String(error)));
  const record={id:story.id,componentId:story.componentId,caseId:story.caseId,coverageAwarded:false};
  try{
   await page.goto(`${server.origin}/iframe.html?id=${story.id}&viewMode=story`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
   const root=page.locator('#storybook-root');await root.waitFor();
   const body=await root.innerText();if(!body.trim())throw new Error('Empty native story');
   record.contentReviewBlocked=await page.locator('[data-krds-host="media-content-blocked"]').count()>0;record.configurationError=await page.locator('[data-krds-host="configuration-error"]').allTextContents();
   record.nativeSnapshot=await root.ariaSnapshot();record.geometry=await root.evaluate(node=>({width:node.getBoundingClientRect().width,height:node.getBoundingClientRect().height,scrollWidth:document.documentElement.scrollWidth,viewport:innerWidth,focus:document.activeElement?.outerHTML}));
   record.expected=await Promise.all(story.expected.map(async expected=>{const target=page.getByRole(expected.role,expected.name?{name:expected.name,exact:true}:{});return{...expected,count:await target.count(),visible:await target.first().isVisible().catch(()=>false)};}));
   record.axe=await new AxeBuilder({page}).include('#storybook-root').analyze();
   await page.screenshot({path:join(directory,`${story.id}.png`),animations:'disabled'});
   record.status=errors.length||policy.violations.length||record.axe.violations.length||record.configurationError.some(text=>text.trim())?'needs-review':record.contentReviewBlocked?'manual-content-blocked':'observed';
  }catch(error){record.status='failed';record.error=String(error);}
  record.runtimeErrors=errors;record.requests=policy.requests;record.forbiddenRequests=policy.violations;results.push(record);await writeFile(join(directory,`${story.id}.json`),JSON.stringify(record,null,2)+'\n');await context.close();
  if(results.length%20===0)console.log(`${results.length}/${fullCatalogStoryCases.length} native initial states observed`);
 }
}finally{await browser.close();await server.close();}
await writeFile(join(directory,'report.json'),JSON.stringify({kind:'native-vue-catalog-story-initial-state-audit',functionalEvidence:'Separate315contractsuite',coverageAwarded:false,results},null,2)+'\n');
console.log(JSON.stringify({observed:results.length,failed:results.filter(r=>r.status==='failed').length,runtimeErrors:results.reduce((n,r)=>n+r.runtimeErrors.length,0),forbiddenRequests:results.reduce((n,r)=>n+r.forbiddenRequests.length,0),axeViolations:results.reduce((n,r)=>n+(r.axe?.violations.length??0),0)}));
