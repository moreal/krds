import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {observeCatalogCase} from '../testing/catalog-observations.mjs';
const cases=JSON.parse(await readFile(new URL('../../catalog/full-catalog-scenarios.json',import.meta.url),'utf8')).cases;
const fixture=(id,n)=>cases.find(item=>item.componentId===id&&item.caseId===`outcome-${String(n).padStart(2,'0')}`);

// Observer inspections only: these native DOM specimens award zero catalog coverage.
async function run(browser,f,markup,setup,mode){
  const page=await browser.newPage();
  await page.setContent('<!doctype html><html lang="ko"><meta charset="utf-8"><body>'+markup+'</body></html>');
  await page.evaluate(({f,mode})=>{window.__state={...f.initialState,__host:f.host};window.__events=[];window.__mode=mode;window.__KRDS_FIXTURE__={getState:()=>window.__state};},{f,mode});
  await page.evaluate(setup);
  const driver={readEvents:()=>page.evaluate(()=>window.__events),setState:patch=>page.evaluate(async patch=>{window.__state={...window.__state,...patch};window.__patch?.(patch);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));},patch)};
  return {observe:()=>observeCatalogCase(page,driver,f),close:()=>page.close()};
}
function radios(f){return `<form><fieldset><legend>${f.initialState.label}</legend>`+f.initialState.options.map(item=>`<label><input type="radio" name="${f.initialState.name}" value="${item.value}" ${item.disabled?'disabled':''} ${f.initialState.required?'required':''}>${item.label}</label>`).join('')+'</fieldset></form>';}

test('Radio03 establishes real keyboard focus after a pointer check without waiving missing navigation or duplicate requests',async()=>{
  const {chromium}=await import('playwright');const browser=await chromium.launch();const f=fixture('radio-group',3);
  function setup(){for(const input of document.querySelectorAll('input')){
    input.onclick=event=>{if(event.detail>0){document.body.tabIndex=-1;document.body.focus();}};
    input.onchange=()=>{const entry={name:'valueChange',detail:{value:input.value}};window.__events.push(entry);if(window.__mode==='duplicate')window.__events.push(entry);};
    input.onkeydown=event=>{if(window.__mode==='no-navigation'&&event.key.startsWith('Arrow'))event.preventDefault();};
  }}
  try{for(const mode of ['correct','no-navigation','duplicate']){const instance=await run(browser,f,radios(f),setup,mode);try{if(mode==='correct')await instance.observe();else await assert.rejects(instance.observe(),/toBeChecked|toBe|toHaveLength/);}finally{await instance.close();}}}finally{await browser.close();}
});

test('Radio08 uses a real controlled pointer request then awaits final checked/FormData; rejected stale and duplicate transactions fail',async()=>{
  const {chromium}=await import('playwright');const browser=await chromium.launch();const f=fixture('radio-group',8);
  function setup(){const first=document.querySelector('input');first.onclick=()=>{first.checked=false;setTimeout(()=>{first.checked=window.__mode!=='rejected';if(window.__mode!=='missing'){const entry={name:'valueChange',detail:{value:''}};window.__events.push(entry);if(window.__mode==='duplicate')window.__events.push(entry);}},80);};}
  try{for(const mode of ['correct','rejected','missing','duplicate']){const instance=await run(browser,f,radios(f),setup,mode);try{if(mode==='correct')await instance.observe();else await assert.rejects(instance.observe(),/toBeChecked|toEqual/);}finally{await instance.close();}}}finally{await browser.close();}
});

test('Checkbox02 scopes the aggregate indicator to its named actual control, retaining all three native instances and rejecting child-only mixed state',async()=>{
  const {chromium}=await import('playwright');const browser=await chromium.launch();const f=fixture('checkbox',2);
  const markup=`<aggregate-host></aggregate-host><label data-krds-component="checkbox" data-krds-part="root"><input type="checkbox">첫 번째 자식<span data-krds-component="checkbox" data-krds-part="indicator" data-krds-state="mixed"></span></label><label data-krds-component="checkbox" data-krds-part="root"><input type="checkbox">두 번째 자식<span data-krds-component="checkbox" data-krds-part="indicator" data-krds-state="unchecked"></span></label>`;
  function setup(){const root=document.querySelector('aggregate-host').attachShadow({mode:'open'});const s=window.__state;root.innerHTML=`<label data-krds-component="checkbox" data-krds-part="root"><input type="checkbox" name="${s.name}">${s.label}${window.__mode==='missing-parent'?'':`<span data-krds-component="checkbox" data-krds-part="indicator" data-krds-state="${window.__mode==='wrong-parent'?'unchecked':'mixed'}"></span>`}${window.__mode==='duplicate-parent'?'<span data-krds-component="checkbox" data-krds-part="indicator" data-krds-state="mixed"></span>':''}</label>`;root.querySelector('input').indeterminate=true;}
  try{for(const mode of ['correct','missing-parent','wrong-parent','duplicate-parent']){const instance=await run(browser,f,markup,setup,mode);try{if(mode==='correct')await instance.observe();else await assert.rejects(instance.observe(),/toEqual|toHaveAttribute/);}finally{await instance.close();}}}finally{await browser.close();}
});

test('TTS06 observes real abortable driver disposal with raw optional single lifecycle Stop, rejecting generic idle/no-op/duplicate/wrong-summary cleanup',async()=>{
  const {chromium}=await import('playwright');const browser=await chromium.launch();const f=fixture('tts',6);
  const markup=`<div data-krds-component="tts" data-krds-part="root"><button type="button" data-krds-component="tts" data-krds-part="play">${f.initialState.label} 재생</button></div><output data-krds-host="speech-state">idle</output><output data-krds-host="speech-driver-active">false</output><output data-krds-host="speech-driver-lifecycle">idle</output>`;
  function setup(){
    let controller=null,lifecycle='idle';
    const output=name=>document.querySelector(`[data-krds-host="${name}"]`);
    const reflect=()=>{output('speech-driver-active').textContent=String(Boolean(controller&&!controller.signal.aborted));output('speech-driver-lifecycle').textContent=lifecycle;};
    document.querySelector('button').onclick=()=>{controller=new AbortController();lifecycle='playing';controller.signal.addEventListener('abort',()=>{lifecycle='disposed';reflect();},{once:true});output('speech-state').textContent='playing';reflect();window.__events.push({name:'request',detail:{action:'play',summary:window.__state.summary,locale:window.__state.locale}});};
    window.__patch=patch=>{if(patch.__host?.mounted===false){document.querySelector('[data-krds-part=root]').remove();output('speech-state').textContent='idle';if(window.__mode!=='fake-idle')controller.abort();if(['one-stop','duplicate','wrong-summary'].includes(window.__mode)){const entry={name:'request',detail:{action:'stop',summary:window.__mode==='wrong-summary'?'다른 내용':window.__state.summary,locale:window.__state.locale}};window.__events.push(entry);if(window.__mode==='duplicate')window.__events.push(entry);}}};
  }
  try{for(const mode of ['direct-disposal','one-stop','fake-idle','duplicate','wrong-summary']){const instance=await run(browser,f,markup,setup,mode);try{if(['direct-disposal','one-stop'].includes(mode))await instance.observe();else await assert.rejects(instance.observe(),/toHaveText|toEqual|toHaveLength|toContainEqual/);}finally{await instance.close();}}}finally{await browser.close();}
});
