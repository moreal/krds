import {launchSelectedHeadedChromium} from '../../tests/compatibility/headed-browser.mjs';
import {acquireNativeVisibilityLease} from './catalog-visibility-lease.mjs';
export function requiresNativeVisibility(fixture){
  return (fixture.componentId==='toast'&&fixture.caseId==='outcome-05')||(fixture.componentId==='snackbar'&&fixture.caseId==='outcome-12');
}
export async function catalogBrowserRuntime(defaultPage,fixture){
  const actual=defaultPage.context().browser();
  if(!requiresNativeVisibility(fixture)||actual.browserType().name()!=='chromium')return {page:defaultPage,evidence:{actualBrowser:actual.browserType().name(),version:actual.version(),nativeVisibilityContext:false}};
  const lease=await acquireNativeVisibilityLease();let runtime;
  try{
    runtime=await launchSelectedHeadedChromium();
    const page=await runtime.context.newPage();
    page.__krdsPrivateNativeVisibility=true;
    const install=()=>{
      const samples=[];window.__KRDS_NATIVE_VISIBILITY_TRACE__=samples;
      const record=event=>samples.push({type:event?.type??'initial',trusted:event?.isTrusted??null,hidden:document.hidden,visibilityState:document.visibilityState,focused:document.hasFocus(),at:Date.now()});
      for(const name of ['visibilitychange','focus','blur'])addEventListener(name,record,true);
      record();
    };
    await page.addInitScript(install);await page.evaluate(install);
    return {
      page,evidence:{actualBrowser:'chromium',version:runtime.browser.version(),nativeVisibilityContext:true,headed:true,defaultContext:true,noDefaults:true,executable:runtime.executable,args:runtime.args,lease:lease.evidence,coverageAwarded:false},
      readVisibilityEvidence:async()=>({actualDefaultContext:page.context()===runtime.context,...await page.evaluate(()=>({samples:window.__KRDS_NATIVE_VISIBILITY_TRACE__??[],actions:window.__KRDS_NATIVE_VISIBILITY_ACTIONS__??[]}))}),
      cleanup:async()=>{try{await runtime.cleanup();}finally{await lease.cleanup();}},
    };
  }catch(error){try{await runtime?.cleanup();}finally{await lease.cleanup();}throw error;}
}
