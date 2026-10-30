import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {installCatalogExposureTracking,pauseClockNow} from '../testing/catalog-timing.mjs';
import {observeCatalogCase,catalogCaseMetadata,ManualCatalogObservationRequired} from '../testing/catalog-observations.mjs';
const all=JSON.parse(await readFile(new URL('../../catalog/full-catalog-scenarios.json',import.meta.url),'utf8')).cases;
const source=(id,n)=>all.find(item=>item.componentId===id&&item.caseId===`outcome-${String(n).padStart(2,'0')}`);
let browser;
before(async()=>{const {chromium}=await import('playwright');browser=await chromium.launch();});
after(async()=>{await browser?.close();});
// All specimens are deliberately plain DOM, inspect observers only, and award no native coverage.
async function inspect(id,n,markup,setup,mode='correct'){
 const f=source(id,n),context=await browser.newContext({hasTouch:id==='tooltip'&&n===5}),p=await context.newPage();if(f.host.fakeClock){await p.clock.install({time:new Date('2024-02-29T12:00:00.000Z')});await pauseClockNow(p);}
 if(f.host.fakeClock)await installCatalogExposureTracking(p);
 await p.setContent('<!doctype html><html lang="ko"><meta charset="utf-8"><body>'+markup+'</body></html>');
 await p.evaluate(({f,mode})=>{window.__mode=mode;window.__state={...f.initialState,__host:f.host};window.__events=[];window.__KRDS_FIXTURE__={getState:()=>window.__state};}, {f,mode});
 await p.evaluate(setup);
 const d={readEvents:()=>p.evaluate(()=>window.__events),setState:patch=>p.evaluate(async patch=>{window.__state={...window.__state,...patch};await window.__patch?.(patch);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));},patch)};
 return {p,d,run:()=>observeCatalogCase(p,d,f),close:()=>context.close()};
}
async function check(id,n,markup,setup,bad,pattern){const positive=await inspect(id,n,markup,setup);try{await positive.run();}finally{await positive.close();}for(const mode of bad){const negative=await inspect(id,n,markup,setup,mode);try{await assert.rejects(negative.run(),pattern,`${id}/${n} must reject ${mode}`);}finally{await negative.close();}}}

test('radio sequential access preserves native same-name grouping and never selects merely from Tab',async()=>{
 const markup='<form><fieldset><legend>거주 지역</legend><label><input type="radio" name="region" value="seoul">서울</label><label><input type="radio" name="region" value="busan">부산</label><label><input type="radio" name="region" value="jeju" disabled>제주</label></fieldset></form><button>다음</button>';
 function setup(){if(window.__mode==='native-default-only')return;const inputs=[...document.querySelectorAll('input:not(:disabled)')];for(let index=0;index<inputs.length;index++)inputs[index].addEventListener('keydown',event=>{if(event.key!=='Tab')return;const target=inputs[index+(event.shiftKey?-1:1)];if(target){event.preventDefault();target.focus();if(window.__mode==='tab-selects')target.checked=true;}});}
 await check('radio-group',7,markup,setup,['native-default-only','tab-selects'],/toBeFocused|toBeChecked/);
});

test('controlled mixed checkbox restores both native bits and rejects optimistic mixed-bit loss',async()=>{
 const markup='<form><label><input name="consent" type="checkbox" value="agreed">이용약관 동의</label></form>';
 function setup(){const input=document.querySelector('input');input.indeterminate=true;input.onclick=()=>{window.__events.push({name:'checkedChange',detail:{checked:true}});input.checked=false;if(window.__mode!=='lost-mixed')input.indeterminate=true;};}
 await check('checkbox',7,markup,setup,['lost-mixed'],/toEqual/);
});

test('fractional range requests and actual submitted native decimals avoid floating point drift and duplicates',async()=>{
 const markup='<form><label>예제 비율<input name="ratio" type="range" min="0" max="1" step="0.1" value="0.2"></label></form>';
 function setup(){const input=document.querySelector('input');input.oninput=()=>{window.__events.push({name:'valueChange',detail:{value:window.__mode==='drift'?Number(input.value)+Number.EPSILON:Number(input.value)}});if(window.__mode==='duplicate')window.__events.push(window.__events.at(-1));};}
 await check('range-slider',6,markup,setup,['drift','duplicate'],/toEqual/);
});

