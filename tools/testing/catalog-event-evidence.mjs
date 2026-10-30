import {randomUUID} from 'node:crypto';
import {expect} from '@playwright/test';
import {navigationLedgerState,readNavigationLedger,requireNavigationReceipt} from './catalog-navigation-ledger.mjs';

/** Private observation transport, not an application bridge or event producer. */
export async function createComponentEventEvidence(page){
  const initialUrl=page.url(),startedAt=Date.now(),token=randomUUID();
  const name='__krdsObservedEvents_'+token.replaceAll('-','');
  const snapshots=[];
  const navigation=await navigationLedgerState();
  await page.exposeBinding(name,({frame},snapshot)=>{
    if(frame!==page.mainFrame()||snapshot.token!==token)throw new Error('Unexpected component event evidence source');
    snapshots.push({...snapshot,receivedAt:Date.now()});
  });
  await page.evaluate(async({name,token})=>{
    const bridge=window.__KRDS_FIXTURE__;
    if(bridge?.protocol!==1||typeof bridge.readEvents!=='function')throw new Error('Actual fixture bridge required for event evidence health');
    const read=bridge.readEvents.bind(bridge),sourceDocumentUrl=location.href;
    const capture=(phase,event)=>{
      const result={phase,token,url:location.href,sourceDocumentUrl,framework:bridge.framework,protocol:bridge.protocol,trusted:event?.isTrusted??null,at:Date.now()};
      try{const events=read();if(!Array.isArray(events))throw new Error('Raw callback snapshot must be an array');result.events=events;}
      catch(error){result.error=String(error);}
      return window[name](result);
    };
    addEventListener('beforeunload',event=>{void capture('beforeunload',event);},true);
    addEventListener('pagehide',event=>{void capture('pagehide',event);},true);
    await capture('health');
  },{name,token});
  if(snapshots[0]?.error||!Array.isArray(snapshots[0]?.events))throw new Error('Actual health callback snapshot unavailable');
  const framework=snapshots[0].framework;
  return {
    observedSnapshots:()=>structuredClone(snapshots),
    async finalize(){
      const currentUrl=page.url();
      const current=await page.evaluate(()=>{
        const bridge=window.__KRDS_FIXTURE__;
        if(!bridge)return null;
        return {framework:bridge.framework,protocol:bridge.protocol,events:bridge.readEvents()};
      });
      if(current){
        if(current.protocol!==1||current.framework!==framework||!Array.isArray(current.events))throw new Error('Actual final fixture bridge identity/callback snapshot mismatch');
        snapshots.push({phase:'final-current-bridge',url:currentUrl,events:current.events,receivedAt:Date.now()});
        return {kind:'current-bridge',initialUrl,currentUrl,events:current.events,snapshots};
      }
      const initial=new URL(initialUrl),destination=new URL(currentUrl);
      if(currentUrl===initialUrl||destination.origin!==initial.origin||!destination.pathname.startsWith('/local/'))throw new Error('Missing fixture bridge without an actual different same-origin local navigation');
      if(!navigation)throw new Error('Actual current server navigation receipt required when destination has no fixture bridge');
      await expect.poll(()=>snapshots.filter(item=>item.trusted===true&&['beforeunload','pagehide'].includes(item.phase)).length,{message:'Actual trusted pre-navigation callback snapshot required'}).toBeGreaterThan(0);
      const phases=snapshots.filter(item=>item.trusted===true&&['beforeunload','pagehide'].includes(item.phase));
      const last=phases.at(-1);
      if(last.sourceDocumentUrl!==initialUrl||last.error||!Array.isArray(last.events))throw new Error('Actual pre-navigation callback snapshot lost or stale');
      let receipt;
      await expect.poll(async()=>{
        try{receipt=requireNavigationReceipt(await readNavigationLedger(navigation.path),{...navigation,actionStartedAt:startedAt,expectedUrl:currentUrl});return receipt.status;}
        catch{return null;}
      },{message:'Actual different local navigation requires a new200 HTML served-byte receipt'}).toBe(200);
      return {kind:'real-navigation',initialUrl,currentUrl,events:last.events,snapshots,navigationReceipt:receipt};
    },
  };
}
