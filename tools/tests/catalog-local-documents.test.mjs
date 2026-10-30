import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {serveProduction} from '../testing/support.mjs';
import {allowedRequest} from '../testing/network.mjs';
async function local(run){const directory=await mkdtemp(join(tmpdir(),'krds-local-documents-'));await mkdir(join(directory,'local/notice/a'),{recursive:true});await writeFile(join(directory,'index.html'),'<!doctype html><meta charset="utf-8"><a href="/local/notice/a">신청 안내</a>');await writeFile(join(directory,'local/notice/index.html'),'<!doctype html><meta charset="utf-8"><h1>실제 로컬 공고 목록</h1>');await writeFile(join(directory,'local/notice/a/index.html'),'<!doctype html><meta charset="utf-8"><h1>실제 로컬 공고 상세</h1>');await writeFile(join(directory,'local/direct'),'<!doctype html><h1>Owned exact document</h1>');await writeFile(join(directory,'local/binary'),'not HTML');const server=await serveProduction(directory);try{await run(server);}finally{await server.close();await rm(directory,{recursive:true,force:true});}}
test('only actual known local documents get HTML directory aliases or content-sensitive extensionless MIME',async()=>{await local(async(server)=>{
 for(const path of ['/local/notice','/local/notice/','/local/notice/a','/local/direct']){const response=await fetch(server.origin+path);assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'text/html');assert.match(await response.text(),/h1/);assert.equal(allowedRequest(server.origin+path,'document',server.origin,server.assets),true);}
 const binary=await fetch(server.origin+'/local/binary');assert.equal(binary.headers.get('content-type'),'application/octet-stream');
 for(const path of ['/local/missing','/api/state','/arbitrary/spa/path']){assert.equal((await fetch(server.origin+path)).status,404);assert.equal(allowedRequest(server.origin+path,'document',server.origin,server.assets),false);}
 assert.equal((await fetch(server.origin+'/%2e%2e%2fpackage.json')).status,403);
});});
test('native modified anchor opens the real directory document, not a synthesized shell or download',async()=>{await local(async(server)=>{const {chromium}=await import('playwright');const browser=await chromium.launch();try{const context=await browser.newContext(),page=await context.newPage();await page.goto(server.origin);const opened=context.waitForEvent('page');await page.getByRole('link',{name:'신청 안내',exact:true}).click({modifiers:['ControlOrMeta']});const destination=await opened;await destination.getByRole('heading',{name:'실제 로컬 공고 상세',exact:true}).waitFor();assert.equal(destination.url(),server.origin+'/local/notice/a');await context.close();}finally{await browser.close();}});});

test('only four explicit composition entry routes map to the fixture index, retaining query/case and rejecting arbitrary fallback',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'krds-composition-entries-'));
 await writeFile(join(directory,'index.html'),'<!doctype html><meta charset="utf-8"><h1 id="route"></h1><script>document.getElementById("route").textContent=location.pathname+location.search</script>');
 const fixture=await serveProduction(directory,{fixture:true}),production=await serveProduction(directory);
 let browser;
 try{
  for(const route of ['form-errors','search-results','consent-confirmation','service-layout']){
   const path=`/examples/${route}?case=outcome-01`;const response=await fetch(fixture.origin+path);assert.equal(response.status,200);assert.equal(response.headers.get('content-type'),'text/html');
   assert.equal((await fetch(production.origin+path)).status,404);
  }
  for(const path of ['/examples/unknown','/examples/service-layout/extra','/examples/service-layout/','/api/examples/service-layout','/anything'])assert.equal((await fetch(fixture.origin+path)).status,404);
  const {chromium}=await import('playwright');browser=await chromium.launch();const page=await browser.newPage();await page.goto(fixture.origin+'/examples/form-errors?case=required');
  assert.equal(await page.getByRole('heading').textContent(),'/examples/form-errors?case=required');
 }finally{await browser?.close();await fixture.close();await production.close();await rm(directory,{recursive:true,force:true});}
});