test('same-ID toast revisions get a fresh lifetime, identical updates stay silent, and stale timers cannot dismiss new content',async()=>{
 const markup='<div data-krds-component="toast" data-krds-part="root"><div role="status">신청이 저장되었습니다.</div></div>';
 function setup(){let timer,generation=0,text=window.__state.message.text;const status=document.querySelector('[role=status]');const schedule=()=>{Date.now();if(window.__mode!=='stale-timer')clearTimeout(timer);const own=++generation;timer=setTimeout(()=>{if(window.__mode!=='stale-timer'&&own!==generation)return;window.__events.push({name:'dismiss',detail:{id:window.__state.message.id,reason:'timeout',generation:own}});status.remove();},window.__state.durationMs);};schedule();window.__patch=patch=>{if(!patch.message)return;if(patch.message.text!==text){text=patch.message.text;status.textContent=text;schedule();}else if(window.__mode==='duplicate-dom'){status.textContent=text;schedule();}};}
 await check('toast',8,markup,setup,['duplicate-dom'],/toBe/);
 await check('toast',11,markup,setup,['stale-timer'],/toEqual|toContainText/);
});

test('snackbar rejected close/timeout preserves actual visible message and focus without advancing an internal queue',async()=>{
 const markup='<div data-krds-component="snackbar" data-krds-part="root"><div role="status">예제 신청을 저장했습니다.</div><button type="button">알림 닫기</button></div><button data-krds-host="outside-action">다음 작업</button>';
 function setup(){let timer,generation=1;const root=document.querySelector('div'),button=document.querySelector('button');const send=reason=>{window.__events.push({name:'dismiss',detail:{id:'saved',reason,generation}});if(window.__mode==='optimistic-remove')root.remove();};button.onclick=()=>send('close');window.__patch=patch=>{if(patch.durationMs){clearTimeout(timer);generation++;timer=setTimeout(()=>send('timeout'),patch.durationMs);}};}
 await check('snackbar',10,markup,setup,['optimistic-remove'],/toContainText/);
});

test('partial narrow tutorial Stop retains the real Help modal and never restores outside its active trap',async()=>{
 const markup='<div inert id="outside"><button id="tutorial-fallback">다음 작업</button></div><aside data-krds-component="tutorial-panel" data-krds-part="root" data-krds-state="open running" role="dialog" aria-modal="true" aria-label="지원"><button data-krds-component="tutorial-panel" data-krds-part="opener">튜토리얼 열기</button><button data-krds-component="tutorial-panel" data-krds-part="close">튜토리얼 닫기</button><button role="tab" aria-selected="true">도움말</button><button role="tab" aria-selected="false">튜토리얼</button><section data-krds-component="coach-mark" data-krds-part="root">설명</section><button data-krds-component="tutorial-panel" data-krds-part="stop">따라하기 중지</button><button id="internal">도움말 계속</button></aside>';
 function setup(){const modal=document.querySelector('aside'),internal=document.querySelector('#internal');document.querySelector('[data-krds-part=stop]').onclick=()=>{window.__events.push({name:'stop',detail:{reason:'stop',running:false,returnTo:{panel:'tutorial',open:true,startActionId:'tutorial-start'}}});document.querySelector('[data-krds-component="coach-mark"]').remove();modal.dataset.krdsState='open idle';if(window.__mode==='outside-restore'){document.querySelector('#outside').inert=false;document.querySelector('#tutorial-fallback').focus();}else{internal.focus();if(window.__mode==='duplicate-restore')internal.focus();}};modal.onkeydown=event=>{if(event.key==='Tab'){event.preventDefault();internal.focus();}};}
 await check('tutorial-panel',11,markup,setup,['outside-restore','duplicate-restore'],/toBe|toEqual|toHaveLength/);
});

