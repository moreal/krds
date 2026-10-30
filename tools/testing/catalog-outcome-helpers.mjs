import {expect} from '@playwright/test';
import {navigationLedgerState,readNavigationLedger,requireNavigationReceipt} from './catalog-navigation-ledger.mjs';
export {expect};
export const root=(page,id)=>page.locator(`[data-krds-component="${id}"][data-krds-part="root"]`);
export const part=(page,id,name)=>page.locator(`[data-krds-component="${id}"][data-krds-part="${name}"]`);
export const role=(page,name,label)=>page.getByRole(name,{name:label,exact:true});
export const host=(page,name)=>page.locator(`[data-krds-host="${name}"]`);
export const manual=reason=>Object.freeze({manualRequired:reason});
export const partial=(run,reason)=>Object.freeze({run,manualRequired:reason});
export async function events(driver,name,expected){const read=async()=>{const actual=await driver.readEvents();return name?actual.filter(event=>event.name===name):actual;};if(expected.length)await expect.poll(read).toEqual(expected);else expect(await read()).toEqual(expected);}
export async function quiet(driver){await events(driver,null,[]);}
export async function request(driver,name,detail){await events(driver,null,[{name,detail}]);}
export async function tag(locator,name){await expect(locator).toHaveCount(1);expect(await locator.evaluate(node=>node.tagName)).toBe(name.toUpperCase());}
export async function anchor(locator,href){await tag(locator,'a');await expect(locator).toHaveAttribute('href',href);}
export async function patchHost(page,driver,fixture,patch){const current=await page.evaluate(()=>window.__KRDS_FIXTURE__?.getState().__host??{});await driver.setState({__host:{...fixture.host,...current,...patch}});}
export async function teardown(page,driver,fixture){await patchHost(page,driver,fixture,{mounted:false});await expect(root(page,fixture.componentId)).toHaveCount(0);}
export function associatedForm(node){
  const Form=node.ownerDocument.defaultView.HTMLFormElement;
  for(let current=node;current;current=current.parentNode??current.host){
    for(const candidate of [current.form,current.formControl?.internals?.form,current.internals?.form])if(candidate instanceof Form)return candidate;
    if(current.constructor?.formAssociated===true){
      const explicit=current.getAttribute('form');
      const candidate=explicit?current.ownerDocument.getElementById(explicit):current.closest('form');
      if(candidate instanceof Form)return candidate;
    }
  }
  throw new Error('Actual native or form-associated custom-element form owner required');
}
export async function form(control,name){
  const owner=await control.evaluateHandle(associatedForm);
  try{return await owner.evaluate(async(form,key)=>Promise.all(new FormData(form).getAll(key).map(async value=>typeof value==='string'?value:{name:value.name,type:value.type,size:value.size,text:await value.text()})),name);}
  finally{await owner.dispose();}
}
export async function observeSubmissions(control){
  const owner=await control.evaluateHandle(associatedForm);
  try{await owner.evaluate(form=>{window.__catalogSubmits=0;form.addEventListener('submit',event=>{window.__catalogSubmits++;event.preventDefault();});});}finally{await owner.dispose();}
}
export async function cancelReset(control){
  const owner=await control.evaluateHandle(associatedForm);
  try{await owner.evaluate(form=>form.addEventListener('reset',event=>event.preventDefault(),{once:true}));}finally{await owner.dispose();}
}
export async function ids(control,attribute){return control.evaluate((node,attr)=>{
  const owner=node.getRootNode(),names=(node.getAttribute(attr)||'').split(/\s+/).filter(Boolean);
  if(names.length)return names.map(id=>({id,text:owner.getElementById(id)?.textContent??null}));
  const property={'aria-describedby':'ariaDescribedByElements','aria-labelledby':'ariaLabelledByElements','aria-controls':'ariaControlsElements'}[attr];
  return [...(node[property]??[])].map((element,index)=>({id:element.id||`native-reference-${index}`,text:element.isConnected?element.textContent:null}));
},attribute);}
export async function relation(control,attribute,text){const values=await ids(control,attribute);expect(values.length).toBeGreaterThan(0);expect(values.map(value=>value.text)).not.toContain(null);expect(new Set(values.map(value=>value.id)).size).toBe(values.length);if(text)expect(values.map(value=>value.text).join(' ')).toContain(text);}
export async function containsFocus(container){return container.evaluate(node=>{
  let active=node.ownerDocument.activeElement;while(active?.shadowRoot?.activeElement)active=active.shadowRoot.activeElement;
  for(let current=active;current;current=current.assignedSlot??current.parentNode??current.host)if(current===node)return true;return false;
});}
export async function focusableInside(container){expect(await containsFocus(container)).toBe(true);}
export async function focusOutsideHidden(page){expect(await page.evaluate(()=>{
  let active=document.activeElement;while(active?.shadowRoot?.activeElement)active=active.shadowRoot.activeElement;
  for(let node=active;node;node=node.assignedSlot??node.parentNode??node.host)if(node.nodeType===1&&(node.hasAttribute('hidden')||node.hasAttribute('inert')||node.getAttribute('aria-hidden')==='true'))return false;
  return true;
})).toBe(true);}
export async function usableFocus(page){expect(await page.evaluate(()=>{
  let node=document.activeElement;while(node?.shadowRoot?.activeElement)node=node.shadowRoot.activeElement;
  const box=node?.getBoundingClientRect();let inert=false;for(let parent=node;parent;parent=parent.assignedSlot??parent.parentNode??parent.host)if(parent.nodeType===1&&(parent.hasAttribute('inert')||parent.hasAttribute('hidden')))inert=true;
  return Boolean(node?.isConnected&&!inert&&!node.disabled&&box?.width&&box?.height);
})).toBe(true);}
export async function noInteractive(container){await expect(container.locator('a[href],button,input,select,textarea,[tabindex]:not([tabindex="-1"])')).toHaveCount(0);}
export async function insideViewport(page,locator){const bounds=await locator.boundingBox();expect(bounds).not.toBeNull();const size=page.viewportSize();expect(bounds.x).toBeGreaterThanOrEqual(0);expect(bounds.y).toBeGreaterThanOrEqual(0);expect(bounds.x+bounds.width).toBeLessThanOrEqual(size.width+1);expect(bounds.y+bounds.height).toBeLessThanOrEqual(size.height+1);}
export async function noHorizontalOverflow(page){expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1)).toBe(true);}
export async function nativeReset(page){await role(page,'button','초기화').click();await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));}
export async function hiddenDocument(page,run){
  const other=await page.context().newPage();let session,windowId,originalBounds;
  const actions=[];
  const record=async(type,detail={})=>{
    actions.push({type,...detail,...await page.evaluate(()=>({hidden:document.hidden,visibilityState:document.visibilityState,focused:document.hasFocus(),at:Date.now()}))});
    await page.evaluate(actions=>{window.__KRDS_NATIVE_VISIBILITY_ACTIONS__=actions;},actions);
  };
  try{
    await record('before-tab-switch');
    await other.goto('about:blank');await other.bringToFront();
    let hidden=await expect.poll(()=>page.evaluate(()=>document.hidden),{timeout:1500}).toBe(true).then(()=>true,()=>false);
    await record(hidden?'tab-hidden-confirmed':'tab-switch-stayed-visible');
    if(!hidden&&page.__krdsPrivateNativeVisibility&&page.context().browser().browserType().name()==='chromium'){
      session=await page.context().newCDPSession(page);
      const actual=await session.send('Browser.getWindowForTarget');windowId=actual.windowId;originalBounds=actual.bounds;
      await session.send('Browser.setWindowBounds',{windowId,bounds:{windowState:'minimized'}});
      await record('private-window-minimize',{windowId,reportedBounds:(await session.send('Browser.getWindowBounds',{windowId})).bounds});
      hidden=await expect.poll(()=>page.evaluate(()=>document.hidden),{timeout:1500}).toBe(true).then(()=>true,()=>false);
      await record(hidden?'minimize-hidden-confirmed':'minimize-stayed-visible');
    }
    try { expect(hidden).toBe(true); }
    catch {
      const error=new Error('Actual browser document visibility did not become hidden. This required timer scenario is browser-capability-blocked; document.hidden and visibilitychange were not spoofed. Run in a browser environment that exposes genuine background visibility.');
      error.code='KRDS_BROWSER_CAPABILITY_REQUIRED';throw error;
    }
    await run();
  }finally{
    try{
      if(session&&originalBounds){
        await session.send('Browser.setWindowBounds',{windowId,bounds:{windowState:'normal'}});
        if(originalBounds.windowState==='normal')await session.send('Browser.setWindowBounds',{windowId,bounds:{left:originalBounds.left,top:originalBounds.top,width:originalBounds.width,height:originalBounds.height}});
        else if(originalBounds.windowState!=='minimized')await session.send('Browser.setWindowBounds',{windowId,bounds:{windowState:originalBounds.windowState}});
        await record('private-window-restore-request',{windowId,reportedBounds:(await session.send('Browser.getWindowBounds',{windowId})).bounds});
      }
      await other.close();await page.bringToFront();await expect.poll(()=>page.evaluate(()=>!document.hidden)).toBe(true);await record('visible-restored');
    }finally{await session?.detach();}
  }
}
export async function mutations(page,selector){await page.locator(selector).evaluate(node=>{window.__catalogMutations=[];window.__catalogObserver?.disconnect();window.__catalogObserver=new MutationObserver(records=>{for(const record of records)window.__catalogMutations.push({type:record.type,text:record.target.textContent});});window.__catalogObserver.observe(node,{childList:true,characterData:true,subtree:true});});}
export async function mutationCount(page){return page.evaluate(()=>window.__catalogMutations.length);}
export async function outside(page){const candidate=host(page,'outside-action');await expect(candidate).toBeVisible();return candidate;}
export async function assertCleanup(page){
  const state=await page.evaluate(()=>{
    const roots=[document];for(let n=0;n<roots.length;n++)for(const element of roots[n].querySelectorAll('*'))if(element.shadowRoot)roots.push(element.shadowRoot);
    let leakedInert=0,modal=0;
    for(const owner of roots){modal+=owner.querySelectorAll('dialog:modal').length;for(const node of owner.querySelectorAll('[inert]')){
      if(node.closest('[hidden],[aria-hidden="true"],dialog:not([open]),[data-krds-state~="closed"]'))continue;
      const css=getComputedStyle(node);if(css.display!=='none'&&css.visibility!=='hidden')leakedInert++;
    }}
    return {leakedInert,modal,locked:['hidden','clip'].includes(getComputedStyle(document.body).overflow)||['hidden','clip'].includes(getComputedStyle(document.documentElement).overflow)};
  });
  expect(state).toEqual({leakedInert:0,modal:0,locked:false});
  const target=host(page,'outside-action');if(await target.count()){await target.evaluate(node=>node.focus());await expect(target).toBeFocused();}
}
export async function trackFocus(page){await page.evaluate(()=>{window.__catalogFocusCalls=[];if(!window.__catalogOriginalFocus){window.__catalogOriginalFocus=HTMLElement.prototype.focus;HTMLElement.prototype.focus=function(...args){window.__catalogFocusCalls.push({id:this.id,part:this.getAttribute('data-krds-part'),connected:this.isConnected,inert:(()=>{for(let node=this;node;node=node.assignedSlot??node.parentNode??node.host)if(node.nodeType===1&&node.hasAttribute('inert'))return true;return false;})()});return window.__catalogOriginalFocus.apply(this,args);};}});}
export async function focusCalls(page){return page.evaluate(()=>window.__catalogFocusCalls);}

