import {readFile} from 'node:fs/promises';
import {browserPath} from '../../../tools/testing/support.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH ??= browserPath;
const {chromium}=await import('playwright');
const directory=new URL('../../../.superpowers/sdd/PLAN/t10-lit-logs/visual-inspection/',import.meta.url);
const inventory=JSON.parse(await readFile(new URL('inventory.json',directory),'utf8'));
const browser=await chromium.launch();
try{const page=await browser.newPage({viewport:{width:1900,height:1100}});for(let offset=0;offset<54;offset+=6){let markup='<style>body{margin:0;display:flex;align-items:start;background:#ddd;font:14px sans-serif}figure{margin:0}figcaption{height:26px;padding:4px}img{display:block}</style>';for(const item of inventory.items.slice(offset,offset+6)){const bytes=await readFile(new URL(item.path,directory));markup+=`<figure><figcaption>${item.id}</figcaption><img src="data:image/png;base64,${bytes.toString('base64')}"></figure>`;}await page.setContent(markup);await page.locator('img').evaluateAll(images=>Promise.all(images.map(image=>image.decode())));await page.screenshot({path:new URL(`inspect-${String(offset/6+1).padStart(2,'0')}.png`,directory).pathname,fullPage:true});}}finally{await browser.close();}
