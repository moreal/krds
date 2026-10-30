import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
process.env.PLAYWRIGHT_BROWSERS_PATH='/private/tmp/krds-playwright-1.64.1';
const root=resolve(import.meta.dirname,'../../..'),require=createRequire(resolve(root,'apps/fixture-qwik/package.json')),{chromium}=require('playwright'),ts=require('typescript');
const production=process.env.KRDS_PATTERN_PRODUCTION;assert(production,'An explicitly leased immutable producer copy is required');
const output=resolve(process.env.KRDS_IME_OUTPUT??resolve(root,'.superpowers/sdd/PLAN/t11-qwik-fix1-logs/ime'));
await mkdir(output,{recursive:true});
const manifest=JSON.parse(await readFile(resolve(production,'dist/q-manifest.json'),'utf8'));
const entries=Object.entries(manifest.symbols).filter(([,e])=>/Pattern(?:Route|Instance)_component$/.test(e.displayName)&&e.ctxKind==='function'&&e.ctxName==='component$'&&e.origin==='examples/pattern-route.tsx'&&e.parent===null);assert.equal(entries.length,2);
const guards=await Promise.all(entries.map(async([symbol,metadata])=>{
 const bundle=manifest.mapping[symbol],code=await readFile(resolve(production,'dist/build',bundle),'utf8'),parsed=ts.createSourceFile(bundle,code,ts.ScriptTarget.Latest,true,ts.ScriptKind.JS);let alias,fn;
 for(const node of parsed.statements)if(ts.isExportDeclaration(node)&&node.exportClause&&ts.isNamedExports(node.exportClause))for(const specifier of node.exportClause.elements)if(specifier.name.text===symbol)alias=(specifier.propertyName??specifier.name).text;
 assert(alias,`Actual AST export for ${symbol}`);
 const declarations=parsed.statements.filter(ts.isVariableStatement).flatMap(node=>[...node.declarationList.declarations]).filter(node=>ts.isIdentifier(node.name)&&node.name.text===alias&&node.initializer&&ts.isArrowFunction(node.initializer));assert.equal(declarations.length,1,'Exact exported module-scope render binding');fn=declarations[0].initializer;
 const body=fn.body.getStart(parsed),end=fn.body.end,prefix=code.slice(0,body);return {symbol,metadata,bundle,code,alias,body,end,lineNumber:prefix.split('\n').length-1,columnNumber:body-prefix.lastIndexOf('\n')-1};
}));
const {startProductionSsr}=await import(pathToFileURL(resolve(production,'server.mjs'))),server=await startProductionSsr(),browser=await chromium.launch(),results=[];
// Chromium's CDP end command emits an untrusted compositionend even without app code.
const controlPage=await browser.newPage(),controlCdp=await controlPage.context().newCDPSession(controlPage);await controlPage.setContent('<input id="plain-native">');await controlPage.evaluate(()=>{window.__control=[];for(const type of ['compositionstart','compositionend','input'])document.addEventListener(type,e=>window.__control.push({type,isTrusted:e.isTrusted,isComposing:e.isComposing??null}),true);});await controlPage.locator('input').focus();await controlCdp.send('Input.imeSetComposition',{text:'조합',selectionStart:2,selectionEnd:2});await controlCdp.send('Input.imeSetComposition',{text:'',selectionStart:0,selectionEnd:0});const protocolControl=await controlPage.evaluate(()=>window.__control);assert(protocolControl.some(e=>e.type==='compositionend'));await controlPage.close();
const frames=page=>page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));
const observe=async page=>{await page.waitForLoadState('networkidle');await frames(page);return page.evaluate(()=>({trace:window.__imeTrace.map((entry,index)=>({...entry,defaultPrevented:window.__imeNativeEvents[index].defaultPrevented})),requests:window.__KRDS_FIXTURE__.readEvents().filter(e=>e.name==='pattern:request'),value:document.querySelector('#example-search-query,#example-form-title').value,boundary:document.querySelector('#example-form,#example-search-form').dataset.krdsPatternBoundary??null}));};
try{for(const flow of ['search-results','form-errors'])for(const scenario of ['composition-enter-end-enter','229-enter','canceled-enter','composition-end-button','composition-remount-enter-end-enter']){
 const context=await browser.newContext({locale:'ko-KR'}),page=await context.newPage(),cdp=await context.newCDPSession(page),calls=[],parsedScripts=[],resolved=[],errors=[],external=[];
 const result={flow,scenario,status:'failed',errors,external,limitation:'Trusted Chromium CDP composition/key dispatch is not a real OS IME session. End uses CDP empty composition (cancel/end, isTrusted=false also in plain native control), then trusted committed-text insertion.'};
 page.on('pageerror',e=>errors.push(String(e)));page.on('request',r=>{if(!r.url().startsWith(server.origin)&&!r.url().startsWith('data:'))external.push(r.url());});
 await cdp.send('Debugger.enable');cdp.on('Debugger.scriptParsed',s=>parsedScripts.push({scriptId:s.scriptId,url:s.url}));cdp.on('Debugger.breakpointResolved',d=>resolved.push(d));cdp.on('Debugger.paused',async d=>{calls.push(d.callFrames[0]);await cdp.send('Debugger.resume');});
 const probes=await Promise.all(guards.map(async guard=>({guard,probe:await cdp.send('Debugger.setBreakpointByUrl',{urlRegex:guard.bundle.replaceAll('.','\\.')+'$',lineNumber:guard.lineNumber,columnNumber:guard.columnNumber})})));
 try{
  const response=await page.goto(`${server.origin}/examples/${flow}?case=${flow==='form-errors'?'retry-success':'cold'}`,{waitUntil:'networkidle'}),html=await response.text();assert.match(html,/q:container="paused"/);assert.match(html,/q:render="ssr"/);await writeFile(resolve(output,`${flow}-${scenario}.html`),html);
  await page.waitForFunction(()=>window.__KRDS_FIXTURE__?.protocol===1);
  await page.evaluate(()=>{window.__imeTrace=[];window.__imeNativeEvents=[];for(const type of ['compositionstart','compositionupdate','compositionend','beforeinput','input','keydown','keyup','submit'])document.addEventListener(type,event=>{const entry={type,target:event.target.id,isTrusted:event.isTrusted,isComposing:event.isComposing??null,hasCompositionProperty:'isComposing'in event,key:event.key??null,keyCode:event.keyCode??null,inputType:event.inputType??null,data:event.data??null,defaultPreventedAtCapture:event.defaultPrevented,defaultPrevented:null};window.__imeTrace.push(entry);window.__imeNativeEvents.push(event);},true);});
  if(scenario==='composition-remount-enter-end-enter'){await page.getByRole('button',{name:'패턴 마운트 전환'}).click();await page.waitForFunction(()=>!window.__KRDS_FIXTURE__);await page.getByRole('button',{name:'패턴 마운트 전환'}).click();await page.waitForFunction(()=>window.__KRDS_FIXTURE__?.protocol===1);await frames(page);result.explicitRemountRootCalls=calls.splice(0);}
  const field=page.locator(flow==='search-results'?'#example-search-query':'#example-form-title');await field.focus();
  const initialResources=await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>/\.js(?:$|\?)/.test(r.name)).map(r=>r.name));
  if(scenario.startsWith('composition')){
   await cdp.send('Input.imeSetComposition',{text:'조합제목',selectionStart:4,selectionEnd:4});
   if(scenario.endsWith('enter-end-enter')){
    await page.keyboard.press('Enter');result.during=await observe(page);
    assert(result.during.trace.some(e=>e.type==='compositionstart'&&e.isTrusted));
    assert(result.during.trace.some(e=>e.type==='keydown'&&e.key==='Enter'&&e.isComposing&&e.isTrusted));
    assert.equal(result.during.requests.length,0,'A trusted composing Enter must start no actual request');
    assert(!result.during.trace.some(e=>e.type==='submit'),'Composing Enter must be canceled before native submit');assert(result.during.value.includes('조합제목'),'The boundary must retain the composing native draft');assert.equal(result.during.trace.find(e=>e.type==='keydown'&&e.key==='Enter').defaultPrevented,true);assert.equal(result.during.boundary,'ready');
   }
   await cdp.send('Input.imeSetComposition',{text:'',selectionStart:0,selectionEnd:0});await cdp.send('Input.insertText',{text:'조합제목'});await frames(page);
   const ended=await page.evaluate(()=>window.__imeTrace.some(e=>e.type==='compositionend'));assert(ended,'The CDP-driven compositionend must occur before ordinary activation (trust metadata retained)');
  }else{
   await field.fill('일반 제목 연습');
   if(scenario==='229-enter'){
    await cdp.send('Input.dispatchKeyEvent',{type:'rawKeyDown',key:'Enter',code:'Enter',windowsVirtualKeyCode:229,nativeVirtualKeyCode:229});
    await cdp.send('Input.dispatchKeyEvent',{type:'keyUp',key:'Enter',code:'Enter',windowsVirtualKeyCode:229,nativeVirtualKeyCode:229});
   }else{
    await page.evaluate(()=>{window.__cancelImeKey=event=>{if(event.key==='Enter')event.preventDefault();};document.addEventListener('keydown',window.__cancelImeKey,true);});
    await page.keyboard.press('Enter');
    await page.evaluate(()=>document.removeEventListener('keydown',window.__cancelImeKey,true));
   }
   result.blocked=await observe(page);assert.equal(result.blocked.requests.length,0);
   const key=result.blocked.trace.find(e=>e.type==='keydown'&&e.key==='Enter');assert(key?.isTrusted);assert.equal(key.defaultPrevented,true,'The native key default must be canceled synchronously');
   if(scenario==='229-enter')assert.equal(key.keyCode,229);
  }
  if(scenario==='composition-end-button')await page.locator(flow==='search-results'?'#example-search-submit':'#example-form-submit').click();else await page.keyboard.press('Enter');
  await page.waitForFunction(()=>window.__KRDS_FIXTURE__.readEvents().filter(e=>e.name==='pattern:request').length>=1);
  result.after=await observe(page);assert.equal(result.after.requests.length,1,'One ordinary activation must produce exactly one request without lazy replay duplication');
  const submit=result.after.trace.filter(e=>e.type==='submit');assert.equal(submit.length,1);assert(submit[0].isTrusted);assert.equal(submit[0].hasCompositionProperty,false,'The fix must not depend on SubmitEvent.isComposing');
  assert.equal(result.after.requests[0].detail.operation,flow==='search-results'?'search':'submit-form');assert.equal(result.after.requests[0].detail.requestId,1);const payload=result.after.requests[0].detail.payload;assert.equal(flow==='search-results'?payload.query:payload.title,result.after.value.trim());
  result.guards=[];
  for(const {guard,probe}of probes){const locations=[...probe.locations,...resolved.filter(r=>r.breakpointId===probe.breakpointId).map(r=>r.location)];assert(locations.length||!parsedScripts.some(s=>s.url.endsWith('/'+guard.bundle)));for(const location of locations){assert(location.lineNumber===guard.lineNumber&&location.columnNumber>=guard.columnNumber&&location.columnNumber<guard.columnNumber+(guard.end-guard.body));assert.equal((await cdp.send('Debugger.getScriptSource',{scriptId:location.scriptId})).scriptSource,guard.code);}const {code,...details}=guard;result.guards.push({...details,scriptSHA256:createHash('sha256').update(code).digest('hex'),renderChunkParsed:parsedScripts.some(s=>s.url.endsWith('/'+guard.bundle)),locations});}
  result.rootCalls=calls;assert.equal(calls.length,0,'Neither complete native host render is recreated during these interactions');
  result.initialResources=initialResources;result.finalResources=await page.evaluate(()=>performance.getEntriesByType('resource').filter(r=>/\.js(?:$|\?)/.test(r.name)).map(r=>r.name));if(scenario!=='composition-remount-enter-end-enter')assert(result.finalResources.length>initialResources.length,'Native activation retains actual lazy QRL loading');assert.deepEqual(errors,[]);assert.deepEqual(external,[]);result.status='passed';
 }catch(error){result.error=String(error);result.stack=error.stack;result.observed=await observe(page);}finally{results.push(result);await context.close();}
}}finally{await browser.close();await server.close();await writeFile(resolve(output,'report.json'),JSON.stringify({production,protocolControl,results},null,2));}
console.log(JSON.stringify(results.map(r=>({flow:r.flow,scenario:r.scenario,status:r.status,error:r.error})),null,2));assert.equal(results.filter(r=>r.status!=='passed').length,0);
