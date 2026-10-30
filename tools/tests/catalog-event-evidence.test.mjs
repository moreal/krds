import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,readFile,writeFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {serveProduction} from '../testing/support.mjs';
import {createComponentEventEvidence} from '../testing/catalog-event-evidence.mjs';

test('real pre-navigation callback evidence survives a bridge-free static destination and rejects lost/stale/same-URL bridge failures',async()=>{
  const directory=await mkdtemp(join(tmpdir(),'krds-event-evidence-'));
  const saved={ledger:process.env.KRDS_NAVIGATION_LEDGER,snapshot:process.env.KRDS_NAVIGATION_SNAPSHOT};
  try{
    await mkdir(join(directory,'local/done'),{recursive:true});
    await writeFile(join(directory,'driver.js'),await readFile(new URL('../../packages/test-contracts/dist/driver.js',import.meta.url)));
    const script=`import {createFixtureBridge} from '/driver.js';const mode=new URL(location.href).searchParams.get('mode');const bridge=createFixtureBridge('vue',{});let lost=false;const original=bridge.readEvents;bridge.readEvents=()=>{if(lost)throw new Error('actual callback snapshot lost');return original();};if(mode==='stale'){for(const name of ['beforeunload','pagehide'])addEventListener(name,event=>event.stopImmediatePropagation(),true);}document.querySelector('button').onclick=()=>{bridge.recordEvent('localeRequest',{locale:'en',href:'/local/done'});if(mode==='stay')return;if(mode==='missing'){delete window.__KRDS_FIXTURE__;return;}if(mode==='prior200'){delete window.__KRDS_FIXTURE__;history.pushState(null,'','/local/done');return;}if(mode==='lost')lost=true;location.href='/local/done';};`;
    await writeFile(join(directory,'index.html'),`<!doctype html><html lang="ko"><meta charset="utf-8"><title>Event inspection</title><main><h1>Plain observer specimen</h1><button>이동</button></main><script type="module">${script}</script></html>`);
    await writeFile(join(directory,'local/done/index.html'),'<!doctype html><html lang="en"><meta charset="utf-8"><title>Local destination</title><main><h1>Real static destination</h1></main></html>');
    const ledger=join(directory,'responses.ndjson'),snapshot=join(directory,'snapshot.json');
    const server=await serveProduction(directory,{responseLedger:ledger});await writeFile(snapshot,JSON.stringify(server.snapshot));
    process.env.KRDS_NAVIGATION_LEDGER=ledger;process.env.KRDS_NAVIGATION_SNAPSHOT=snapshot;
    try{
      const {chromium,webkit}=await import('playwright');
      for(const engine of [chromium,webkit]){
        const browser=await engine.launch();
        try{for(const mode of ['stay','correct','missing','prior200','stale','lost']){
          const page=await browser.newPage();
          try{
            await page.goto(server.origin+'/local/done'); // A genuine prior200 may never prove this action.
            await page.goto(server.origin+'/?mode='+mode);await page.waitForFunction(()=>window.__KRDS_FIXTURE__?.protocol===1);
            const evidence=await createComponentEventEvidence(page);
            await page.getByRole('button',{name:'이동'}).click();
            if(!['missing','stay'].includes(mode))await page.waitForURL(server.origin+'/local/done');
            if(['stay','correct'].includes(mode)){
              const result=await evidence.finalize();assert.equal(result.kind,mode==='stay'?'current-bridge':'real-navigation');
              assert.deepEqual(result.events,[{name:'localeRequest',detail:{locale:'en',href:'/local/done'}}]);
              if(mode==='correct'){assert.equal(result.navigationReceipt.status,200);assert.ok(result.snapshots.some(item=>item.trusted===true&&['beforeunload','pagehide'].includes(item.phase)));}
              assert.equal(await page.evaluate(()=>Boolean(window.__KRDS_FIXTURE__)),mode==='stay');
            }else await assert.rejects(evidence.finalize(),/bridge|snapshot|navigation|callback/i);
          }finally{await page.close();}
        }}finally{await browser.close();}
      }
    }finally{await server.close();}
  }finally{
    for(const [name,value] of [['KRDS_NAVIGATION_LEDGER',saved.ledger],['KRDS_NAVIGATION_SNAPSHOT',saved.snapshot]]){if(value===undefined)delete process.env[name];else process.env[name]=value;}
    await rm(directory,{recursive:true,force:true});
  }
});
