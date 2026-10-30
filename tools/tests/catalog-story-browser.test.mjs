import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,stat,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {serveProduction} from '../testing/support.mjs';
import {verifyCatalogStory} from '../testing/catalog-stories.mjs';
const story=JSON.parse(await readFile(new URL('../../catalog/full-catalog-stories.json',import.meta.url),'utf8')).cases.find(item=>item.id==='krds-checkbox--binary');
test('catalog browser audit keeps real PNG/request/raw axe evidence and rejects role-only, unnamed, forbidden and foreign specimens',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'krds-catalog-story-audit-'));
 const {chromium}=await import('playwright');const browser=await chromium.launch();
 try{
  for(const mode of ['correct','role-only','stale-value','axe-bad','forbidden','foreign']){
   const source=join(directory,mode),evidence=join(directory,mode+'-evidence');await mkdir(source);await mkdir(evidence);
   const input=mode==='role-only'?'<div style="width:20px;height:20px" role="checkbox" tabindex="0" aria-checked="false" aria-label="이용약관 동의"></div>':`<label><input type="checkbox" name="consent" value="agreed" ${mode==='stale-value'?'checked':''}>이용약관 동의</label>`;
   const markup='<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>Local observer inspection</title></head><body><main id="storybook-root"><h1>상태 예제</h1><div data-krds-component="checkbox" data-krds-part="root">'+input+'</div>'+(mode==='axe-bad'?'<button></button>':'')+'</main>'+(mode==='forbidden'?'<script>fetch("/api/state").catch(()=>{})</script>':'')+'</body></html>';
   await writeFile(join(source,'index.html'),markup);await writeFile(join(source,'iframe.html'),markup);
   const server=await serveProduction(source);
   let result;try{result=await verifyCatalogStory(browser,server,story,evidence,{framework:mode==='foreign'?'solid-next':'vue'});}finally{await server.close();}
   assert.equal(result.coverageAwarded,false);
   assert.equal(result.status,mode==='correct'?'passed':'failed',JSON.stringify(result));
   assert.ok((await stat(join(evidence,result.screenshot))).size>0);
   if(mode==='foreign'){assert.match(result.error,/Foreign\/unrequired renderer/);assert.ok(result.axeErrorFile);continue;}
   assert.ok(result.axeFile,JSON.stringify({mode,result}));
   const raw=JSON.parse(await readFile(join(evidence,result.axeFile),'utf8'));assert.ok(raw.testEngine.version);
   const requests=JSON.parse(await readFile(join(evidence,result.requestsFile),'utf8'));assert.ok(Array.isArray(requests.requests));
   if(mode==='axe-bad'){assert.ok(raw.violations.some(item=>item.id==='button-name'));assert.match(result.error,/Raw axe violations/);}
   if(mode==='role-only')assert.match(result.error,/INPUT|toContain/);
   if(mode==='stale-value')assert.match(result.error,/toBeChecked/);
   if(mode==='forbidden'){assert.ok(requests.violations.some(item=>item.url.endsWith('/api/state')));assert.match(result.error,/Forbidden story requests/);}
   if(mode==='foreign')assert.match(result.error,/Foreign\/unrequired renderer/);
  }
 }finally{await browser.close();await rm(directory,{recursive:true,force:true});}
});

