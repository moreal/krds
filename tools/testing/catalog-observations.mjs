import {assertMastheadPolicy} from './catalog-masthead-inspection.mjs';
import {nativeComposedOrder,lastComposedSubdivision} from './catalog-composed-inspection.mjs';
import {expect} from '@playwright/test';
import {pauseClockNow,clockManagedDriver,visibleAfterClockAction} from './catalog-timing.mjs';
import {form as readAssociatedForm,ownedNative,ownedList,focusableInside,modalIsolation,ids as relationIds,panelPresentation,assertCleanup,branchButton,followNativeModifiedLink} from './catalog-outcome-helpers.mjs';
import {assertCatalogBoundary} from './catalog-boundaries.mjs';
import {staticOutcomes} from './catalog-static-outcomes.mjs';
import {navigationOutcomes} from './catalog-navigation-outcomes.mjs';
import {inputOutcomes} from './catalog-input-outcomes.mjs';
import {stateOutcomes} from './catalog-state-outcomes.mjs';
import {helpOutcomes} from './catalog-help-outcomes.mjs';
import {notificationOutcomes} from './catalog-notification-outcomes.mjs';
import {uploadOutcomes} from './catalog-upload-outcomes.mjs';
import {mediaOutcomes} from './catalog-media-outcomes.mjs';

const additionalCases = new Map();
for (const family of [staticOutcomes,navigationOutcomes,inputOutcomes,stateOutcomes,helpOutcomes,notificationOutcomes,uploadOutcomes,mediaOutcomes]) {
  for (const [componentId, outcomes] of Object.entries(family)) {
    for (const [number, observation] of Object.entries(outcomes)) {
      const caseId = `outcome-${number.padStart(2,'0')}`;
      const key = `${componentId}/${caseId}`;
      if (additionalCases.has(key)) throw new Error(`Duplicate executable catalog observation: ${key}`);
      additionalCases.set(key, observation);
    }
  }
}
export class ManualCatalogObservationRequired extends Error {
  constructor(fixture, reason) {
    super(`Manual catalog observation required: ${fixture.componentId}/${fixture.caseId}: ${reason}`);
    this.name = 'ManualCatalogObservationRequired';
    this.code = 'KRDS_MANUAL_OBSERVATION_REQUIRED';
    this.reason = reason;
  }
}
export function catalogCaseMetadata(fixture) {
  assertCatalogCaseSupported(fixture);
  const entry = additionalCases.get(`${fixture.componentId}/${fixture.caseId}`);
  const manualRequired = entry?.manualRequired ?? (fixture.componentId==='accessible-media' && fixture.caseId==='outcome-01'
    ? 'A human must listen to the actual audio and confirm transcript equivalence; decoded duration and matching supplied text do not establish content accuracy.' : null);
  return {componentId:fixture.componentId,caseId:fixture.caseId,requiredBrowserCapabilities:(fixture.componentId==='toast'&&fixture.caseId==='outcome-05')||(fixture.componentId==='snackbar'&&fixture.caseId==='outcome-12')?['actual-document-visibility']:[],automatedPortion:typeof entry==='function'||Boolean(entry?.run)||!entry,manualRequired,coverageAwarded:false};
}
export const additionalCatalogObservationCases = Object.freeze([...additionalCases.keys()].map(key=>{
  const [componentId,caseId]=key.split('/');return Object.freeze({componentId,caseId});
}));


/** Executable observations are opt-in and keyed by the complete frozen pair.
 * A source obligation is not automatically executable merely because it has prose/data.
 * Plain DOM inspection of this module never awards native implementation coverage. */
const firstCaseComponents = [
  'masthead','identifier','header','footer','skip-link','main-menu','breadcrumb','side-navigation',
  'in-page-navigation','pagination','structured-list','critical-alert','disclosure','badge','accordion',
  'image','carousel','table','text-list','favicon','link','fab','radio-group','checkbox','tag','switch',
  'step-indicator','spinner','help-panel','tutorial-panel','contextual-help','coach-mark','tooltip','tts',
  'textarea','text-input','file-upload','language-switcher','resize','accessible-media','visually-hidden',
  'range-slider','back-button','bottom-sheet','quantity-toggle','toast','snackbar','tab-bar',
];
export const catalogObservationCases = Object.freeze(firstCaseComponents.map(componentId=>Object.freeze({componentId,caseId:'outcome-01'})));
export const catalogAllObservationCases = Object.freeze([...catalogObservationCases,...additionalCatalogObservationCases]);
const supported = new Set(catalogObservationCases.map(item=>`${item.componentId}/${item.caseId}`));
export function assertCatalogCaseSupported({componentId,caseId}) {
  if(!supported.has(`${componentId}/${caseId}`) && !additionalCases.has(`${componentId}/${caseId}`)) throw new Error(`No executable catalog observer for fixture: ${componentId}/${caseId}; staged obligations remain unverified`);
}
const role=(page,kind,name)=>page.getByRole(kind,{name,exact:true});
export const catalogRoot=(page,id)=>page.locator(`[data-krds-component="${id}"][data-krds-part="root"]`);
const part=(page,id,name)=>page.locator(`[data-krds-component="${id}"][data-krds-part="${name}"]`);
async function native(locator,tag) {await expect(locator).toHaveCount(1);expect(await locator.evaluate(node=>node.tagName)).toBe(tag.toUpperCase());}
async function quiet(driver) {expect(await driver.readEvents(),'Mount, passive props and no-op actions emit no semantic requests').toEqual([]);}
async function eventList(driver,list) {if(list.length)await expect.poll(()=>driver.readEvents(),{message:'Exactly the required plain semantic requests after native action commit'}).toEqual(list);else expect(await driver.readEvents()).toEqual(list);}
async function noInteractive(locator) {
  await expect(locator.locator('a[href],button,input,select,textarea,[role="button"],[role="link"],[tabindex]:not([tabindex="-1"])')).toHaveCount(0);
}
async function anchor(locator,href) {await native(locator,'a');await expect(locator).toHaveAttribute('href',href);}
async function localImage(page,locator,src) {
  await native(locator,'img');await expect(locator).toHaveAttribute('src',src);
  const url=new URL(src,page.url());expect(url.origin).toBe(new URL(page.url()).origin);
  const response=await page.request.get(url.href);expect(response.ok(),'Actual local image asset must exist').toBe(true);
  await expect.poll(()=>locator.evaluate(image=>image.complete&&image.naturalWidth>0&&image.naturalHeight>0)).toBe(true);
}
async function resolvedIds(locator,attribute,text) {
  const references=await relationIds(locator,attribute);const info={ids:references.map(item=>item.id),texts:references.map(item=>item.text)};
  expect(info.ids.length,`A real ${attribute} relationship is required`).toBeGreaterThan(0);
  expect(new Set(info.ids).size).toBe(info.ids.length);expect(info.texts).not.toContain(null);
  if(text)expect(info.texts.join(' ')).toContain(text);
}
async function formValue(control,name,expected) {
  await expect.poll(async()=>(await readAssociatedForm(control,name)).map(value=>typeof value==='string'?value:{name:value.name,size:value.size,type:value.type})).toEqual(expected);
}
async function nextEvent(driver,name,detail) {await eventList(driver,[{name,detail}]);}
async function firstTab(page,target) {await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0);});await page.keyboard.press('Tab');await expect(target).toBeFocused();}
const modifiedNavigation=followNativeModifiedLink;

