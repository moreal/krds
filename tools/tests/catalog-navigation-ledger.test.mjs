import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {serveProduction} from '../testing/support.mjs';
import {followNativeModifiedLink} from '../testing/catalog-outcome-helpers.mjs';
import {readNavigationLedger,requireNavigationReceipt} from '../testing/catalog-navigation-ledger.mjs';

test('real modified navigation binds a new actual server200 HTML byte receipt and native popup DOM in Chromium and WebKit',async()=>{
  const directory=await mkdtemp(join(tmpdir(),'krds-navigation-ledger-'));
  const original={ledger:process.env.KRDS_NAVIGATION_LEDGER,snapshot:process.env.KRDS_NAVIGATION_SNAPSHOT};
  try{
    await mkdir(join(directory,'local/notice'),{recursive:true});
    await writeFile(join(directory,'index.html'),'<!doctype html><html lang="ko"><meta charset="utf-8"><title>Inspection</title><main><h1>Native observer inspection</h1><a href="/local/notice">공지 예제</a></main></html>');
    await writeFile(join(directory,'local/notice/index.html'),'<!doctype html><html lang="ko"><meta charset="utf-8"><title>Local notice</title><main><h1>실제 로컬 공지 문서</h1><p>독립 예제 목적지</p></main></html>');
    const ledger=join(directory,'responses.ndjson'),snapshotFile=join(directory,'snapshot.json');
    const server=await serveProduction(directory,{responseLedger:ledger});await writeFile(snapshotFile,JSON.stringify(server.snapshot));
    process.env.KRDS_NAVIGATION_LEDGER=ledger;process.env.KRDS_NAVIGATION_SNAPSHOT=snapshotFile;
    try{
      const {chromium,webkit}=await import('playwright');
      for(const engine of [chromium,webkit]){
        const browser=await engine.launch();
        try{
          const page=await browser.newPage();await page.goto(server.origin);
          const before=(await readNavigationLedger(ledger)).at(-1)?.sequence??0;
          const started=Date.now();const evidence=await followNativeModifiedLink(page,page.getByRole('link',{name:'공지 예제'}),'/local/notice');
          assert.equal(evidence.status,'observed');assert.equal(evidence.receipt.status,200);assert.equal(evidence.actualUrl,server.origin+'/local/notice');
          console.log(JSON.stringify({engine:engine.name(),browserInitialResponseObserved:evidence.browserInitialResponseObserved,receipt:evidence.receipt}));
          const records=await readNavigationLedger(ledger);
          const receipt=requireNavigationReceipt(records,{afterSequence:before,actionStartedAt:started,expectedUrl:server.origin+'/local/notice',snapshot:server.snapshot});
          assert.equal(receipt.status,200);assert.match(receipt.bodySha256,/^[a-f0-9]{64}$/);
          const binding={afterSequence:before,actionStartedAt:started,expectedUrl:server.origin+'/local/notice',snapshot:server.snapshot};
          assert.throws(()=>requireNavigationReceipt(records,{...binding,afterSequence:receipt.sequence}),/No actual/);
          for(const [patch,message] of [[{status:404},/returned404|returned 404/],[{bodySha256:'f'.repeat(64)},/served-byte hash/],[{artifactSha256:'f'.repeat(64)},/served-byte hash/],[{asset:'/index.html'},/served-byte hash/]])assert.throws(()=>requireNavigationReceipt([{...receipt,...patch}],binding),message);
          assert.throws(()=>requireNavigationReceipt([{...receipt,status:404},{...receipt,sequence:receipt.sequence+1}],binding),/returned 404/);
        }finally{await browser.close();}
      }
      const {request}=await import('node:http');
      const invalidStatus=await new Promise((resolve,reject)=>{const outgoing=request(server.origin,{path:'http://['},response=>{response.resume();response.on('end',()=>resolve(response.statusCode));});outgoing.on('error',reject);outgoing.end();});
      assert.equal(invalidStatus,400);assert.equal((await fetch(server.origin)).status,200);
    }finally{await server.close();}
  }finally{
    for(const [name,value] of [['KRDS_NAVIGATION_LEDGER',original.ledger],['KRDS_NAVIGATION_SNAPSHOT',original.snapshot]]){if(value===undefined)delete process.env[name];else process.env[name]=value;}
    await rm(directory,{recursive:true,force:true});
  }
});
