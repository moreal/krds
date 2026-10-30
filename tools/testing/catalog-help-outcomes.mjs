import {expect,root,part,role,host,events,quiet,request,tag,patchHost,teardown,relation,ids,focusableInside,usableFocus,noInteractive,insideViewport,assertCleanup,outside,trackFocus,focusCalls,pointer,modalIsolation,panelPresentation,containsFocus} from './catalog-outcome-helpers.mjs';
import {resizeWithNativeReadiness} from './catalog-resize-readiness.mjs';
async function panelEntry(p,id){const panel=await panelPresentation(p,id);await expect(panel).toBeVisible();await expect.poll(()=>containsFocus(panel)).toBe(true);}
async function trap(p,container){for(let n=0;n<5;n++){await p.keyboard.press('Tab');await focusableInside(container);}await p.keyboard.press('Shift+Tab');await focusableInside(container);}
async function stopEvent(d,f,offset=0){const actual=(await d.readEvents()).slice(offset);const stop=actual.filter(event=>event.name==='stop');expect(stop).toEqual([{name:'stop',detail:{reason:'stop',running:false,returnTo:{panel:'tutorial',open:true,startActionId:f.initialState.startActionId}}}]);expect(actual.filter(event=>event.name==='openChange'&&event.detail.open===false)).toEqual([]);}
async function stopped(p,d,f,offset=0){await expect(part(p,'coach-mark','popover')).toBeHidden();await stopEvent(d,f,offset);if(await root(p,'tutorial-panel').count())await expect(root(p,'tutorial-panel')).toHaveAttribute('data-krds-state',/idle/);await usableFocus(p);}
async function startFocused(p,f){const start=p.locator(`[id="${f.initialState.startActionId}"]`);await expect(start).toBeVisible();await expect(start).toBeEnabled();await expect(start).toBeFocused();expect(await start.evaluate(node=>!node.closest('[inert]'))).toBe(true);}
async function modalStop(p,d,f,component,{preferredStart=false}={}){await trackFocus(p);await part(p,component,'stop').click();await stopped(p,d,f);const modal=p.getByRole('dialog').last();await expect(modal).toBeVisible();await focusableInside(modal);if(preferredStart)await startFocused(p,f);const calls=await focusCalls(p);expect(calls).toHaveLength(1);expect(calls.filter(call=>!call.connected||call.inert)).toEqual([]);await trap(p,modal);await modalIsolation(p,modal);}
async function targetOrder(p,s){const step=s.steps.find(step=>step.id===(s.stepId??s.defaultStepId))??s.steps[0];const popup=part(p,'coach-mark','popover');expect(await popup.evaluate((node,id)=>{const target=node.getRootNode().getElementById(id);return Boolean(target&&target.nextElementSibling?.contains(node));},step.targetId)).toBe(true);return p.locator(`[id="${step.targetId}"]`);}
export const helpOutcomes={
  'help-panel':{
    2:async(p,d,f)=>{const topic=f.initialState.topics[0];await role(p,'button',`${topic.title} 도움말`).click();await expect(root(p,'help-panel')).toContainText(topic.content);await expect(await panelPresentation(p,'help-panel')).toBeFocused();await request(d,'topicChange',{id:topic.id});},
    3:async(p,d,f)=>{const topic=f.initialState.topics[0];await role(p,'button',`${topic.title} 도움말`).click();await part(p,'help-panel','close').click();await part(p,'help-panel','opener').click();await expect(root(p,'help-panel')).toContainText(topic.content);await expect(root(p,'help-panel').getByRole('heading',{name:topic.title,exact:true})).toBeVisible();},
    4:async(p)=>{const panel=p.getByRole('dialog');await modalIsolation(p,panel);await focusableInside(panel);await trap(p,panel);await p.keyboard.press('Escape');await expect(panel).toBeHidden();await assertCleanup(p);},
    5:async(p,d,f)=>{await part(p,'help-panel','close').click();await expect(await panelPresentation(p,'help-panel')).toBeHidden();await role(p,'button',`${f.initialState.topics[0].title} 도움말`).click();await panelEntry(p,'help-panel');await trackFocus(p);await part(p,'help-panel','close').click();await expect(part(p,'help-panel','opener')).toBeFocused();const calls=await focusCalls(p);expect(calls).toHaveLength(1);expect(calls[0].part).toBe('opener');await assertCleanup(p);},
    6:async(p,d,f)=>{await patchHost(p,d,f,{routeChange:true});await expect(root(p,'help-panel')).toHaveCount(0);await assertCleanup(p);await usableFocus(p);await quiet(d);},
    7:async(p,d,f)=>{await part(p,'help-panel','close').click();await expect(await panelPresentation(p,'help-panel')).toBeHidden();const topic=role(p,'button',`${f.initialState.topics[0].title} 도움말`);await topic.click();await expect(topic).toBeVisible();await panelEntry(p,'help-panel');await trackFocus(p);await part(p,'help-panel','close').click();await expect(part(p,'help-panel','opener')).toBeFocused();const calls=await focusCalls(p);expect(calls).toHaveLength(1);expect(calls[0].part).toBe('opener');},
    8:async(p,d)=>{const panel=p.getByRole('dialog'),close=part(p,'help-panel','close');await close.focus();await p.keyboard.press('Enter');await expect(panel).toBeVisible();await expect(close).toBeFocused();await modalIsolation(p,panel);await trap(p,panel);await request(d,'openChange',{open:false});},
    9:async(p,d,f)=>{await patchHost(p,d,f,{removePanelOpener:true});await expect(part(p,'help-panel','opener')).toHaveCount(0);await part(p,'help-panel','close').click();await expect(p.locator(`[id="${f.initialState.fallbackFocusId}"]`)).toBeFocused();await assertCleanup(p);},
  },
  'tutorial-panel':{
    2:async(p,d,f)=>{await part(p,'tutorial-panel','stop').click();await stopped(p,d,f);await startFocused(p,f);},
    3:async(p,d,f)=>{const task=f.initialState.tasks.find(task=>task.id===f.initialState.activeTaskId),step=task.steps.find(step=>step.id===f.initialState.activeStepId);await expect(part(p,'coach-mark','title')).toHaveText(step.title);await expect(root(p,'tutorial-panel').getByRole('button',{name:step.title,exact:true})).toBeVisible();},
    4:async(p,d)=>{await part(p,'tutorial-panel','opener').click();const panel=root(p,'tutorial-panel');await expect(panel).toBeVisible();await part(p,'tutorial-panel','stop').focus();await p.keyboard.press('Tab');expect(await containsFocus(panel)).toBe(false);},
    5:async(p)=>{await modalIsolation(p,p.getByRole('dialog'));await part(p,'tutorial-panel','close').click();await expect(await panelPresentation(p,'tutorial-panel')).toBeHidden();await assertCleanup(p);},
    6:async(p,d,f)=>{await patchHost(p,d,f,{targetRemoved:true});await expect(part(p,'coach-mark','instruction')).toContainText(/대상|찾을 수 없/);await trackFocus(p);await patchHost(p,d,f,{routeChange:true});await expect(root(p,'coach-mark')).toHaveCount(0);await expect(root(p,'tutorial-panel')).toHaveCount(0);await assertCleanup(p);expect((await focusCalls(p)).every(call=>call.connected&&!call.inert)).toBe(true);},
    7:async(p,d,f)=>{await expect(role(p,'tab','도움말')).toHaveAttribute('aria-selected','true');await part(p,'tutorial-panel','close').click();await expect(await panelPresentation(p,'tutorial-panel')).toBeHidden();const offset=(await d.readEvents()).length;await part(p,'coach-mark','stop').click();await stopped(p,d,f,offset);await expect(role(p,'tab','튜토리얼')).toHaveAttribute('aria-selected','true');await startFocused(p,f);},
    8:async(p,d,f)=>{await modalStop(p,d,f,'tutorial-panel',{preferredStart:true});},
    9:async(p,d,f)=>{await patchHost(p,d,f,{acceptStop:false});const stop=part(p,'tutorial-panel','stop');await stop.focus();await p.keyboard.press('Enter');await expect(root(p,'coach-mark')).toBeVisible();await expect(stop).toBeFocused();await patchHost(p,d,f,{acceptStop:true,acceptPanelExposure:false,startActionPresent:false});await stop.click();await expect(part(p,'coach-mark','popover')).toBeHidden();await expect(part(p,'tutorial-panel','opener')).toBeFocused();await usableFocus(p);},
    10:async(p,d,f)=>{await trackFocus(p);await patchHost(p,d,f,{routeChange:true});await expect(root(p,'tutorial-panel')).toHaveCount(0);await expect(root(p,'coach-mark')).toHaveCount(0);await assertCleanup(p);await usableFocus(p);expect((await focusCalls(p)).every(call=>call.connected&&!call.inert)).toBe(true);},
    11:async(p,d,f)=>{await modalStop(p,d,f,'tutorial-panel');await expect(role(p,'tab','도움말')).toHaveAttribute('aria-selected','true');await expect(p.locator(`[id="${f.initialState.startActionId}"]`)).toBeHidden();await expect(root(p,'tutorial-panel')).toHaveAttribute('data-krds-state',/idle/);},
  },
  'contextual-help':{
    2:async(p,d,f)=>{const trigger=role(p,'button',f.initialState.triggerLabel);await expect(trigger).toHaveCount(1);await expect(trigger).toHaveAccessibleName(f.initialState.title);await quiet(d);},
    3:async(p,d,f)=>{await role(p,'button',f.initialState.triggerLabel).click();const link=part(p,'contextual-help','popover').getByRole('link');await expect(link).toBeFocused();await p.keyboard.press('Tab');await p.keyboard.press('Tab');expect(await containsFocus(part(p,'contextual-help','popover'))).toBe(false);},
    4:async(p,d,f)=>{const trigger=role(p,'button',f.initialState.triggerLabel);await trigger.click();await expect(part(p,'contextual-help','popover')).toBeVisible();await p.keyboard.press('Escape');await expect(trigger).toBeFocused();await expect(part(p,'contextual-help','popover')).toBeHidden();await trigger.click();await expect(part(p,'contextual-help','popover')).toBeVisible();await (await outside(p)).click();await expect(trigger).toBeFocused();await expect(part(p,'contextual-help','popover')).toBeHidden();},
    5:async(p,d,f)=>{await p.setViewportSize({width:360,height:400});const popover=part(p,'contextual-help','popover');if(!(f.initialState.open??f.initialState.defaultOpen??false))await expect(popover).toBeHidden();await role(p,'button',f.initialState.triggerLabel).click();await expect(popover).toBeVisible();await insideViewport(p,popover);},
    6:async(p,d,f)=>{
      expect(f.host.removeTrigger).toBe(false);expect(f.host.removeTriggerAction).toBe(true);
      const id=f.initialState.fallbackFocusId;expect(typeof id).toBe('string');expect(f.host.fallbackFocusId).toBe(id);
      const trigger=role(p,'button',f.initialState.triggerLabel),popover=part(p,'contextual-help','popover');
      await trigger.click();await expect(popover).toBeVisible();await request(d,'openChange',{open:true});
      const before=await d.readEvents();await patchHost(p,d,f,{removeTrigger:true});
      await expect(root(p,'contextual-help')).toHaveCount(0);await expect(trigger).toHaveCount(0);await expect(popover).toHaveCount(0);
      const fallback=p.locator(`[id="${id}"]`);await tag(fallback,'button');await expect(fallback).toHaveAccessibleName(f.host.fallbackLabel);
      await expect(fallback).toBeVisible();await expect(fallback).toBeEnabled();await expect(fallback).toBeFocused();
      await events(d,null,before);await teardown(p,d,f);await usableFocus(p);
      await p.keyboard.press('Escape');await (await outside(p)).click();await events(d,null,before);
    },
  },
  'coach-mark':{
    2:async(p,d,f)=>{await expect(part(p,'coach-mark','previous')).toBeHidden();await expect(part(p,'coach-mark','next')).toHaveText('다음');await part(p,'coach-mark','next').click();await expect(part(p,'coach-mark','next')).toHaveText('마치기');await d.setState({steps:[f.initialState.steps[0]],stepId:f.initialState.steps[0].id});await expect(part(p,'coach-mark','next')).toHaveText('확인');},
    3:async(p,d,f)=>{
      expect(f.host.linkedTutorial??false,'This exact case exercises standalone action-gated completion').toBe(false);
      await part(p,'coach-mark','next').click();const step=f.initialState.steps[1];
      await expect(part(p,'coach-mark','title')).toHaveText(step.title);
      await request(d,'stepChange',{id:step.id,reason:'next'});
      const advancement=events=>events.filter(event=>['stepChange','stop','openChange'].includes(event.name));
      const before=advancement(await d.readEvents());const next=part(p,'coach-mark','next');
      if(await next.count()){await expect(next).toBeDisabled();await pointer(p,next);expect(advancement(await d.readEvents())).toEqual(before);}
      const target=p.locator(`[id="${step.targetId}"]`);await target.click();
      await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      expect(advancement(await d.readEvents())).toEqual(before);
      await expect(part(p,'coach-mark','popover')).toBeVisible();await expect(part(p,'coach-mark','title')).toHaveText(step.title);
      await patchHost(p,d,f,{targetActionVerified:true});await target.click();
      await expect(part(p,'coach-mark','popover')).toBeHidden();
      await expect.poll(async()=>advancement(await d.readEvents())).toEqual([...before,{name:'openChange',detail:{open:false}}]);
      await usableFocus(p);
    },
    4:async(p,d,f)=>{await part(p,'coach-mark','stop').click();await stopped(p,d,f);await startFocused(p,f);},
    5:async(p,d,f)=>{await expect(p.locator(`[id="${f.initialState.steps[0].targetId}"]`)).toHaveCount(0);await expect(part(p,'coach-mark','instruction')).toContainText(/대상|찾을 수 없/);await expect(part(p,'coach-mark','next')).toBeDisabled();await patchHost(p,d,f,{routeChange:true});await expect(root(p,'coach-mark')).toHaveCount(0);await usableFocus(p);},
    6:async(p,d,f)=>{await resizeWithNativeReadiness(p,{width:360,height:600});const target=p.locator(`[id="${f.initialState.steps[0].targetId}"]`);await insideViewport(p,target);await insideViewport(p,part(p,'coach-mark','popover'));},
    7:async(p,d,f)=>{await expect(root(p,'coach-mark')).toHaveCount(1);await expect(part(p,'coach-mark','popover')).toBeVisible();await expect(part(p,'coach-mark','instruction')).toContainText(f.initialState.steps[0].instruction);await expect(root(p,'toast')).toHaveCount(0);await expect(root(p,'snackbar')).toHaveCount(0);},
    8:async(p,d,f)=>{await targetOrder(p,f.initialState);const spotlight=part(p,'coach-mark','spotlight');if(await spotlight.count())await expect(spotlight).toHaveAttribute('aria-hidden','true');},
    9:async(p,d,f)=>{const target=await targetOrder(p,f.initialState);const saved=await target.elementHandle();await target.fill('신청인');await target.focus();await target.dispatchEvent('compositionstart');await target.fill('입력 중');await d.setState({steps:f.initialState.steps.map((step,index)=>index?step:{...step,instruction:'추가 안내'})});await expect(target).toBeFocused();await expect(target).toHaveValue('입력 중');expect(await saved.evaluate(node=>node.isConnected&&document.getElementById(node.id)===node)).toBe(true);await target.dispatchEvent('compositionend',{data:'입력 중'});expect((await d.readEvents()).filter(e=>e.name==='stepChange')).toEqual([]);},
    10:async(p,d,f)=>{await patchHost(p,d,f,{panelOpen:false,activePanel:'help'});await part(p,'coach-mark','stop').click();await stopped(p,d,f);await expect(root(p,'tutorial-panel')).toBeVisible();await expect(role(p,'tab','튜토리얼')).toHaveAttribute('aria-selected','true');await startFocused(p,f);},
    11:async(p,d,f)=>{
      expect(f.initialState.open).toBe(true);expect(Object.hasOwn(f.initialState,'defaultOpen')).toBe(false);
      expect(f.host.acceptStop).toBe(false);expect(f.host.linkedTutorial??false).toBe(false);
      expect(await p.evaluate(()=>window.__KRDS_FIXTURE__.getState().open)).toBe(true);await quiet(d);
      const stop=part(p,'coach-mark','stop');await stop.focus();await p.keyboard.press('Enter');
      await request(d,'openChange',{open:false});
      await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
      expect(await p.evaluate(()=>window.__KRDS_FIXTURE__.getState().open)).toBe(true);
      await expect(root(p,'coach-mark')).toHaveCount(1);await expect(root(p,'coach-mark')).toBeVisible();
      await expect(part(p,'coach-mark','popover')).toBeVisible();await expect(stop).toBeFocused();
      await request(d,'openChange',{open:false});
      await patchHost(p,d,f,{acceptStop:true,startActionPresent:false,routeChange:true});
      await expect(root(p,'coach-mark')).toHaveCount(0);await usableFocus(p);
      await request(d,'openChange',{open:false});
    },
    12:async(p,d,f)=>{await modalStop(p,d,f,'coach-mark');await expect(role(p,'tab','도움말')).toHaveAttribute('aria-selected','true');await expect(p.locator(`[id="${f.initialState.startActionId}"]`)).toBeHidden();},
  },
  tooltip:{
    2:async(p,d,f)=>{const trigger=p.locator(`[id="${f.initialState.triggerId}"]`);await trigger.hover();const popup=p.getByRole('tooltip');await expect(popup).toBeVisible();await popup.hover();await expect(popup).toBeVisible();},
    3:async(p,d,f)=>{const trigger=p.locator(`[id="${f.initialState.triggerId}"]`);await trigger.focus();await p.keyboard.press('Escape');await expect(p.getByRole('tooltip')).toBeHidden();await trigger.hover();await expect(p.getByRole('tooltip')).toBeHidden();await p.keyboard.press('Tab');await p.keyboard.press('Shift+Tab');await expect(trigger).toBeFocused();await expect(p.getByRole('tooltip')).toBeVisible();},
    4:async(p,d,f)=>{await p.locator(`[id="${f.initialState.triggerId}"]`).focus();await noInteractive(p.getByRole('tooltip'));},
    5:async(p,d,f)=>{const trigger=p.locator(`[id="${f.initialState.triggerId}"]`);await trigger.tap();await expect(p.getByRole('tooltip')).toBeVisible();await trigger.tap();await expect(p.getByRole('tooltip')).toBeHidden();await events(d,'openChange',[{name:'openChange',detail:{open:true}},{name:'openChange',detail:{open:false}}]);await events(d,'action',[]);},
    6:async(p,d,f)=>{const s=f.initialState,trigger=p.locator(`[id="${s.triggerId}"]`);await expect(trigger).toHaveAccessibleName(s.triggerLabel);await relation(trigger,'aria-describedby',s.text);await expect(trigger).not.toHaveAttribute('aria-labelledby',new RegExp(s.textId));await expect(trigger).not.toHaveAttribute('title',/.+/);},
    7:async(p,d,f)=>{const s=f.initialState,trigger=p.locator(`[id="${s.triggerId}"]`);await expect(trigger).toHaveAccessibleName(s.text);await relation(trigger,'aria-labelledby',s.text);await expect(trigger).not.toHaveAttribute('aria-describedby',new RegExp(s.textId));await expect(trigger).not.toHaveAttribute('aria-label',/.+/);await trigger.focus();await p.keyboard.press('Escape');await expect(trigger).toHaveAccessibleName(s.text);},
    8:async(p,d,f)=>{const outsideAction=await outside(p),trigger=p.locator(`[id="${f.initialState.triggerId}"]`);await outsideAction.focus();await trigger.hover();await expect(outsideAction).toBeFocused();await p.keyboard.press('Escape');await expect(trigger).toBeFocused();await expect(p.getByRole('tooltip')).toBeHidden();await trigger.hover();await expect(p.getByRole('tooltip')).toBeHidden();},
    9:async(p,d,f)=>{const outsideAction=await outside(p);await outsideAction.focus();await p.keyboard.press('Escape');await expect(p.getByRole('tooltip')).toBeVisible();await expect(outsideAction).toBeFocused();await patchHost(p,d,f,{acceptClose:true,removeTrigger:true});await teardown(p,d,f);await usableFocus(p);await expect(p.locator(`[id="${f.initialState.triggerId}"]`)).toHaveCount(0);},
    10:async(p,d,f)=>{const trigger=p.locator(`[id="${f.initialState.triggerId}"]`);await relation(trigger,'aria-describedby',f.initialState.text);expect(await trigger.evaluate((node,id)=>{const names=(node.getAttribute('aria-describedby')??'').split(/\s+/);return names.includes(id)?Boolean(node.getRootNode().getElementById(id)):[...(node.ariaDescribedByElements??[])].some(element=>element.id===id&&element.isConnected);},f.initialState.textId)).toBe(true);await expect(trigger).toHaveAccessibleDescription(f.initialState.text);await expect(trigger).toHaveAccessibleName(f.initialState.triggerLabel);},
  },
};
