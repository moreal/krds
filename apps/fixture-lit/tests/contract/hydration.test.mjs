import {tmpdir} from 'node:os';import {join} from 'node:path';
import test from 'node:test';import assert from 'node:assert/strict';import {readFile,writeFile,cp,mkdtemp,rm} from 'node:fs/promises';
import {browserPath,serveProduction} from '../../../../tools/testing/support.mjs';
import {render} from '@lit-labs/ssr';import {html} from 'lit';import {registerKrdsElements} from '@unofficial-krds/lit';
process.env.PLAYWRIGHT_BROWSERS_PATH??=browserPath;const {chromium,webkit}=await import('playwright');
registerKrdsElements(customElements);
for(const browserName of ['chromium','webkit'])test(`Lit ${browserName} hydrates all six SSR shadow roots and reuses native DOM`,async t=>{
 const hydrationDist=await mkdtemp(join(tmpdir(),'krds-lit-six-hydration-'));t.after(()=>rm(hydrationDist,{recursive:true,force:true}));
 await cp(new URL('../../dist',import.meta.url),hydrationDist,{recursive:true});
 const options=[{value:'seoul',label:'서울'},{value:'busan',label:'부산'}],items=[{value:'first',label:'첫 번째',content:'첫 번째 내용'},{value:'second',label:'두 번째',content:'두 번째 내용'}];
 const markup=[...render(html`<krds-button id="ssr-button" defer-hydration>저장</krds-button><krds-native-select id="ssr-select" defer-hydration label="지역" .options=${options} .value=${'seoul'}></krds-native-select><krds-modal id="ssr-modal" defer-hydration title="확인"></krds-modal><krds-tabs id="ssr-tabs" defer-hydration label="작업" .items=${items}></krds-tabs><krds-calendar id="ssr-calendar" defer-hydration label="날짜 선택" reference-date="2024-02-01"></krds-calendar><krds-date-input id="ssr-date" defer-hydration label="방문일" .value=${'2024-02-29'}></krds-date-input>`)].join('');
 const skeleton=await readFile(join(hydrationDist,'hydrate.html'),'utf8');const htmlOutput=skeleton.replace('<main id="app"></main>',`<main id="app">${markup}</main><script id="krds-hydration-state" type="application/json">${JSON.stringify({'ssr-select':{options,value:'seoul'},'ssr-tabs':{items},'ssr-date':{value:'2024-02-29'}})}</script><script>window.ssrNodes=[...document.querySelectorAll('main > *')].map(host=>host.shadowRoot?.querySelector('button,select,input,table,[role="tablist"]'));</script>`);
 await writeFile(join(hydrationDist,'ssr-test.html'),htmlOutput);const server=await serveProduction(hydrationDist);let browser;
 try{browser=await({chromium,webkit})[browserName].launch();const page=await browser.newPage();const errors=[];page.on('pageerror',error=>errors.push(error.stack??String(error)));await page.goto(`${server.origin}/ssr-test.html`);await page.waitForFunction(()=>customElements.get('krds-date-input'));
  assert.equal(await page.locator('krds-button').evaluate(async element=>{await element.updateComplete;return element.shadowRoot.querySelector('button')===window.ssrNodes[0];}),true);
  assert.equal(await page.locator('krds-date-input').evaluate(async element=>{await element.updateComplete;return element.shadowRoot.querySelector('input')===window.ssrNodes[5];}),true);
  assert.equal(await page.getByRole('textbox',{name:'방문일'}).inputValue(),'2024-02-29');assert.equal(await page.getByRole('combobox',{name:'지역'}).inputValue(),'seoul');
  await page.getByRole('combobox',{name:'지역'}).selectOption('busan');assert.equal(await page.getByRole('combobox',{name:'지역'}).inputValue(),'seoul');
  await page.getByRole('tab',{name:'두 번째'}).click();assert.equal(await page.getByRole('tab',{name:'두 번째'}).getAttribute('aria-selected'),'true');
  await page.locator('krds-button').evaluate(element=>{window.actions=0;element.addEventListener('click',()=>window.actions++);});await page.getByRole('button',{name:'저장',exact:true}).click();assert.equal(await page.evaluate(()=>window.actions),1);
  assert.equal(await page.getByRole('table').count(),1);assert.deepEqual(errors,[]);
 }finally{await browser?.close();await server.close();}
});
