import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {createHash} from 'node:crypto';
import {serveProduction} from '../testing/support.mjs';
const digest=bytes=>createHash('sha256').update(bytes).digest('hex');
async function specimen(run){
 const directory=await mkdtemp(join(tmpdir(),'krds-artifact-snapshot-'));await mkdir(join(directory,'assets'));
 await writeFile(join(directory,'index.html'),'<!doctype html><html lang="ko"><meta charset="utf-8"><title>Actual artifact inspection</title><main><h1>loading</h1></main><script type="module" src="/assets/start.js"></script></html>');
 await writeFile(join(directory,'assets/start.js'),'import {value} from "./value.js";document.querySelector("h1").textContent=value;');
 await writeFile(join(directory,'assets/value.js'),'export const value="IMMUTABLE-ONE";');
 const original={};for(const path of ['index.html','assets/start.js','assets/value.js'])original['/'+path]=await readFile(join(directory,path));
 const server=await serveProduction(directory,{fixture:true});
 try{
  await rm(join(directory,'assets'),{recursive:true});await mkdir(join(directory,'assets'));
  await writeFile(join(directory,'index.html'),'<!doctype html><h1>DIFFERENT-PRODUCER-BUILD</h1>');
  await writeFile(join(directory,'assets/new.js'),'throw Error("New build must not leak into old artifact server")');
  await run({directory,server,original});
 }finally{await server.close();await rm(directory,{recursive:true,force:true});}
}
test('production server serves exact immutable startup bytes after a producer rebuild removes its live chunks',async()=>{
 await specimen(async({directory,server,original})=>{
  for(const [path,bytes] of Object.entries(original)){
   const response=await fetch(server.origin+path);assert.equal(response.status,200,path);assert.equal(digest(Buffer.from(await response.arrayBuffer())),digest(bytes),path);
  }
  assert.equal((await fetch(server.origin+'/assets/new.js')).status,404);
  assert.equal(server.snapshot.stableVerified,true);assert.equal(server.snapshot.files.length,3);
  for(const [path,bytes] of Object.entries(original))assert.equal(server.snapshot.files.find(file=>file.path===path).sha256,digest(bytes));
  const changed=await serveProduction(directory);try{assert.notEqual(changed.snapshot.sha256,server.snapshot.sha256);}finally{await changed.close();}
 });
});
test('actual browser module imports remain bound to the immutable build after all original live module files are removed',async()=>{
 await specimen(async({server})=>{const {chromium}=await import('playwright');const browser=await chromium.launch();try{
  const page=await browser.newPage();const errors=[];page.on('pageerror',error=>errors.push(String(error)));
  await page.goto(server.origin+'/fixtures/checkbox?case=outcome-01');await page.getByRole('heading',{name:'IMMUTABLE-ONE',exact:true}).waitFor();assert.deepEqual(errors,[]);
 }finally{await browser.close();}});
});
