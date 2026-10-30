import assert from 'node:assert/strict';
import {mkdir,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve,join} from 'node:path';
import {chromium,firefox,webkit} from 'playwright';
import {serveProduction} from '../../../tools/testing/support.mjs';
import {createBrowserEnvironment} from '../../../tests/compatibility/browser-environment.mjs';

const repo=resolve(process.cwd(),'../..');
const dist=resolve(process.argv[2]??'dist');
const phase=process.argv[3]??'candidate';
const output=join(repo,'.superpowers/sdd/PLAN/t13-svelte-native-tab-fix',`${phase}-${Date.now()}`);
await mkdir(output,{recursive:true});
const server=await serveProduction(dist,{fixture:true});
const rows=[];
async function frame(page){await page.evaluate(()=>new Promise(done=>requestAnimationFrame(()=>requestAnimationFrame(done))));}
async function press(page,key){await page.keyboard.press(key);await frame(page);}
async function focused(locator){return locator.evaluate(node=>node===document.activeElement);}
async function events(page){return page.evaluate(()=>window.__KRDS_FIXTURE__.readEvents());}
async function attributes(locator){return locator.evaluateAll(nodes=>nodes.map(node=>({tag:node.tagName,type:node.type,id:node.id,disabled:node.disabled,tabindex:node.getAttribute('tabindex'),tabIndex:node.tabIndex,controls:node.getAttribute('aria-controls'),describedby:node.getAttribute('aria-describedby')})));}
async function nativeDisabledSentinel(page){
  await page.evaluate(()=>{const host=document.createElement('section');host.id='native-tab-sentinel';host.innerHTML='<input id="sentinel-before"><button type="button" id="sentinel-a" tabindex="0">A</button><button type="button" id="sentinel-disabled" tabindex="0" disabled>Disabled</button><button type="button" id="sentinel-b" tabindex="0">B</button><button type="button" id="sentinel-negative" tabindex="-1">Negative</button><span hidden><button type="button" id="sentinel-hidden" tabindex="0">Hidden</button></span><input id="sentinel-after">';document.body.append(host);});
  await page.locator('#sentinel-before').focus();
  for(const [key,id]of[['Tab','sentinel-a'],['Tab','sentinel-b'],['Tab','sentinel-after'],['Shift+Tab','sentinel-b'],['Shift+Tab','sentinel-a'],['ArrowDown','sentinel-a']]){await press(page,key);assert.equal(await page.evaluate(()=>document.activeElement.id),id);}
  assert.equal(await page.locator('#sentinel-disabled').isDisabled(),true);
  await page.locator('#native-tab-sentinel').evaluate(node=>node.remove());
}
try{
  for(const browserName of ['chromium','firefox','webkit']){
    const environment=await createBrowserEnvironment(browserName);
    let browser;
    try{
      browser=await({chromium,firefox,webkit})[browserName].launch({headless:true,env:environment.env});
      for(const componentId of ['accordion','tooltip']){
        const context=await browser.newContext({viewport:{width:1280,height:800}});
        const page=await context.newPage();
        const row={browserName,browserVersion:browser.version(),componentId,passed:false,errors:[],requests:[]};
        page.on('pageerror',error=>row.errors.push(String(error)));
        page.on('request',request=>row.requests.push(request.url()));
        try{
          await page.goto(`${server.origin}/fixtures/${componentId}?case=${componentId==='accordion'?'outcome-04':'outcome-03'}`);
          await page.waitForFunction(()=>window.__KRDS_FIXTURE__?.protocol===1);
          await page.evaluate(()=>{window.__nativeTabKeys=[];document.addEventListener('keydown',event=>window.__nativeTabKeys.push({key:event.key,trusted:event.isTrusted,defaultPrevented:event.defaultPrevented,targetId:event.target.id}));});
          const triggers=page.locator(`[data-krds-component=${componentId}][data-krds-part=trigger]`);
          row.beforeAttributes=await attributes(triggers);
          await triggers.evaluateAll(nodes=>window.__nativeTabNodes=nodes);
          const first=triggers.first();
          if(componentId==='accordion'){
            await nativeDisabledSentinel(page);
            assert.deepEqual(await events(page),[]);
            await first.focus();
            await press(page,'Enter');assert.equal(await first.getAttribute('aria-expanded'),'true');assert.ok(await focused(first));
            await press(page,'Space');assert.equal(await first.getAttribute('aria-expanded'),'false');assert.ok(await focused(first));
            const state=await page.evaluate(()=>window.__KRDS_FIXTURE__.getState());
            const expected=[{name:'openChange',detail:{ids:[state.items[0].id]}},{name:'openChange',detail:{ids:[]}}];
            assert.deepEqual(await events(page),expected);
            await press(page,'Tab');assert.ok(await focused(triggers.nth(1)),'real Tab must reach the second native header');
            await press(page,'Shift+Tab');assert.ok(await focused(first));
            await press(page,'ArrowDown');assert.ok(await focused(first),'Accordion must not add mandatory arrow roving');
            assert.deepEqual(await events(page),expected);
          }else{
            await first.focus();await frame(page);
            const popup=page.getByRole('tooltip');
            await press(page,'Escape');assert.equal(await popup.isVisible(),false);assert.ok(await focused(first));
            await first.hover();await frame(page);assert.equal(await popup.isVisible(),false);
            assert.deepEqual((await events(page)).map(event=>event.detail.open),[true,false]);
            await press(page,'Tab');assert.equal(await focused(first),false);assert.equal(await popup.isVisible(),false);
            await press(page,'Shift+Tab');assert.ok(await focused(first),'real reverse Tab must reach the actual Tooltip trigger');assert.equal(await popup.isVisible(),true);
            assert.deepEqual((await events(page)).map(event=>event.detail.open),[true,false,true]);
            await press(page,'Escape');assert.equal(await popup.isVisible(),false);
            await page.evaluate(()=>{const input=document.createElement('input');input.id='native-tab-after-tooltip';document.querySelector('[data-krds-component=tooltip][data-krds-part=root]').after(input);});
            await press(page,'Tab');assert.ok(await focused(page.locator('#native-tab-after-tooltip')));assert.equal(await popup.isVisible(),false);
            await press(page,'Shift+Tab');assert.ok(await focused(first));assert.equal(await popup.isVisible(),true);
            assert.deepEqual(await events(page),[true,false,true,false,true].map(open=>({name:'openChange',detail:{open}})));
          }
          row.afterAttributes=await attributes(triggers);
          assert.deepEqual(row.afterAttributes,row.beforeAttributes);
          assert.ok(row.afterAttributes.every(node=>node.tag==='BUTTON'&&node.type==='button'&&node.disabled===false));
          row.nodesReused=await triggers.evaluateAll(nodes=>nodes.every((node,index)=>node===window.__nativeTabNodes[index]));assert.equal(row.nodesReused,true);
          row.keys=await page.evaluate(()=>window.__nativeTabKeys);
          assert.ok(row.keys.filter(event=>event.key==='Tab').every(event=>event.trusted&&!event.defaultPrevented));
          row.events=await events(page);
          assert.deepEqual(row.errors,[]);
          assert.deepEqual(row.requests.filter(url=>new URL(url).origin!==server.origin),[]);
          row.passed=true;
        }catch(error){row.error=String(error);row.stack=error.stack;row.keys=await page.evaluate(()=>window.__nativeTabKeys??[]);row.events=await events(page);}
        finally{await page.screenshot({path:join(output,`${browserName}-${componentId}.png`),fullPage:true});await writeFile(join(output,`${browserName}-${componentId}.json`),JSON.stringify(row,null,2));rows.push(row);await context.close();}
      }
    }finally{await browser?.close();await environment.cleanup();}
  }
}finally{await server.close();}
const sourcePaths=['packages/svelte/src/lib/components/Accordion.svelte','packages/svelte/src/lib/components/Tooltip.svelte','apps/fixture-svelte/scripts/native-tab-regression.mjs'];
const sources=await Promise.all(sourcePaths.map(async path=>({path,sha256:createHash('sha256').update(await readFile(join(repo,path))).digest('hex')})));
await writeFile(join(output,'results.json'),JSON.stringify({phase,node:process.version,artifact:server.snapshot,sources,rows},null,2));
console.log(JSON.stringify({output,passed:rows.filter(row=>row.passed).length,total:rows.length,failures:rows.filter(row=>!row.passed).map(row=>({browser:row.browserName,component:row.componentId,error:row.error}))}));
if(rows.some(row=>!row.passed))process.exitCode=1;
