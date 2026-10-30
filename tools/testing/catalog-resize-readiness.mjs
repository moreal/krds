import {randomUUID} from 'node:crypto';

export async function resizeWithNativeReadiness(page,viewport,{timeoutMs=5000}={}){
  if(!Number.isSafeInteger(timeoutMs)||timeoutMs<=0||timeoutMs>5000)throw new TypeError('Resize readiness timeout must be positive and at most5000');
  const key='__krdsNativeResize_'+randomUUID().replaceAll('-','');
  await page.evaluate(({key,viewport})=>{
    const state={ready:false,frames:0,events:[]};window[key]=state;
    const listener=event=>{
      state.events.push({trusted:event.isTrusted,width:innerWidth,height:innerHeight,at:performance.now()});
      if(!event.isTrusted||innerWidth!==viewport.width||innerHeight!==viewport.height)return;
      removeEventListener('resize',listener);
      requestAnimationFrame(()=>{state.frames++;requestAnimationFrame(()=>{state.frames++;state.ready=true;});});
    };
    state.cleanup=()=>removeEventListener('resize',listener);
    addEventListener('resize',listener);
  },{key,viewport});
  let proof;
  try{
    await page.setViewportSize(viewport);
    await page.waitForFunction(key=>window[key]?.ready===true,key,{timeout:timeoutMs});
  }finally{
    try{proof=await page.evaluate(key=>{const state=window[key];if(!state)return {ready:false,events:null,error:'Resize observation document missing'};state.cleanup();const result={ready:state.ready,frames:state.frames,events:state.events,width:innerWidth,height:innerHeight};delete window[key];return result;},key);}
    catch(error){proof={ready:false,events:null,error:String(error)};}
    (page.__krdsNativeResizeEvidence??=[]).push({target:viewport,...proof});
  }
  return proof;
}