test('configured table sorting must change actual rows, aria-sort and retain the actual header button focus',async()=>{
 const markup='<table data-krds-component="table" data-krds-part="root"><caption>예제 신청 내역</caption><thead><tr><th scope="col" aria-sort="ascending"><button data-krds-component="table" data-krds-part="sort-trigger">신청명</button></th><th scope="col">수량</th></tr></thead><tbody><tr><td>신청 가</td><td>2</td></tr><tr><td>신청 나</td><td>1</td></tr></tbody></table>';
 function setup(){if(window.__mode==='stale-cell')document.querySelector('tbody td').textContent='오래된 값';document.querySelector('button').onclick=()=>{document.querySelector('th[aria-sort]').setAttribute('aria-sort','descending');if(window.__mode!=='stale-order'){const body=document.querySelector('tbody');body.prepend(body.lastElementChild);}window.__events.push({name:'sortChange',detail:{columnId:window.__mode==='wrong-column'?'wrong':window.__state.sort.columnId,direction:'descending'}});};}
 await check('table',5,markup,setup,['stale-order','wrong-column','stale-cell'],/toEqual|toHaveText/);
});

test('manual media equivalence stays an explicit failing blocker rather than a skipped or fabricated passing browser result',async()=>{
 const f=source('accessible-media',6);assert.match(catalogCaseMetadata(f).manualRequired,/content-production/);await assert.rejects(observeCatalogCase({}, {readEvents:async()=>[]}, f),error=>error instanceof ManualCatalogObservationRequired&&error.code==='KRDS_MANUAL_OBSERVATION_REQUIRED');
});


test('touch tooltip uses genuine browser tap activation and never hijacks a separate primary action',async()=>{
 const markup='<button id="help-trigger" type="button" aria-describedby="help-tooltip">신청 도움말</button><div id="help-tooltip" role="tooltip" hidden>신청 도움말을 엽니다</div>';
 function setup(){let open=false;document.querySelector('button').onclick=()=>{open=!open;document.querySelector('div').hidden=!open;window.__events.push({name:'openChange',detail:{open}});if(window.__mode==='hijacks-primary')window.__events.push({name:'action',detail:{}});};}
 await check('tooltip',5,markup,setup,['hijacks-primary'],/toEqual/);
});

test('quantity bound uses actual pointer activation on aria-disabled button and rejects boundary callbacks',async()=>{
 const markup='<form><button type="button" data-krds-component="quantity-toggle" data-krds-part="decrement">신청 수량 줄이기</button><output data-krds-component="quantity-toggle" data-krds-part="output">2개</output><button type="button" data-krds-component="quantity-toggle" data-krds-part="increment">신청 수량 늘리기</button><input type="hidden" name="quantity" value="2"></form>';
 function setup(){let value=window.__state.value??window.__state.defaultValue;const button=document.querySelector('button'),output=document.querySelector('output');output.textContent=value+'개';document.querySelector('input').value=String(value);button.setAttribute('aria-disabled',String(value===0));button.onclick=()=>{if(value===0){if(window.__mode==='boundary-callback')window.__events.push({name:'valueChange',detail:{value:0}});return;}value--;output.textContent=value+'개';document.querySelector('input').value=String(value);button.setAttribute('aria-disabled',String(value===0));window.__events.push({name:'valueChange',detail:{value}});};}
 await check('quantity-toggle',3,markup,setup,['boundary-callback'],/toEqual/);
});

test('action-gated coach blocks real disabled-pointer and unverified target activation before a verified host action',async()=>{
 const markup='<button id="tutorial-start">튜토리얼 시작</button><button id="save-application" type="button">신청 저장</button><section data-krds-component="coach-mark" data-krds-part="root"><div data-krds-component="coach-mark" data-krds-part="popover"><h3 data-krds-component="coach-mark" data-krds-part="title">이름 입력</h3><button data-krds-component="coach-mark" data-krds-part="next" type="button">다음</button></div></section>';
 function setup(){const title=document.querySelector('h3'),next=document.querySelector('[data-krds-part=next]');next.onclick=()=>{title.textContent='신청 저장';next.disabled=true;window.__events.push({name:'stepChange',detail:{id:'two',reason:'next'}});};document.querySelector('#save-application').onclick=()=>{if(window.__state.__host.targetActionVerified||window.__mode==='unverified-advance'){const event=window.__mode==='joint-stop'?{name:'stop',detail:{reason:'finish',running:false,returnTo:{panel:'tutorial',open:true,startActionId:'tutorial-start'}}}:{name:'openChange',detail:{open:false}};window.__events.push(event);if(window.__mode==='duplicate-close')window.__events.push(event);document.querySelector('section').remove();}};}
 await check('coach-mark',3,markup,setup,['unverified-advance','joint-stop','duplicate-close'],/toEqual/);
});


