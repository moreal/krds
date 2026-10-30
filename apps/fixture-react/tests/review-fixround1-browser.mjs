import {chromium} from 'playwright';
import {strict as assert} from 'node:assert';
import {mkdir,writeFile} from 'node:fs/promises';
import {join} from 'node:path';
import AxeBuilder from '@axe-core/playwright';
import {root,serveProduction} from '../../../tools/testing/support.mjs';
const output=join(root,'.superpowers/sdd/PLAN/t10-react-logs/fixround1/production-probes');await mkdir(output,{recursive:true});
const server=await serveProduction(join(root,'apps/fixture-react/dist'),{fixture:true});const browser=await chromium.launch();
try{
 const context=await browser.newContext({viewport:{width:390,height:844},locale:'ko-KR'});const page=await context.newPage();
 await page.goto(server.origin+'/fixtures/main-menu?case=outcome-03');await page.waitForFunction(()=>window.__KRDS_FIXTURE__);
 await page.evaluate(()=>window.__KRDS_FIXTURE__.setState({items:[{id:'a',label:'상위 분류',children:[{id:'b',label:'하위 분류',children:[{id:'leaf',label:'깊은 목적지',href:'/local/deep'}]}]}],expandedId:'b',mobileOpen:true,query:''}));
 await page.getByRole('link',{name:'깊은 목적지',exact:true}).waitFor();await page.getByRole('button',{name:'이전 메뉴',exact:true}).click();
 assert.equal(await page.getByRole('button',{name:'상위 분류',exact:true}).getAttribute('aria-expanded'),'true');assert.equal(await page.getByRole('button',{name:'하위 분류',exact:true}).getAttribute('aria-expanded'),'false');assert.equal(await page.getByRole('button',{name:'하위 분류',exact:true}).evaluate(node=>node===document.activeElement),true);
 await page.getByRole('button',{name:'이전 메뉴',exact:true}).click();assert.equal(await page.getByRole('button',{name:'상위 분류',exact:true}).getAttribute('aria-expanded'),'false');assert.equal(await page.getByRole('button',{name:'상위 분류',exact:true}).evaluate(node=>node===document.activeElement),true);
 const menu=await page.evaluate(()=>({state:window.__KRDS_FIXTURE__.getState(),events:window.__KRDS_FIXTURE__.readEvents(),active:document.activeElement?.textContent}));assert.deepEqual(menu.events.filter(event=>event.name==='expandedChange').map(event=>event.detail.id),['a',null]);await page.screenshot({path:join(output,'mobile-main-menu-back.png')});const menuAxe=await new AxeBuilder({page}).analyze();await writeFile(join(output,'mobile-main-menu.raw-axe.json'),JSON.stringify(menuAxe,null,2));
 await page.setViewportSize({width:1280,height:800});await page.goto(server.origin+'/fixtures/range-slider?case=outcome-09');await page.waitForFunction(()=>window.__KRDS_FIXTURE__);
 await page.evaluate(()=>window.__KRDS_FIXTURE__.setState({min:0,max:0.3,step:0.1,value:0.2,__host:{acceptChanges:true}}));const range=page.getByRole('slider');await range.focus();await page.keyboard.press('End');await page.waitForFunction(()=>document.querySelector('input[type="range"]').value==='0.3');const numeric=await range.evaluate(node=>({value:node.value,stepMismatch:node.validity.stepMismatch,formData:node.form?Object.fromEntries(new FormData(node.form)):null,focused:document.activeElement===node}));assert.equal(numeric.stepMismatch,false);assert.equal(numeric.focused,true);assert.ok(Object.values(numeric.formData).includes('0.3'));const numericEvents=await page.evaluate(()=>window.__KRDS_FIXTURE__.readEvents());assert.deepEqual(numericEvents.filter(event=>event.name==='valueChange').map(event=>event.detail.value),[0.3]);await page.screenshot({path:join(output,'fractional-native-End.png')});await writeFile(join(output,'results.json'),JSON.stringify({menu,numeric,numericEvents,menuAxeViolations:menuAxe.violations,coverageAwarded:false},null,2));console.log(JSON.stringify({mobileBack:'passed',fractionalTrustedEnd:'passed',menuAxeViolations:menuAxe.violations.length}));await context.close();
}finally{await browser.close();await server.close();}
