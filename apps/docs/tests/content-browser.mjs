import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';
import { chromium, webkit } from '@playwright/test';
const site=resolve(import.meta.dirname,'..');const evidence=resolve(site,'test-results/content');await mkdir(evidence,{recursive:true});
const server=createServer(async(req,res)=>{try{const path=new URL(req.url,'http://localhost').pathname;if(!path.startsWith('/krds/'))throw Error('base');const file=resolve(site,'dist','.'+path.slice(5));if(!file.startsWith(resolve(site,'dist')+'/'))throw Error('path');res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.txt':'text/plain'})[extname(file)]??'application/octet-stream');res.end(await readFile(file));}catch{res.statusCode=404;res.end();}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin=`http://127.0.0.1:${server.address().port}`;
try{for(const [name,engine]of [['chromium',chromium],['webkit',webkit]]){
 const browser=await engine.launch({headless:true});try{
 const context=await browser.newContext({viewport:{width:320,height:800},reducedMotion:'reduce'});const page=await context.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.message));page.on('console',message=>{if(message.type()==='error'||/hydration/i.test(message.text()))errors.push(message.text());});
 await page.goto(origin+'/krds/components/button.html',{waitUntil:'networkidle'});
 await page.waitForFunction(()=>!document.querySelector('astro-island[ssr]'));
 assert.ok(await page.locator('table [data-krds-component="link"]').count()>10);assert.ok(await page.locator('table code').count()>5);
 const ids=await page.locator('th[id]').evaluateAll(nodes=>nodes.map(n=>n.id));assert.equal(new Set(ids).size,ids.length);
 for(const href of await page.locator('article a[href]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href'))))assert.ok(href.startsWith('/krds/')||/^(https?:|mailto:|tel:|#)/.test(href),href);
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),'narrow table stays in its scroll region');
 // Reference and compiler-source documents can exceed WebKit's full-page bitmap limit.
 await page.locator('article table').first().scrollIntoViewIfNeeded();await page.screenshot({path:resolve(evidence,`${name}-table.png`)});
 await page.goto(origin+'/krds/examples/solid-2.html',{waitUntil:'networkidle'});await page.waitForFunction(()=>!document.querySelector('astro-island[ssr]'));
 assert.match(await page.locator('pre code').first().textContent(),/import/);assert.ok(await page.getByRole('button',{name:'코드 복사',exact:true}).first().isEnabled());
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=document.documentElement.clientWidth+1),'long source stays in pre scroll region');
 await page.locator('pre code').first().scrollIntoViewIfNeeded();await page.screenshot({path:resolve(evidence,`${name}-code.png`)});assert.deepEqual(errors,[]);
 const ssr=await browser.newContext({javaScriptEnabled:false,viewport:{width:320,height:800}});const staticPage=await ssr.newPage();await staticPage.goto(origin+'/krds/components/button.html');assert.ok(await staticPage.locator('article table a[href]').count()>=8);const download=await staticPage.locator('article a[href*="/sources/"]').first().getAttribute('href');assert.equal((await staticPage.request.get(origin+download)).status(),200);
 console.log(`${name}: rich public table/link/code, unique IDs, 320px reflow, hydration and no-JS downloads passed`);await context.close();await ssr.close();
 }finally{await browser.close();}
}}finally{await new Promise(resolve=>server.close(resolve));}