test('folded tutorial Stop distinguishes the earlier close action from duplicate closure during its joint transaction',async()=>{
 const markup='<button data-krds-component="tutorial-panel" data-krds-part="opener">튜토리얼 열기</button><aside data-krds-component="tutorial-panel" data-krds-part="root" data-krds-state="open running"><button data-krds-component="tutorial-panel" data-krds-part="close">튜토리얼 닫기</button><button role="tab" aria-selected="true">도움말</button><button role="tab" aria-selected="false">튜토리얼</button><button id="tutorial-start" hidden>튜토리얼 시작</button></aside><section data-krds-component="coach-mark" data-krds-part="root"><button data-krds-component="coach-mark" data-krds-part="stop">그만보기</button></section>';
 function setup(){const panel=document.querySelector('aside');document.querySelector('[data-krds-part=close]').onclick=()=>{panel.hidden=true;window.__events.push({name:'openChange',detail:{open:false}});};document.querySelector('[data-krds-part=stop]').onclick=()=>{window.__events.push({name:'stop',detail:{reason:'stop',running:false,returnTo:{panel:'tutorial',open:true,startActionId:'tutorial-start'}}});if(window.__mode==='duplicate-close')window.__events.push({name:'openChange',detail:{open:false}});document.querySelector('section').remove();panel.hidden=false;panel.dataset.krdsState='open idle';const tabs=document.querySelectorAll('[role=tab]');tabs[0].setAttribute('aria-selected','false');tabs[1].setAttribute('aria-selected','true');document.querySelector('#tutorial-start').hidden=false;document.querySelector('#tutorial-start').focus();};}
 await check('tutorial-panel',7,markup,setup,['duplicate-close'],/toEqual/);
});

test('dirty Back waits for a real reviewed confirmation dialog and never accepts an eager boolean or navigation callback',async()=>{
 const markup='<input data-krds-host="dirty-input"><button data-krds-component="back-button" data-krds-part="root">뒤로</button><output data-krds-host="route">/local/current</output><dialog aria-labelledby="confirm-title" aria-describedby="confirm-description"><h2 id="confirm-title">작성 중인 내용이 있습니다</h2><p id="confirm-description">이전 화면으로 이동하면 입력 내용이 사라질 수 있습니다.</p><button>취소</button><button>확인</button></dialog>';
 function setup(){
  const back=document.querySelector('body>button'),dialog=document.querySelector('dialog'),route=document.querySelector('output');back.textContent=window.__state.label;
  back.onclick=()=>{if(window.__mode==='boolean-only')return;if(window.__mode==='eager-navigation'){route.textContent='/local/previous';window.__events.push({name:'backRequest',detail:{reason:'confirmed'}});}dialog.showModal();};
  dialog.querySelector('button').onclick=()=>dialog.close();
  dialog.querySelectorAll('button')[1].onclick=()=>{dialog.close();window.__events.push({name:'backRequest',detail:{reason:'confirmed'}});route.textContent=window.__state.__host.history.at(-2);};
 }
 await check('back-button',2,markup,setup,['boolean-only','eager-navigation'],/toBeVisible|toHaveText|toEqual/);
 await check('back-button',3,markup,setup,['eager-navigation'],/toEqual/);
});

test('stale toast timer test preserves old-generation margin measured from actual initial exposure before driver acknowledgment',async()=>{
 const markup='<div data-krds-component="toast" data-krds-part="root"><div role="status">신청이 저장되었습니다.</div></div>';
 function setup(){let timer,generation=0;const status=document.querySelector('[role=status]');const start=()=>{clearTimeout(timer);const own=++generation;timer=setTimeout(()=>{window.__events.push({name:'dismiss',detail:{id:'saved',reason:'timeout',generation:own}});status.remove();},3000);};start();window.__patch=patch=>{if(patch.message){status.textContent=patch.message.text;start();}};}
 const specimen=await inspect('toast',11,markup,setup);
 try{await specimen.p.clock.runFor(160);await specimen.run();}finally{await specimen.close();}
});

