import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {browserPath} from '../testing/support.mjs';
import {selectOptions} from '../testing/selection.mjs';
import {pauseClockNow} from '../testing/catalog-timing.mjs';
import {catalogObservationCases,assertCatalogCaseSupported,observeCatalogCase} from '../testing/catalog-observations.mjs';

// These intentionally plain DOM specimens inspect observer strength only.
// They are not native implementations and award zero catalog/native coverage.
process.env.PLAYWRIGHT_BROWSERS_PATH??=browserPath;
const manifest=JSON.parse(await readFile(new URL('../../catalog/full-catalog-scenarios.json',import.meta.url),'utf8'));
const fixture=id=>manifest.cases.find(item=>item.componentId===id&&item.caseId==='outcome-01');
let browser;
before(async()=>{const {chromium}=await import('playwright');browser=await chromium.launch();});
after(async()=>{await browser?.close();});
async function inspect(id,markup,setup,mode='correct') {
  const page=await browser.newPage();await page.setContent(`<!doctype html><html lang="ko"><body>${markup}</body></html>`);
  await page.evaluate(({mode})=>{window.__inspectionMode=mode;window.__events=[];window.__state={};}, {mode});
  if(fixture(id)?.host?.fakeClock){await page.clock.install({time:new Date('2024-02-29T12:00:00.000Z')});await pauseClockNow(page);}
  if(setup)await page.evaluate(setup);
  const driver={readEvents:()=>page.evaluate(()=>window.__events),setState:patch=>page.evaluate(patch=>window.__patch?.(patch),patch)};
  return {page,driver,run:()=>observeCatalogCase(page,driver,fixture(id)),close:()=>page.close()};
}
async function check(id,markup,setup,{bad=[],pattern}={}) {
  const positive=await inspect(id,markup,setup);try{await positive.run();}finally{await positive.close();}
  for(const mode of bad){const negative=await inspect(id,markup,setup,mode);try{await assert.rejects(negative.run(),pattern,`${id}: ${mode} must be rejected`);}finally{await negative.close();}}
}

test('catalog opt-in preserves exact pilot option shape and rejects unsupported combinations',()=>{
  assert.deepEqual(selectOptions(['--framework','solid'],'contract'),{frameworks:['solid'],probe:false,browser:'chromium',component:undefined});
  assert.equal(selectOptions(['--framework','solid','--catalog','--case','outcome-01'],'contract').catalog,true);
  assert.throws(()=>selectOptions(['--framework','solid','--catalog','--probe'],'contract'),/cannot select probes/);
  assert.throws(()=>selectOptions(['--framework','solid','--case','outcome-01'],'contract'),/requires explicit/);
  assert.equal(selectOptions(['--framework','solid','--catalog'],'story').catalog,true);
  assert.throws(()=>selectOptions(['--supported','--catalog'],'siheom'),/Unknown option/);
});
test('first-case pairs preserve 48 component kinds and unknown frozen pairs fail closed',()=>{
  assert.equal(catalogObservationCases.length,48);assert.equal(new Set(catalogObservationCases.map(item=>item.componentId)).size,48);
  for(const entry of catalogObservationCases){assert.doesNotThrow(()=>assertCatalogCaseSupported(entry));assert.ok(fixture(entry.componentId));}
  for(const item of [{componentId:'checkbox',caseId:'outcome-99'},{componentId:'checkbox',caseId:'outcome-1'},{componentId:'button',caseId:'outcome-01'},{componentId:'__probe',caseId:'outcome-01'}])assert.throws(()=>assertCatalogCaseSupported(item),/No executable catalog observer/);
});

const checkbox='<form><label><input type="checkbox" name="consent" value="agreed">이용약관 동의</label></form>';
function checkboxSetup(){const input=document.querySelector('input');input.addEventListener('change',()=>{window.__events.push({name:'checkedChange',detail:{checked:input.checked}});if(window.__inspectionMode==='duplicate')window.__events.push({name:'checkedChange',detail:{checked:input.checked}});});if(window.__inspectionMode==='eager')window.__events.push({name:'checkedChange',detail:{checked:false}});if(window.__inspectionMode==='wrong-form')input.name='wrong';}
test('checkbox observes real label/Space, submitted native value and rejects eager/duplicate notifications and wrong names',async()=>{
  await check('checkbox',checkbox,checkboxSetup,{bad:['eager','duplicate','wrong-form'],pattern:/toEqual/});
});

