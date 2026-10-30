import { mkdir, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { serveProduction, root } from '../../../tools/testing/support.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH='/private/tmp/krds-playwright-1.64.1';
const directory=join(root,'.superpowers/sdd/PLAN/t07-vue-logs/visual');await mkdir(directory,{recursive:true});
const server=await serveProduction(join(root,'apps/fixture-vue/dist'),{fixture:true});const browser=await chromium.launch();const results=[];
try {
 for(const variant of ['normal','narrow','zoom200','text200','forced-colors']) {
  const context=await browser.newContext({viewport:variant==='narrow'?{width:320,height:800}:{width:1280,height:900},locale:'ko-KR',timezoneId:'Asia/Seoul',reducedMotion:'reduce',forcedColors:variant==='forced-colors'?'active':'none'});
  const page=await context.newPage();const errors=[];const requests=[];page.on('pageerror',error=>errors.push(String(error)));page.on('request',request=>{if(!request.url().startsWith(server.origin))requests.push(request.url());});
  await page.goto(server.origin+'/fixtures/__visual?case=matrix');await page.getByRole('heading',{name:'Vue 네이티브 파일럿'}).waitFor();await page.evaluate(()=>document.fonts.ready);
  if(variant==='text200')await page.evaluate(()=>{document.documentElement.style.fontSize='200%';});
  if(variant==='zoom200')await page.evaluate(()=>{document.documentElement.style.zoom='2';});
  const focus=page.getByRole('button',{name:'medium',exact:true});await focus.focus();
  await page.screenshot({path:join(directory,variant+'.png'),fullPage:true,animations:'disabled'});
  if(variant==='normal') {
    for(const [name,locator] of [
      ['select',page.getByRole('combobox',{name:'지역',exact:true})],
      ['date-input',page.getByRole('textbox',{name:'방문일',exact:true})],
      ['tabs',page.getByRole('tab',{name:'첫 번째',exact:true})],
      ['calendar',page.locator('[data-krds-component="calendar"][data-krds-part="day"][data-date="2024-02-15"]')]
    ]) { await locator.focus(); await page.screenshot({path:join(directory,`focused-${name}.png`),fullPage:true,animations:'disabled'}); }
    await focus.focus();
  }
  const geometry=await page.evaluate(()=>({viewport:innerWidth,page:document.documentElement.scrollWidth,focused:document.activeElement?.textContent,focusOutline:getComputedStyle(document.activeElement).outlineStyle,tableScroll:Array.from(document.querySelectorAll('[data-krds-internal="table-scroll"]')).map(el=>({client:el.clientWidth,scroll:el.scrollWidth}))}));
  const axe=await new AxeBuilder({page}).analyze();
  await page.getByRole('button',{name:'모달 열기',exact:true}).click();await page.getByRole('dialog',{name:'신청 확인'}).waitFor();await page.screenshot({path:join(directory,variant+'-modal.png'),fullPage:true,animations:'disabled'});const modalAxe=await new AxeBuilder({page}).analyze();
  results.push({variant,geometry,axe:axe.violations,modalAxe:modalAxe.violations,errors,externalRequests:requests});await context.close();
 }
} finally {await browser.close();await server.close();await writeFile(join(directory,'raw-results.json'),JSON.stringify(results,null,2));}
console.log(JSON.stringify(results.map(r=>({variant:r.variant,geometry:r.geometry,axe:r.axe.map(x=>x.id),modalAxe:r.modalAxe.map(x=>x.id),errors:r.errors,externalRequests:r.externalRequests})),null,2));
if(results.some(r=>r.axe.length||r.modalAxe.length||r.errors.length||r.externalRequests.length))process.exitCode=1;
