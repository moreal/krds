import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createBrowserEnvironment} from './browser-environment.mjs';
import {root} from './evidence.mjs';
const require=createRequire(resolve(root,'package.json')),playwright=require('playwright'),results=[];
for(const name of ['chromium','firefox','webkit']){
 const environment=await createBrowserEnvironment(name);let browser;
 try{browser=await playwright[name].launch({env:environment.env});for(const timezoneId of ['UTC','Asia/Seoul','America/Los_Angeles']){const page=await browser.newPage({timezoneId,reducedMotion:'reduce',locale:'ko-KR'});try{await page.setContent('<label for="date">Date</label><input type="date" id="date" value="2024-02-29"><button>Run</button><output>0</output><script>let n=0;document.querySelector("button").onclick=()=>document.querySelector("output").textContent=String(++n);</script>');assert.equal(await page.locator('input').inputValue(),'2024-02-29');assert.equal(await page.evaluate(()=>Intl.DateTimeFormat().resolvedOptions().timeZone),timezoneId==='UTC'?'UTC':timezoneId);await page.getByRole('button',{name:'Run'}).click();assert.equal(await page.locator('output').textContent(),'1');results.push({browser:name,version:browser.version(),timezoneId,status:'passed',scope:'browser launcher/context health only; no adapter support claim'});}finally{await page.close();}}}catch(error){results.push({browser:name,status:'failed',error:String(error)});}finally{await browser?.close();await environment.cleanup();}
}
const output=resolve(root,process.env.KRDS_COMPAT_OUTPUT??'test-results/t13/compatibility');await mkdir(output,{recursive:true});await writeFile(resolve(output,'browser-health.json'),JSON.stringify({date:new Date().toISOString(),node:process.versions.node,platform:process.platform,arch:process.arch,playwrightVersion:require('playwright/package.json').version,executables:Object.fromEntries(['chromium','firefox','webkit'].map(name=>[name,playwright[name].executablePath()])),results},null,2));console.log(JSON.stringify(results));if(results.length!==9||results.some(row=>row.status!=='passed'))process.exitCode=1;