test('eligible autoplay unmount clears actual timer without a fabricated Play action',async()=>{
 const markup='<section data-krds-component="carousel" data-krds-part="root"><button>정지</button><div data-krds-component="carousel" data-krds-part="slide">첫 번째 신청 안내</div><div data-krds-component="carousel" data-krds-part="slide" hidden>두 번째 서류 안내</div><div data-krds-component="carousel" data-krds-part="slide" hidden>세 번째 문의 안내</div></section>';
 function setup(){const timer=setTimeout(()=>window.__events.push({name:'indexChange',detail:{index:1,reason:'timer'}}),window.__state.intervalMs);window.__patch=patch=>{if(patch.__host?.mounted===false){document.querySelector('section').remove();if(window.__mode!=='leaked-timer')clearTimeout(timer);}};}
 await check('carousel',6,markup,setup,['leaked-timer'],/toEqual/);
});

test('accordion sequential real actions await native committed state and exact delayed callbacks',async()=>{
 const markup='<div id="accordion"></div>';
 function setup(){
  let open=window.__state.openIds??window.__state.defaultOpenIds??[];
  const element=document.querySelector('#accordion');
  const render=()=>{for(const button of element.querySelectorAll('button'))button.setAttribute('aria-expanded',String(open.includes(button.dataset.id)));};
  for(const item of window.__state.items){const button=document.createElement('button');button.textContent=item.title;button.dataset.id=item.id;button.onclick=()=>setTimeout(()=>{
   const ids=open.includes(item.id)?open.filter(id=>id!==item.id):[...open,item.id];
   window.__events.push({name:'openChange',detail:{ids}});
   if(window.__mode==='duplicate')window.__events.push({name:'openChange',detail:{ids}});
   if(window.__mode!=='no-op'&&window.__state.__host.acceptChanges!==false){open=ids;render();}
  },40);element.append(button);}render();
 }
 await check('accordion',2,markup,setup,['duplicate','no-op'],/toEqual|toHaveAttribute/);
 await check('accordion',5,markup,setup,['duplicate'],/toEqual/);
});

test('mixed reset baseline waits for the exact delayed activation and rejects duplicate, absent, or reset-generated callbacks',async()=>{
 const markup='<form><label><input type="checkbox" name="consent" value="agreed"></label><button type="reset">초기화</button></form>';
 function setup(){
  const input=document.querySelector('input');input.indeterminate=true;document.querySelector('label').append(window.__state.label);
  input.onchange=()=>setTimeout(()=>{if(window.__mode==='missing-activation')return;const event={name:'checkedChange',detail:{checked:true}};window.__events.push(event);if(window.__mode==='duplicate')window.__events.push(event);},80);
  document.querySelector('form').onreset=()=>setTimeout(()=>{input.checked=false;input.indeterminate=true;if(window.__mode==='reset-callback')window.__events.push({name:'checkedChange',detail:{checked:false}});},180);
 }
 await check('checkbox',4,markup,setup,['duplicate','missing-activation','reset-callback'],/toEqual/);
});

test('three real list levels inside Shadow DOM remain required and malformed or shallow lists fail',async()=>{
 function setup(){const shadow=document.querySelector('list-host').attachShadow({mode:'open'});shadow.innerHTML='<ul data-krds-component="text-list" data-krds-part="root"><li>신청 단계<ul><li>자료 준비'+(window.__mode==='shallow'?'':'<ul><li>파일 확인</li></ul>')+'</li></ul></li></ul>';if(window.__mode==='malformed'){const nested=shadow.querySelector('ul ul');nested.parentElement.replaceWith(nested);}}
 await check('text-list',2,'<list-host></list-host>',setup,['shallow','malformed'],/toBe|toHaveCount/);
});

test('every declared native Badge sample preserves its full long label and size state without clipping or callback',async()=>{
 function setup(){const container=document.querySelector('section');for(const size of ['medium','small','medium','large']){const badge=document.createElement('span');badge.dataset.krdsComponent='badge';badge.dataset.krdsPart='root';badge.dataset.krdsSize=window.__mode==='wrong-size'?'medium':size;badge.style.cssText='display:inline-block;max-width:100%;overflow-wrap:anywhere';badge.textContent=window.__state.label;container.append(badge);}if(window.__mode==='missing-sample')container.lastElementChild.remove();window.__patch=patch=>{if(!patch.label)return;for(const badge of container.children){if(window.__mode!=='no-op')badge.textContent=patch.label;}if(window.__mode==='clipped'){container.lastElementChild.style.cssText='display:inline-block;width:4px;white-space:nowrap';}};}
 await check('badge',3,'<section></section>',setup,['wrong-size','missing-sample','no-op','clipped'],/toEqual|toHaveCount|toHaveText|toBe/);
});