export async function pointer(page,locator){await locator.scrollIntoViewIfNeeded();const bounds=await locator.boundingBox();expect(bounds).not.toBeNull();await page.mouse.click(bounds.x+bounds.width/2,bounds.y+bounds.height/2);}

export function ownedNative(page,id,tagName){const container=root(page,id);return container.and(page.locator(tagName)).or(container.locator(tagName));}
export async function ownedList(page,id,tagName){
  const container=root(page,id);
  await expect(container).toHaveCount(1);
  const rootTag=await container.evaluate(node=>node.tagName.toLowerCase());
  if(['ul','ol'].includes(rootTag)){await tag(container,tagName);return container;}
  const candidates=container.locator(tagName);
  const owner=await container.elementHandle();
  const indices=await candidates.evaluateAll((nodes,owner)=>nodes.flatMap((node,index)=>{
    for(let parent=node.assignedSlot??node.parentNode??node.host;parent;parent=parent.assignedSlot??parent.parentNode??parent.host){
      if(parent===owner)return [index];
      if(parent.nodeType===1&&['UL','OL'].includes(parent.tagName))return [];
    }
    return [];
  }),owner);
  expect(indices,'One actual outer native list is required; nested lists belong to its list items').toHaveLength(1);
  return candidates.nth(indices[0]);
}
export async function modalIsolation(page,dialog){
  await expect(dialog).toBeVisible();
  await expect.poll(()=>containsFocus(dialog)).toBe(true);
  const native=await dialog.evaluate(node=>node.matches('dialog:modal'));
  if(!native)await expect(dialog).toHaveAttribute('aria-modal','true');
  const outsideControl=host(page,'outside-action');
  if(await outsideControl.count()){
    const target=await outsideControl.elementHandle();
    expect(await dialog.evaluate((container,target)=>{for(let current=target;current;current=current.assignedSlot??current.parentNode??current.host)if(current===container)return true;return false;},target)).toBe(false);
    await outsideControl.evaluate(node=>node.focus());await focusableInside(dialog);
  }
}

