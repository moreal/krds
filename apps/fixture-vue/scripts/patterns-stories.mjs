import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {chromium} from 'playwright';
import {expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {serveProduction,root} from '../../../tools/testing/support.mjs';
if(process.env.PLAYWRIGHT_BROWSERS_PATH!=='/private/tmp/krds-playwright-1.64.1')throw new Error('Set PLAYWRIGHT_BROWSERS_PATH to the selected /private/tmp/krds-playwright-1.64.1 cache before execution.');
const dist=resolve(process.env.KRDS_PATTERN_STORY_DIST??join(root,'apps/storybook-vue/dist'));
const directory=join(root,'.superpowers/sdd/PLAN/t11-vue-logs/stories');await mkdir(directory,{recursive:true});
const index=JSON.parse(await readFile(join(dist,'index.json'),'utf8'));const entries=Object.values(index.entries).filter(entry=>entry.type==='story'&&entry.id.startsWith('krds-pattern-'));assert.equal(entries.length,16);
const server=await serveProduction(dist);const browser=await chromium.launch();const results=[];
try{for(const entry of entries){
 const context=await browser.newContext({viewport:{width:1280,height:900},locale:'ko-KR',reducedMotion:'reduce'});const page=await context.newPage();const errors=[],external=[];page.on('pageerror',error=>errors.push(String(error)));page.on('request',request=>{if(!request.url().startsWith(server.origin))external.push(request.url());});
 const result={id:entry.id,errors,external,pass:false};
 try{await page.goto(`${server.origin}/iframe.html?id=${entry.id}&viewMode=story`);await page.locator('[data-pattern-kind]').waitFor();await page.evaluate(()=>document.fonts.ready);await expect(page.locator('#storybook-root')).not.toContainText('Unknown presentation');
 const axe=await new AxeBuilder({page}).analyze();result.axe=axe;await page.screenshot({path:join(directory,entry.id+'.png'),fullPage:true,animations:'disabled'});assert.equal(await page.evaluate(()=>window.__KRDS_FIXTURE__!==undefined),false);assert.deepEqual(errors,[]);assert.deepEqual(external,[]);assert.deepEqual(axe.violations.map(x=>x.id),[]);result.pass=true;
 }catch(error){result.failure=String(error.stack??error);}results.push(result);console.log(`${result.pass?'PASS':'FAIL'} ${entry.id}`);await context.close();
}}finally{await browser.close();await server.close();await writeFile(join(directory,'results.json'),JSON.stringify({browserVersion:browser.version(),browserCache:process.env.PLAYWRIGHT_BROWSERS_PATH,artifact:server.snapshot,results},null,2));}
if(results.some(x=>!x.pass))process.exitCode=1;
