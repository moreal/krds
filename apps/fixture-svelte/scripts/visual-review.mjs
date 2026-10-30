import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { serveProduction, browserPath } from '../../../tools/testing/support.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH ??= browserPath;
const directory=fileURLToPath(new URL('../../../.superpowers/sdd/PLAN/t07-svelte-logs/visual/',import.meta.url));
await mkdir(directory,{recursive:true});
const server=await serveProduction(fileURLToPath(new URL('../../storybook-svelte/dist/',import.meta.url)));
const browser=await chromium.launch();
const observations=[];
try {
 for(const [name,id,width,zoom,forced] of [
  ['disabled','krds-button--disabled',1280,1,false],
  ['sizes','krds-button--sizes',1280,1,false],
  ['focus','krds-native-select--controlled',1280,1,false],
  ['invalid','krds-date-input--invalid',1280,1,false],
  ['modal','krds-modal--open',1280,1,false],
  ['tabs-focus','krds-tabs--manual',1280,1,false],
  ['calendar','krds-calendar--selected-range',1280,1,false],
  ['calendar-narrow','krds-calendar--selected-range',320,1,false],
  ['calendar-narrow-focus-right','krds-calendar--selected-range',320,1,false],
  ['calendar-200','krds-calendar--selected-range',640,2,false],
  ['calendar-forced','krds-calendar--selected-range',640,1,true],
  ['invalid-narrow-200','krds-date-input--invalid',640,2,false],
 ]){
  const context=await browser.newContext({viewport:{width,height:900},locale:'ko-KR',reducedMotion:'reduce',forcedColors:forced?'active':'none'});
  const page=await context.newPage();
  await page.goto(`${server.origin}/iframe.html?id=${id}&viewMode=story`,{waitUntil:'networkidle'});
  if(zoom!==1)await page.evaluate(zoom=>{document.documentElement.style.zoom=String(zoom);},zoom);
  if(name==='focus')await page.getByRole('combobox',{name:'지역'}).focus();
  if(name==='calendar-narrow-focus-right')await page.locator('[data-date="2024-02-17"]').focus();
  if(name==='calendar-forced')await page.locator('[data-date="2024-02-15"]').focus();
  if(name==='tabs-focus')await page.getByRole('tab',{name:'두 번째'}).focus();
  await page.screenshot({path:`${directory}/${name}.png`,fullPage:true});
  const tableScroll=await page.locator('[data-krds-internal="table-scroll"]').evaluateAll(elements=>elements.map(element=>({scrollLeft:element.scrollLeft,scrollWidth:element.scrollWidth,clientWidth:element.clientWidth})));
  observations.push({name,id,width,zoom,forced,tableScroll,bodyWidth:await page.evaluate(()=>document.body.scrollWidth),viewportWidth:await page.evaluate(()=>innerWidth),focus:await page.evaluate(()=>document.activeElement?.outerHTML.slice(0,300))});
  await context.close();
 }
 await writeFile(`${directory}/observations.json`,JSON.stringify(observations,null,2)+'\n');
}finally{await browser.close();await server.close();}
