import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile,readdir} from 'node:fs/promises';
import {join,relative} from 'node:path';
import {chromium} from 'playwright';
import {expect} from '@playwright/test';
import {startProductionSsr} from '../server.mjs';

// Public native names and host receipts; no renderer/source snapshots or matcher waivers.
const dist=new URL('../dist/',import.meta.url),results=[],errors=[];
async function artifactIdentity(){
  const files=[];
  async function walk(path){for(const entry of await readdir(path,{withFileTypes:true})){const file=join(path,entry.name);if(entry.isDirectory())await walk(file);else if(entry.isFile()){const bytes=await readFile(file);files.push({path:relative(dist.pathname,file),bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});}else throw new Error('Unexpected artifact entry');}}
  await walk(dist.pathname);files.sort((a,b)=>a.path.localeCompare(b.path));
  return {fileCount:files.length,sha256:createHash('sha256').update(JSON.stringify(files)).digest('hex')};
}
const artifactBefore=await artifactIdentity(),server=await startProductionSsr(),browser=await chromium.launch();
const context=await browser.newContext(),page=await context.newPage(),ssrContext=await browser.newContext({javaScriptEnabled:false}),ssr=await ssrContext.newPage();
page.on('pageerror',error=>errors.push(String(error)));
async function check(id,run){try{const detail=await run();results.push({id,status:'passed',...(detail?{detail}:{})});}catch(error){results.push({id,status:'failed',error:String(error)});}}
const part=name=>page.locator(`[data-krds-component="tts"][data-krds-part="${name}"]`);
const host=name=>page.locator(`[data-krds-host="${name}"]`);
const events=()=>page.evaluate(()=>window.__KRDS_FIXTURE__.readEvents());
const patch=next=>page.evaluate(next=>window.__KRDS_FIXTURE__.setState(next),next);
try{
  await check('paused-production-SSR-default-functional-name',async()=>{
    const response=await ssr.goto(server.origin+'/catalog-resume.html?component=tts&case=page');
    assert.equal(response.headers()['x-krds-render'],'production-qwik-ssr');
    await expect(ssr.getByRole('button',{name:'음성 안내 재생',exact:true})).toBeVisible();
    await expect(ssr.getByRole('button',{name:'음성 안내 재생',exact:true})).toHaveText('음성 안내 재생');
    return {htmlSha256:createHash('sha256').update(await response.body()).digest('hex')};
  });
  await check('paused-production-SSR-supplied-icon-only-name',async()=>{
    const response=await ssr.goto(server.origin+'/source-contracts.html?case=options');
    assert.equal(response.headers()['x-krds-render'],'production-qwik-ssr');
    const button=ssr.getByRole('button',{name:'문서 읽기 재생',exact:true});
    await expect(button).toBeVisible();assert.equal(await button.innerText(),'');await expect(button.locator('svg[aria-hidden="true"]')).toHaveCount(1);
  });
  await page.goto(server.origin+'/__fixture/tts?case=outcome-06');
  await expect(page.getByRole('status',{name:'Fixture health',exact:true})).toHaveText('ready');
  await check('default-idle-name-no-autoplay-default-size',async()=>{
    await expect(page.getByRole('button',{name:'음성 안내 재생',exact:true})).toBeEnabled();
    await expect(part('root')).toHaveAttribute('data-krds-size','small');
    assert.deepEqual(await events(),[]);await expect(host('speech-driver-active')).toHaveText('false');
  });
  await patch({label:'문서 읽기',summary:'이 문서의 목적과 이용 순서',locale:'ko-KR',iconOnly:true,state:'idle',size:'xsmall'});
  await check('supplied-idle-icon-only-name-no-prop-callback',async()=>{
    const button=page.getByRole('button',{name:'문서 읽기 재생',exact:true});
    await expect(button).toBeEnabled();assert.equal(await button.innerText(),'');await expect(button.locator('svg[aria-hidden="true"]')).toHaveCount(1);
    await expect(part('root')).toHaveAttribute('data-krds-size','xsmall');assert.deepEqual(await events(),[]);
  });
  await patch({state:'unsupported'});
  await check('unsupported-exact-name-disabled-explanation-zero-events',async()=>{
    await expect(page.getByRole('button',{name:'문서 읽기 재생',exact:true})).toBeDisabled();
    await expect(part('status')).toHaveText('음성 읽기를 지원하지 않습니다.');assert.deepEqual(await events(),[]);
  });
  await patch({state:'error',iconOnly:false,size:'medium'});
  await check('error-retry-supplied-name-status-and-size',async()=>{
    await expect(page.getByRole('button',{name:'문서 읽기 다시 재생',exact:true})).toHaveText('문서 읽기 다시 재생');
    await expect(part('status')).toHaveText('읽기에 실패했습니다. 다시 시도하세요.');await expect(part('root')).toHaveAttribute('data-krds-size','medium');assert.deepEqual(await events(),[]);
  });
  const expected=action=>({name:'request',detail:{action,summary:'이 문서의 목적과 이용 순서',locale:'ko-KR'}});
  await check('retry-Enter-requests-play-once-and-reachable-controls',async()=>{
    await page.getByRole('button',{name:'문서 읽기 다시 재생',exact:true}).press('Enter');
    await expect(host('speech-state')).toHaveText('playing');await expect(host('speech-driver-active')).toHaveText('true');
    await expect(page.getByRole('button',{name:'문서 읽기 재생',exact:true})).toBeDisabled();
    await expect(page.getByRole('button',{name:'문서 읽기 일시정지',exact:true})).toBeEnabled();await expect(page.getByRole('button',{name:'문서 읽기 중지',exact:true})).toBeEnabled();
    await expect.poll(events).toEqual([expected('play')]);
  });
  await check('pause-Space-and-canonical-resume-name',async()=>{
    await page.getByRole('button',{name:'문서 읽기 일시정지',exact:true}).press('Space');
    await expect(host('speech-state')).toHaveText('paused');await expect(page.getByRole('button',{name:'문서 읽기 다시 재생',exact:true})).toBeEnabled();
    await expect.poll(events).toEqual([expected('play'),expected('pause')]);
  });
  await check('canonical-resume-requests-resume-once',async()=>{
    await page.getByRole('button',{name:'문서 읽기 다시 재생',exact:true}).click();await expect(host('speech-state')).toHaveText('playing');
    await expect.poll(events).toEqual([expected('play'),expected('pause'),expected('resume')]);
  });
  await check('explicit-stop-restores-idle-functional-name-and-disposes-driver',async()=>{
    await page.getByRole('button',{name:'문서 읽기 중지',exact:true}).click();await expect(host('speech-state')).toHaveText('idle');
    await expect(page.getByRole('button',{name:'문서 읽기 재생',exact:true})).toBeEnabled();await expect(host('speech-driver-active')).toHaveText('false');await expect(host('speech-driver-lifecycle')).toHaveText('disposed');
    await expect.poll(events).toEqual([expected('play'),expected('pause'),expected('resume'),expected('stop')]);
  });
  await check('unmount-aborts-real-host-driver-with-permitted-single-Stop',async()=>{
    await page.getByRole('button',{name:'문서 읽기 재생',exact:true}).click();await expect(host('speech-driver-active')).toHaveText('true');
    const before=await events();await page.evaluate(()=>{const bridge=window.__KRDS_FIXTURE__;return bridge.setState({__host:{...bridge.getState().__host,mounted:false}});});
    await expect(part('root')).toHaveCount(0);await expect(host('speech-driver-active')).toHaveText('false');await expect(host('speech-driver-lifecycle')).toHaveText('disposed');await expect(host('speech-state')).toHaveText('idle');
    const after=await events();assert.deepEqual(after.slice(0,before.length),before);assert.deepEqual(after.slice(before.length),[expected('stop')]);
    return {before,after,receipts:{active:false,lifecycle:'disposed',speech:'idle'}};
  });
  await check('no-browser-runtime-errors',async()=>assert.deepEqual(errors,[]));
}finally{await browser.close();await server.close();}
const artifactAfter=await artifactIdentity();assert.deepEqual(artifactAfter,artifactBefore,'Production output changed during native reader lease');
console.log(JSON.stringify({artifactBefore,artifactAfter,results,errors},null,2));
if(results.length!==12||results.some(result=>result.status!=='passed'))process.exitCode=1;