test('a native Shadow navigation precedes its real light-DOM target and later misplaced navigation fails',async()=>{
 function setup(){const host=document.querySelector('outline-host');const shadow=host.attachShadow({mode:'open'});const s=window.__state;shadow.innerHTML=`<nav aria-label="${s.title}" style="position:fixed;right:16px;top:100px;width:220px">${s.sections.map(section=>`<a href="#${section.id}">${section.label}</a>`).join('')}</nav>`;for(const section of s.sections){const heading=document.createElement('h2');heading.id=section.id;heading.tabIndex=-1;heading.textContent=section.label;document.body.append(heading);}if(window.__mode==='after-target')document.body.append(host);}
 await check('in-page-navigation',1,'<outline-host></outline-host>',setup,['after-target'],/toBe/);
});

test('accepted StructuredList sorting waits for the exact delayed native order and callback; stale order or duplicate requests fail',async()=>{
 function setup(){const s=window.__state,container=document.querySelector('section');container.dataset.krdsComponent='structured-list';container.dataset.krdsPart='root';container.innerHTML='<button>정렬 오름차순</button><ul>'+s.items.map(item=>`<li data-krds-part="item">${item.title}</li>`).join('')+'</ul>';container.querySelector('button').onclick=()=>setTimeout(()=>{window.__events.push({name:'sortChange',detail:{key:'title',direction:'descending'}});if(window.__mode==='duplicate')window.__events.push(window.__events.at(-1));if(window.__mode!=='stale-order'){const list=container.querySelector('ul');list.prepend(list.lastElementChild);}},80);}
 await check('structured-list',2,'<section></section>',setup,['stale-order','duplicate'],/toEqual/);
});

test('controlled Switch rejection awaits its native request and committed rollback without accepting optimistic state',async()=>{
 function setup(){const input=document.querySelector('input');input.setAttribute('aria-label',window.__state.label);input.onclick=()=>setTimeout(()=>{window.__events.push({name:'checkedChange',detail:{checked:true}});if(window.__mode!=='optimistic')setTimeout(()=>{input.checked=false;input.setAttribute('aria-checked','false');},30);},80);}
 await check('switch',3,'<input type="checkbox" role="switch" name="notification" aria-checked="false">',setup,['optimistic'],/toBeChecked/);
});

test('paused-clock Carousel keyboard/button portions await actual two-frame paint and still require the separate real-touch review',async()=>{
 function setup(){const s=window.__state,root=document.querySelector('section');root.dataset.krdsComponent='carousel';root.dataset.krdsPart='root';root.innerHTML='<button id="next">다음 슬라이드</button>'+s.items.map((item,index)=>`<div data-krds-component="carousel" data-krds-part="slide" ${index?'hidden':''}>${item.content}</div>`).join('')+s.items.map((_,index)=>`<button data-krds-component="carousel" data-krds-part="indicator">${index+1}</button>`).join('');let current=0;const select=value=>{if(window.__mode==='no-op')return;requestAnimationFrame(()=>requestAnimationFrame(()=>{current=value;root.querySelectorAll('[data-krds-part=slide]').forEach((node,index)=>node.hidden=index!==current);}));};root.querySelector('#next').onclick=()=>select(current+1);root.querySelectorAll('[data-krds-part=indicator]').forEach((node,index)=>{node.onclick=()=>select(index);node.onkeydown=event=>{if(event.key==='ArrowLeft')select(current-1);};});}
 for(const mode of ['correct','no-op']){const specimen=await inspect('carousel',4,'<section></section>',setup,mode);try{await assert.rejects(specimen.run(),error=>mode==='correct'?error.code==='KRDS_MANUAL_OBSERVATION_REQUIRED':error.code!=='KRDS_MANUAL_OBSERVATION_REQUIRED'&&/toBe/.test(String(error)));}finally{await specimen.close();}}
});