test('asset-only favicon completion and closed Tutorial use actual head assets/opener, while wrong assets and wrong branch action fail',async()=>{
 const manifest=JSON.parse(await readFile(new URL('../../catalog/full-catalog-stories.json',import.meta.url),'utf8')).cases;
 const directory=await mkdtemp(join(tmpdir(),'krds-asset-only-story-'));
 const {chromium}=await import('playwright');const browser=await chromium.launch();
 try{
  for(const mode of ['favicon','bad-icon','closed-tutorial','image-only','side-branch','wrong-branch']){
   const source=join(directory,mode),evidence=join(directory,mode+'-evidence');await mkdir(source);await mkdir(evidence);await mkdir(join(source,'local-assets'));
   let state,content,head='';
   if(mode.includes('icon')){
    state=manifest.find(item=>item.id==='krds-favicon--standard-local-head');content='<h1>로컬 파비콘 미리보기</h1>';
    for(const theme of ['light','dark']){const asset=state.state[theme];head+=`<link rel="icon" href="${asset.href}" type="${asset.type}" sizes="${asset.sizes}" media="(prefers-color-scheme: ${theme})">`;await writeFile(join(source,asset.href),mode==='bad-icon'?'broken bytes':'<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"><rect width="16" height="16"/></svg>');}
   }else if(mode==='image-only'){
    state=manifest.find(item=>item.id==='krds-image--informative');
    content=`<img data-krds-component="image" data-krds-part="root" alt="${state.state.alt}" src="${state.state.src}">`;
    await writeFile(join(source,state.state.src),'<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360"><rect width="640" height="360"/></svg>');
   }else if(mode==='closed-tutorial'){
    state=manifest.find(item=>item.id==='krds-tutorial-panel--suspended-panel');content='<h1>설명</h1><button>튜토리얼 열기</button>';
   }else{
    state=manifest.find(item=>item.id==='krds-side-navigation--deep-progressive');content=`<h1>설명</h1><nav data-krds-component="side-navigation" data-krds-part="root"><button aria-expanded="false">분류 ${mode==='wrong-branch'?'접기':'펼치기'}</button></nav>`;
   }
   const markup=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>Local inspection</title>${head}</head><body><main id="storybook-root">${content}</main></body></html>`;
   await writeFile(join(source,'index.html'),markup);await writeFile(join(source,'iframe.html'),markup);
   const server=await serveProduction(source);let result;try{result=await verifyCatalogStory(browser,server,state,evidence,{framework:'vue'});}finally{await server.close();}
   assert.equal(result.status,['bad-icon','wrong-branch'].includes(mode)?'failed':'passed',JSON.stringify({mode,result}));
   if(mode==='bad-icon')assert.match(result.error,/Unusable actual favicon bytes/);
   if(mode==='wrong-branch')assert.match(result.error,/toHaveCount/);
  }
 }finally{await browser.close();await rm(directory,{recursive:true,force:true});}
});

test('catalog stories inspect adjacent Masthead simulation notices and actual FAB label presentation',async()=>{
 const manifest=JSON.parse(await readFile(new URL('../../catalog/full-catalog-stories.json',import.meta.url),'utf8')).cases;
 const directory=await mkdtemp(join(tmpdir(),'krds-story-policy-'));
 const {chromium}=await import('playwright');const browser=await chromium.launch();
 try{
  for(const mode of ['masthead','far-notice','icon-only','icon-with-label','extended','extended-without-label']){
   const source=join(directory,mode),evidence=join(directory,mode+'-evidence');await mkdir(source);await mkdir(evidence);
   let story,content;
   if(mode.includes('notice')||mode==='masthead'){
    story=manifest.find(item=>item.id==='krds-masthead--default-specimen');
    content=`<p>${story.host.specimenLabel}</p>${mode==='far-notice'?'<h1>별도 본문</h1>':''}<p data-krds-component="masthead" data-krds-part="root">${story.expected[0].visibleText}</p>`;
   }else{
    story=manifest.find(item=>item.id===`krds-fab--${mode.startsWith('icon')?'single-icon':'extended-label'}`);
    const label=['icon-with-label','extended'].includes(mode)?`<span data-krds-component="fab" data-krds-part="label">${story.state.label}</span>`:'';
    content=`<div data-krds-component="fab" data-krds-part="root"><button type="button" data-krds-component="fab" data-krds-part="trigger" aria-label="${story.state.label}"><span aria-hidden="true">+</span>${label}</button></div>`;
   }
   const markup=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>Local inspection</title></head><body><main id="storybook-root">${content}</main></body></html>`;
   await writeFile(join(source,'index.html'),markup);await writeFile(join(source,'iframe.html'),markup);
   const server=await serveProduction(source);let result;try{result=await verifyCatalogStory(browser,server,story,evidence,{framework:'vue'});}finally{await server.close();}
   assert.equal(result.status,['far-notice','icon-with-label','extended-without-label'].includes(mode)?'failed':'passed',JSON.stringify({mode,result}));
   assert.equal(result.coverageAwarded,false);
  }
 }finally{await browser.close();await rm(directory,{recursive:true,force:true});}
});

