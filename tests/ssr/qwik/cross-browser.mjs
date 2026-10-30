import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {prepareProductionEvidence} from './production-evidence.mjs';
import {createBrowserEnvironment} from '../../compatibility/browser-environment.mjs';
const root=resolve(import.meta.dirname,'../../..'),require=createRequire(resolve(root,'apps/fixture-qwik/package.json')),playwright=require('playwright');
const directory=resolve(process.env.KRDS_SSR_OUTPUT??resolve(root,'test-results/t13/ssr/qwik'));await mkdir(directory,{recursive:true});
const productionEvidence=await prepareProductionEvidence(directory,'cross-browser');const {startProductionSsr}=productionEvidence;
const manifest=JSON.parse(await readFile(resolve(productionEvidence.production,'dist/q-manifest.json'),'utf8'));
const symbol=Object.entries(manifest.symbols).find(([,value])=>value.displayName==='resume.tsx_resume_component');assert.ok(symbol,'Production resume QRL symbol required');const chunk=manifest.mapping[symbol[0]];
const server=await startProductionSsr(),results=[];
try{for(const browserName of (process.env.KRDS_BROWSERS??'chromium,firefox,webkit').split(',')){
 const environment=await createBrowserEnvironment(browserName);let browser;try{browser=await playwright[browserName].launch({env:environment.env});for(const timezoneId of (process.env.KRDS_TIMEZONES??'UTC,Asia/Seoul,America/Los_Angeles').split(',')){
  const context=await browser.newContext({timezoneId,reducedMotion:'reduce',locale:'ko-KR',serviceWorkers:'block'}),page=await context.newPage(),errors=[],external=[];page.on('pageerror',error=>errors.push(String(error)));await page.route('**/*',route=>{if(new URL(route.request().url()).origin!==server.origin){external.push(route.request().url());return route.abort();}return route.continue();});
  try{
   await page.addInitScript(()=>{new MutationObserver(()=>{const button=document.querySelector('[data-krds-component="button"]');if(button&&!globalThis.__ssrBefore)globalThis.__ssrBefore=button;}).observe(document,{childList:true,subtree:true});});
   const response=await page.goto(`${server.origin}/resume.html`,{waitUntil:'networkidle'});assert.equal(response.headers()['x-krds-render'],'production-qwik-ssr');const actualHtml=await response.text();await productionEvidence.retainDocument(`${browserName}-${timezoneId}`,actualHtml);assert.match(actualHtml,/q:container="paused"/);assert.ok(await page.locator('script[type="qwik/json"]').count());
   const resources=await page.evaluate(()=>performance.getEntriesByType('resource').map(entry=>entry.name));assert.equal(resources.some(url=>url.endsWith(chunk)),false,'Application render QRL stays cold before first action');
   await page.getByRole('button',{name:'첫 클릭',exact:true}).click();await page.waitForFunction(()=>document.querySelector('output[aria-label="클릭 수"]').textContent==='1');assert.equal(await page.evaluate(()=>globalThis.__ssrBefore===document.querySelector('[data-krds-component="button"]')),true);
   await page.getByRole('combobox',{name:'지역',exact:true}).selectOption('busan');await page.waitForFunction(()=>document.querySelector('output[aria-label="이벤트 수"]').textContent==='1');
   assert.equal(await page.getByRole('textbox',{name:'날짜',exact:true}).inputValue(),'2024-02-29');assert.equal(await page.locator('#resume-form').evaluate(form=>new FormData(form).get('visit')),'2024-02-29');
   await page.getByRole('button',{name:'열기',exact:true}).click();await page.getByRole('dialog',{name:'확인',exact:true}).waitFor();await page.getByRole('button',{name:'마운트 전환',exact:true}).evaluate(node=>node.click());await page.getByRole('dialog').waitFor({state:'detached'});await page.waitForFunction(()=>document.body.style.overflow==='');assert.equal(await page.evaluate(()=>document.querySelectorAll('[inert]:not([hidden])').length),0);
   assert.deepEqual(errors,[]);assert.deepEqual(external,[]);results.push({browser:browserName,version:browser.version(),timezoneId,status:'passed',checks:['production SSR serialization','cold render QRL','first action one event','SSR native node retained','first select one event','date-only form','open-modal unmount cleanup','zero page errors/remote requests'],executionCoverage:'Chromium-only precise render-function count is verified separately by resume.mjs; this row claims cross-engine behavior and downloads only'});
  }catch(error){results.push({browser:browserName,version:browser.version(),timezoneId,status:'failed',error:String(error),errors,external});}finally{await context.close();}
 }}catch(error){results.push({browser:browserName,status:'failed',stage:'launch',error:String(error)});}finally{await browser?.close();await environment.cleanup();}
}}finally{await server.close();await productionEvidence.finish();await writeFile(resolve(directory,'cross-browser.json'),JSON.stringify({results},null,2));}
console.log(JSON.stringify(results));if(results.some(row=>row.status!=='passed'))process.exitCode=1;
