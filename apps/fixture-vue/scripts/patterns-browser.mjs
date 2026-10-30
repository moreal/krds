import assert from 'node:assert/strict';
import {mkdir,writeFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {chromium} from 'playwright';
import {expect} from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import {serveProduction,root} from '../../../tools/testing/support.mjs';
if(process.env.PLAYWRIGHT_BROWSERS_PATH!=='/private/tmp/krds-playwright-1.64.1')throw new Error('Set PLAYWRIGHT_BROWSERS_PATH to the selected /private/tmp/krds-playwright-1.64.1 cache before execution.');
const directory=join(root,'.superpowers/sdd/PLAN/t11-vue-logs',process.env.KRDS_PATTERN_RUN??'browser');await mkdir(directory,{recursive:true});
const server=await serveProduction(resolve(process.env.KRDS_PATTERN_DIST??join(root,'apps/fixture-vue/dist')),{fixture:true});
const browser=await chromium.launch();const results=[];let seq=0;
const events=page=>page.evaluate(()=>window.__KRDS_FIXTURE__.readEvents().filter(event=>event.name==='pattern:request'));
async function settle(page,ok){await page.evaluate(async command=>{await window.__KRDS_FIXTURE__.setState({__patternCommand:command});},{sequence:++seq,command:'settle',...(ok===undefined?{}:{ok})});}
const cases=[['form-errors','error-summary-focus'],['form-errors','retry-success'],['form-errors','reset-cancels-pending'],['search-results','filter-resets-page'],['search-results','empty-results'],['search-results','retry-success'],['search-results','query-during-loading'],['consent-confirmation','required-refusal'],['consent-confirmation','optional-refusal-success'],['consent-confirmation','modal-focus-return'],['consent-confirmation','retry-in-dialog'],['service-layout','skip-main'],['service-layout','navigate-current'],['service-layout','narrow-navigation'],['service-layout','footer-policy']];
try{
for(const [pattern,id] of cases){
 const context=await browser.newContext({viewport:id==='narrow-navigation'?{width:360,height:800}:id==='modal-focus-return'?{width:1000,height:500}:{width:1280,height:900},locale:'ko-KR',reducedMotion:'reduce'});const page=await context.newPage();const errors=[],external=[];
 page.on('pageerror',error=>errors.push(String(error)));page.on('request',request=>{if(!request.url().startsWith(server.origin))external.push(request.url());});
 const result={pattern,id,errors,external,pass:false};
 try{
 await page.goto(`${server.origin}/examples/${pattern}?case=${id}`);await page.waitForFunction(()=>window.__KRDS_FIXTURE__?.framework==='vue');assert.equal((await events(page)).length,0);
 if(pattern==='form-errors'){
  if(id==='error-summary-focus'){
   await page.locator('#example-form-submit').click();await expect(page.locator('#example-form-title')).toBeFocused();await expect(page.locator('#example-form-errors li')).toHaveCount(2);
   await page.locator('#example-form-errors a[href="#example-form-category"]').click();await expect(page.locator('#example-form-category')).toBeFocused();assert.equal((await events(page)).length,0);
   assert.equal(await page.locator('#example-form-title').getAttribute('aria-invalid'),'true');assert.match(await page.locator('#example-form-title').getAttribute('aria-describedby'),/example-form-title-error/);
   await page.locator('#example-form-title').fill('  예제 제목 😀  ');await page.locator('#example-form-category').selectOption('practice');
   const fd=await page.locator('form').evaluate(form=>Object.fromEntries(new FormData(form)));assert.deepEqual(fd,{title:'  예제 제목 😀  ',category:'practice',detail:''});
   await page.locator('#example-form-title').press('Enter');assert.equal((await events(page)).length,1);assert.equal((await events(page))[0].detail.payload.title,'예제 제목 😀');await settle(page);await expect(page.getByRole('status').filter({hasText:'DEMO-FORM-001'})).toBeVisible();
  }else{
   await page.locator('#example-form-submit').click();assert.equal((await events(page)).length,1);await expect(page.locator('form')).toHaveAttribute('aria-busy','true');
   await page.locator('form').evaluate(form=>form.requestSubmit());assert.equal((await events(page)).length,1);
   if(id==='reset-cancels-pending'){
    await page.locator('#example-form-reset').click();await expect(page.locator('#example-form-title')).toHaveValue('');await expect(page.locator('#example-form-category')).toHaveValue('');await settle(page,true);await expect(page.getByText('DEMO-FORM-001',{exact:false})).toHaveCount(0);assert.equal((await events(page)).length,1);
   }else{
    await settle(page);await expect(page.locator('#example-form-retry')).toBeVisible();await expect(page.locator('#example-form-title')).toHaveValue('예제 입력폼 연습');await page.locator('#example-form-retry').click();assert.equal((await events(page)).length,2);await settle(page);await expect(page.getByRole('status').filter({hasText:'DEMO-FORM-001'})).toBeVisible();
   }
  }
 }else if(pattern==='search-results'){
  const query=page.locator('#example-search-query');
  if(id==='filter-resets-page'){
   await expect(page.locator('[data-krds-component="pagination"] [aria-current="page"]')).toHaveText('3');const select=page.locator('#example-search-category');await select.focus();await select.selectOption('example');await expect(select).toBeFocused();await expect(page.locator('#example-search-count')).toHaveCount(0);assert.equal((await events(page)).length,1);assert.equal((await events(page))[0].detail.payload.page,1);await settle(page);
   await expect(page.locator('#example-search-count')).toContainText('4건');for(const resource of ['resource-02','resource-05','resource-08'])await expect(page.locator('#'+resource)).toBeVisible();await expect(page.locator('[data-krds-component="pagination"] [aria-current="page"]')).not.toHaveAttribute('href');
   const second=page.locator('[data-krds-component="pagination"][data-krds-part="link"]').filter({hasText:/^2$/});assert.match(await second.getAttribute('href'),/case=filter-resets-page&query=&category=example&page=2/);await second.click();await settle(page);await expect(page.locator('[data-krds-component="pagination"] [aria-current="page"]')).toBeFocused();await expect(page.locator('#resource-11')).toBeVisible();await expect(page.locator('[data-krds-component="structured-list"][data-krds-part="item"]')).toHaveCount(1);assert.match(page.url(),/page=2/);
   await page.goBack();await expect(page.locator('#resource-02')).toBeVisible();assert.equal((await events(page)).length,2);await page.goForward();await expect(page.locator('#resource-11')).toBeVisible();assert.equal((await events(page)).length,2);
   await page.reload();await page.waitForFunction(()=>window.__KRDS_FIXTURE__);await expect(page.locator('#resource-11')).toBeVisible();assert.equal((await events(page)).length,0);
  }else{
   if(id==='empty-results')await query.fill('존재하지않는예제');if(id==='query-during-loading')await query.fill('접근성');assert.equal(new URL(page.url()).searchParams.has('query'),false);await page.locator('#example-search-submit').click();assert.equal((await events(page)).length,1);await expect(page.locator('#example-search-count')).toHaveCount(0);
   if(id==='query-during-loading')await query.fill('대화상자');await settle(page);
   if(id==='empty-results'){await expect(page.locator('#example-search-count')).toContainText('0건');await expect(page.getByText('검색 결과가 없습니다. 검색어나 자료 유형을 바꿔 보세요.')).toBeVisible();await expect(page.locator('[data-krds-component="pagination"]')).toHaveCount(0);}
   else if(id==='retry-success'){await expect(page.locator('#example-search-retry')).toBeVisible();await query.fill('나중 초안');await page.locator('#example-search-retry').click();assert.deepEqual((await events(page))[1].detail.payload,{query:'',category:'all',page:1});await settle(page);await expect(page.locator('#example-search-count')).toContainText('12건');await expect(query).toHaveValue('나중 초안');}
   else{await expect(query).toHaveValue('대화상자');await expect(page.locator('#example-search-count')).toContainText('접근성');await expect(page.locator('#example-search-count')).toContainText('4건');assert.equal((await events(page))[0].detail.payload.query,'접근성');}
  }
 }else if(pattern==='consent-confirmation'){
  const review=page.locator('#example-consent-review');
  if(id==='required-refusal'){await page.locator('#example-consent-required-decline').check();await review.click();await expect(page.getByRole('dialog')).toHaveCount(0);await expect(page.locator('#example-consent-required-agree')).toBeFocused();await expect(page.locator('#example-consent-error')).toBeVisible();assert.equal((await events(page)).length,0);}
  else{
   await review.scrollIntoViewIfNeeded();await review.focus();const position=await page.evaluate(()=>scrollY);if(id==='modal-focus-return')assert.ok(position>0,'scroll test must start away from page top');await review.click();const dialog=page.getByRole('dialog',{name:'예제 선택 확인'});await expect(dialog).toBeFocused();assert.equal(await page.evaluate(()=>document.body.style.overflow),'hidden');
   if(id==='modal-focus-return'){
    for(let index=0;index<8;index++){await page.keyboard.press('Tab');assert.equal(await dialog.evaluate(el=>el.contains(document.activeElement)),true);}await page.keyboard.press('Shift+Tab');assert.equal(await dialog.evaluate(el=>el.contains(document.activeElement)),true);await page.keyboard.press('Escape');await expect(dialog).toHaveCount(0);await expect(review).toBeFocused();assert.ok(Math.abs((await page.evaluate(()=>scrollY))-position)<=3);await review.click();await page.locator('#example-consent-cancel').click();await expect(review).toBeFocused();assert.ok(Math.abs((await page.evaluate(()=>scrollY))-position)<=3);
    await review.click();await page.locator('#example-consent-confirm').click();assert.equal((await events(page)).length,1);await page.locator('#example-consent-cancel').click();await settle(page,true);await expect(page.getByText('DEMO-CONSENT-001',{exact:false})).toHaveCount(0);await expect(review).toBeFocused();
   }else{
    await page.locator('#example-consent-confirm').click();assert.equal((await events(page)).length,1);await expect(dialog).toBeVisible();await settle(page);
    if(id==='retry-in-dialog'){await expect(dialog).toBeVisible();assert.equal(await dialog.evaluate(el=>el.contains(document.activeElement)),true);await page.locator('#example-consent-retry').click();assert.equal((await events(page)).length,2);await settle(page);}
    await expect(dialog).toHaveCount(0);await expect(review).toBeFocused();await expect(page.getByRole('status').filter({hasText:'DEMO-CONSENT-001'})).toContainText('동의하지 않음');assert.ok(Math.abs((await page.evaluate(()=>scrollY))-position)<=3);
   }
  }
 }else{
  const heading=page.locator('#example-main-heading');
  if(id==='skip-main'){await page.keyboard.press('Tab');await expect(page.getByRole('link',{name:'본문 바로가기'}).first()).toBeFocused();await page.keyboard.press('Enter');await expect(heading).toBeFocused();}
  else if(id==='navigate-current'){
   const sidebar=page.locator('[data-krds-component="side-navigation"][data-krds-part="root"]');await sidebar.getByRole('button',{name:'도움말'}).click();await expect(sidebar.getByRole('button',{name:'예제 둘러보기'})).toHaveAttribute('aria-expanded','true');await expect(heading).toHaveText('예제 소개');assert.equal(new URL(page.url()).searchParams.has('section'),false);await sidebar.getByRole('link',{name:'검색 연습',exact:true}).click();await expect(heading).toHaveText('검색 연습');await expect(heading).toBeFocused();assert.match(page.url(),/section=search/);await expect(sidebar.getByRole('link',{name:'검색 연습',exact:true})).toHaveAttribute('aria-current','page');await page.goBack();await expect(heading).toHaveText('예제 소개');await page.goForward();await expect(heading).toHaveText('검색 연습');
  }else if(id==='narrow-navigation'){
   const opener=page.locator('#example-layout-mobile-open');await opener.click();let dialog=page.getByRole('dialog',{name:'전체 메뉴'});await expect(dialog).toBeVisible();await dialog.getByRole('button',{name:'예제 둘러보기'}).click();await dialog.getByRole('link',{name:'검색 연습',exact:true}).click();await expect(dialog).toHaveCount(0);await expect(heading).toHaveText('검색 연습');await expect(heading).toBeFocused();
   await opener.click();dialog=page.getByRole('dialog',{name:'전체 메뉴'});const branch=dialog.getByRole('button',{name:'예제 둘러보기'});if(await branch.getAttribute('aria-expanded')!=='true')await branch.click();await expect(dialog.getByRole('link',{name:'검색 연습',exact:true})).toHaveAttribute('aria-current','page');await dialog.getByRole('link',{name:'검색 연습',exact:true}).click();await expect(dialog).toHaveCount(0);await expect(heading).toBeFocused();await opener.click();await page.keyboard.press('Escape');await expect(opener).toBeFocused();
  }else{await page.locator('footer').getByRole('link',{name:'개인정보 처리방침'}).click();await expect(heading).toHaveText('개인정보 처리방침');await expect(heading).toBeFocused();await expect(page.locator('main')).toContainText('전송하거나 영구 저장하지 않습니다');await expect(page.locator('[data-krds-component="side-navigation"] [aria-current="page"]')).toHaveText('개인정보 처리방침');}
  assert.equal((await events(page)).length,0);await expect(page.getByRole('banner')).toBeVisible();await expect(page.getByRole('contentinfo')).toBeVisible();await expect(page.getByText('정부·공공기관의 공식 서비스가 아닙니다.',{exact:false})).toBeVisible();
 }
 result.requests=await events(page);assert.deepEqual(errors,[]);assert.deepEqual(external,[]);result.pass=true;
 }catch(error){result.failure=String(error.stack??error);await page.screenshot({path:join(directory,`${pattern}-${id}-failure.png`),fullPage:true});}
 results.push(result);console.log(`${result.pass?'PASS':'FAIL'} ${pattern}/${id}${result.failure?' '+result.failure.split('\n')[0]:''}`);await context.close();
}
if(process.env.KRDS_PATTERN_VISUAL==='1')for(const [pattern,id] of [cases[0],cases[3],cases[9],cases[14]])for(const variant of (process.env.KRDS_PATTERN_ONLY_NARROW200==='1'?['narrow200']:['normal','narrow','zoom200','text200','narrow200','forced-colors'])){
 const context=await browser.newContext({viewport:variant.startsWith('narrow')?{width:360,height:800}:{width:1280,height:900},forcedColors:variant==='forced-colors'?'active':'none',reducedMotion:'reduce'});const page=await context.newPage();const errors=[],external=[];page.on('pageerror',e=>errors.push(String(e)));page.on('request',r=>{if(!r.url().startsWith(server.origin))external.push(r.url());});
 await page.goto(`${server.origin}/examples/${pattern}?case=${id}`);await page.waitForFunction(()=>window.__KRDS_FIXTURE__);await page.evaluate(()=>document.fonts.ready);if(variant==='zoom200')await page.evaluate(()=>document.documentElement.style.zoom='2');if(variant==='text200'||variant==='narrow200')await page.evaluate(()=>document.documentElement.style.fontSize='200%');if(pattern==='form-errors')await page.locator('#example-form-submit').click();else if(pattern==='search-results')await page.locator('#example-search-category').focus();else if(pattern==='consent-confirmation')await page.locator('#example-consent-review').focus();else await page.locator('#example-main-heading').focus();
 const raw=await new AxeBuilder({page}).analyze();const geometry=await page.evaluate(()=>({viewport:innerWidth,width:document.documentElement.scrollWidth,focus:document.activeElement?.id,outline:getComputedStyle(document.activeElement).outlineStyle}));await page.screenshot({path:join(directory,`${pattern}-${variant}.png`),fullPage:true});
 const visual={pattern,variant,geometry,axe:raw,errors,external,pass:raw.violations.length===0&&errors.length===0&&external.length===0&&geometry.width<=geometry.viewport+1};
 if(pattern==='consent-confirmation'){await page.locator('#example-consent-review').click();await page.getByRole('dialog').waitFor();visual.modalAxe=await new AxeBuilder({page}).analyze();await page.screenshot({path:join(directory,`${pattern}-${variant}-modal.png`),fullPage:true});visual.pass=visual.pass&&visual.modalAxe.violations.length===0;}
 results.push(visual);console.log(`${visual.pass?'PASS':'FAIL'} visual ${pattern}/${variant}: ${raw.violations.map(x=>x.id).join(',')} width ${geometry.width}/${geometry.viewport}`);await context.close();
}
}finally{await browser.close();await server.close();await writeFile(join(directory,'results.json'),JSON.stringify({browserVersion:browser.version(),browserCache:process.env.PLAYWRIGHT_BROWSERS_PATH,artifact:server.snapshot,results},null,2));}
if(results.some(result=>!result.pass))process.exitCode=1;
