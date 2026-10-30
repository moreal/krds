import test,{before,after} from 'node:test';
import assert from 'node:assert/strict';
import {form,ownedList,tag,ownedNative,relation,focusableInside,usableFocus,modalIsolation,assertCleanup,branchButton} from '../testing/catalog-outcome-helpers.mjs';
let browser;
before(async()=>{const {chromium}=await import('playwright');browser=await chromium.launch();});
after(async()=>{await browser?.close();});
// These actual-browser DOM specimens inspect observers and award zero native coverage.
test('native outer lists preserve three real levels and reject unrelated or role-only substitutes',async()=>{
 const page=await browser.newPage();
 try{
  await page.setContent('<div data-krds-component="text-list" data-krds-part="root"><ul><li>첫째<ul><li>둘째<ul><li>셋째</li></ul></li></ul></li></ul></div>');
  const list=await ownedList(page,'text-list','ul');await tag(list,'ul');assert.equal(await list.locator('ul').count(),2);
  await page.locator('[data-krds-part=root]').evaluate(node=>node.insertAdjacentHTML('beforeend','<ul><li>unrelated</li></ul>'));
  await assert.rejects(ownedList(page,'text-list','ul'),/toHaveLength/);
  await page.setContent('<div data-krds-component="text-list" data-krds-part="root" role="list"><div role="listitem">fake</div></div>');
  await assert.rejects(ownedList(page,'text-list','ul'),/toHaveLength/);
 }finally{await page.close();}
});
test('actual FACE internals submit once through shadow native controls and reject duplicated hidden contributions',async()=>{
 const page=await browser.newPage();
 try{
  await page.setContent('<form><quantity-face></quantity-face></form>');
  await page.evaluate(()=>{customElements.define('quantity-face',class extends HTMLElement{
   static formAssociated=true;
   constructor(){super();this.internals=this.attachInternals();this.attachShadow({mode:'open'}).innerHTML='<label>수량<input name="quantity" value="2"></label><output>2</output>';this.internals.setFormValue('2');this.setAttribute('name','quantity');}
  });});
  const control=page.getByRole('textbox',{name:'수량'});assert.equal(await control.evaluate(node=>node.form),null);
  assert.deepEqual(await form(control,'quantity'),['2']);
  await page.locator('form').evaluate(node=>node.insertAdjacentHTML('beforeend','<input type="hidden" name="quantity" value="2">'));
  assert.notDeepEqual(await form(control,'quantity'),['2']);
 }finally{await page.close();}
});
test('composed focus and native modal isolation inspect actual browser behavior without requiring inert attributes',async()=>{
 const page=await browser.newPage();
 try{
  await page.setContent('<button data-krds-host="outside-action">외부</button><dialog aria-label="설명"><shadow-controls></shadow-controls></dialog>');
  await page.evaluate(()=>{customElements.define('shadow-controls',class extends HTMLElement{constructor(){super();this.attachShadow({mode:'open'}).innerHTML='<button>내부</button>';}});document.querySelector('dialog').showModal();});
  const dialog=page.getByRole('dialog',{includeHidden:true});await page.getByRole('button',{name:'내부'}).focus();await focusableInside(dialog);await usableFocus(page);
  assert.equal(await page.locator('[inert]').count(),0);await modalIsolation(page,dialog);
  await page.evaluate(()=>document.querySelector('dialog').close());await assertCleanup(page);
  await assert.rejects(focusableInside(dialog),/toBe/);
 }finally{await page.close();}
});
test('wrapper roots still require real native image/table and native cross-root description references',async()=>{
 const page=await browser.newPage();
 try{
  await page.setContent('<figure data-krds-component="image" data-krds-part="root"><img alt="기관"></figure><div data-krds-component="table" data-krds-part="root"><table><caption>내역</caption></table></div><span id="description">실제 설명</span><described-control></described-control>');
  await tag(ownedNative(page,'image','img'),'img');await tag(ownedNative(page,'table','table'),'table');
  await page.evaluate(()=>{customElements.define('described-control',class extends HTMLElement{constructor(){super();this.attachShadow({mode:'open'}).innerHTML='<button>설명</button>';this.shadowRoot.querySelector('button').ariaDescribedByElements=[document.querySelector('#description')];}});});
  const button=page.getByRole('button',{name:'설명'});await relation(button,'aria-describedby','실제 설명');
  await page.evaluate(()=>document.querySelector('#description').remove());await assert.rejects(relation(button,'aria-describedby','실제 설명'),/not.toContain|toBeGreaterThan/);
 }finally{await page.close();}
});

test('purposeful native branch names retain configured labels including regex punctuation',async()=>{
 const page=await browser.newPage();try{
  await page.setContent('<nav data-krds-component="side-navigation" data-krds-part="root"><button aria-expanded="false">[A+B] 펼치기</button><button>[A+B] 다른 작업</button></nav>');
  const button=branchButton(page,'[A+B]');assert.equal(await button.count(),1);await tag(button,'button');
 }finally{await page.close();}
});

test('body-first native banner follows composed parents and rejects an actual main ancestor or earlier body content',async()=>{
 const {observeCatalogCase}=await import('../testing/catalog-observations.mjs');
 const {readFile}=await import('node:fs/promises');
 const fixture=JSON.parse(await readFile(new URL('../../catalog/full-catalog-scenarios.json',import.meta.url),'utf8')).cases.find(item=>item.componentId==='critical-alert'&&item.caseId==='outcome-04');
 for(const mode of ['correct','inside-main','after-content']){
  const page=await browser.newPage();try{
   await page.setContent(mode==='inside-main'?'<main><alert-host></alert-host></main>':(mode==='after-content'?'<p>앞선 본문</p>':'')+'<alert-host></alert-host>');
   await page.evaluate(fixture=>{const shadow=document.querySelector('alert-host').attachShadow({mode:'open'});const section=document.createElement('section');section.dataset.krdsComponent='critical-alert';section.dataset.krdsPart='root';section.setAttribute('role','banner');section.textContent=fixture.initialState.label+' '+fixture.initialState.message;shadow.append(section);},fixture);
   const run=observeCatalogCase(page,{readEvents:async()=>[]},fixture);
   if(mode==='correct')await run;else await assert.rejects(run,/toBe/);
  }finally{await page.close();}
 }
});

test('actual projected controls belong to their native modal slot and outside focus remains rejected after close',async()=>{
 const page=await browser.newPage();try{
  await page.setContent('<button id="outside" data-krds-host="outside-action">외부 동작</button><modal-host><button slot="content">투영된 버튼</button></modal-host>');
  await page.evaluate(()=>{const shadow=document.querySelector('modal-host').attachShadow({mode:'open'});shadow.innerHTML='<dialog aria-label="투영 대화상자"><slot name="content"></slot></dialog>';shadow.querySelector('dialog').showModal();});
  const dialog=page.getByRole('dialog',{name:'투영 대화상자',includeHidden:true});await page.getByRole('button',{name:'투영된 버튼',exact:true}).focus();await focusableInside(dialog);await modalIsolation(page,dialog);
  await page.evaluate(()=>document.querySelector('modal-host').shadowRoot.querySelector('dialog').close());await page.locator('#outside').focus();await assert.rejects(focusableInside(dialog),/toBe/);
 }finally{await page.close();}
});