test('post-removal story states require absent owned UI and a real usable named fallback, rejecting retained roots and stale controls',async()=>{
 const manifest=JSON.parse(await readFile(new URL('../../catalog/full-catalog-stories.json',import.meta.url),'utf8')).cases;
 const directory=await mkdtemp(join(tmpdir(),'krds-story-removed-trigger-'));
 const {chromium}=await import('playwright');const browser=await chromium.launch();
 try{
  for(const component of ['tooltip','contextual-help'])for(const mode of ['removed','missing-fallback','disabled-fallback','stale-root','stale-trigger','orphan-popup']){
   const original=manifest.find(item=>item.id===`krds-${component}--${component==='tooltip'?'trigger-removed':'removed-trigger'}`);
   const story={...original,state:{...original.state,fallbackFocusId:'inspection-fallback'},host:{...original.host,fallbackFocusId:'inspection-fallback',fallbackLabel:'계속 진행'},expected:[{role:'button',name:'계속 진행'}]};
   const source=join(directory,component+'-'+mode),evidence=source+'-evidence';await mkdir(source);await mkdir(evidence);
   const fallback=mode==='missing-fallback'?'':`<button id="inspection-fallback" ${mode==='disabled-fallback'?'disabled':''}>계속 진행</button>`;
   const stale=mode==='stale-root'?`<div data-krds-component="${component}" data-krds-part="root"></div>`:mode==='stale-trigger'?`<button>${story.state.triggerLabel}</button>`:mode==='orphan-popup'?`<div data-krds-component="${component}" data-krds-part="${component==='tooltip'?'content':'popover'}">오래된 도움말</div>`:'';
   const markup=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>Local inspection</title></head><body><main id="storybook-root"><h1>제거된 도움말</h1>${fallback}${stale}</main></body></html>`;
   await writeFile(join(source,'index.html'),markup);await writeFile(join(source,'iframe.html'),markup);
   const server=await serveProduction(source);let result;try{result=await verifyCatalogStory(browser,server,story,evidence,{framework:'vue'});}finally{await server.close();}
   assert.equal(result.status,mode==='removed'?'passed':'failed',JSON.stringify({component,mode,result}));
   assert.equal(result.coverageAwarded,false);
  }
 }finally{await browser.close();await rm(directory,{recursive:true,force:true});}
});

test('post-removal stories reject orphan semantic popups even when a fake owner omits all owned-part markers',async()=>{
 const manifest=JSON.parse(await readFile(new URL('../../catalog/full-catalog-stories.json',import.meta.url),'utf8')).cases;
 const directory=await mkdtemp(join(tmpdir(),'krds-story-orphan-popup-'));
 const {chromium}=await import('playwright');const browser=await chromium.launch();
 try{
  for(const component of ['tooltip','contextual-help']){
   const story=manifest.find(item=>item.id===`krds-${component}--${component==='tooltip'?'trigger-removed':'removed-trigger'}`);
   const source=join(directory,component),evidence=source+'-evidence';await mkdir(source);await mkdir(evidence);
   const popup=component==='tooltip'?`<div role="tooltip">${story.state.text}</div>`:`<div role="dialog" aria-label="${story.state.title}">${story.state.content}</div>`;
   const markup=`<!doctype html><html lang="ko"><head><meta charset="utf-8"><title>Local inspection</title></head><body><main id="storybook-root"><h1>제거된 도움말</h1><button id="${story.state.fallbackFocusId}">${story.host.fallbackLabel}</button>${popup}</main></body></html>`;
   await writeFile(join(source,'index.html'),markup);await writeFile(join(source,'iframe.html'),markup);
   const server=await serveProduction(source);let result;try{result=await verifyCatalogStory(browser,server,story,evidence,{framework:'vue'});}finally{await server.close();}
   assert.equal(result.status,'failed',JSON.stringify({component,result}));
  }
 }finally{await browser.close();await rm(directory,{recursive:true,force:true});}
});
