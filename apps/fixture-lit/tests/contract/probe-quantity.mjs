import {serveProduction,browserPath} from '../../../../tools/testing/support.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH??=browserPath;
const {chromium}=await import('playwright');
const server=await serveProduction(new URL('../../dist',import.meta.url).pathname,{fixture:true});const browser=await chromium.launch();
try{const page=await browser.newPage();await page.goto(`${server.origin}/fixtures/quantity-toggle?case=outcome-05`);await page.waitForFunction(()=>window.__KRDS_FIXTURE__?.getState());
 const read=()=>page.evaluate(()=>{const host=document.querySelector('krds-quantity-toggle');return {state:window.__KRDS_FIXTURE__.getState(),disabled:host.disabled,fieldsetDisabled:host.formControl.fieldsetDisabled,attribute:host.getAttribute('disabled'),buttons:[...host.shadowRoot.querySelectorAll('button')].map(b=>({disabled:b.disabled,name:b.getAttribute('aria-label')})),form:host.formControl.internals.form?.outerHTML}});
 console.log('initial',JSON.stringify(await read()));await page.evaluate(()=>window.__KRDS_FIXTURE__.setState({disabled:true}));console.log('disabled',JSON.stringify(await read()));await page.evaluate(()=>window.__KRDS_FIXTURE__.setState({disabled:false}));console.log('enabled',JSON.stringify(await read()));await page.waitForTimeout(100);console.log('settled',JSON.stringify(await read()));
}finally{await browser.close();await server.close();}
