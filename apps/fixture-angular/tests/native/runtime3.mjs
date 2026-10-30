import {serveProduction,root,browserPath} from '../../../../tools/testing/support.mjs';
import {createBrowserEnvironment} from '../../../../tests/compatibility/browser-environment.mjs';
import {join} from 'node:path';
import {writeFile} from 'node:fs/promises';
import assert from 'node:assert/strict';
process.env.PLAYWRIGHT_BROWSERS_PATH??=browserPath;
const {chromium}=await import('playwright');
const server=await serveProduction(join(root,'apps/fixture-angular/dist'),{fixture:true});
const runtime=await createBrowserEnvironment('chromium'),browser=await chromium.launch({env:runtime.env});
const prefix=process.env.KRDS_ANGULAR_DIAGNOSTIC_OUTPUT??'runtime3-production-red';
const directory=join(root,'.superpowers/sdd/PLAN/t10-angular-logs');
const result={artifact:server.snapshot,states:[],tts:{},pageErrors:[]};
try{
 for(const configuration of [{name:'normal',width:1280,height:800},{name:'narrow',width:360,height:800},{name:'narrow-text2-forced',width:360,height:400,text2:true}]){
  const p=await browser.newPage({viewport:{width:configuration.width,height:configuration.height}});p.on('pageerror',error=>result.pageErrors.push(String(error)));
  if(configuration.text2)await p.emulateMedia({forcedColors:'active'});
  await p.goto(server.origin+'/fixtures/bottom-sheet?case=outcome-01');await p.getByRole('status',{name:'Fixture health'}).waitFor();const dialog=p.getByRole('dialog',{name:'지역 선택'});await dialog.waitFor();
  if(configuration.text2){await p.evaluate(async()=>{document.documentElement.style.fontSize='200%';await window.__KRDS_FIXTURE__.setState({description:'긴 지역 선택 예제 내용을 확인하세요. '.repeat(120)});});}
  await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));const box=await dialog.boundingBox();const dimensions=await dialog.evaluate(node=>({clientHeight:node.clientHeight,scrollHeight:node.scrollHeight,paddingBottom:getComputedStyle(node).paddingBottom,part:node.getAttribute('data-krds-part')}));
  const state={configuration,box,dimensions,bottomAnchored:Math.abs(box.y+box.height-configuration.height)<=1,widthFits:box.x>=0&&box.x+box.width<=configuration.width+1,bounded:box.y>=0&&box.height<=configuration.height+1};
  await p.screenshot({path:join(directory,prefix+'-'+configuration.name+'.png')});
  const close=dialog.getByRole('button',{name:'닫기',exact:true});await close.scrollIntoViewIfNeeded();state.closeVisible=await close.isVisible();state.closeBox=await close.boundingBox();state.closeInViewport=state.closeBox.x>=0&&state.closeBox.y>=0&&state.closeBox.x+state.closeBox.width<=configuration.width+1&&state.closeBox.y+state.closeBox.height<=configuration.height+1;await p.screenshot({path:join(directory,prefix+'-'+configuration.name+'-close.png')});await close.focus();state.tabInside=[];for(let n=0;n<5;n++){await p.keyboard.press('Tab');state.tabInside.push(await dialog.evaluate(node=>node.contains(document.activeElement)));}
  await dialog.getByRole('radio',{name:'부산'}).check();await close.scrollIntoViewIfNeeded();await close.click();await dialog.waitFor({state:'hidden'});await p.locator('#sheet-opener').click();await dialog.waitFor();state.canceledSelectionRestored=await dialog.getByRole('radio',{name:'서울'}).isChecked();
  await p.mouse.click(8,8);await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(resolve)));state.defaultOutsideRetained=await dialog.isVisible();if(!state.defaultOutsideRetained){await p.locator('#sheet-opener').click();await dialog.waitFor();}
  await p.evaluate(()=>window.__KRDS_FIXTURE__.setState({dismissOnOutside:true}));await p.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));await p.mouse.click(8,8);await dialog.waitFor({state:'hidden'});state.explicitOutsideClosed=true;await p.locator('#sheet-opener').click();await dialog.waitFor();const handle=dialog.locator('[data-krds-part=handle]');await handle.scrollIntoViewIfNeeded();const handleBox=await handle.boundingBox();await p.mouse.move(handleBox.x+handleBox.width/2,handleBox.y+handleBox.height/2);await p.mouse.down();await p.mouse.move(handleBox.x+handleBox.width/2,handleBox.y+handleBox.height/2+100,{steps:4});await p.mouse.up();await dialog.waitFor({state:'hidden'});state.dragClosed=true;state.returnedToOpener=await p.locator('#sheet-opener').evaluate(node=>document.activeElement===node);state.events=await p.evaluate(()=>window.__KRDS_FIXTURE__.readEvents());result.states.push(state);await p.close();
 }
 const t=await browser.newPage();await t.goto(server.origin+'/fixtures/tts?case=outcome-01');await t.getByRole('status',{name:'Fixture health'}).waitFor();result.tts={labelledStatus:await t.getByRole('region',{name:'로컬 음성 모의 상태'}).count(),state:await t.locator('[data-krds-host=speech-state]').textContent(),active:await t.locator('[data-krds-host=speech-driver-active]').textContent(),lifecycle:await t.locator('[data-krds-host=speech-driver-lifecycle]').textContent()};await t.close();
}finally{await browser.close();await runtime.cleanup();await server.close();await writeFile(join(directory,prefix+'.json'),JSON.stringify(result,null,2)+'\n');}
console.log(JSON.stringify(result.states.map(({events,...state})=>state),null,2));
assert.equal(result.pageErrors.length,0);
for(const state of result.states){assert.equal(state.bottomAnchored,true,state.configuration.name+' actual sheet bottom');assert.equal(state.widthFits&&state.bounded&&state.closeVisible&&state.closeInViewport,true);assert.ok(state.tabInside.every(Boolean));assert.equal(state.canceledSelectionRestored,true);assert.equal(state.defaultOutsideRetained&&state.explicitOutsideClosed&&state.dragClosed&&state.returnedToOpener,true);if(state.configuration.text2)assert.ok(state.dimensions.scrollHeight>state.dimensions.clientHeight,'Real long text must produce bounded native scrolling');}
assert.equal(result.tts.labelledStatus,1,'Real machine-readable mock receipts have a legible status label');