const disclosure='<h2><button type="button" aria-expanded="false" aria-controls="application-help">신청 도움말</button></h2><section hidden id="application-help">신청서를 작성하는 방법입니다.</section><button id="other">다른 작업</button>';
function disclosureSetup(){const button=document.querySelector('h2 button'),panel=document.querySelector('section');button.onclick=()=>{window.__events.push({name:'openChange',detail:{open:true}});if(window.__inspectionMode!=='no-op'){button.setAttribute('aria-expanded','true');panel.hidden=false;}if(window.__inspectionMode==='wrong-focus')document.querySelector('#other').focus();};}
test('disclosure requires actual hidden-to-open content and focus retention, rejecting callback-only and misplaced focus',async()=>{
  await check('disclosure',disclosure,disclosureSetup,{bad:['no-op','wrong-focus'],pattern:/toHaveAttribute|toBeFocused/});
});

const table='<table><caption>예제 신청 내역</caption><thead><tr><th scope="col">신청명</th><th scope="col">수량</th></tr></thead><tbody><tr><td>신청 가</td><td>2</td></tr><tr><td>신청 나</td><td>1</td></tr></tbody></table>';
function tableSetup(){if(window.__inspectionMode==='fake-role'){const original=document.querySelector('table');const fake=document.createElement('div');fake.setAttribute('role','table');fake.setAttribute('aria-label','예제 신청 내역');fake.innerHTML=original.innerHTML;original.replaceWith(fake);}if(window.__inspectionMode==='wrong-values')document.querySelector('td').textContent='오래된 값';if(window.__inspectionMode==='wrong-scope')document.querySelector('th').scope='row';}
test('table checks native header/data structure, rejecting role-only tables, wrong scope and stale cells',async()=>{
  await check('table',table,tableSetup,{bad:['fake-role','wrong-scope','wrong-values'],pattern:/toBe|toHaveAttribute|toHaveText/});
});

const range='<form><label>예제 비율<input type="range" name="ratio" min="0" max="100" step="10" value="50"></label><output data-krds-component="range-slider" data-krds-part="output">50</output></form>';
function rangeSetup(){const input=document.querySelector('input'),output=document.querySelector('output');input.oninput=()=>{if(window.__inspectionMode!=='stale-output')output.textContent=input.value;window.__events.push({name:'valueChange',detail:{value:Number(input.value)}});};input.onchange=()=>{if(window.__inspectionMode==='input-change-duplicate')window.__events.push({name:'valueChange',detail:{value:Number(input.value)}});};if(window.__inspectionMode==='wrong-form')input.name='wrong';}
test('range uses real input and FormData, rejects input/change duplication, stale output and wrong submission',async()=>{
  await check('range-slider',range,rangeSetup,{bad:['input-change-duplicate','stale-output','wrong-form'],pattern:/toEqual|toHaveText/});
});

const back='<button type="button">뒤로가기</button><p data-krds-host="route">/local/current</p>';
function backSetup(){document.querySelector('button').onclick=()=>{window.__events.push({name:'backRequest',detail:{reason:'activate'}});if(window.__inspectionMode!=='host-no-op')document.querySelector('p').textContent='/local/parent';};}
test('back requires a real visible host route effect, rejecting callbacks that leave current route unchanged',async()=>{
  await check('back-button',back,backSetup,{bad:['host-no-op'],pattern:/toHaveText/});
});

const resize='<button type="button" id="trigger">화면 크기 기본</button><button type="button" id="choice" hidden>아주 크게</button><div data-krds-host="resize-content" style="font-size:20px">크기 변경 예제</div>';
function resizeSetup(){const trigger=document.querySelector('#trigger'),choice=document.querySelector('#choice');trigger.onclick=()=>choice.hidden=false;choice.onclick=()=>{window.__events.push({name:'valueChange',detail:{value:'130'}});if(window.__inspectionMode!=='host-no-op')document.querySelector('div').style.fontSize='26px';choice.hidden=true;trigger.textContent='화면 크기 아주 크게';trigger.focus();};}
test('resize measures actual scoped host text size and rejects decorative selection with no host scale change',async()=>{
  await check('resize',resize,resizeSetup,{bad:['host-no-op'],pattern:/toBeGreaterThan/});
});