const observers={
  async masthead(page,driver,fixture) {
    const {initialState:s,host}=fixture;await assertMastheadPolicy(page,fixture);const root=catalogRoot(page,'masthead');await expect(root).toHaveCount(1);
    await expect(root).toContainText('이 누리집은 대한민국 공식 전자정부 누리집입니다.');await noInteractive(root);
    const skip=role(page,'link','본문 바로가기');await firstTab(page,skip);
    const header=page.locator('header');await native(header,'header');
    const order=await nativeComposedOrder(page.locator('body'),[skip,root,header]);expect(order[0]>=0&&order[0]<order[1]&&order[1]<order[2],'Page order is SkipLink, Masthead, Header').toBe(true);
    await quiet(driver);
  },
  async identifier(page,driver,{initialState:s}) {
    const footer=page.getByRole('contentinfo');await native(footer,'footer');const root=catalogRoot(page,'identifier');await expect(root).toHaveCount(1);
    expect(await lastComposedSubdivision(root,footer)).toBe(true);
    await localImage(page,root.getByRole('img',{name:s.institutionName,exact:true}),s.logo.src);
    await expect(root).toContainText(s.relationshipText);await noInteractive(root);await quiet(driver);
  },
  async header(page,driver,{initialState:s}) {
    const root=page.getByRole('banner');await native(root,'header');const home=root.getByRole('link',{name:s.home.label,exact:true});await anchor(home,s.home.href);
    const utility=root.getByRole('link',{name:s.utilityItems[0].label,exact:true});await anchor(utility,s.utilityItems[0].href);
    const search=root.getByRole('button',{name:s.search?.label??'검색',exact:true});await native(search,'button');
    const nav=root.getByRole('navigation');await native(nav,'nav');
    const order=await nativeComposedOrder(root,[home,search,nav],{controlsOnly:true});expect(order[0]).toBe(0);expect(order[1]).toBeGreaterThan(order[0]);expect(order[2]).toBeGreaterThan(order[1]);
    await firstTab(page,role(page,'link','본문 바로가기'));await quiet(driver);
  },
  async footer(page,driver,{initialState:s}) {
    const root=page.getByRole('contentinfo');await native(root,'footer');
    await anchor(root.getByRole('link',{name:s.privacyPolicy.label,exact:true}),s.privacyPolicy.href);
    await expect(root).toContainText(s.copyrightText);for(const contact of s.contacts)await expect(root).toContainText(contact.text);
    const identifier=root.locator('[data-krds-component="identifier"][data-krds-part="root"]');await expect(identifier).toHaveCount(1);
    expect(await lastComposedSubdivision(identifier,root)).toBe(true);
    const main=page.getByRole('main');await native(main,'main');const order=await nativeComposedOrder(page.locator('body'),[main,root]);expect(order[0]>=0&&order[1]>order[0]).toBe(true);await quiet(driver);
  },
  async 'skip-link'(page,driver,{initialState:s}) {
    const link=role(page,'link',s.links[0].label);await anchor(link,`#${s.links[0].targetId}`);await firstTab(page,link);await expect(link).toBeVisible();
    await page.keyboard.press('Enter');const target=page.locator(`[id="${s.links[0].targetId}"]`);await expect(target).toBeFocused();
    expect(await target.evaluate(node=>Boolean(node.closest('main'))&&node.querySelector('nav,[data-krds-component="breadcrumb"]')===null)).toBe(true);
    await page.keyboard.press('Tab');await focusableInside(target);await quiet(driver);
  },
  async 'main-menu'(page,driver,{initialState:s}) {
    const nav=role(page,'navigation','메인 메뉴');await native(nav,'nav');await expect(nav.locator('ul > li')).not.toHaveCount(0);
    const item=s.items.find(item=>item.href);await modifiedNavigation(page,nav.getByRole('link',{name:item.label,exact:true}),item.href);await quiet(driver);
  },
  async breadcrumb(page,driver,{initialState:s}) {
    const nav=role(page,'navigation','브레드크럼');await native(nav,'nav');await expect(nav.locator(':scope > ol')).toHaveCount(1);
    await anchor(nav.getByRole('link',{name:s.home.label,exact:true}),s.home.href);
    for(const item of s.items.filter(item=>!item.href)) {const label=nav.getByText(item.label,{exact:true});if(await label.count()){expect(await label.evaluate(node=>node.closest('a,button,[tabindex="0"]')===null)).toBe(true);}}
    await quiet(driver);
  },
  async 'side-navigation'(page,driver,{initialState:s}) {
    const nav=role(page,'navigation','사이드 메뉴');await native(nav,'nav');
    const current=s.items.flatMap(item=>item.children??[item]).find(item=>item.id===s.currentId);const link=nav.getByRole('link',{name:current.label,exact:true});await anchor(link,current.href);await expect(link).toHaveAttribute('aria-current','page');await expect(link).toBeVisible();
    const branch=s.items.find(item=>item.children?.some(child=>child.id===s.currentId));const trigger=branchButton(page,branch.label);await expect(trigger).toHaveAttribute('aria-expanded','true');await trigger.focus();await page.keyboard.press('Enter');await expect(trigger).toHaveAttribute('aria-expanded','false');await expect(link).toBeHidden();await expect(trigger).toBeFocused();
    await nextEvent(driver,'expandedChange',{ids:[]});
  },
  async 'in-page-navigation'(page,driver,{initialState:s}) {
    const nav=role(page,'navigation',s.title);await native(nav,'nav');const last=s.sections.at(-1);const link=nav.getByRole('link',{name:last.label,exact:true});await anchor(link,`#${last.id}`);
    const heading=page.locator(`[id="${last.id}"]`);await expect(heading).toContainText(last.label);
    const order=await nativeComposedOrder(page.locator('body'),[nav,heading]);expect(order[0]>=0&&order[1]>order[0]).toBe(true);
    await link.focus();await page.keyboard.press('Enter');await expect(heading).toBeFocused();
    const navBounds = await nav.boundingBox();
    const headingBounds = await heading.boundingBox();
    expect(navBounds.x, 'Desktop outline is visually to the right of body content').toBeGreaterThan(headingBounds.x);
  },
  async pagination(page,driver,{initialState:s}) {
    const nav=role(page,'navigation','페이지 이동');await native(nav,'nav');const current=nav.locator('[aria-current="true"],[aria-current="page"]');await expect(current).toHaveCount(1);await expect(current).not.toHaveAttribute('href',/.+/);
    const last=nav.getByRole('link',{name:String(s.pageCount),exact:true});await anchor(last,s.hrefTemplate.replace('{page}',String(s.pageCount)));
    await modifiedNavigation(page,last,s.hrefTemplate.replace('{page}',String(s.pageCount)));await quiet(driver);
  },
  async 'structured-list'(page,driver,{initialState:s}) {
    const root=catalogRoot(page,'structured-list');await expect(root).toHaveCount(1);
    await expect(root.locator('[data-krds-part="item"]')).toHaveCount(s.items.length);
    expect(await root.evaluate(node => node.matches('ul,ol,table') || Boolean(node.querySelector('ul,ol,table')))).toBe(true);
    for(const item of s.items){const link=root.getByRole('link',{name:item.title,exact:true});await anchor(link,item.href);for(const metadata of item.metadata)await expect(root).toContainText(metadata.value??'—');}
    // The configured first case has no trailing actions. If present, they must follow each item's content.
    expect(await root.evaluate(node=>[...node.querySelectorAll('[data-krds-part="item"]')].every(item=>{const content=item.querySelector('[data-krds-part="content"]');return [...item.querySelectorAll('[data-krds-part="actions"]')].every(actions=>content&&(content.compareDocumentPosition(actions)&4));}))).toBe(true);await quiet(driver);
  },
  async 'critical-alert'(page,driver,{initialState:s}) {
    const root=catalogRoot(page,'critical-alert');await expect(root).toHaveCount(1);await expect(root).toContainText(s.label);await expect(root).toContainText(s.message);await anchor(root.getByRole('link',{name:s.details.label,exact:true}),s.details.href);
    await expect(root.getByRole('button')).toHaveCount(0);await expect(root.locator('details,[aria-expanded]')).toHaveCount(0);await quiet(driver);
  },
  async disclosure(page,driver,{initialState:s}) {
    const trigger=role(page,'button',s.label);await native(trigger,'button');await expect(trigger).toHaveAttribute('type','button');await expect(trigger).toHaveAttribute('aria-expanded','false');await expect(trigger).toHaveAttribute('aria-controls',s.contentId);
    const panel=page.locator(`[id="${s.contentId}"]`);await expect(panel).toBeHidden();await trigger.focus();await page.keyboard.press('Space');await expect(trigger).toHaveAttribute('aria-expanded','true');await expect(panel).toContainText(s.content);await expect(trigger).toBeFocused();await nextEvent(driver,'openChange',{open:true});
  },
  async badge(page,driver,{initialState:s}) {
    const root=catalogRoot(page,'badge');await expect(root).toHaveCount(1);await expect(root).toHaveText(s.label);await noInteractive(root);
    expect(await root.evaluate(node=>!node.matches('a[href],button,input,[role="button"],[role="link"],[tabindex]:not([tabindex="-1"])')&&!node.hasAttribute('aria-live'))).toBe(true);await quiet(driver);
  },
  async accordion(page,driver,{initialState:s}) {
    for(const item of s.items){const button=role(page,'button',item.title);await native(button,'button');await expect(button).toHaveAttribute('type','button');expect(await button.evaluate(node=>/^H[2-6]$/.test(node.parentElement.tagName))).toBe(true);await expect(button).toHaveAttribute('aria-expanded','false');await resolvedIds(button,'aria-controls',item.content);}
    const button=role(page,'button',s.items[0].title);await button.focus();await page.keyboard.press('Enter');await expect(button).toHaveAttribute('aria-expanded','true');await expect(button).toBeFocused();await expect(page.getByText(s.items[0].content,{exact:true})).toBeVisible();await nextEvent(driver,'openChange',{ids:[s.items[0].id]});
  },
  async image(page,driver,{initialState:s}) {
    const image=role(page,'img',s.alt);await native(image,'img');await expect(image).toHaveAttribute('alt',s.alt);await expect(image).toHaveAttribute('src',s.src);
    // Force a real failed load; the informative alternative must survive it.
    await driver.setState({src:'/local-assets/intentional-missing-image.svg'});await expect(image).toHaveAttribute('src','/local-assets/intentional-missing-image.svg');await expect.poll(()=>image.evaluate(node=>node.complete&&node.naturalWidth===0)).toBe(true);await expect(image).toHaveAccessibleName(s.alt);await quiet(driver);
  },
  async carousel(page,driver,{initialState:s}) {
    const root=catalogRoot(page,'carousel');await expect(root).toHaveCount(1);
    const next=role(page,'button','다음 슬라이드');await native(next,'button');await next.focus();
    await visibleAfterClockAction(page,driver,role(page,'button','재생'));const before=await root.locator('[data-krds-part="slide"]').evaluateAll(nodes=>nodes.filter(node=>!node.hidden&&node.getAttribute('aria-hidden')!=='true').map(node=>node.textContent));expect(before).toHaveLength(1);
    await page.clock.fastForward((s.intervalMs??6000)*2);expect(await root.locator('[data-krds-part="slide"]').evaluateAll(nodes=>nodes.filter(node=>!node.hidden&&node.getAttribute('aria-hidden')!=='true').map(node=>node.textContent))).toEqual(before);
    await page.keyboard.press('Tab');await page.clock.fastForward((s.intervalMs??6000)*2);await expect(role(page,'button','재생')).toBeVisible();
    await quiet(driver);
    await next.click();await visibleAfterClockAction(page,driver,page.getByText(s.items[1].content,{exact:true}));await expect(page.getByText(s.items[0].content,{exact:true})).toBeHidden();
    expect(await root.locator('[data-krds-part="slide"]').evaluateAll(nodes=>nodes.every(node=>node.hidden||node.getAttribute('aria-hidden')!=='true'||[...node.querySelectorAll('a,button,input')].every(control=>control.tabIndex<0)))).toBe(true);
    expect((await driver.readEvents()).filter(event => event.name === 'indexChange')).toEqual([{name:'indexChange',detail:{index:1,reason:'next'}}]);
  },
  async table(page,driver,{initialState:s}) {
    const table=role(page,'table',s.caption);await native(table,'table');await expect(table.locator(':scope > caption')).toHaveText(s.caption);await expect(table.locator(':scope > thead > tr > th')).toHaveCount(s.columns.length);await expect(table.locator(':scope > tbody > tr')).toHaveCount(s.rows.length);
    for(const column of s.columns)await expect(table.getByRole('columnheader',{name:column.label,exact:true})).toHaveAttribute('scope','col');
    for(let index=0;index<s.rows.length;index++)for(let column=0;column<s.columns.length;column++)await expect(table.locator('tbody > tr').nth(index).locator(':scope > td').nth(column)).toHaveText(String(s.rows[index].cells[s.columns[column].id]??'—'));
    await expect(table.getByRole('button')).toHaveCount(0);await quiet(driver);
  },
  async 'text-list'(page,driver,{initialState:s}) {
    const root=catalogRoot(page,'text-list');await native(root,s.ordered?'ol':'ul');await expect(root.locator(':scope > li')).toHaveCount(s.items.length);for(let index=0;index<s.items.length;index++)await expect(root.locator(':scope > li').nth(index)).toContainText(s.items[index].content);await noInteractive(root);await quiet(driver);
  },
  async favicon(page,driver,{initialState:s}) {
    for(const theme of ['light','dark']){if(!s[theme])continue;const asset=s[theme];const link=page.locator(`head link[rel="icon"][href="${asset.href}"]`);await expect(link).toHaveCount(1);await expect(link).toHaveAttribute('type',asset.type);await expect(link).toHaveAttribute('sizes',asset.sizes);if(theme==='dark')await expect(link).toHaveAttribute('media',/prefers-color-scheme:\s*dark/);
      const url=new URL(asset.href,page.url());expect(url.origin).toBe(new URL(page.url()).origin);const response=await page.request.get(url.href);expect(response.ok(),'Head descriptor must resolve actual local bytes').toBe(true);expect(response.headers()['content-type']).toContain(asset.type);
      // Decode the exact response bytes rather than a stale browser URL-cache entry.
      const encoded = `data:${asset.type};base64,${(await response.body()).toString('base64')}`;
      const size=await page.evaluate(src=>new Promise((resolve,reject)=>{const img=new Image();img.onload=()=>resolve([img.naturalWidth,img.naturalHeight]);img.onerror=()=>reject(new Error('Unusable icon bytes'));img.src=src;}),encoded);expect(size[0]).toBeGreaterThan(0);expect(size[0]).toBe(size[1]);}
    await expect(page.locator('[data-krds-component="favicon"]')).toHaveCount(0);await quiet(driver);
  },
  async link(page,driver,{initialState:s}) {await modifiedNavigation(page,role(page,'link',s.label),s.href);await quiet(driver);},
  async fab(page,driver,{initialState:s}) {const button=role(page,'button',s.label);await native(button,'button');await expect(button).toHaveAttribute('type','button');await button.focus();await page.keyboard.press('Enter');await nextEvent(driver,'action',{});await expect(button).toBeFocused();},
  async 'radio-group'(page,driver,{initialState:s}) {
    const first=role(page,'radio',s.options[0].label);const second=role(page,'radio',s.options[1].label);for(const option of s.options){const radio=role(page,'radio',option.label);await native(radio,'input');await expect(radio).toHaveAttribute('type','radio');await expect(radio).toHaveAttribute('name',s.name);await expect(radio).not.toBeChecked();}
    await first.check();await expect(first).toBeChecked();await expect(second).not.toBeChecked();await formValue(first,s.name,[s.options[0].value]);await nextEvent(driver,'valueChange',{value:s.options[0].value});
    await second.check();await expect(first).not.toBeChecked();await expect(second).toBeChecked();await eventList(driver,[{name:'valueChange',detail:{value:s.options[0].value}},{name:'valueChange',detail:{value:s.options[1].value}}]);
  },
  async checkbox(page,driver,{initialState:s}) {
    const control=role(page,'checkbox',s.label);await native(control,'input');await expect(control).toHaveAttribute('type','checkbox');await expect(control).not.toBeChecked();await page.getByText(s.label,{exact:true}).click();await expect(control).toBeChecked();await formValue(control,s.name,[s.value]);await nextEvent(driver,'checkedChange',{checked:true});await control.focus();await page.keyboard.press('Space');await expect(control).not.toBeChecked();await eventList(driver,[{name:'checkedChange',detail:{checked:true}},{name:'checkedChange',detail:{checked:false}}]);
  },
  async tag(page,driver,{initialState:s}) {const tag=role(page,'button',s.items[0].label);await native(tag,'button');await expect(tag).toHaveAttribute('aria-pressed','false');await tag.focus();await page.keyboard.press('Space');await expect(tag).toHaveAttribute('aria-pressed','true');await expect(tag).toBeFocused();await nextEvent(driver,'selectionChange',{ids:[s.items[0].id]});await expect(page.locator('[data-krds-host="filtered-results"]')).toContainText(s.items[0].label);},
  async switch(page,driver,{initialState:s,host}) {const control=role(page,'switch',s.label);await native(control,'input');await expect(control).toHaveAttribute('type','checkbox');await expect(control).not.toBeChecked();await resolvedIds(control,'aria-describedby',host.helpText);await control.focus();await page.keyboard.press('Space');await expect(control).toBeChecked();await expect(control).toHaveAccessibleName(s.label);await formValue(control,s.name,[s.value??'on']);await nextEvent(driver,'checkedChange',{checked:true});},
  async 'step-indicator'(page,driver,{initialState:s}) {const root=catalogRoot(page,'step-indicator');const list=await ownedList(page,'step-indicator','ol');await expect(list.locator(':scope > li')).toHaveCount(s.steps.length);for(const step of s.steps){const item=root.getByRole('listitem').filter({hasText:step.label});await expect(item).toHaveCount(1);if(step.status==='current')await expect(item).toHaveAttribute('aria-current','step');if(step.status==='complete')await expect(item).toContainText('완료');}await quiet(driver);},
  async spinner(page,driver,{initialState:s}) {const progress=role(page,'progressbar',s.label);await expect(progress).toHaveAttribute('aria-valuemin','0');await expect(progress).toHaveAttribute('aria-valuemax','100');await expect(progress).toHaveAttribute('aria-valuenow',String(s.value));await driver.setState({value:70});await expect(progress).toHaveAttribute('aria-valuenow','70');await quiet(driver);},
  async 'help-panel'(page,driver,{initialState:s}) {
    const root=catalogRoot(page,'help-panel');await expect(root).toBeVisible();await expect(role(page,'button','도움말 닫기')).toBeVisible();await expect(root).toContainText('도움말');
    const topic=role(page,'button',s.topics[0].title);await topic.click();await expect(root).toContainText(s.topics[0].content);await expect(await panelPresentation(page,'help-panel')).toBeFocused();await nextEvent(driver,'topicChange',{id:s.topics[0].id});
  },
  async 'tutorial-panel'(page,driver,{initialState:s}) {
    const root=catalogRoot(page,'tutorial-panel');await expect(root).toBeVisible();
    const before=await page.evaluate(()=>window.__KRDS_FIXTURE__.getState());
    const help=role(page,'tab','도움말');await help.click();await expect(help).toHaveAttribute('aria-selected','true');
    const tutorial=role(page,'tab','튜토리얼');await tutorial.click();await expect(tutorial).toHaveAttribute('aria-selected','true');
    await role(page,'button','튜토리얼 닫기').click();await expect(await panelPresentation(page,'tutorial-panel')).toBeHidden();await role(page,'button','튜토리얼 열기').click();await expect(root).toBeVisible();
    const after=await page.evaluate(()=>window.__KRDS_FIXTURE__.getState());expect(after.activeTaskId).toBe(before.activeTaskId??s.activeTaskId);expect(after.activeStepId).toBe(before.activeStepId??s.activeStepId);
    await expect(root).toContainText(s.tasks[0].steps.find(step=>step.id===s.activeStepId)?.title??s.tasks[0].title);
  },
  async 'contextual-help'(page,driver,{initialState:s}) {
    const trigger=role(page,'button',s.triggerLabel);await native(trigger,'button');await expect(trigger).toHaveAttribute('aria-expanded','false');const popup=part(page,'contextual-help','popover');await expect(popup).toBeHidden();
    await trigger.click();await expect(trigger).toHaveAttribute('aria-expanded','true');await expect(popup).toContainText(s.content);await nextEvent(driver,'openChange',{open:true});
  },
  async 'coach-mark'(page,driver,{initialState:s}) {
    const popup=part(page,'coach-mark','popover');await expect(popup).toBeHidden();const start=page.locator(`[id="${s.startActionId}"]`);await native(start,'button');await start.click();await expect(popup).toBeVisible();await expect(popup).toContainText(s.steps[0].instruction);
    const target=page.locator(`[id="${s.steps[0].targetId}"]`);await expect(target).toBeVisible();
    expect(await popup.evaluate((node,id)=>{const target=node.getRootNode().getElementById(id);const boundary=target?.nextElementSibling;return Boolean(boundary)&&(boundary===node||boundary.contains(node));},s.steps[0].targetId)).toBe(true);
    await expect(role(page,'button','그만보기')).toBeVisible();await nextEvent(driver,'openChange',{open:true});
  },
  async tooltip(page,driver,{initialState:s}) {
    const trigger=page.locator(`[id="${s.triggerId}"]`);await native(trigger,'button');await expect(trigger).toHaveAccessibleName(s.triggerLabel);await resolvedIds(trigger,'aria-describedby',s.text);
    const popup=role(page,'tooltip',s.text);await expect(popup).toBeHidden();await trigger.focus();await expect(popup).toBeVisible();await noInteractive(popup);await expect(trigger).toBeFocused();
    await page.keyboard.press('Escape');await expect(popup).toBeHidden();await expect(trigger).toBeFocused();await trigger.hover();await expect(popup).toBeHidden();
    const events=await driver.readEvents();expect(events).toEqual([{name:'openChange',detail:{open:true}},{name:'openChange',detail:{open:false}}]);
  },
  async tts(page,driver,{initialState:s}) {
    const play=role(page,'button',`${s.label??'음성 안내'} 재생`);await native(play,'button');await play.click();const detail={action:'play',summary:s.summary,locale:s.locale};await nextEvent(driver,'request',detail);
    const effect=page.locator('[data-krds-host="speech-state"]');await expect(effect).toContainText('playing');await expect(page.locator('[data-krds-host="speech-summary"]')).toHaveText(s.summary);
    const pause=role(page,'button',`${s.label??'음성 안내'} 일시정지`);await expect(pause).toBeVisible();await pause.click();await expect(effect).toContainText('paused');await role(page,'button',`${s.label??'음성 안내'} 중지`).click();await expect(effect).toContainText('idle');
    await eventList(driver,[{name:'request',detail},{name:'request',detail:{...detail,action:'pause'}},{name:'request',detail:{...detail,action:'stop'}}]);
  },
  async textarea(page,driver,{initialState:s}) {
    const field=role(page,'textbox',s.label);await native(field,'textarea');await expect(page.getByText(s.label,{exact:true})).toBeVisible();await field.fill('첫 번째');await page.keyboard.press('Enter');await page.keyboard.type('두 번째');await expect(field).toHaveValue('첫 번째\n두 번째');await expect(field).toHaveAccessibleName(s.label);await expect(page.getByText(s.label,{exact:true})).toBeVisible();await formValue(field,s.name,['첫 번째\n두 번째']);
    const events=await driver.readEvents();expect(events.length).toBeGreaterThan(0);expect(events.every(event=>event.name==='valueChange'&&typeof event.detail.value==='string')).toBe(true);expect(events.at(-1)).toEqual({name:'valueChange',detail:{value:'첫 번째\n두 번째'}});
    const values=events.map(event=>event.detail.value);expect(values.every((value,index)=>index===0||value!==values[index-1]),'No input/change double notifications').toBe(true);
  },
  async 'text-input'(page,driver,{initialState:s,host}) {
    const field=role(page,'textbox',s.label);await native(field,'input');await expect(field).toHaveAttribute('name',s.name);await expect(field).toHaveAttribute('autocomplete',s.autocomplete);await expect(field).toHaveAttribute('aria-invalid','true');await resolvedIds(field,'aria-describedby',host.errorText);
    await field.fill('홍길동');await expect(field).toHaveValue('홍길동');await expect(page.getByText(s.label,{exact:true})).toBeVisible();await resolvedIds(field,'aria-describedby',host.errorText);await formValue(field,s.name,['홍길동']);await nextEvent(driver,'valueChange',{value:'홍길동'});
  },
  async 'file-upload'(page,driver,{initialState:s,host}) {
    const input=part(page,'file-upload','file-input');await native(input,'input');await expect(input).toHaveAttribute('type','file');await expect(input).toHaveAttribute('accept',s.accept);
    const picker=page.getByRole('button',{name:/^파일 선택(?:\s|$)/});await native(picker,'button');
    const material=host.fileFixtures[0];const bytes=Buffer.from(material.contents);await input.setInputFiles({name:material.name,mimeType:material.type,buffer:bytes});
    await expect(part(page,'file-upload','list')).toContainText(material.name);
    const selected=await driver.readEvents();expect(selected).toHaveLength(1);expect(selected[0].name).toBe('filesChange');expect(selected[0].detail).toMatchObject({reason:'picker',addedIds:[expect.any(String)],removedIds:[]});expect(selected[0].detail.value).toHaveLength(1);
    await expect(page.locator('[data-krds-host="upload-receipt"]')).toBeEmpty();
    // Chooser is ephemeral; cancel must preserve the committed File store and callbacks.
    await expect(input).toHaveValue('');await input.dispatchEvent('cancel');await expect(part(page,'file-upload','list')).toContainText(material.name);await eventList(driver,selected);
    await formValue(input,s.name,[{name:material.name,size:bytes.length,type:material.type}]);
    const submittedContents = (await readAssociatedForm(input,s.name)).map(value=>typeof value==='string'?value:value.text);
    expect(submittedContents, 'Committed FormData contains the selected File bytes, not a metadata substitute').toEqual([material.contents]);
    await role(page,'button','제출').click();await expect(page.locator('[data-krds-host="upload-receipt"]')).toContainText(material.name);await expect(page.locator('[data-krds-host="upload-receipt"]')).toContainText(String(bytes.length));
    await input.setInputFiles({name:material.name,mimeType:material.type,buffer:bytes});await expect(part(page,'file-upload','list')).toContainText(material.name);const reselected=await driver.readEvents();expect(reselected.filter(event=>event.name==='filesChange')).toHaveLength(2);
    // Controlled reset retains accepted files until host explicitly clears them.
    await role(page,'button','초기화').click();await formValue(input,s.name,[{name:material.name,size:bytes.length,type:material.type}]);expect((await driver.readEvents()).filter(event=>event.name==='filesChange')).toHaveLength(2);
  },
  async 'language-switcher'(page,driver,{initialState:s}) {
    const alternate=s.options.find(option=>option.locale!==s.currentLocale);const link=role(page,'link',alternate.nativeLabel);await anchor(link,alternate.href);await expect(link).toHaveAttribute('lang',alternate.locale);
    await link.click();await expect(page.locator('html')).toHaveAttribute('lang',alternate.locale);await expect(page.locator('[data-krds-host="locale-content"]')).toContainText('English');
    const reverse=role(page,'link','한국어');await expect(reverse).toHaveAttribute('lang','ko');await anchor(reverse,s.options.find(option=>option.locale==='ko').href);
  },
  async resize(page,driver,{initialState:s}) {
    const content=page.locator('[data-krds-host="resize-content"]');await expect(content).toBeVisible();const before=await content.evaluate(node=>parseFloat(getComputedStyle(node).fontSize));
    const trigger=role(page,'button','화면 크기 기본');await native(trigger,'button');await trigger.click();const choice=s.levels.at(-1);const option=role(page,'button',choice.label);await option.click();
    await expect.poll(()=>content.evaluate(node=>parseFloat(getComputedStyle(node).fontSize))).toBeGreaterThan(before);const after=await content.evaluate(node=>parseFloat(getComputedStyle(node).fontSize));expect(after/before).toBeCloseTo(choice.percent/100,2);await expect(role(page,'button',`화면 크기 ${choice.label}`)).toBeFocused();
    expect((await driver.readEvents()).filter(event=>event.name==='valueChange')).toEqual([{name:'valueChange',detail:{value:choice.id}}]);
  },
  async 'accessible-media'(page,driver,{initialState:s}) {
    const root=catalogRoot(page,'accessible-media');await expect(root).toContainText(s.title);const media=part(page,'accessible-media','media');await native(media,s.media.kind==='audio'?'audio':'video');await expect(media).toHaveAttribute('controls','');await expect(media).not.toHaveAttribute('autoplay','');
    await expect.poll(()=>media.evaluate(node=>node.readyState)).toBeGreaterThanOrEqual(1);
    const info=await media.evaluate(node=>({src:node.currentSrc||node.src,direct:node.getAttribute('src'),nested:[...node.querySelectorAll('source')].map(source=>source.getAttribute('src')),autoplay:node.autoplay,paused:node.paused}));
    const registered=new URL(s.media.src,page.url()).href;
    expect(info.src).toBe(registered);expect([info.direct,...info.nested].filter(Boolean).map(src=>new URL(src,page.url()).href)).toContain(registered);
    expect(info.autoplay).toBe(false);expect(info.paused).toBe(true);expect(new URL(info.src).origin).toBe(new URL(page.url()).origin);const response=await page.request.get(info.src);expect(response.ok()).toBe(true);expect((await response.body()).length).toBeGreaterThan(44);
    expect(await media.evaluate(node=>Number.isFinite(node.duration)&&node.duration>0)).toBe(true);
    if(s.transcript.content)await expect(root).toContainText(s.transcript.content);else await anchor(root.getByRole('link',{name:'대본',exact:true}),s.transcript.href);
    for(const track of s.captionTracks){const element=media.locator(`track[srclang="${track.lang}"]`);await expect(element).toHaveAttribute('kind','captions');await expect(element).toHaveAttribute('src',track.src);await expect(element).toHaveAttribute('label',track.label);const response=await page.request.get(new URL(track.src,page.url()).href);expect(response.ok()).toBe(true);expect(await response.text()).toMatch(/^WEBVTT[\s\S]*\d\d:\d\d[\s\S]*-->/);}
    // Timing/content equivalence and manual native media controls remain separate review obligations.
    await quiet(driver);
  },
  async 'visually-hidden'(page,driver,{initialState:s}) {
    const text=page.locator(`[id="${s.id}"]`);await expect(text).toHaveText(s.content);await expect(text).toHaveAttribute('lang',s.lang);
    const style=await text.evaluate(node=>{const css=getComputedStyle(node);const box=node.getBoundingClientRect();return {display:css.display,visibility:css.visibility,font:parseFloat(css.fontSize),width:box.width,height:box.height,clip:css.clip,clipPath:css.clipPath};});expect(style.display).not.toBe('none');expect(style.visibility).toBe('visible');expect(style.font).toBeGreaterThan(0);expect(style.width).toBeGreaterThan(0);expect(style.height).toBeGreaterThan(0);expect(style.clip!=='auto'||style.clipPath!=='none').toBe(true);
    const snapshot=await text.ariaSnapshot();expect(snapshot).toContain(s.content);await quiet(driver);
  },
  async 'range-slider'(page,driver,{initialState:s}) {
    const slider=role(page,'slider',s.label);await native(slider,'input');await expect(slider).toHaveAttribute('type','range');await expect(slider).toHaveValue(String(s.defaultValue));await slider.focus();await page.keyboard.press('ArrowRight');const value=s.defaultValue+s.step;await expect(slider).toHaveValue(String(value));await formValue(slider,s.name,[String(value)]);await nextEvent(driver,'valueChange',{value});await slider.blur();await nextEvent(driver,'valueChange',{value});
    await expect(part(page,'range-slider','output')).toHaveText(String(value));
  },
  async 'back-button'(page,driver,{initialState:s,host}) {const back=role(page,'button',s.label);await native(back,'button');await expect(back).toHaveAttribute('type','button');await back.click();await nextEvent(driver,'backRequest',{reason:'activate'});await expect(page.locator('[data-krds-host="route"]')).toHaveText(host.history.at(-2)??s.fallbackHref);},
  async 'bottom-sheet'(page,driver,{initialState:s,host}) {
    const dialog=role(page,'dialog',s.title);await expect(dialog).toBeVisible();await modalIsolation(page,dialog);await focusableInside(dialog);
    const close=dialog.getByRole('button',{name:'닫기',exact:true});await native(close,'button');await close.focus();for(let count=0;count<5;count++){await page.keyboard.press('Tab');await focusableInside(dialog);}
    await page.keyboard.press('Escape');await expect(dialog).toBeHidden();await expect(page.locator(`[id="${host.openerId}"]`)).toBeFocused();await assertCleanup(page);
    const events=await driver.readEvents();expect(events.filter(event=>event.name==='openChange')).toEqual([{name:'openChange',detail:{open:false,reason:'escape'}}]);
  },
  async 'quantity-toggle'(page,driver,{initialState:s}) {
    const output=part(page,'quantity-toggle','output');await expect(output).toHaveText(`${s.defaultValue}${s.unit}`);const plus=role(page,'button',`${s.label} 늘리기`);await native(plus,'button');await expect(plus).toHaveAttribute('type','button');await plus.focus();await page.keyboard.press('Enter');const value=s.defaultValue+s.step;await expect(output).toHaveText(`${value}${s.unit}`);await formValue(part(page,'quantity-toggle','output'),s.name,[String(value)]);await nextEvent(driver,'valueChange',{value});
  },
  async toast(page,driver,{initialState:s,host}) {
    const text=host.actionMessage.text;const message=catalogRoot(page,'toast').getByRole('status');await expect(message).toHaveCount(0);const action=role(page,'button','신청 저장');await action.focus();await expect(action).toBeFocused();await action.press('Enter');await page.clock.runFor(32);await expect(message).toHaveText(text);await expect(action).toBeFocused();await noInteractive(catalogRoot(page,'toast'));
    const persistent=page.locator(`[id="${host.persistentResult.id}"]`);await expect(persistent).toContainText(text);await expect(persistent).toBeVisible();
    // Pointer activation is a separate actual-result observation: WebKit's
    // native pointer default can blur an already focused button by itself.
    await driver.setState({message:null});await expect(message).toHaveCount(0);
    await action.click();await page.clock.runFor(32);await expect(message).toHaveText(text);await expect(persistent).toContainText(text);await expect(persistent).toBeVisible();
    expect((await driver.readEvents()).filter(event=>event.name==='dismiss')).toEqual([]);
  },
  async snackbar(page,driver,{initialState:s}) {
    const root=catalogRoot(page,'snackbar');await expect(root).toHaveCount(1);const status=root.getByRole('status');await expect(status).toHaveCount(1);await expect(status).toContainText(s.message.text);await noInteractive(status);const close=role(page,'button','알림 닫기');await native(close,'button');await close.click();await page.clock.runFor(32);await expect(root).toBeHidden();const events=await driver.readEvents();expect(events).toHaveLength(1);expect(events[0]).toMatchObject({name:'dismiss',detail:{id:s.message.id,reason:'close',generation:expect.any(Number)}});
  },
  async 'tab-bar'(page,driver,{initialState:s}) {
    const root=catalogRoot(page,'tab-bar');await native(root,'nav');await expect(root.getByRole('tab')).toHaveCount(0);for(const item of s.items){const link=root.getByRole('link',{name:item.label,exact:true});await anchor(link,item.href);if(item.id===s.currentId)await expect(link).toHaveAttribute('aria-current','page');}
    const before=await root.boundingBox();await page.evaluate(()=>window.scrollTo(0,1000));const after=await root.boundingBox();expect(after.y).toBeCloseTo(before.y,0);await quiet(driver);
  },
};
export async function observeCatalogCase(page,driver,fixture) {
  assertCatalogCaseSupported(fixture);
  await quiet(driver);
  if(fixture.host?.fakeClock){await pauseClockNow(page);driver=clockManagedDriver(page,driver);}
  const entry = additionalCases.get(`${fixture.componentId}/${fixture.caseId}`);
  if (typeof entry === 'function' || entry?.run) await assertCatalogBoundary(page,fixture);
  if (typeof entry === 'function') await entry(page,driver,fixture);
  else if (entry?.run) await entry.run(page,driver,fixture);
  else if (!entry) await observers[fixture.componentId](page,driver,fixture);
  const metadata = catalogCaseMetadata(fixture);
  if (metadata.manualRequired) throw new ManualCatalogObservationRequired(fixture, metadata.manualRequired);
}
