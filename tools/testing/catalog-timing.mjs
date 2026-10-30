import {expect} from '@playwright/test';

/** Observe the live rendered generation, independently of adapter internals.
 * The fixture bridge acknowledges two animation frames; relative sleeps begun
 * after that acknowledgement must not silently count those frames twice. */
function initializeExposureTracking(){
  if(window.__catalogExposureTracking)return;
  const records={};let bridge;const observed=new WeakSet();
  const options={childList:true,characterData:true,subtree:true,attributes:true};
  const sample=()=>{
    const roots=[document];
    for(let index=0;index<roots.length;index++){
      const owner=roots[index];if(!observed.has(owner)){observer.observe(owner,options);observed.add(owner);}
      for(const element of owner.querySelectorAll('*'))if(element.shadowRoot)roots.push(element.shadowRoot);
    }
    for(const component of ['toast','snackbar']){
      const candidates=roots.flatMap(owner=>[...owner.querySelectorAll(`[data-krds-component="${component}"][data-krds-part="root"]`)]);
      let root,status;
      for(const candidate of candidates){
        let content=candidate.matches('[role="status"]')?candidate:candidate.querySelector('[role="status"]');
        if(!content)for(const owner of roots){
          let belongs=false;for(let node=owner.host;node;node=node.parentNode??node.host)if(node===candidate){belongs=true;break;}
          if(belongs){content=owner.querySelector('[role="status"]');if(content)break;}
        }
        if(content){root=candidate;status=content;break;}
      }
      const visible=Boolean(status&&status.getClientRects().length&&!status.closest('[hidden],[inert]')&&getComputedStyle(status).visibility!=='hidden');
      if(!visible){if(records[component])records[component].visible=false;continue;}
      const state=window.__KRDS_FIXTURE__?.getState?.()??{};
      const message=state.message;
      const signature=JSON.stringify({id:message?.id,text:status.textContent,title:message?.title,error:message?.error,tone:message?.tone,duration:state.durationMs,action:state.action});
      if(!records[component]?.visible||records[component].signature!==signature)records[component]={visible:true,signature,shownAt:Date.now()};
    }
    const current=window.__KRDS_FIXTURE__;
    if(current&&current!==bridge){bridge=current;current.subscribe?.(()=>sample());}
  };
  const observer=new MutationObserver(sample);
  // Shadow-root creation is not a light-DOM mutation. Observe the actual new
  // open root immediately, without changing its contents, owner or return value.
  const attachShadow=Element.prototype.attachShadow;
  Element.prototype.attachShadow=function(init){
    const shadow=attachShadow.call(this,init);
    if(init.mode==='open'){observer.observe(shadow,options);observed.add(shadow);sample();}
    return shadow;
  };
  window.__catalogExposureTracking={records,sample};sample();
}
export async function installCatalogExposureTracking(page){await page.addInitScript(initializeExposureTracking);await page.evaluate(initializeExposureTracking);}
export async function beforeExposureDeadline(page,component,duration,margin=1){
  await expect.poll(()=>page.evaluate(component=>window.__catalogExposureTracking?.records[component]?.shownAt??null,component)).not.toBeNull();
  const shownAt=await page.evaluate(component=>window.__catalogExposureTracking.records[component].shownAt,component);
  await page.clock.pauseAt(new Date(shownAt+duration-margin));
}
/** Preserve a full minimum exposure and allow only the native bridge's two-frame
 * render acknowledgement when checking the first eligible timeout callback. */
export async function crossExposureDeadline(page){await page.clock.runFor(34);}
export async function pauseClockNow(page){
  // setFixedTime holds wall time long enough to pause at that exact public clock
  // value, without jumping forward across an old generation's pending deadline.
  const now=await page.evaluate(()=>Date.now());
  await page.clock.setFixedTime(new Date(now));
  await page.clock.pauseAt(new Date(now));
  await page.clock.setSystemTime(new Date(now));
}
export async function updateTimedState(page,driver,patch){
  if(driver.catalogClockManaged)return driver.setState(patch);
  await pauseClockNow(page);
  let settled=false,failure;
  const pending=driver.setState(patch).then(()=>{settled=true;},error=>{failure=error;settled=true;});
  // Drive the actual bridge acknowledgement; do not bypass its promise or move
  // component exposure time outside the controlled clock.
  for(let frame=0;frame<12&&!settled;frame++)await page.clock.runFor(16);
  await pending;
  if(failure)throw failure;
}
export function clockManagedDriver(page,driver){
  if(driver.catalogClockManaged)return driver;
  return {catalogClockManaged:true,open:async fixture=>{
    let settled=false,failure;const pending=driver.open(fixture).then(()=>{settled=true;},error=>{failure=error;settled=true;});
    for(let frame=0;frame<1200&&!settled;frame++){
      try{await page.clock.runFor(16);}catch(error){if(settled)break;if(!/context|navigation|frame/i.test(String(error)))throw error;}
    }
    await pending;if(failure)throw failure;
  },readEvents:()=>driver.readEvents(),setState:patch=>updateTimedState(page,driver,patch)};
}

export async function visibleAfterClockAction(page,driver,locator){
  if(driver.catalogClockManaged)await expect.poll(async()=>{await page.clock.runFor(16);return locator.isVisible();}).toBe(true);
  else await expect(locator).toBeVisible();
}