const upload='<form><button type="button">파일 선택</button><input data-krds-component="file-upload" data-krds-part="file-input" type="file" name="documents" accept=".txt,.pdf"><ul data-krds-component="file-upload" data-krds-part="list"></ul><button type="submit">제출</button><button type="reset">초기화</button></form><output data-krds-host="upload-receipt"></output>';
function uploadSetup(){
  const input=document.querySelector('input'),list=document.querySelector('ul'),form=document.querySelector('form'),receipt=document.querySelector('output');let committed=[],counter=0;
  input.onchange=()=>{const file=input.files[0];if(!file)return;committed=[file];const id='file-'+(++counter);list.textContent=file.name;window.__events.push({name:'filesChange',detail:{reason:'picker',addedIds:[id],removedIds:[],value:[{id,file:{name:file.name,size:file.size,type:file.type},status:'staged'}]}});input.value='';if(window.__inspectionMode==='auto-send')receipt.textContent=file.name;};
  input.oncancel=()=>{if(window.__inspectionMode==='cancel-clears'){committed=[];list.textContent='';}};
  form.addEventListener('formdata',event=>{event.formData.delete('documents');if(window.__inspectionMode!=='fake-store')for(const file of committed)event.formData.append('documents',window.__inspectionMode==='forged-content'?new File(['forged!'],file.name,{type:file.type}):file);});
  form.onsubmit=event=>{event.preventDefault();const data=new FormData(form);receipt.textContent=[...data.getAll('documents')].map(file=>file.name+' '+file.size).join(',');};
  form.onreset=()=>{if(window.__inspectionMode==='reset-clears'){committed=[];list.textContent='';}};
}
test('upload tests actual committed File FormData, cancel, reselect, reset and submit-gated host output',async()=>{
  await check('file-upload',upload,uploadSetup,{bad:['auto-send','fake-store','cancel-clears','reset-clears','forged-content'],pattern:/toBeEmpty|toEqual|toContainText/});
});

test('favicon inspects actual document head and served bytes, rejecting body-only previews and nonsquare local bytes',async()=>{
  const {mkdtemp,writeFile,rm}=await import('node:fs/promises');const {join}=await import('node:path');const {tmpdir}=await import('node:os');const {serveProduction}=await import('../testing/support.mjs');
  const directory=await mkdtemp(join(tmpdir(),'krds-catalog-favicon-inspection-'));
  await writeFile(join(directory,'icon.svg'),'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"><rect width="32" height="32"/></svg>');
  const markup='<head><link rel="icon" href="/icon.svg" type="image/svg+xml" sizes="any"></head><body><h1>로컬 파비콘 미리보기</h1></body>';
  await writeFile(join(directory,'index.html'),markup);let server=await serveProduction(directory);const page=await browser.newPage();
  const custom={...fixture('favicon'),initialState:{light:{href:'/icon.svg',type:'image/svg+xml',sizes:'any'}}};const driver={readEvents:async()=>[]};
  try{
    await page.goto(server.origin);await observeCatalogCase(page,driver,custom);
    await writeFile(join(directory,'icon.svg'),'<svg xmlns="http://www.w3.org/2000/svg" width="32" height="16"><rect width="32" height="16"/></svg>');
    await server.close();server=await serveProduction(directory);await page.goto(server.origin);
    await assert.rejects(observeCatalogCase(page,driver,custom),/toBe/);
    await page.evaluate(()=>document.querySelector('link').remove());await assert.rejects(observeCatalogCase(page,driver,custom),/toHaveCount/);
  }finally{await page.close();await server.close();await rm(directory,{recursive:true,force:true});}
});

test('toast appears after a user action, retains focus and exposes a persistent complete result; host no-op is rejected',async()=>{
  const markup='<button type="button">신청 저장</button><div id="saved-result" hidden></div>';
  function setup(){
    document.querySelector('button').onclick=event=>{
      if(event.detail>0){document.body.tabIndex=-1;document.body.focus();if(window.__inspectionMode==='pointer-no-op')return;}
      const root=document.createElement('div');root.dataset.krdsComponent='toast';root.dataset.krdsPart='root';root.innerHTML='<div role="status">신청이 저장되었습니다.</div>';document.body.append(root);
      if(window.__inspectionMode==='steals-keyboard-focus'){root.tabIndex=-1;root.focus();}
      if(window.__inspectionMode!=='persistent-no-op'){const result=document.querySelector('#saved-result');result.hidden=false;result.textContent='신청이 저장되었습니다.';}
    };
    window.__patch=patch=>{if(patch.message===null)document.querySelector('[data-krds-component="toast"]').remove();};
  }
  await check('toast',markup,setup,{bad:['persistent-no-op','steals-keyboard-focus','pointer-no-op'],pattern:/toContainText|toBeVisible|toBeFocused|toHaveText/});
});

