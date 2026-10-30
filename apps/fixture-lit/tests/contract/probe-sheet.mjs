import {serveProduction,browserPath} from '../../../../tools/testing/support.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH??=browserPath;
const {chromium}=await import('playwright');
const server=await serveProduction(new URL('../../dist',import.meta.url).pathname,{fixture:true});const browser=await chromium.launch();
try{const page=await browser.newPage();await page.goto(`${server.origin}/fixtures/bottom-sheet?case=outcome-02`);await page.waitForFunction(()=>window.__KRDS_FIXTURE__?.getState());
 await page.evaluate(()=>window.__KRDS_FIXTURE__.setState({__health:'ok'})); console.log('dialog',JSON.stringify(await page.getByRole('dialog').evaluate(node=>({labelledby:node.getAttribute('aria-labelledby'),title:node.getRootNode().getElementById('title')?.textContent,description:node.getAttribute('aria-describedby'),role:node.getAttribute('role'),html:node.outerHTML.slice(0,500)}))));console.log(await page.getByRole('dialog').ariaSnapshot());

}finally{await browser.close();await server.close();}
