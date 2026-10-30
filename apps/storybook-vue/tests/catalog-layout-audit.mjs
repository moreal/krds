import {mkdir,writeFile,readFile} from 'node:fs/promises';
import {join} from 'node:path';
import {chromium} from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import {fullCatalogStoryCases} from '@unofficial-krds/test-contracts';
import {serveProduction,browserPath} from '../../../tools/testing/support.mjs';
import {guardStoryNetwork} from '../../../tools/testing/network.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH??=browserPath;
const directory=join(process.cwd(),'../../.superpowers/sdd/PLAN/t10-vue-logs/layout-audit');await mkdir(directory,{recursive:true});
const representatives=[...new Map(fullCatalogStoryCases.map(item=>[item.componentId,item])).values()];
const index=JSON.parse(await readFile('dist/index.json','utf8')).entries;
for(const id of ['button','native-select','modal','tabs','calendar','date-input']){const entry=Object.values(index).find(item=>item.type==='story'&&item.title===`KRDS/${({'button':'Button','native-select':'Native Select','modal':'Modal','tabs':'Tabs','calendar':'Calendar','date-input':'Date Input'})[id]}`);if(!entry)throw new Error(`No pilot story ${id}`);representatives.push({id:entry.id,componentId:id});}
const server=await serveProduction(join(process.cwd(),'dist')),browser=await chromium.launch(),results=[];
try{for(const story of representatives)for(const variant of ['narrow-text200','forced-colors']){
 const context=await browser.newContext({viewport:{width:360,height:800},locale:'ko-KR',reducedMotion:'reduce',forcedColors:variant==='forced-colors'?'active':'none',serviceWorkers:'block'});
 const policy=await guardStoryNetwork(context,server.origin,server.assets),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(String(e)));
 const record={componentId:story.componentId,storyId:story.id,variant,coverageAwarded:false,actualBrowserZoomVerified:false};
 try{
  await page.goto(`${server.origin}/iframe.html?id=${story.id}&viewMode=story`,{waitUntil:'networkidle'});await page.evaluate(()=>document.fonts.ready);
  if(variant==='narrow-text200')await page.evaluate(()=>{document.documentElement.style.fontSize=`${parseFloat(getComputedStyle(document.documentElement).fontSize)*2}px`;});
  const native=page.locator(`[data-krds-component="${story.componentId}"][data-krds-part="root"]`).first();
  const action=native.locator('button:not(:disabled),a[href],input:not(:disabled),textarea:not(:disabled),select:not(:disabled),[tabindex="0"]').filter({visible:true}).first();
  if(await action.count())await action.focus();
  record.geometry=await page.evaluate(component=>{const root=document.querySelector(`[data-krds-component="${component}"][data-krds-part="root"]`),active=document.activeElement,style=active?getComputedStyle(active):null;return{viewport:innerWidth,pageWidth:document.documentElement.scrollWidth,root:root?.getBoundingClientRect().toJSON(),active:active?.outerHTML,focusRect:active?.getBoundingClientRect().toJSON(),focusOutline:style?{style:style.outlineStyle,width:style.outlineWidth,offset:style.outlineOffset}:null,fontSize:getComputedStyle(document.documentElement).fontSize,scrollRegions:[...document.querySelectorAll('[data-krds-part="scroll-region"]')].map(node=>({clientWidth:node.clientWidth,scrollWidth:node.scrollWidth,tabIndex:node.tabIndex}))};},story.componentId);
  record.snapshot=await page.locator('#storybook-root').ariaSnapshot();record.axe=await new AxeBuilder({page}).include('#storybook-root').analyze();await page.screenshot({path:join(directory,`${story.componentId}-${variant}.png`),fullPage:true,animations:'disabled'});record.status='observed';
 }catch(error){record.status='failed';record.error=String(error);}
 record.runtimeErrors=errors;record.forbiddenRequests=policy.violations;results.push(record);await context.close();
 if(results.length%18===0)console.log(`${results.length}/108 layout states observed`);
}}finally{await browser.close();await server.close();}
await writeFile(join(directory,'report.json'),JSON.stringify({kind:'native-vue-narrow-text-size-forced-colors-inspection',limitations:['CSS text sizing is not actual browser zoom','Assistive technology and virtual keyboard remain manual'],coverageAwarded:false,results},null,2));
console.log(JSON.stringify({states:results.length,failed:results.filter(r=>r.status==='failed').length,axeViolations:results.reduce((n,r)=>n+(r.axe?.violations.length??0),0),pageOverflow:results.filter(r=>r.geometry?.pageWidth>360).map(r=>({component:r.componentId,variant:r.variant,width:r.geometry.pageWidth})),runtimeErrors:results.reduce((n,r)=>n+r.runtimeErrors.length,0),forbiddenRequests:results.reduce((n,r)=>n+r.forbiddenRequests.length,0)},null,2));
