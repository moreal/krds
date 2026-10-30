import {readFile,writeFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {createHash} from 'node:crypto';
import {expect} from '@playwright/test';
import {guardStoryNetwork} from './network.mjs';
import {assertMastheadPolicy} from './catalog-masthead-inspection.mjs';

const nativeRenderers={
  react:'@storybook/react-vite',solid:'storybook-solidjs-vite',
  svelte:'@storybook/svelte-vite',vue:'@storybook/vue3-vite',
  lit:'@storybook/web-components-vite',qwik:'storybook-framework-qwik',angular:'@storybook/angular',
};
export function selectStoryDist(workspaceRoot,framework,frameworks,override){
  if(override&&frameworks.length!==1)throw new Error('KRDS_STORYBOOK_DIST requires exactly one selected framework');
  return override?resolve(override):join(workspaceRoot,`apps/storybook-${framework}/dist`);
}
export function selectCatalogStories(manifest,{component,caseId}={}){
  if(!Array.isArray(manifest.cases))throw new Error('Catalog story manifest cases are required');
  const ids=new Set();
  for(const story of manifest.cases){
    if(story.id!==`krds-${story.componentId}--${story.caseId}`)throw new Error(`Frozen catalog ID mismatch: ${story.id}`);
    if(ids.has(story.id))throw new Error(`Duplicate catalog story ID: ${story.id}`);
    ids.add(story.id);
    if(!Array.isArray(story.expected)||(!story.expected.length&&!(story.componentId==='image'&&story.caseId==='decorative'&&story.state.decorative===true&&story.state.alt===''))||!story.environment?.viewport)throw new Error(`Missing actual story expectations/environment: ${story.id}`);
  }
  const selected=manifest.cases.filter(story=>(!component||story.componentId===component)&&(!caseId||story.caseId===caseId));
  if(!selected.length)throw new Error('Zero required catalog story states selected');
  return selected;
}
export function validateCatalogStoryIndex(index,stories){
  if(!stories.length)throw new Error('Zero required catalog story states selected');
  return stories.map(story=>{
    const entry=index.entries?.[story.id];
    if(!entry)throw new Error(`Missing required native story: ${story.id}`);
    if(entry.type!=='story')throw new Error(`Required ID is not a real native story: ${story.id}`);
    if(entry.id!==story.id)throw new Error(`Native story exact ID mismatch: ${story.id}`);
    if(!/^\.\/src\/stories\//.test(entry.importPath??'')||entry.importPath.split('/').includes('..')||/probe/i.test(entry.importPath))throw new Error(`Native story must have its own actual source: ${story.id}`);
    return {id:entry.id,importPath:entry.importPath,title:entry.title,exportName:entry.exportName};
  });
}
export async function inspectCatalogRenderer(directory,framework){
  const renderer=nativeRenderers[framework];
  if(!renderer)throw new Error(`Unsupported native Storybook renderer: ${framework}`);
  const manifest=JSON.parse(await readFile(join(directory,'package.json'),'utf8'));
  const dependencies={...manifest.dependencies,...manifest.devDependencies};
  if(manifest.name!==`@unofficial-krds/storybook-${framework}`||!dependencies[renderer])throw new Error(`Declared native renderer ${renderer} required for ${framework}`);
  const foreign=Object.values(nativeRenderers).filter(name=>name!==renderer&&dependencies[name]);
  if(foreign.length)throw new Error(`Foreign renderer dependencies in ${framework}: ${foreign.join(', ')}`);
  const adapter=`@unofficial-krds/${framework}`;
  if(!dependencies[adapter])throw new Error(`Consuming native adapter dependency required: ${adapter}`);
  const configuration=await readFile(join(directory,'.storybook/main.ts'),'utf8');
  if(!configuration.includes(renderer))throw new Error(`Native renderer missing from actual Storybook configuration: ${renderer}`);
  for(const name of Object.values(nativeRenderers))if(name!==renderer&&configuration.includes(name))throw new Error(`Foreign renderer configuration: ${name}`);
  return {framework,renderer,adapter,configurationSha256:createHash('sha256').update(configuration).digest('hex'),coverageAwarded:false};
}
async function committedStoryState(page,story){
  const s=story.state;
  const control=(role,name=s.label)=>page.getByRole(role,{name,exact:true});
  const disabled=async locator=>{if(s.disabled!==undefined){if(s.disabled)await expect(locator).toBeDisabled();else await expect(locator).toBeEnabled();}};
  switch(story.componentId){
    case 'fab': {
      const trigger=page.locator('[data-krds-component="fab"][data-krds-part="trigger"]');
      await expect(trigger).toHaveAccessibleName(s.label);
      const label=trigger.locator('[data-krds-component="fab"][data-krds-part="label"]');
      if(s.showLabel===false)await expect(label).not.toBeVisible();
      else {await expect(label).toBeVisible();await expect(label).toHaveText(s.label);}
      break;
    }
    case 'text-input':case 'textarea': {
      const field=control('textbox');await expect(field).toHaveValue(s.value??s.defaultValue??'');
      await disabled(field);
      if(s.readOnly!==undefined)expect(await field.evaluate(node=>node.readOnly)).toBe(s.readOnly);
      if(s.name)await expect(field).toHaveAttribute('name',s.name);
      break;
    }
    case 'checkbox':case 'switch': {
      const field=control(story.componentId==='switch'?'switch':'checkbox');
      await expect(field).toBeChecked({checked:s.checked??s.defaultChecked??false});await disabled(field);
      if(story.componentId==='checkbox')expect(await field.evaluate(node=>node.indeterminate)).toBe(s.indeterminate??s.defaultIndeterminate??false);
      if(s.name)await expect(field).toHaveAttribute('name',s.name);
      break;
    }
    case 'radio-group': {
      const value=s.value??s.defaultValue;
      for(const option of s.options){const field=control('radio',option.label);await expect(field).toBeChecked({checked:option.value===value});if(s.disabled||option.disabled)await expect(field).toBeDisabled();else await expect(field).toBeEnabled();await expect(field).toHaveAttribute('name',s.name);}
      break;
    }
    case 'range-slider': {
      const field=control('slider');await expect(field).toHaveValue(String(s.value??s.defaultValue));await disabled(field);
      for(const key of ['min','max','step'])if(s[key]!==undefined)await expect(field).toHaveAttribute(key,String(s[key]));
      break;
    }
    case 'quantity-toggle': {
      const output=page.locator('[data-krds-component="quantity-toggle"][data-krds-part="output"]');
      await expect(output).toHaveText(`${s.value??s.defaultValue}${s.unit??''}`);
      for(const action of ['줄이기','늘리기'])await expect(control('button',`${s.label} ${action}`)).toBeVisible();
      break;
    }
    case 'disclosure':await expect(control('button')).toHaveAttribute('aria-expanded',String(s.open??s.defaultOpen??false));break;
    case 'accordion': {
      const open=s.openIds??s.defaultOpenIds??[];
      for(const item of s.items)await expect(control('button',item.title)).toHaveAttribute('aria-expanded',String(open.includes(item.id)));
      break;
    }
    case 'toast':case 'snackbar': {
      if(s.message)await expect(page.locator(`[data-krds-component="${story.componentId}"][data-krds-part="root"]`).getByRole('status')).toContainText(s.message.text);
      break;
    }
  }
}
async function faviconAssets(page,story){
  await expect(page.locator('[data-krds-component="favicon"]')).toHaveCount(0);
  for(const theme of ['light','dark']){
    const asset=story.state[theme];if(!asset)continue;
    const link=page.locator(`head link[rel="icon"][href="${asset.href}"]`);
    await expect(link).toHaveCount(1);await expect(link).toHaveAttribute('type',asset.type);await expect(link).toHaveAttribute('sizes',asset.sizes);
    if(theme==='dark')await expect(link).toHaveAttribute('media',/prefers-color-scheme:\s*dark/);
    const url=new URL(asset.href,page.url());expect(url.origin).toBe(new URL(page.url()).origin);
    const actual=await page.evaluate(async url=>{const response=await fetch(url);const bytes=new Uint8Array(await response.arrayBuffer());return {ok:response.ok,type:response.headers.get('content-type'),encoded:btoa(String.fromCharCode(...bytes))};},url.href);
    expect(actual.ok).toBe(true);expect(actual.type).toContain(asset.type);
    const dimensions=await page.evaluate(src=>new Promise((resolve,reject)=>{const image=new Image();image.onload=()=>resolve([image.naturalWidth,image.naturalHeight]);image.onerror=()=>reject(new Error('Unusable actual favicon bytes'));image.src=src;}),`data:${asset.type};base64,${actual.encoded}`);
    expect(dimensions[0]).toBeGreaterThan(0);expect(dimensions[0]).toBe(dimensions[1]);
  }
}
async function removedTriggerState(page,story){
  const removed=(story.componentId==='contextual-help'&&story.caseId==='removed-trigger')||
    (story.componentId==='tooltip'&&story.caseId==='trigger-removed');
  if(!removed)return false;
  expect(story.host.removeTrigger).toBe(true);
  const id=story.state.fallbackFocusId;
  expect(typeof id).toBe('string');expect(id.length).toBeGreaterThan(0);
  expect(story.host.fallbackFocusId).toBe(id);
  expect(typeof story.host.fallbackLabel).toBe('string');
  expect(story.expected).toContainEqual({role:'button',name:story.host.fallbackLabel});
  // This is an initial post-removal specimen. Never activate an original trigger
  // or accept a placeholder root as a substitute for the declared absent UI.
  await expect(page.locator(`[data-krds-component="${story.componentId}"]`)).toHaveCount(0);
  await expect(page.getByRole('button',{name:story.state.triggerLabel,exact:true,includeHidden:true})).toHaveCount(0);
  const popup=story.componentId==='tooltip'?page.getByRole('tooltip',{includeHidden:true}):page.getByRole('dialog',{name:story.state.title,exact:true,includeHidden:true});
  await expect(popup).toHaveCount(0);
  const fallback=page.locator(`[id="${id}"]`);
  await expect(fallback).toHaveCount(1);await expect(fallback).toBeVisible();await expect(fallback).toBeEnabled();
  expect(await fallback.evaluate(node=>node.tagName)).toBe('BUTTON');
  await expect(fallback).toHaveAccessibleName(story.host.fallbackLabel);
  await fallback.focus();await expect(fallback).toBeFocused();
  return true;
}
async function expectedStoryElements(page,story){
  if(story.componentId==='masthead')await assertMastheadPolicy(page,{initialState:story.state,host:story.host});
  const removedTrigger=await removedTriggerState(page,story);
  const component=page.locator(`[data-krds-component="${story.componentId}"][data-krds-part="root"]`);
  const closedPanel=['tutorial-panel','help-panel'].includes(story.componentId)&&!(story.state.open??story.state.defaultOpen??false);
  if(story.componentId!=='favicon'&&!closedPanel&&!removedTrigger)await expect(component).not.toHaveCount(0);
  if(story.componentId==='favicon')await faviconAssets(page,story);
  if(story.componentId==='image'&&story.state.decorative===true){
    const image=component.and(page.locator('img')).or(component.locator('img'));
    await expect(image).toHaveCount(1);await expect(image).toHaveAttribute('alt','');
    await expect(image).toBeVisible();await expect(page.getByRole('img')).toHaveCount(0);
  }
  for(const expected of story.expected){
    let name=expected.name;
    if(story.componentId==='side-navigation'&&expected.role==='button'){
      const branches=items=>items.flatMap(item=>item.children?[item,...branches(item.children)]:[]);
      const branch=branches(story.state.items).find(item=>item.label===name);
      if(branch){
        const expanded=(story.state.expandedIds??story.state.defaultExpandedIds??[]).includes(branch.id);
        const escape=value=>value.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
        name=new RegExp(`^${escape(name)}(?: ${expanded?'접기':'펼치기'})?$`);
      }
    }
    let matches=expected.role==='generic'?component:page.getByRole(expected.role,name?{name,exact:typeof name==='string'}:{});
    if(expected.visibleText!==undefined)matches=matches.filter({hasText:expected.visibleText});
    const visible=matches.filter({visible:true});
    await expect(visible).not.toHaveCount(0);
    if(expected.visibleText!==undefined){
      const texts=await visible.allTextContents();
      expect(texts.some(text=>text.trim()===expected.visibleText),`Exact visible story text for ${story.id}/${expected.role}`).toBe(true);
    }
    const tags={button:['BUTTON'],link:['A'],textbox:['INPUT','TEXTAREA'],checkbox:['INPUT'],radio:['INPUT'],switch:['INPUT'],slider:['INPUT'],img:['IMG'],table:['TABLE']};
    if(tags[expected.role])for(const control of await visible.all())expect(tags[expected.role]).toContain(await control.evaluate(node=>node.tagName));
  }
}
/** A story state audit is actual browser/axe/request/PNG evidence, independent of
 * the 315 user-outcome suite. It never promotes staged source to native coverage. */
export async function verifyCatalogStory(browser,server,story,directory,{framework,sourceEntry}={}){
  const context=await browser.newContext({viewport:story.environment.viewport,locale:story.environment.locale,timezoneId:'Asia/Seoul',colorScheme:story.environment.colorMode,reducedMotion:story.environment.reducedMotion??'reduce',serviceWorkers:'block',hasTouch:story.componentId==='tooltip'&&story.caseId==='touch-toggle'});
  const network=await guardStoryNetwork(context,server.origin,server.assets);
  const page=await context.newPage();page.setDefaultTimeout(5000);
  const runtimeErrors=[];page.on('pageerror',error=>runtimeErrors.push(String(error)));
  const result={id:story.id,componentId:story.componentId,caseId:story.caseId,framework,sourceCandidate:'catalog/full-catalog-stories.json',sourceEntry,caseSha256:createHash('sha256').update(JSON.stringify(story)).digest('hex'),coverageAwarded:false,status:'failed',requiredOutcomeSuite:'separate-315-cases'};
  const failures=[];
  try{
    if(!story.requiredFrameworks.includes(framework))throw new Error(`Foreign/unrequired renderer for ${story.id}: ${framework}`);
    await page.clock.setFixedTime(new Date(story.environment.nowIso));
    await page.goto(`${server.origin}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`,{waitUntil:'networkidle',timeout:15000});
    await expect(page.locator('#storybook-root')).toBeAttached();
    await expect(page.locator('#storybook-root').locator(':scope > *')).not.toHaveCount(0);
    await expectedStoryElements(page,story);
    await committedStoryState(page,story);
    await page.evaluate(()=>document.fonts.ready);
  }catch(error){failures.push(String(error));}
  // Keep evidence even when semantic expectations fail, rather than dropping the
  // raw accessibility result that explains a genuine native failure.
  try{
    result.screenshot=`${story.id}.png`;
    await page.screenshot({path:join(directory,result.screenshot),animations:'disabled',caret:'hide',scale:'css',timeout:10000});
  }catch(error){failures.push(`PNG evidence: ${error}`);}
  try{
    const {default:AxeBuilder}=await import('@axe-core/playwright');
    const raw=await new AxeBuilder({page}).include('#storybook-root').include('[data-krds-component][data-krds-part="root"]').analyze();
    result.axeFile=`${story.id}.axe.json`;await writeFile(join(directory,result.axeFile),JSON.stringify(raw,null,2)+'\n');
    result.axe={version:raw.testEngine.version,violations:raw.violations,incomplete:raw.incomplete};
    if(raw.violations.length)failures.push(`Raw axe violations: ${raw.violations.map(item=>item.id).join(', ')}`);
  }catch(error){result.axeErrorFile=`${story.id}.axe-error.json`;await writeFile(join(directory,result.axeErrorFile),JSON.stringify({error:String(error),rawResultAvailable:false},null,2)+'\n');failures.push(`Raw axe evidence: ${error}`);}
  try{network.assertClean();}catch(error){failures.push(String(error));}
  if(runtimeErrors.length)failures.push(`Story runtime errors: ${runtimeErrors.join('; ')}`);
  result.runtimeErrors=runtimeErrors;result.requests=network.requests;result.violations=network.violations;
  result.requestsFile=`${story.id}.requests.json`;
  try{await writeFile(join(directory,result.requestsFile),JSON.stringify({requests:network.requests,violations:network.violations},null,2)+'\n');}
  catch(error){failures.push(`Request evidence: ${error}`);}
  if(failures.length)result.error=failures.join('\n');else result.status='passed';
  await context.close();return result;
}
