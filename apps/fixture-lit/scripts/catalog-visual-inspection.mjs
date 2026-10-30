import {mkdir,writeFile} from 'node:fs/promises';
import {browserPath,serveProduction} from '../../../tools/testing/support.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH ??= browserPath;
const {chromium}=await import('playwright');
const directory=new URL('../../../.superpowers/sdd/PLAN/t10-lit-logs/visual-inspection/',import.meta.url);
await mkdir(directory,{recursive:true});
const server=await serveProduction(new URL('../dist/',import.meta.url).pathname);
const browser=await chromium.launch();
const inventory=[];
try {
 const page=await browser.newPage({viewport:{width:320,height:900},reducedMotion:'reduce'});
 await page.goto(`${server.origin}/gallery.html`);
 await page.waitForFunction(()=>document.querySelectorAll('#gallery > section').length===54);
 const ids=await page.locator('#gallery > section').evaluateAll(nodes=>nodes.map(node=>node.dataset.component));
 for(const id of ids){
  await page.evaluate(id=>{for(const card of document.querySelectorAll('#gallery > section'))card.style.display=card.dataset.component===id?'':'none';},id);
  const card=page.locator(`#gallery > section[data-component="${id}"]`);
  await card.screenshot({path:new URL(`${id}.png`,directory).pathname,animations:'disabled'});
  inventory.push({id,mode:'320px native viewport; other gallery specimens hidden only for isolated screenshot',path:`${id}.png`,bounds:await card.boundingBox()});
 }
 await writeFile(new URL('inventory.json',directory),JSON.stringify({snapshot:server.snapshot,items:inventory},null,2));
}finally{await browser.close();await server.close();}
