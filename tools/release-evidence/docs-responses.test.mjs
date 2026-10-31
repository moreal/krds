import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {createRequire} from 'node:module';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {resolve,join} from 'node:path';
import {createHash} from 'node:crypto';
const api=await import('./docs-responses.mjs').catch(()=>({}));
const require=createRequire(resolve(import.meta.dirname,'../../apps/docs/package.json'));
process.env.PLAYWRIGHT_BROWSERS_PATH??='/private/tmp/krds-playwright-1.64.1';
const {chromium,webkit}=require('@playwright/test');
const sha256=body=>createHash('sha256').update(body).digest('hex');

test('R4 records exact bytes delivered for Chromium prefetch and drains a delayed response before browser close',async()=>{
 assert.equal(typeof api.monitorDocsBrowser,'function','actual browser response monitor must be available');
 const root=await mkdtemp('/private/tmp/krds-docs-monitor-');const dist=join(root,'apps/docs/dist');await mkdir(dist,{recursive:true});
 const home=Buffer.from('<!doctype html><title>Local docs</title><link rel="prefetch" href="/krds/prefetched.js"><main>Docs</main>');
 const script=Buffer.from('/* Full prefetched JavaScript bytes must reach the browser unchanged. */\n'.repeat(500));
 await writeFile(join(dist,'index.html'),home);await writeFile(join(dist,'prefetched.js'),script);await writeFile(join(dist,'delayed.txt'),'actual delayed bytes');
 let delayedStarted,releaseDelayed;const requested=new Promise(resolve=>{delayedStarted=resolve;}),delayed=new Promise(resolve=>{releaseDelayed=resolve;});
 const server=createServer((request,response)=>{
  request.url=request.url.replace(/^\/krds/, '');
  response.setHeader('Content-Type',request.url.endsWith('.js')?'text/javascript':'text/html');
  if(request.url==='/delayed.txt'){delayedStarted();void delayed.then(()=>response.end('actual delayed bytes'));return;}
  if(request.url==='/'){response.end(home);return;}if(request.url==='/prefetched.js'){response.end(script);return;}
  response.statusCode=404;response.end('missing');
 });await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin=`http://127.0.0.1:${server.address().port}`;
 let browser;try{
  browser=await chromium.launch({headless:true});const monitor=api.monitorDocsBrowser(browser,{root,dist,name:'chromium',base:'/krds/'});const context=await browser.newContext();
  const blocked=[];await context.route('**/*',route=>{if(new URL(route.request().url()).hostname!=='127.0.0.1'){blocked.push(route.request().url());return route.abort();}return route.continue();});
  const page=await context.newPage();await page.goto(`${origin}/krds/`,{waitUntil:'networkidle'});await monitor.drain();
  const prefetched=monitor.responses.find(row=>row.url===`${origin}/krds/prefetched.js`);assert.ok(prefetched,'real Chromium prefetch must be captured');assert.equal(prefetched.bytes,script.length);assert.equal(prefetched.sha256,sha256(script));assert.equal(prefetched.status,200);assert.equal(prefetched.responseUrl,`${origin}/krds/prefetched.js`);assert.equal(prefetched.headers['content-type'],'text/javascript');assert.equal(prefetched.delivery,'route.fulfill');
  await page.evaluate(()=>fetch('https://example.invalid/blocked').catch(()=>{}));
  await page.evaluate(()=>{void fetch('/krds/delayed.txt');});await requested;const closing=browser.close();await new Promise(resolve=>setImmediate(resolve));releaseDelayed();await closing;browser=null;
  assert.deepEqual(monitor.failures,[]);assert.ok(monitor.responses.some(row=>row.url===`${origin}/krds/delayed.txt`&&row.bytes===20));assert.deepEqual(blocked,['https://example.invalid/blocked']);
 }finally{releaseDelayed();await browser?.close();await new Promise(resolve=>server.close(resolve));await rm(root,{recursive:true,force:true});}
});

test('R4 WebKit delivered-body validation rejects a same-path server substitution',async()=>{
 assert.equal(typeof api.monitorDocsBrowser,'function','actual browser response monitor must be available');
 const root=await mkdtemp('/private/tmp/krds-docs-monitor-negative-'),dist=join(root,'apps/docs/dist');await mkdir(dist,{recursive:true});await writeFile(join(dist,'index.html'),'expected current built documentation');
 const server=createServer((request,response)=>{response.setHeader('Content-Type','text/html');response.end('different served documentation');});await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 let browser;try{browser=await webkit.launch({headless:true});const monitor=api.monitorDocsBrowser(browser,{root,dist,name:'webkit'});const context=await browser.newContext();await context.route('**/*',route=>route.continue());const page=await context.newPage();await page.goto(`http://127.0.0.1:${server.address().port}`,{waitUntil:'networkidle'});await browser.close();browser=null;assert.ok(monitor.failures.some(message=>message.includes('different documentation bytes')));assert.equal(monitor.responses.length,0);}
 finally{await browser?.close();await new Promise(resolve=>server.close(resolve));await rm(root,{recursive:true,force:true});}
});
