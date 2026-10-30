import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
process.env.PLAYWRIGHT_BROWSERS_PATH='/private/tmp/krds-playwright-1.64.1';
const root=resolve(import.meta.dirname,'../../..'),require=createRequire(resolve(root,'apps/fixture-qwik/package.json')),ts=require('typescript'),{chromium}=require('playwright');
const production=process.env.KRDS_PATTERN_PRODUCTION;assert(production);const directory=resolve(root,'.superpowers/sdd/PLAN/t11-qwik-logs');
const manifest=JSON.parse(await readFile(resolve(production,'dist/q-manifest.json'),'utf8'));
const entries=Object.entries(manifest.symbols).filter(([,e])=>/Pattern(?:Route|Instance)_component$/.test(e.displayName)&&e.ctxKind==='function'&&e.ctxName==='component$'&&e.origin==='examples/pattern-route.tsx'&&e.parent===null);assert.equal(entries.length,2,'Exact actual native wrapper and state-owning component$ render symbols');
const guards=await Promise.all(entries.map(async([symbol,entry])=>{
 const bundle=manifest.mapping[symbol],code=await readFile(resolve(production,'dist/build',bundle),'utf8');
 const alias=new RegExp(`(\\w+) as ${symbol}(?:,|})`).exec(code)?.[1];assert(alias,'Exact actual exported render alias');
 const parsed=ts.createSourceFile(bundle,code,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);let fn;
 const visit=node=>{if(ts.isVariableDeclaration(node)&&node.name.getText(parsed)===alias&&node.initializer&&ts.isArrowFunction(node.initializer))fn=node.initializer;ts.forEachChild(node,visit);};visit(parsed);assert(fn);
 const body=fn.body.getStart(parsed),end=fn.body.end,prefix=code.slice(0,body),lineNumber=prefix.split('\n').length-1,columnNumber=body-prefix.lastIndexOf('\n')-1;
 return {symbol,displayName:entry.displayName,ctxKind:entry.ctxKind,ctxName:entry.ctxName,origin:entry.origin,loc:entry.loc,bundle,code,alias,body,end,lineNumber,columnNumber};
}));
const {startProductionSsr}=await import(pathToFileURL(resolve(production,'server.mjs'))),server=await startProductionSsr(),browser=await chromium.launch(),results=[];
try{for(const family of ['form-input','search-input-enter','consent-key','consent-click','layout-key']){
 const context=await browser.newContext({locale:'ko-KR',viewport:{width:1280,height:900}}),page=await context.newPage(),errors=[],external=[],calls=[],resolved=[],parsedScripts=[];
 page.on('pageerror',e=>errors.push(String(e)));page.on('request',r=>{if(!r.url().startsWith(server.origin)&&!r.url().startsWith('data:'))external.push(r.url());});
 const cdp=await context.newCDPSession(page);await cdp.send('Debugger.enable');cdp.on('Debugger.scriptParsed',d=>parsedScripts.push({scriptId:d.scriptId,url:d.url}));cdp.on('Debugger.paused',async d=>{calls.push(d.callFrames[0]);await cdp.send('Debugger.resume');});cdp.on('Debugger.breakpointResolved',d=>resolved.push(d));
 const probes=await Promise.all(guards.map(async guard=>({guard,probe:await cdp.send('Debugger.setBreakpointByUrl',{urlRegex:guard.bundle.replaceAll('.','\\.')+'$',lineNumber:guard.lineNumber,columnNumber:guard.columnNumber})})));
 const flow=family.startsWith('form')?'form-errors':family.startsWith('search')?'search-results':family.startsWith('consent')?'consent-confirmation':'service-layout';
 const response=await page.goto(`${server.origin}/examples/${flow}?case=${family==='consent-click'?'optional-refusal-success':'cold'}`,{waitUntil:'networkidle'}),html=await response.text();assert.match(html,/q:container="paused"/);assert.match(html,/q:render="ssr"/);assert.match(html,/type="qwik\/json"/);assert.match(html,new RegExp(`data-pattern="${flow}"`));await writeFile(resolve(directory,`cold-${family}.html`),html);
 const resources=()=>page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>/\.js(?:$|\?)/.test(r.name)).map(r=>({name:r.name,bytes:r.decodedBodySize})));
 const before=await resources();
 if(family==='form-input'){await page.locator('#example-form-title').evaluate(n=>window.__ssrNode=n);await page.locator('#example-form-title').fill('서버 재개 연습');await page.locator('#example-form-submit').click();await page.waitForFunction(()=>document.querySelector('#example-form-errors')?.textContent.includes('연습 유형'));assert.equal(await page.locator('#example-form-title').inputValue(),'서버 재개 연습');assert.equal(await page.evaluate(()=>window.__ssrNode===document.querySelector('#example-form-title')),true);}
 if(family==='search-input-enter'){await page.locator('#example-search-query').fill('접근성');await page.locator('#example-search-query').press('Enter');await page.waitForFunction(()=>window.__KRDS_FIXTURE__?.readEvents().filter(e=>e.name==='pattern:request').length===1);assert.equal(await page.evaluate(()=>window.__KRDS_FIXTURE__.readEvents().find(e=>e.name==='pattern:request').detail.payload.query),'접근성');}
 if(family==='consent-key'){await page.locator('#example-consent-required-agree').focus();await page.keyboard.press('ArrowRight');await page.waitForFunction(()=>document.querySelector('#example-consent-required-decline')?.checked);await page.locator('#example-consent-review').click();await page.waitForFunction(()=>document.activeElement?.id==='example-consent-required-agree');}
 if(family==='consent-click'){await page.locator('#example-consent-review').click();await page.waitForFunction(()=>document.activeElement?.id==='example-consent-dialog');await page.keyboard.press('Escape');await page.waitForFunction(()=>document.activeElement?.id==='example-consent-review');}
 if(family==='layout-key'){await page.keyboard.press('Tab');await page.keyboard.press('Enter');await page.waitForFunction(()=>document.activeElement?.id==='example-main-heading');}
 const after=await resources(),guardEvidence=[];
 for(const {guard,probe} of probes){const locations=[...probe.locations,...resolved.filter(r=>r.breakpointId===probe.breakpointId).map(r=>r.location)];
  assert(locations.length||!parsedScripts.some(script=>script.url.endsWith('/'+guard.bundle)),'An unresolved render breakpoint is valid only if its chunk never parsed');
  const scripts=await Promise.all([...new Set(locations.map(l=>l.scriptId))].map(scriptId=>cdp.send('Debugger.getScriptSource',{scriptId})));
  assert(scripts.every(s=>s.scriptSource===guard.code));assert(locations.every(l=>l.lineNumber===guard.lineNumber&&l.columnNumber>=guard.columnNumber&&l.columnNumber<guard.columnNumber+(guard.end-guard.body)));
  const {code,...details}=guard;guardEvidence.push({...details,scriptSHA256:createHash('sha256').update(code).digest('hex'),renderChunkParsed:parsedScripts.some(script=>script.url.endsWith('/'+guard.bundle)),locations});
 }
 assert.equal(calls.length,0,'Native semantic events must resume without executing wrapper or complete state-owning PatternInstance render');assert(after.length>before.length,'A first native event loads an additional lazy QRL');assert.deepEqual(errors,[]);assert.deepEqual(external,[]);
 results.push({family,status:'passed',guards:guardEvidence,calls,before,after,serializationBytes:Buffer.byteLength(html.match(/<script type="qwik\/json">([\s\S]*?)<\/script>/)?.[1]??''),errors,external});await context.close();
}}finally{await browser.close();await server.close();await writeFile(resolve(directory,'resume.json'),JSON.stringify({results},null,2));}
console.log(`Qwik native T11 cold events ${results.length}/5`);
