import {chromium} from 'playwright';
import {serveProduction,root} from '../../../tools/testing/support.mjs';
const server=await serveProduction(root+'/apps/fixture-react/dist',{fixture:true});
const browser=await chromium.launch();
const context=await browser.newContext({viewport:{width:1280,height:800},locale:'ko-KR'});
const page=await context.newPage();page.on('pageerror',e=>console.log('PAGE ERROR',String(e)));
const state=()=>page.evaluate(()=>({state:window.__KRDS_FIXTURE__.getState(),events:window.__KRDS_FIXTURE__.readEvents()}));
try{
 await page.goto(server.origin+'/fixtures/language-switcher?case=outcome-01');await page.waitForFunction(()=>window.__KRDS_FIXTURE__);
 console.log('LANG BEFORE',await state());await page.getByRole('link',{name:'English',exact:true}).click({timeout:3000});console.log('LANG AFTER',await state(),await page.locator('html').getAttribute('lang'));
 await page.goto(server.origin+'/fixtures/radio-group?case=outcome-09');await page.waitForFunction(()=>window.__KRDS_FIXTURE__);await page.getByRole('radio',{name:'부산',exact:true}).click();await page.evaluate(()=>window.__KRDS_FIXTURE__.setState({value:null}));
 console.log('RADIO CLEARED',await page.locator('input[type=radio]').evaluateAll(ns=>ns.map(n=>({value:n.value,checked:n.checked,default:n.defaultChecked}))));
 await page.getByRole('button',{name:'초기화',exact:true}).click();console.log('RADIO RESET',await page.locator('input[type=radio]').evaluateAll(ns=>ns.map(n=>({value:n.value,checked:n.checked,default:n.defaultChecked}))),await state());
 await page.goto(server.origin+'/fixtures/checkbox?case=outcome-09');await page.waitForFunction(()=>window.__KRDS_FIXTURE__);await page.getByRole('checkbox',{name:'이용약관 동의',exact:true}).click();console.log('CHECK BEFORE',await page.locator('input[type=checkbox]').evaluate(n=>({checked:n.checked,indeterminate:n.indeterminate})));await page.getByRole('button',{name:'초기화',exact:true}).click();console.log('CHECK AFTER',await page.locator('input[type=checkbox]').evaluate(n=>({checked:n.checked,indeterminate:n.indeterminate})),await state());
await page.goto(server.origin+'/fixtures/critical-alert?case=outcome-04');await page.waitForFunction(()=>window.__KRDS_FIXTURE__);console.log('CRITICAL PARENT',await page.locator('[data-krds-component="critical-alert"][data-krds-part="root"]').evaluate(n=>({parent:n.parentElement.outerHTML,nearest:n.closest('main')?.outerHTML})));
}finally{await browser.close();await server.close();}