export async function panelPresentation(page,id){const container=root(page,id);const dialog=container.and(page.getByRole('dialog',{includeHidden:true})).or(container.getByRole('dialog',{includeHidden:true}));return await dialog.count()?dialog:container;}

export function branchButton(page,label){
  const escaped=label.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
  return root(page,'side-navigation').getByRole('button',{name:new RegExp(`^${escaped}(?: (?:접기|펼치기))?$`)});
}
export async function followNativeModifiedLink(page,link,href){
  await anchor(link,href);
  const ledger=await navigationLedgerState();
  const responses=[];
  const record=response=>{if(response.request().isNavigationRequest())responses.push(response);};
  page.context().on('response',record);
  let destination;
  try{
    const opened=page.context().waitForEvent('page');
    const actionStartedAt=Date.now();
    const evidence={expectedUrl:new URL(href,page.url()).href,actionStartedAt,ledgerCursor:ledger?.afterSequence??null,status:'attempted'};
    (page.__krdsNativeNavigationEvidence??=[]).push(evidence);
    await link.click({modifiers:['ControlOrMeta']});destination=await opened;
    const expected=new URL(href,page.url()).href;
    await expect.poll(()=>destination.url()).toBe(expected);
    await destination.waitForLoadState('load');
    const response=responses.find(response=>response.url()===expected&&response.frame()===destination.mainFrame());
    evidence.browserInitialResponseObserved=Boolean(response);
    if(response){expect(response.status()).toBe(200);expect(response.headers()['content-type']).toContain('text/html');}
    else expect(ledger,'Missing browser response requires current immutable server-ledger evidence').not.toBeNull();
    if(ledger)await expect.poll(async()=>{
      try{evidence.receipt=requireNavigationReceipt(await readNavigationLedger(ledger.path),{...ledger,actionStartedAt,expectedUrl:expected});return evidence.receipt.status;}
      catch{return null;}
    },{message:'Actual current navigation must serve immutable local HTML bytes with status200'}).toBe(200);
    const headings=destination.getByRole('heading',{level:1});
    await expect(headings).not.toHaveCount(0);
    evidence.actualHeadingTexts=await headings.allTextContents();
    expect(evidence.actualHeadingTexts.some(text=>text.trim().length>0)).toBe(true);
    evidence.actualUrl=destination.url();evidence.status='observed';return evidence;
  }finally{page.context().off('response',record);await destination?.close();}
}
