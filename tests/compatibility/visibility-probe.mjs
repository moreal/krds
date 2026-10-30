import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {launchSelectedHeadedChromium} from './headed-browser.mjs';
import {validateVisibilityObservations,validateVisibilityResults} from './visibility-integrity.mjs';
const directory=resolve(process.env.KRDS_VISIBILITY_OUTPUT??'test-results/t13/visibility');await mkdir(directory,{recursive:true});const results=[];
for(const backgroundingDefaults of[true,false]){
 const runtime=await launchSelectedHeadedChromium({backgroundingDefaults});const observations=[];let session,windowId,before;
 const capture=async(label,page)=>{const row={label,...await page.evaluate(()=>({hidden:document.hidden,visibilityState:document.visibilityState,focused:document.hasFocus(),events:globalThis.__visibilityEvents??[]}))};observations.push(row);console.log(JSON.stringify({backgroundingDefaults,...row}));};
 try{
  const context=runtime.context;const first=context.pages()[0]??await context.newPage();await first.setContent('<title>KRDS visibility first</title><h1>First test tab</h1><script>globalThis.__visibilityEvents=[];document.addEventListener("visibilitychange",()=>globalThis.__visibilityEvents.push({hidden:document.hidden,state:document.visibilityState}));</script>');
  await first.bringToFront();await capture('first-foreground',first);
  const second=await context.newPage();await second.setContent('<title>KRDS visibility second</title><h1>Second test tab</h1>');await second.bringToFront();
  await first.waitForFunction(()=>document.hidden,undefined,{timeout:3000});await capture('first-behind-second-real-tab',first);
  await first.bringToFront();await first.waitForFunction(()=>!document.hidden,undefined,{timeout:3000});await capture('first-restored-real-tab',first);
  session=await context.newCDPSession(first);const window=await session.send('Browser.getWindowForTarget');windowId=window.windowId;before=window.bounds;
  await session.send('Browser.setWindowBounds',{windowId,bounds:{windowState:'minimized'}});await first.waitForFunction(()=>document.hidden,undefined,{timeout:3000});await capture('first-native-window-minimized',first);observations.push({label:'actual-window-bounds-minimized',...await session.send('Browser.getWindowBounds',{windowId})});
  await session.send('Browser.setWindowBounds',{windowId,bounds:{windowState:'normal'}});await first.bringToFront();await first.waitForFunction(()=>!document.hidden,undefined,{timeout:3000});await capture('first-native-window-restored',first);
  validateVisibilityObservations(observations);
  results.push({backgroundingDefaults,version:runtime.browser.version(),executable:runtime.executable,args:runtime.args,attachment:{noDefaults:true,defaultContext:true},observations,status:'real-hidden-state-observed'});
 }catch(error){results.push({backgroundingDefaults,status:'failed',error:String(error),observations});}finally{if(session&&before){await session.send('Browser.setWindowBounds',{windowId,bounds:{windowState:'normal'}}).catch(()=>{});if(before.windowState==='normal'){const {windowState,...bounds}=before;await session.send('Browser.setWindowBounds',{windowId,bounds}).catch(()=>{});}else await session.send('Browser.setWindowBounds',{windowId,bounds:{windowState:before.windowState}}).catch(()=>{});}await writeFile(resolve(directory,`browser-${backgroundingDefaults?'with':'without'}-background-defaults.log`),runtime.logs.join(''));await runtime.cleanup();}
}
await writeFile(resolve(directory,'results.json'),JSON.stringify({scope:'focused real native browser capability; no adapter coverage claim',results},null,2));try{validateVisibilityResults(results);}catch(error){console.error(error);process.exitCode=1;}
