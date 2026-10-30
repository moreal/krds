import {chromium,expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {mkdir,writeFile} from 'node:fs/promises';
import {serveProduction,browserPath} from '../../../tools/testing/support.mjs';
import {guardStoryNetwork} from '../../../tools/testing/network.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH??=browserPath;
const dir='../../.superpowers/sdd/PLAN/t10-vue-logs/interaction-inspection';
await mkdir(dir,{recursive:true});
const server=await serveProduction(new URL('../dist',import.meta.url).pathname),browser=await chromium.launch(),results=[];
async function inspect(id,width,action){
 const context=await browser.newContext({viewport:{width,height:800},locale:'ko-KR',reducedMotion:'reduce'}),page=await context.newPage(),errors=[];
 const policy=await guardStoryNetwork(context,server.origin,server.assets);page.on('pageerror',e=>errors.push(String(e)));
 const captures=[];
 async function capture(name){
  const axe=await new AxeBuilder({page}).analyze();
  const geometry=await page.evaluate(()=>({width:innerWidth,pageWidth:document.documentElement.scrollWidth,active:document.activeElement?.outerHTML,popups:[...document.querySelectorAll('[data-krds-part=popup],[data-krds-part=popover],[role=dialog]')].filter(node=>node.getClientRects().length).map(node=>({tag:node.tagName,part:node.getAttribute('data-krds-part'),rect:node.getBoundingClientRect().toJSON(),placement:node.getAttribute('data-krds-placement')}))}));
  await page.screenshot({path:`${dir}/${name}.png`,fullPage:true});captures.push({name,axe,geometry,snapshot:await page.locator('body').ariaSnapshot()});
  expect(axe.violations).toEqual([]);expect(geometry.pageWidth).toBeLessThanOrEqual(width);
 }
 const record={id,width,captures,coverageAwarded:false};
 try{await page.goto(`${server.origin}/iframe.html?id=${id}&viewMode=story`,{waitUntil:'networkidle'});await action(page,capture);record.status='passed';}
 catch(error){record.status='failed';record.error=String(error);process.exitCode=1;await page.screenshot({path:`${dir}/${id}-failure.png`,fullPage:true});}
 record.errors=errors;record.forbiddenRequests=policy.violations;results.push(record);await context.close();
}
try{
 await inspect('krds-tooltip--hover-escape-return',1280,async(page,capture)=>{
  const trigger=page.getByRole('button',{name:'신청 도움말',exact:true});await trigger.hover();await expect(page.getByRole('tooltip')).toBeVisible();await capture('tooltip-hover-open');await page.keyboard.press('Escape');await expect(trigger).toBeFocused();await expect(page.getByRole('tooltip')).toHaveCount(0);await capture('tooltip-escaped-focus');
 });
 await inspect('krds-contextual-help--narrow-edge',360,async(page,capture)=>{
  await page.locator('[data-krds-component=contextual-help][data-krds-part=root]').evaluate(node=>Object.assign(node.style,{position:'fixed',right:'8px',bottom:'8px'}));
  await page.getByRole('button',{name:'신청 자격 도움말',exact:true}).click();const popup=page.locator('[data-krds-component=contextual-help][data-krds-part=popover]');await expect(popup).toBeVisible();await expect.poll(async()=>{const b=await popup.boundingBox();return b.x>=0&&b.x+b.width<=360&&b.y>=0&&b.y+b.height<=800;}).toBe(true);await capture('contextual-bottom-right-open');await page.keyboard.press('Escape');await expect(page.getByRole('button',{name:'신청 자격 도움말',exact:true})).toBeFocused();await capture('contextual-escaped-focus');
 });
 await inspect('krds-main-menu--mobile-drilldown',360,async(page,capture)=>{
  const opener=page.getByRole('button',{name:'전체 메뉴',exact:true});await opener.click();const dialog=page.getByRole('dialog',{name:'전체 메뉴',exact:true});await expect(dialog).toBeVisible();
  for(const key of ['root','branch','apply'])await dialog.locator(`[data-krds-part=trigger][id$="-${key}"]`).click();
  await expect(dialog.getByRole('link',{name:'신규 신청',exact:true})).toHaveAttribute('aria-current','page');await capture('mobile-deep-current');await dialog.locator('[data-krds-component=modal][data-krds-part=close]').click();await expect(opener).toBeFocused();await capture('mobile-modal-return');
 });
 await inspect('krds-carousel--multiple',1280,async(page,capture)=>{
  const visible=page.locator('[data-krds-component=carousel][data-krds-part=slide]:visible');await expect(visible).toHaveCount(2);await capture('carousel-multiple-two-whole');await page.getByRole('button',{name:'다음 슬라이드',exact:true}).click();await expect(visible).toHaveCount(2);await capture('carousel-multiple-next');
 });
}finally{await browser.close();await server.close();await writeFile(`${dir}/report.json`,JSON.stringify({results,manualLimits:['Actual device touch, browser zoom and assistive technology require separate review.'],coverageAwarded:false},null,2));}
console.log(JSON.stringify(results.map(({id,status,error,errors,forbiddenRequests})=>({id,status,error,errors,forbiddenRequests})),null,2));