test('snackbar keeps controls outside its live text and waits for actual accepted host removal',async()=>{
  const markup='<div data-krds-component="snackbar" data-krds-part="root"><div role="status">예제 신청을 저장했습니다.</div><button type="button">알림 닫기</button></div>';
  function setup(){const root=document.querySelector('div'),button=document.querySelector('button');if(window.__inspectionMode==='interactive-live')document.querySelector('[role=status]').append(button);button.onclick=()=>{window.__events.push({name:'dismiss',detail:{id:'saved',reason:'close',generation:1}});if(window.__inspectionMode!=='host-no-op')root.remove();};}
  await check('snackbar',markup,setup,{bad:['interactive-live','host-no-op'],pattern:/toHaveCount|toBeHidden/});
});

test('coach starts only by explicit action beside the actual target; automatic, remote-overlay and no-op presentations are rejected',async()=>{
  const markup='<button id="tutorial-start" type="button">튜토리얼 시작</button><label for="applicant-name">이름</label><input id="applicant-name"><div id="applicant-name-after"><section data-krds-component="coach-mark" data-krds-part="popover" hidden><h2>이름 입력</h2><p>신청인 이름을 입력하세요</p><button type="button">그만보기</button></section></div>';
  function setup(){const popup=document.querySelector('section');if(window.__inspectionMode==='auto-start')popup.hidden=false;if(window.__inspectionMode==='remote-overlay')document.body.append(popup);document.querySelector('#tutorial-start').onclick=()=>{window.__events.push({name:'openChange',detail:{open:true}});if(window.__inspectionMode!=='no-op')popup.hidden=false;};}
  await check('coach-mark',markup,setup,{bad:['auto-start','remote-overlay','no-op'],pattern:/toBeHidden|toBe|toBeVisible/});
});

test('tooltip resolves the real description and accepted Escape suppression, rejecting broken relationships and immediate reopening',async()=>{
  const markup='<button id="help-trigger" type="button" aria-describedby="help-tooltip">신청 도움말</button><div id="help-tooltip" role="tooltip" hidden>신청 도움말을 엽니다</div>';
  function setup(){const trigger=document.querySelector('button'),popup=document.querySelector('div');if(window.__inspectionMode==='broken-id')trigger.setAttribute('aria-describedby','missing-tooltip');let suppressed=false;trigger.onfocus=()=>{if(!suppressed){popup.hidden=false;window.__events.push({name:'openChange',detail:{open:true}});}};trigger.onmouseenter=()=>{if(!suppressed)popup.hidden=false;};document.onkeydown=event=>{if(event.key==='Escape'){suppressed=true;popup.hidden=true;window.__events.push({name:'openChange',detail:{open:false}});trigger.focus();if(window.__inspectionMode==='reopen')popup.hidden=false;}};}
  await check('tooltip',markup,setup,{bad:['broken-id','reopen'],pattern:/toContain|toBeHidden/});
});


test('carousel focus stops mounted timers and keeps hidden slides unavailable, rejecting stale advancement and passive callbacks',async()=>{
  const markup='<section data-krds-component="carousel" data-krds-part="root"><button type="button" id="play">중지</button><button type="button" id="next">다음 슬라이드</button><div data-krds-part="slide">첫 번째 신청 안내</div><div data-krds-part="slide" hidden>두 번째 서류 안내</div><div data-krds-part="slide" hidden>세 번째 문의 안내</div></section><button type="button">다음 작업</button>';
  function setup(){const root=document.querySelector('section'),slides=[...root.querySelectorAll('[data-krds-part=slide]')],play=document.querySelector('#play');let index=0;const render=()=>slides.forEach((slide,n)=>slide.hidden=n!==index);const timer=setInterval(()=>{index=(index+1)%3;render();window.__events.push({name:'indexChange',detail:{index,reason:'timer'}});},6000);root.addEventListener('focusin',event=>{if(!root.contains(event.relatedTarget)){play.textContent='재생';if(window.__inspectionMode!=='stale-timer')clearInterval(timer);if(window.__inspectionMode==='passive-event')window.__events.push({name:'playingChange',detail:{playing:false,reason:'focus'}});}});document.querySelector('#next').onclick=()=>{index=1;render();window.__events.push({name:'indexChange',detail:{index,reason:'next'}});};}
  await check('carousel',markup,setup,{bad:['stale-timer','passive-event'],pattern:/toEqual/});
});
