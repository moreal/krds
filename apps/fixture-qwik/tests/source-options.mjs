import assert from 'node:assert/strict';
import {chromium} from 'playwright';
import {expect} from '@playwright/test';
import {startProductionSsr} from '../server.mjs';
const server=await startProductionSsr(),browser=await chromium.launch(),page=await browser.newPage(),results=[];
try{await page.goto(server.origin+'/source-contracts.html?case=options');for(const [id,check]of Object.entries({
 'text-status-size':async()=>{await expect(page.getByRole('textbox',{name:'입력',exact:true})).toHaveAttribute('aria-invalid','true');await expect(page.locator('[data-krds-component="text-input"][data-krds-part="root"]')).toHaveAttribute('data-krds-size','large');},
 'textarea-default':async()=>await expect(page.getByRole('textbox',{name:'본문',exact:true})).toHaveAttribute('rows','5'),
 'link-underline':async()=>{assert.equal(await page.getByRole('link',{name:'밑줄 없음'}).evaluate(e=>getComputedStyle(e).textDecorationLine),'none');for(const name of ['기본 밑줄','명시적 밑줄'])assert.equal(await page.getByRole('link',{name}).evaluate(e=>getComputedStyle(e).textDecorationLine),'underline');assert.notEqual(await page.locator('[data-krds-component=link][aria-disabled=true]').evaluate(e=>getComputedStyle(e).textDecorationLine),'line-through');},
 'header-default':async()=>await expect(page.locator('header')).toHaveAttribute('data-krds-action-layout','horizontal'),
 'footer-target-rel':async()=>{for(const name of ['개인정보','정책']){const link=page.getByRole('link',{name:name+' (새 창)',exact:true});await expect(link).toHaveAttribute('target','_blank');assert.match(await link.getAttribute('rel'),/noopener/);}},
 'resize-default':async()=>{await page.getByRole('button',{name:/화면 크기/}).click();assert.deepEqual(await page.locator('[data-krds-component="resize"][data-krds-part="option"]').allTextContents(),['90%','100%','110%','130%','150%']);},
 'tts-label-icon':async()=>{const button=page.getByRole('button',{name:'문서 읽기 재생',exact:true});await expect(button).toBeVisible();assert.equal(await button.innerText(),'▶');await expect(button.locator('span[aria-hidden="true"]')).toHaveCount(1);},
 'range-field-options':async()=>{const range=page.getByRole('slider',{name:'범위',exact:true});await expect(range).toHaveAttribute('required','');await expect(range).toHaveAttribute('aria-invalid','true');await expect(range).toHaveAttribute('aria-describedby','field-help field-error');},
 'quantity-field-options':async()=>{const group=page.getByRole('group',{name:'수량',exact:true});await expect(group).toHaveAttribute('id','optional-quantity');await expect(group).toHaveAttribute('aria-invalid','true');await expect(group).toHaveAttribute('aria-describedby','field-help field-error optional-quantity-required');await expect(page.locator('#optional-quantity-required')).toHaveText('필수 항목');assert.equal(await group.getAttribute('aria-required'),null);},
 'fab-native-icon':async()=>{const icon=page.locator('[data-krds-component="fab"][data-krds-part="icon"]');assert.equal(await icon.innerText(),'');assert.equal(await icon.locator('svg').count(),1);}
})){try{await check();results.push({id,status:'passed'});}catch(error){results.push({id,status:'failed',error:String(error)});}}}finally{await browser.close();await server.close();}console.log(JSON.stringify(results,null,2));if(results.some(r=>r.status!=='passed'))process.exitCode=1;
