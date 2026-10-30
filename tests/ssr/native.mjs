import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { resolve, join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { mkdir, readFile, writeFile, readdir } from 'node:fs/promises';
import { createServer } from 'node:http';
import { createBrowserEnvironment } from '../compatibility/browser-environment.mjs';
import {snapshot} from '../compatibility/evidence.mjs';
import {captureArtifactInventory,assertArtifactMatch} from '../compatibility/artifact-evidence.mjs';
const root=resolve(import.meta.dirname,'../..');
const framework=process.argv[2];
assert.ok(['react','solid','svelte','vue','lit','solid-next'].includes(framework), 'Select a native SSR fixture');
const browsers=(process.env.KRDS_BROWSERS??'chromium,firefox,webkit').split(',');
const timezones=(process.env.KRDS_TIMEZONES??'UTC,Asia/Seoul,America/Los_Angeles').split(',');
const sourceSha256=process.env.KRDS_SSR_SOURCE_SHA256??(await snapshot([framework])).sha256;
const workspace=join(root,'apps',`fixture-${framework}`), require=createRequire(join(workspace,'package.json'));
const {build}=await import(pathToFileURL(require.resolve('vite')));
const plugins=[];
if(framework==='react')plugins.push((await import(pathToFileURL(require.resolve('@vitejs/plugin-react')))).default());
if(framework==='solid-next'){const module=await import(pathToFileURL(require.resolve('@solidjs/vite-plugin')));plugins.push((module.default.default??module.default)({ssr:true}));}
if(framework==='solid')plugins.push((await import(pathToFileURL(require.resolve('vite-plugin-solid')))).default({ssr:true}));
if(framework==='vue')plugins.push((await import(pathToFileURL(require.resolve('@vitejs/plugin-vue')))).default());
if(framework==='svelte')plugins.push((await import(pathToFileURL(require.resolve('@sveltejs/vite-plugin-svelte')))).svelte({configFile:false}));
const directory=resolve(process.env.KRDS_SSR_OUTPUT??join(root,'test-results/t13/ssr',framework));await mkdir(directory,{recursive:true});
const entries=join(import.meta.dirname,framework,...(framework==='solid-next'?['native']:[]));
// Test entries are owned centrally, while dependency resolution is owned by the
// fixture workspace declaring the runtime/compiler. No renderer source alias.
const resolveFixture={name:'krds-ssr-test-dependencies',enforce:'pre',async resolveId(source,importer,options){if(importer?.startsWith(entries)&&!source.startsWith('.')&&!source.startsWith('/')&&!source.startsWith('\0'))return this.resolve(source,join(workspace,'src','__t13_entry.ts'),{...options,skipSelf:true});}};
for(const target of ['client','server']){
 const extension=['react','solid','solid-next'].includes(framework)?'tsx':'ts';
 await build({root:workspace,configFile:false,define:{'process.env.NODE_ENV':JSON.stringify('production')},plugins:[resolveFixture,...plugins],ssr:{noExternal:true},build:{outDir:join(directory,target),emptyOutDir:true,ssr:target==='server',minify:false,lib:{entry:join(entries,`${target}.${extension}`),formats:['es'],fileName:()=>`${target}.js`},rollupOptions:{external:id=>id.startsWith('node:')}}});
}
assert.equal(typeof document,'undefined');assert.equal(typeof window,'undefined');
const {render}=await import(pathToFileURL(join(directory,'server/server.js')));
const output=await render();assert.match(output.body,/<button/);assert.match(output.body,/<select/);assert.match(output.body,/2024-02-29/);assert.match(output.body,/role="tab"/);
const html=`<!doctype html><html lang="en"><head><meta charset="utf-8"><title>${framework} native SSR</title>${output.head??''}</head><body><div id="app">${output.body}</div><script>globalThis.__ssrErrors=[];globalThis.__ssrBefore=document.querySelector('#ssr-button')?.shadowRoot?.querySelector('button')??document.querySelector('#ssr-button');</script><script type="module" src="/client.js"></script></body></html>`;
await writeFile(join(directory,'server.html'),html);
const artifactRoots=[join(directory,'client'),join(directory,'server'),join(directory,'server.html')];
const artifactsBefore=await captureArtifactInventory(directory,'artifacts-before',artifactRoots,sourceSha256);
const files=await readdir(join(directory,'client'));assert.ok(files.includes('client.js'));
const server=createServer(async(req,res)=>{try{const path=req.url.split('?')[0];if(path==='/'){res.setHeader('Content-Type','text/html');res.end(html);}else if(files.includes(path.slice(1))){res.setHeader('Content-Type',path.endsWith('.css')?'text/css':'text/javascript');res.end(await readFile(join(directory,'client',path.slice(1))));}else{res.statusCode=404;res.end();}}catch(error){res.statusCode=500;res.end(String(error));}});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const origin=`http://127.0.0.1:${server.address().port}`;
const playwright=require('playwright');const results=[];
try{
 for(const browserName of browsers){
  assert.ok(['chromium','firefox','webkit'].includes(browserName));const environment=await createBrowserEnvironment(browserName);let browser;
  try{
   browser=await playwright[browserName].launch({env:environment.env});
   for(const timezoneId of timezones){
    const context=await browser.newContext({timezoneId,locale:'en-US',reducedMotion:'reduce'});const page=await context.newPage();const errors=[];const requests=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',message=>{if(message.type()==='error')errors.push(message.text());});
    await page.route('**/*',route=>{const url=new URL(route.request().url());if(url.origin!==origin){requests.push(url.href);return route.abort();}return route.continue();});
    try{
     await page.goto(origin);await page.waitForFunction(()=>globalThis.__ssrReady);
     assert.equal(await page.evaluate(()=>globalThis.__ssrReused&&globalThis.__ssrBefore===(document.querySelector('#ssr-button')?.shadowRoot?.querySelector('button')??document.querySelector('#ssr-button'))),true,'Actual SSR button must survive hydration');
     await page.getByRole('button',{name:'Hydrated 0',exact:true}).click();await page.getByRole('button',{name:'Hydrated 1',exact:true}).waitFor();
     await page.getByRole('combobox',{name:'Region',exact:true}).selectOption('busan');await page.waitForFunction(()=>document.querySelector('#ssr-requests').textContent==='1');
     assert.equal(await page.locator('#ssr-requests').textContent(),'1','Exactly one first select event');
     assert.equal(await page.getByRole('textbox',{name:'Visit date',exact:true}).inputValue(),'2024-02-29');
     assert.deepEqual(await page.locator('#ssr-form').evaluate(form=>Object.fromEntries(new FormData(form))),{region:'busan',visit:'2024-02-29'});
     const links=await page.locator('label[for]').evaluateAll(labels=>labels.map(label=>({id:label.htmlFor,found:!!label.getRootNode().getElementById(label.htmlFor)})));assert.ok(links.length>=2);assert.ok(links.every(link=>link.found));
     const tab=page.getByRole('tab',{name:'Second',exact:true});await tab.click();assert.equal(await tab.getAttribute('aria-selected'),'true');const controlled=await tab.getAttribute('aria-controls');assert.ok(controlled);assert.equal(await tab.evaluate(node=>!node.getRootNode().getElementById(node.getAttribute('aria-controls')).hidden),true);
     await page.getByRole('button',{name:'Open modal',exact:true}).click();await page.getByRole('dialog',{name:'Review',exact:true}).waitFor();
     await page.evaluate(()=>globalThis.__ssrUnmount());await page.waitForFunction(()=>!document.querySelector('#app').textContent.trim());
     assert.equal(await page.getByRole('dialog').count(),0);assert.equal(await page.evaluate(()=>document.querySelectorAll('[inert]').length),0);assert.equal(await page.evaluate(()=>document.body.style.overflow),'');
     assert.deepEqual(await page.evaluate(()=>globalThis.__ssrErrors),[]);assert.deepEqual(errors,[]);assert.deepEqual(requests,[]);
     results.push({browser:browserName,version:browser.version(),timezoneId,status:'passed',checks:['DOM-free official server rendering','SSR node reuse','first button one event','first select one event','date-only canonical form value','label/tab IDs','open-modal unmount cleanup','no page/hydration errors','no remote requests']});
    }catch(error){results.push({browser:browserName,version:browser.version(),timezoneId,status:'failed',error:String(error),errors,requests});}finally{await context.close();}
   }
  }catch(error){results.push({browser:browserName,status:'failed',stage:'browser-launch',error:String(error)});}finally{await browser?.close();await environment.cleanup();}
 }
}finally{await new Promise(resolve=>server.close(resolve));const artifactsAfter=await captureArtifactInventory(directory,'artifacts-after',artifactRoots,sourceSha256);let artifactError;try{assertArtifactMatch(artifactsBefore,artifactsAfter);}catch(error){artifactError=String(error);process.exitCode=1;}await writeFile(join(directory,'results.json'),JSON.stringify({framework,results,artifactEvidence:{sourceSha256,before:artifactsBefore,after:artifactsAfter,unchanged:!artifactError,error:artifactError}},null,2));}
console.log(JSON.stringify({framework,results}));if(results.some(result=>result.status!=='passed')||results.length!==browsers.length*timezones.length)process.exitCode=1;
