import {visibleAfterClockAction} from './catalog-timing.mjs';
import {expect,root,part,role,host,manual,partial,events,quiet,request,tag,patchHost,teardown,form,focusableInside,focusOutsideHidden,usableFocus,noInteractive,insideViewport,noHorizontalOverflow,nativeReset,assertCleanup,outside,pointer,modalIsolation,followNativeModifiedLink} from './catalog-outcome-helpers.mjs';
const slide=(p,index)=>part(p,'carousel','slide').nth(index);
async function elapsed(p,n){await p.clock.runFor(n);}
async function confirmation(page,decision){
  const dialog=role(page,'dialog','작성 중인 내용이 있습니다');
  await expect(dialog).toBeVisible();
  await expect(dialog).toHaveAccessibleDescription('이전 화면으로 이동하면 입력 내용이 사라질 수 있습니다.');
  await focusableInside(dialog);
  await modalIsolation(page,dialog);
  const action=dialog.getByRole('button',{name:decision,exact:true});
  await tag(action,'button');
  await action.click();
  await expect(dialog).toBeHidden();
}
export const stateOutcomes={
  disclosure:{
    2:async(p,d,{initialState:s})=>{const trigger=role(p,'button',s.label);await trigger.click();await expect(trigger).toHaveAttribute('aria-expanded','true');await trigger.focus();await p.keyboard.press('Enter');await expect(trigger).toHaveAttribute('aria-expanded','false');await p.keyboard.press('Space');await expect(trigger).toHaveAttribute('aria-expanded','true');await events(d,'openChange',[{name:'openChange',detail:{open:true}},{name:'openChange',detail:{open:false}},{name:'openChange',detail:{open:true}}]);},
    3:async(p,d,{initialState:s,host:h})=>{const trigger=role(p,'button',s.label);await expect(trigger).toHaveAttribute('aria-expanded','false');await expect(role(p,'link',h.contentLink.label)).toBeHidden();await trigger.focus();await p.keyboard.press('Tab');await focusOutsideHidden(p);await quiet(d);},
    4:async(p,d,{initialState:s,host:h})=>{const trigger=role(p,'button',s.label);await trigger.click();await expect(trigger).toBeFocused();await role(p,'link',h.contentLink.label).focus();await d.setState({open:false});await expect(trigger).toBeFocused();await expect(p.locator(`[id="${s.contentId}"]`)).toBeHidden();await request(d,'openChange',{open:true});},
  },
  accordion:{
    2:async(p,d,{initialState:s})=>{const item=s.items[0],trigger=role(p,'button',item.title);await trigger.click();await expect(trigger).toHaveAttribute('aria-expanded','true');await expect(trigger).toBeFocused();await p.keyboard.press('Enter');await expect(trigger).toHaveAttribute('aria-expanded','false');await p.keyboard.press('Space');await expect(trigger).toHaveAttribute('aria-expanded','true');await expect.poll(async()=>(await d.readEvents()).filter(event=>event.name==='openChange')).toEqual([{name:'openChange',detail:{ids:[item.id]}},{name:'openChange',detail:{ids:[]}},{name:'openChange',detail:{ids:[item.id]}}]);},
    3:async(p,d,{initialState:s})=>{const trigger=role(p,'button',s.items[0].title);await trigger.click();await expect(trigger).toHaveAttribute('aria-expanded','true');const panel=part(p,'accordion','panel').first();await expect(panel).toBeVisible();expect(await panel.evaluate(node=>!['auto','scroll'].includes(getComputedStyle(node).overflowY))).toBe(true);expect(await p.evaluate(()=>document.documentElement.scrollHeight>innerHeight)).toBe(true);},
    4:async(p,d,{initialState:s,host:h})=>{const trigger=role(p,'button',s.items[0].title);await expect(role(p,'link',h.panelLink.label)).toBeHidden();await trigger.focus();await p.keyboard.press('Tab');await expect(role(p,'button',s.items[1].title)).toBeFocused();await quiet(d);},
    5:async(p,d,f)=>{const s=f.initialState;await patchHost(p,d,f,{acceptChanges:true});for(const item of s.items){const trigger=role(p,'button',item.title);if(await trigger.getAttribute('aria-expanded')!=='true'){await trigger.click();await expect(trigger).toHaveAttribute('aria-expanded','true');}}for(const item of s.items)await expect(role(p,'button',item.title)).toHaveAttribute('aria-expanded','true');const before=await d.readEvents();await patchHost(p,d,f,{acceptChanges:false});await role(p,'button',s.items[0].title).click();await expect(role(p,'button',s.items[0].title)).toHaveAttribute('aria-expanded','true');await expect.poll(()=>d.readEvents()).toEqual([...before,{name:'openChange',detail:{ids:s.items.slice(1).map(item=>item.id)}}]);},
  },
  carousel:{
    2:async(p)=>{const r=root(p,'carousel');const first=r.locator('button,a[href],input,[tabindex="0"]').first();await expect(first).toHaveAccessibleName(/^(재생|정지)$/);await first.focus();await expect(first).toBeFocused();},
    3:async(p)=>{const slides=part(p,'carousel','slide');for(let n=1;n<await slides.count();n++){await expect(slides.nth(n)).toBeHidden();await expect(slides.nth(n).getByRole('link')).toHaveCount(0);await expect(slides.nth(n).getByRole('button')).toHaveCount(0);}},
    4:partial(async(p,d)=>{await role(p,'button','다음 슬라이드').click();await visibleAfterClockAction(p,d,slide(p,1));const indicator=part(p,'carousel','indicator').nth(2);await indicator.focus();await p.keyboard.press('Enter');await visibleAfterClockAction(p,d,slide(p,2));await p.keyboard.press('ArrowLeft');await visibleAfterClockAction(p,d,slide(p,1));},'Equivalence of a real touch swipe to button/indicator navigation requires a native touch device gesture run; dispatched synthetic pointer events cannot prove vertical-scroll preservation.'),
    5:async(p,d,{initialState:s})=>{await expect(root(p,'carousel').getByRole('button')).toHaveCount(0);await expect(part(p,'carousel','slide')).toHaveCount(1);await expect(part(p,'carousel','slide')).toContainText(s.items[0].content);},
    6:async(p,d,f)=>{await expect(role(p,'button','정지')).toBeVisible();await quiet(d);await teardown(p,d,f);const before=await d.readEvents();await elapsed(p,(f.initialState.intervalMs??6000)*3);await events(d,null,before);},
    7:async(p,d,f)=>{await p.emulateMedia({reducedMotion:'reduce'});await elapsed(p,f.initialState.intervalMs*3);await expect(slide(p,0)).toBeVisible();await quiet(d);await expect(role(p,'button','재생')).toBeVisible();},
    8:async(p,d,f)=>{await role(p,'button','다음 슬라이드').focus();await elapsed(p,f.initialState.intervalMs*2);await expect(slide(p,0)).toBeVisible();await d.setState({playing:true});await (await outside(p)).focus();await root(p,'carousel').hover();await elapsed(p,f.initialState.intervalMs*2);await expect(slide(p,0)).toBeVisible();await quiet(d);},
    9:async(p,d,f)=>{await root(p,'carousel').hover();await role(p,'button','재생').click();await request(d,'playingChange',{playing:true,reason:'play'});await elapsed(p,f.initialState.intervalMs*2);await expect(slide(p,0)).toBeVisible();await p.mouse.move(0,0);await elapsed(p,f.initialState.intervalMs-1);await expect(slide(p,0)).toBeVisible();await elapsed(p,34);await visibleAfterClockAction(p,d,slide(p,1));},
    10:async(p,d,f)=>{await role(p,'button','다음 슬라이드').focus();await quiet(d);await visibleAfterClockAction(p,d,role(p,'button','재생'));await role(p,'button','자동 재생 중지').click();await request(d,'playingChange',{playing:false,reason:'stop'});await p.mouse.move(0,0);await (await outside(p)).focus();await elapsed(p,f.initialState.intervalMs*3);await expect(slide(p,0)).toBeVisible();await request(d,'playingChange',{playing:false,reason:'stop'});expect(await p.evaluate(()=>window.__KRDS_FIXTURE__.getState().playing)).toBe(true);},
    11:async(p,d,f)=>{await role(p,'button','다음 슬라이드').focus();await quiet(d);await visibleAfterClockAction(p,d,role(p,'button','재생'));await role(p,'button','재생').click();await p.mouse.move(0,0);await visibleAfterClockAction(p,d,role(p,'button','정지'));await elapsed(p,f.initialState.intervalMs+34);await expect(slide(p,0)).toBeVisible();await events(d,'indexChange',[{name:'indexChange',detail:{index:1,reason:'timer'}}]);await elapsed(p,f.initialState.intervalMs);await events(d,'indexChange',[{name:'indexChange',detail:{index:1,reason:'timer'}},{name:'indexChange',detail:{index:1,reason:'timer'}}]);},
  },
  spinner:{
    2:async(p)=>{await expect(root(p,'spinner').getByRole('progressbar')).toHaveCount(1);await expect(root(p,'spinner').getByRole('progressbar')).not.toHaveAttribute('aria-valuenow',/.+/);await expect(root(p,'spinner')).toContainText('불러오는 중');},
    3:async(p,d,{initialState:s})=>{const status=part(p,'spinner','status');await expect(status).toHaveAttribute('aria-live','polite');await expect(status).toHaveText(s.label);await d.setState({pending:false});await expect(status).toHaveText(s.completionMessage);await quiet(d);},
    4:async(p,d)=>{const control=await outside(p);await control.focus();await d.setState({value:90,pending:false});await expect(control).toBeFocused();await quiet(d);},
    5:async(p,d,f)=>{await d.setState({pending:false});await expect(part(p,'spinner','indicator')).toBeHidden();await expect(root(p,'spinner')).toContainText(f.initialState.completionMessage);await teardown(p,d,f);await quiet(d);},
    6:async(p,d,{initialState:s})=>{await p.emulateMedia({reducedMotion:'reduce'});await expect(root(p,'spinner')).toContainText(s.label);expect(await part(p,'spinner','indicator').evaluate(node=>getComputedStyle(node).animationName==='none'||getComputedStyle(node).animationDuration==='0s')).toBe(true);},
  },
  resize:{
    2:async(p,d,{initialState:s})=>{const trigger=part(p,'resize','trigger');await trigger.focus();await p.keyboard.press('ArrowDown');await expect(trigger).toContainText(s.levels[2].label);await request(d,'valueChange',{value:s.levels[2].id});},
    3:async(p)=>{const trigger=part(p,'resize','trigger');await trigger.click();await expect(trigger).toHaveAttribute('aria-expanded','true');await part(p,'resize','option').first().focus();await expect(part(p,'resize','option').first()).toBeFocused();await p.keyboard.press('Escape');await expect(trigger).toBeFocused();await expect(trigger).toHaveAttribute('aria-expanded','false');},
    4:manual('Actual 200% and 400% browser zoom, including browser UI and text reflow, requires a real browser zoom run; viewport emulation and CSS scaling do not establish browser-zoom conformance.'),
    5:async(p)=>{await p.setViewportSize({width:360,height:800});await noHorizontalOverflow(p);await part(p,'resize','trigger').click();await part(p,'resize','option').last().click();await noHorizontalOverflow(p);},
    6:async(p,d,f)=>{const content=host(p,'resize-content'),initial=await content.evaluate(n=>getComputedStyle(n).fontSize);await part(p,'resize','trigger').focus();await p.keyboard.press('ArrowDown');await expect.poll(()=>content.evaluate(n=>getComputedStyle(n).fontSize)).not.toBe(initial);await teardown(p,d,f);await expect.poll(()=>content.evaluate(n=>getComputedStyle(n).fontSize)).toBe(initial);const before=await d.readEvents();await p.keyboard.press('ArrowDown');await events(d,null,before);},
    7:async(p,d,{initialState:s})=>{await part(p,'resize','trigger').focus();await p.keyboard.press('ArrowDown');await request(d,'valueChange',{value:s.levels[2].id});},
    8:async(p,d,{initialState:s})=>{const content=host(p,'resize-content'),before=await content.evaluate(n=>getComputedStyle(n).fontSize);await part(p,'resize','trigger').focus();await p.keyboard.press('ArrowDown');await expect(part(p,'resize','trigger')).toContainText(s.levels.find(level=>level.id===s.value).label);expect(await content.evaluate(n=>getComputedStyle(n).fontSize)).toBe(before);await request(d,'valueChange',{value:s.levels[2].id});},
  },
  tts:{
    2:async(p,d,{initialState:s})=>{await part(p,'tts','play').click();await request(d,'request',{action:'play',summary:s.summary,locale:s.locale});await expect(host(p,'speech-summary')).toHaveText(s.summary);},
    3:async(p,d)=>{await part(p,'tts','play').click();await part(p,'tts','pause').focus();await expect(part(p,'tts','pause')).toBeFocused();await part(p,'tts','stop').focus();await expect(part(p,'tts','stop')).toBeFocused();},
    4:async(p,d,{initialState:s})=>{await part(p,'tts','play').click();await expect(host(p,'speech-state')).toHaveText('playing');await part(p,'tts','pause').click();await expect(host(p,'speech-state')).toHaveText('paused');await expect(part(p,'tts','play')).toHaveAccessibleName(`${s.label??'음성 안내'} 다시 재생`);},
    5:async(p,d)=>{await expect(part(p,'tts','play')).toBeDisabled();await expect(root(p,'tts')).toContainText(/지원|사용할 수 없/);await quiet(d);},
    6:async(p,d,f)=>{
      const detail={summary:f.initialState.summary,locale:f.initialState.locale};
      await part(p,'tts','play').click();await request(d,'request',{action:'play',...detail});
      await expect(host(p,'speech-state')).toHaveText('playing');await expect(host(p,'speech-driver-active')).toHaveText('true');await expect(host(p,'speech-driver-lifecycle')).toHaveText('playing');
      const before=await d.readEvents();await teardown(p,d,f);
      await expect(host(p,'speech-state')).toHaveText('idle');await expect(host(p,'speech-driver-active')).toHaveText('false');await expect(host(p,'speech-driver-lifecycle')).toHaveText('disposed');
      const after=await d.readEvents();expect(after.slice(0,before.length)).toEqual(before);
      expect([[],[{name:'request',detail:{action:'stop',...detail}}]]).toContainEqual(after.slice(before.length));
    },
  },
  'step-indicator':{
    2:async(p,d,{initialState:s})=>{const pending=s.steps.find(step=>step.status==='pending');const item=root(p,'step-indicator').getByRole('listitem').filter({hasText:pending.label});await expect(item.getByRole('link')).toHaveCount(0);await expect(item.getByRole('button')).toHaveCount(0);await item.dispatchEvent('click');await quiet(d);},
    3:async(p,d,{initialState:s})=>{const navigable=s.steps.find(step=>step.href);expect(navigable,'Adaptive source fixture must configure an actual step destination').toBeDefined();const link=role(p,'link',navigable.label);await tag(link,'a');await expect(link).toHaveAttribute('href',navigable.href);await link.focus();await expect(link).toBeFocused();},
    4:async(p,d,{initialState:s})=>{const current=s.steps.findIndex(step=>step.status==='current')+1;await expect(root(p,'step-indicator')).toContainText(String(current));await expect(root(p,'step-indicator')).toContainText(String(s.steps.length));await expect(root(p,'step-indicator').locator('[aria-current="step"]')).toContainText(s.steps[current-1].label);},
    5:async(p,d,f)=>{await host(p,'skip-action').click();await expect(host(p,'route')).toHaveText(f.host.skipDestination);expect((await d.readEvents()).filter(e=>e.name==='stepRequest')).toHaveLength(1);},
  },
  'back-button':{
    2:async(p,d,f)=>{const field=host(p,'dirty-input');await field.fill('보존할 입력');const back=role(p,'button',f.initialState.label);await back.click();await expect(host(p,'route')).toHaveText('/local/current');await events(d,'backRequest',[]);await confirmation(p,'취소');await expect(host(p,'route')).toHaveText('/local/current');await expect(field).toHaveValue('보존할 입력');await expect(back).toBeFocused();await events(d,'backRequest',[]);},
    3:async(p,d,f)=>{await role(p,'button',f.initialState.label).click();await events(d,'backRequest',[]);await confirmation(p,'확인');await request(d,'backRequest',{reason:'confirmed'});await expect(host(p,'route')).toHaveText(f.host.history.at(-2));},
    4:async(p,d,f)=>{const link=role(p,'link',f.initialState.label);await followNativeModifiedLink(p,link,f.initialState.fallbackHref);await quiet(d);},
    5:async(p,d,f)=>{await host(p,'dirty-input').fill('보존할 입력');await d.setState({dirty:true});const before=await host(p,'route').innerText();await role(p,'button',f.initialState.label).click();await expect(host(p,'route')).toHaveText(before);await confirmation(p,'취소');await events(d,'backRequest',[]);await role(p,'button','브라우저 뒤로가기 모의').click();await expect(host(p,'route')).toHaveText(before);await confirmation(p,'취소');await expect(host(p,'route')).toHaveText(before);await events(d,'backRequest',[]);},
  },
  'bottom-sheet':{
    2:async(p,d,f)=>{const dialog=role(p,'dialog',f.initialState.title);await dialog.getByRole('radio',{name:'부산',exact:true}).check();await role(p,'button','닫기').click();await expect(dialog).toBeHidden();await expect(p.locator(`[id="${f.host.openerId}"]`)).toBeFocused();await expect(host(p,'committed-selection')).toHaveText(f.host.selection);},
    3:async(p,d,f)=>{const handle=part(p,'bottom-sheet','handle'),bounds=await handle.boundingBox();await p.mouse.move(bounds.x+bounds.width/2,bounds.y+bounds.height/2);await p.mouse.down();await p.mouse.move(bounds.x+bounds.width/2,bounds.y+180,{steps:4});await p.mouse.up();await expect(role(p,'dialog',f.initialState.title)).toBeHidden();await p.locator(`[id="${f.host.openerId}"]`).click();await role(p,'button','닫기').click();await expect(role(p,'dialog',f.initialState.title)).toBeHidden();},
    4:partial(async(p,d,f)=>{await p.setViewportSize({width:360,height:320});const close=role(p,'dialog',f.initialState.title).getByRole('button',{name:'닫기',exact:true});await close.scrollIntoViewIfNeeded();await insideViewport(p,close);},'Real software-keyboard viewport occlusion requires a mobile device/browser input session; a smaller viewport only verifies the automatable narrow-layout portion.'),
    5:async(p,d,f)=>{await teardown(p,d,f);await assertCleanup(p);await usableFocus(p);},
    6:async(p,d,f)=>{await pointer(p,p.locator(`[id="${f.host.openerId}"]`));await pointer(p,p.locator(`[id="${f.host.openerId}"]`));await expect(p.getByRole('dialog')).toHaveCount(1);await quiet(d);},
  },
};
