import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,writeFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {browserPath,serveProduction} from '../testing/support.mjs';
import {guardStoryNetwork} from '../testing/network.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH??=browserPath;
test('production request guard blocks negative fixture transports before external sending and rejects visible success',async()=>{
  const {chromium}=await import('playwright');
  const directory=await mkdtemp(join(tmpdir(),'krds-negative-story-'));
  await writeFile(join(directory,'index.html'),'<!doctype html><html lang="ko"><title>Negative fixture</title><body><main>Visible fixture</main></body></html>');
  const server=await serveProduction(directory);const browser=await chromium.launch();
  const context=await browser.newContext({serviceWorkers:'block'});const network=await guardStoryNetwork(context,server.origin,server.assets);
  const page=await context.newPage();const completed=[];page.on('requestfinished',request=>completed.push(request.url()));
  try {
    await page.goto(server.origin);assert.equal(await page.getByRole('main').textContent(),'Visible fixture');network.assertClean();
    const settled=await page.evaluate(async()=>{
      for(const create of [()=>new WebSocket('wss://example.invalid/socket'),()=>new EventSource('/events')])try{create();}catch{}
      try{await navigator.serviceWorker.register('/worker.js');}catch{}
      return Promise.allSettled([fetch('https://example.invalid/api'),fetch('/api/state'),fetch('/index.html')]);
    });
    assert.equal(settled[0].status,'rejected');assert.equal(settled[1].status,'rejected');assert.equal(settled[2].status,'fulfilled');
    assert.equal(await page.getByRole('main').isVisible(),true);
    assert.deepEqual(new Set(network.violations.map(item=>item.kind)),new Set(['websocket','eventsource','serviceworker','fetch']));
    assert.equal(network.violations.length,5);
    assert.equal(completed.some(url=>url.includes('example.invalid')||url.endsWith('/api/state')||url.endsWith('/events')||url.endsWith('/worker.js')),false);
    assert.throws(()=>network.assertClean(),/Forbidden story requests/);
  } finally {await context.close();await browser.close();await server.close();await rm(directory,{recursive:true,force:true});}
});
