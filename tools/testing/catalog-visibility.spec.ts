import {catalogBrowserRuntime} from './catalog-browser-runtime.mjs';
import {createComponentEventEvidence} from './catalog-event-evidence.mjs';
import {attachComponentEventEvidence} from './catalog-evidence-attachment.mjs';
import {installCatalogExposureTracking,pauseClockNow,clockManagedDriver} from './catalog-timing.mjs';
import {test,expect} from '@playwright/test';
import {readFileSync} from 'node:fs';
import {createFixtureDriver} from '../../packages/test-contracts/dist/driver.js';
import type {FrameworkId} from '../../packages/test-contracts/dist/types.js';
import {assertCatalogCaseSupported,observeCatalogCase,catalogCaseMetadata} from './catalog-observations.mjs';
const framework=process.env.KRDS_FRAMEWORK as FrameworkId;
const origin=process.env.KRDS_FIXTURE_ORIGIN!;
if(!framework || !origin || process.env.KRDS_TEST_MODE!=='catalog') throw new Error('Use explicit test:contract --catalog with a selected native built fixture');
const manifest=JSON.parse(readFileSync(new URL('../../catalog/full-catalog-scenarios.json',import.meta.url),'utf8'));
const cases=manifest.cases.filter((item:{componentId:string;caseId:string})=>((item.componentId==='toast'&&item.caseId==='outcome-05')||(item.componentId==='snackbar'&&item.caseId==='outcome-12'))&&(!process.env.KRDS_COMPONENT || item.componentId===process.env.KRDS_COMPONENT)&&(!process.env.KRDS_CASE || item.caseId===process.env.KRDS_CASE));
if(!cases.length)throw new Error('No required catalog scenarios selected');
for(const fixture of cases) test.describe(fixture.expectedOutcome,()=>{
  if(fixture.componentId==='tooltip' && fixture.caseId==='outcome-05') test.use({hasTouch:true});
  test(`${framework} catalog ${fixture.componentId}/${fixture.caseId}`,async({page:defaultPage},info)=>{
  const runtime=await catalogBrowserRuntime(defaultPage,fixture);const page=runtime.page;
  try{
  await info.attach('actual-browser-runtime.json',{body:JSON.stringify(runtime.evidence),contentType:'application/json'});
  if(fixture.environment?.viewport) await page.setViewportSize(fixture.environment.viewport);
  if(fixture.environment) await page.emulateMedia({colorScheme:fixture.environment.colorMode,reducedMotion:fixture.environment.reducedMotion});
  // Install the fixture clock before mount so every native timer belongs to it.
  if(fixture.host?.fakeClock){await page.clock.install({time:new Date('2024-02-29T12:00:00.000Z')});await pauseClockNow(page);}
  if(['toast','snackbar'].includes(fixture.componentId)) await installCatalogExposureTracking(page);
  const original=createFixtureDriver(page,origin);const driver=fixture.host?.fakeClock?clockManagedDriver(page,original):original;
  await test.step('native server and control channel health',async()=>{
    await driver.open({...fixture,framework});
    if(!fixture.host?.fakeClock)await expect(page.getByRole('status',{name:'Fixture health',exact:true})).toHaveText('ready');
    await driver.setState({__health:'ok'});
    if(fixture.host?.fakeClock)await expect(page.getByRole('status',{name:'Fixture health',exact:true})).toHaveText('ready');
    expect(await page.evaluate(()=>window.__KRDS_FIXTURE__!.getState().__health)).toBe('ok');
    await info.attach('native-health.json',{body:JSON.stringify({healthy:true,framework,fixture:{componentId:fixture.componentId,caseId:fixture.caseId},sourceCandidate:'catalog/full-catalog-scenarios.json',coverageAwarded:false}),contentType:'application/json'});
  });
  const eventEvidence=await createComponentEventEvidence(page);
  await test.step('required observable catalog behavior',async()=>{
    assertCatalogCaseSupported(fixture);
    await expect(page.getByRole('note').filter({hasText:`Component not implemented: ${fixture.componentId}/${fixture.caseId}`})).toHaveCount(0);
    // A fixture initializes this exact case before mount. Injecting initial state here would conceal mount/autoplay failures.
    await info.attach('catalog-observation-scope.json',{body:JSON.stringify(catalogCaseMetadata(fixture)),contentType:'application/json'});
    let behaviorFailed=false;
    try { await observeCatalogCase(page,driver,fixture); }
    catch(error) {
      behaviorFailed=true;
      if((error as {code?:string}).code==='KRDS_MANUAL_OBSERVATION_REQUIRED') await info.attach('manual-blocker.json',{body:JSON.stringify(catalogCaseMetadata(fixture)),contentType:'application/json'});
      if((error as {code?:string}).code==='KRDS_BROWSER_CAPABILITY_REQUIRED') await info.attach('browser-capability-blocker.json',{body:JSON.stringify({...catalogCaseMetadata(fixture),reason:String(error)}),contentType:'application/json'});
      throw error;
    }finally{
      await attachComponentEventEvidence(info,eventEvidence,{behaviorFailed});
    }
  });
  }finally{
    try{if(runtime.readVisibilityEvidence)await info.attach('actual-document-visibility.json',{body:JSON.stringify(await runtime.readVisibilityEvidence()),contentType:'application/json'});}
    finally{await runtime.cleanup?.();}
  }
  });
});
