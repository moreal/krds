import assert from 'node:assert/strict';
import { writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';
import { serveProduction, root } from '../../../tools/testing/support.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH='/private/tmp/krds-playwright-1.64.1';
const server=await serveProduction(join(root,'apps/fixture-vue/dist'),{fixture:true});const browser=await chromium.launch();const results=[];
try {
 const page=await browser.newPage();
 await page.goto(server.origin+'/fixtures/button?case=disabled');await page.evaluate(()=>window.__KRDS_FIXTURE__.setState({disabled:false}));
 const button=page.getByRole('button',{name:'저장',exact:true});await button.click();await button.focus();await page.keyboard.press('Enter');await page.keyboard.press('Space');assert.equal((await page.evaluate(()=>window.__KRDS_FIXTURE__.readEvents())).length,3);
 await page.evaluate(()=>window.__KRDS_FIXTURE__.setState({disabled:true}));const box=await button.boundingBox();await page.mouse.click(box.x+box.width/2,box.y+box.height/2);assert.equal((await page.evaluate(()=>window.__KRDS_FIXTURE__.readEvents())).length,3);results.push({case:'native button pointer Enter Space and disabled',passed:true,events:3});
 await page.goto(server.origin+'/fixtures/tabs?case=manual-activation');const first=page.getByRole('tab',{name:'첫 번째',exact:true}),second=page.getByRole('tab',{name:'두 번째',exact:true});await first.focus();await page.keyboard.press('Tab');assert.equal(await second.evaluate(el=>el===document.activeElement),true);assert.equal(await first.getAttribute('aria-selected'),'true');await page.keyboard.press('Enter');assert.equal(await second.getAttribute('aria-selected'),'true');results.push({case:'real sequential Tab then Enter selection',passed:true});
 await page.goto(server.origin+'/fixtures/calendar?case=selection-confirm');const dates=page.locator('tbody button');await dates.first().focus();let sequential=true;for(let index=1;index<42;index++){await page.keyboard.press('Tab');sequential &&= await dates.nth(index).evaluate(el=>el===document.activeElement);}assert.equal(sequential,true);assert.deepEqual(await page.evaluate(()=>window.__KRDS_FIXTURE__.readEvents()),[]);results.push({case:'all 42 native date buttons reached sequentially without value events',passed:true});
 await page.goto(server.origin+'/fixtures/date-input?case=timezone-invariance');await page.evaluate(()=>window.__KRDS_FIXTURE__.setState({value:'2024-02-29'}));const field=page.getByRole('textbox',{name:'날짜',exact:true});const trigger=page.getByRole('button',{name:'달력 열기',exact:true});await trigger.click();const selected=page.getByRole('button',{name:'2024년 2월 29일 목요일, 선택됨',exact:true});await selected.waitFor();assert.equal(await selected.evaluate(el=>el===document.activeElement),true);await page.getByRole('button',{name:'확인',exact:true}).click();assert.equal(await trigger.evaluate(el=>el===document.activeElement),true);assert.deepEqual(await page.evaluate(()=>window.__KRDS_FIXTURE__.readEvents()),[]);
 await page.evaluate(()=>window.__KRDS_FIXTURE__.setState({reject:true}));await field.fill('2024-03-01');await field.press('Enter');await page.waitForFunction(()=>document.querySelector('input[type="text"]').value==='2024-02-29');assert.deepEqual(await page.evaluate(()=>window.__KRDS_FIXTURE__.readEvents()),[{name:'valueChange',detail:{value:'2024-03-01'}}]);results.push({case:'popup selected-date focus same Confirm and rejected controlled Enter',passed:true});
 await page.close();
} finally {await browser.close();await server.close();await writeFile(join(root,'.superpowers/sdd/PLAN/t07-vue-logs/production-behavior.json'),JSON.stringify(results,null,2));}
console.log(JSON.stringify(results,null,2));
