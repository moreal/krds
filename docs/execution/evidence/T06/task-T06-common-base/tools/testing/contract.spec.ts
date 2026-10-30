import { test, expect } from '@playwright/test';
import {assertDisabledButton,assertModalFocus,assertTimezoneInvariant} from './observations.mjs';
import { readFileSync } from 'node:fs';
import { createFixtureDriver } from '../../packages/test-contracts/dist/driver.js';
import type { FrameworkId } from '../../packages/test-contracts/dist/types.js';
const framework=process.env.KRDS_FRAMEWORK as FrameworkId;
const origin=process.env.KRDS_FIXTURE_ORIGIN!;
if(!framework || !origin) throw new Error('Use test:contract runner to select a native built fixture');
const manifest=JSON.parse(readFileSync(new URL('../../catalog/fixture-cases.json',import.meta.url),'utf8'));
const probe=process.env.KRDS_TEST_MODE==='probe';
const cases: {componentId:string;caseId:string}[]=probe?[manifest.probe]:manifest.cases.filter((item:{componentId:string})=>!process.env.KRDS_COMPONENT || item.componentId===process.env.KRDS_COMPONENT);
if(!cases.length) throw new Error('No required fixture scenarios selected');
for(const fixture of cases) test(`${framework} ${fixture.componentId}/${fixture.caseId}`,async({page,browser},info)=>{
  const driver=createFixtureDriver(page,origin);
  await test.step('native server and control channel health',async()=>{
    await driver.open({...fixture,framework});
    await expect(page.getByRole('status',{name:'Fixture health',exact:true})).toHaveText('ready');
    await driver.setState({__health:'ok'});
    const state=await page.evaluate(()=>window.__KRDS_FIXTURE__!.getState());
    expect(state.__health).toBe('ok');
    await info.attach('native-health.json',{body:JSON.stringify({healthy:true,framework,fixture}),contentType:'application/json'});
  });
  await test.step('required observable behavior',async()=>{
    if(probe) {
      await expect(page.getByRole('status',{name:'Probe value',exact:true})).toHaveText('0');
      await page.getByRole('button',{name:'Probe increment',exact:true}).click();
      await expect(page.getByRole('status',{name:'Probe value',exact:true})).toHaveText('1');
      expect(await driver.readEvents()).toEqual([{name:'change',detail:{value:1}}]);
      await driver.setState({count:7,label:'Updated probe'});
      await page.getByRole('button',{name:'Updated probe',exact:true}).click();
      await expect(page.getByRole('status',{name:'Probe value',exact:true})).toHaveText('8');
      expect(await driver.readEvents()).toHaveLength(2);
      await page.evaluate(()=>document.fonts.ready); await page.screenshot({path:info.outputPath('native-probe.png'),animations:'disabled',caret:'hide',scale:'css'});return;
    }
    // Fail at the feature boundary immediately once healthy native control has been established.
    const missing=page.getByRole('note').filter({hasText:`Component not implemented: ${fixture.componentId}/${fixture.caseId}`});
    expect(await missing.count(),`Required KRDS feature not implemented: ${fixture.componentId}/${fixture.caseId}; native health passed`).toBe(0);
    if(fixture.componentId==='button') {
      await assertDisabledButton(page,driver);
    } else if(fixture.componentId==='native-select') {
      const select=page.getByRole('combobox',{name:'지역',exact:true});
      await driver.setState({value:'busan'});await expect(select).toHaveValue('busan');
      if(fixture.caseId==='controlled') {await select.selectOption('seoul');expect(await driver.readEvents()).toContainEqual({name:'valueChange',detail:{value:'seoul'}});}
      else {await page.getByRole('button',{name:'초기화',exact:true}).click();await expect(select).toHaveValue('seoul');}
    } else if(fixture.componentId==='modal') {
      await assertModalFocus(page,driver,{triggerRemoved:fixture.caseId==='trigger-removed'});
    } else if(fixture.componentId==='tabs') {
      const first=page.getByRole('tab',{name:'첫 번째',exact:true});const second=page.getByRole('tab',{name:'두 번째',exact:true});
      await first.focus();await page.keyboard.press('ArrowRight');await expect(second).toBeFocused();await expect(first).toHaveAttribute('aria-selected','true');
      await page.keyboard.press('Enter');await expect(second).toHaveAttribute('aria-selected','true');
    } else {
      const date=page.getByRole('textbox',{name:'날짜',exact:true});
      if(fixture.caseId==='leap-year') {await date.fill('2023-02-29');await date.blur();await expect(date).toHaveAttribute('aria-invalid','true');await date.fill('2024-02-29');await date.blur();await expect(date).not.toHaveAttribute('aria-invalid','true');}
      else if(fixture.caseId==='ime') {await date.dispatchEvent('compositionstart');await date.fill('이월');await expect(date).toHaveValue('이월');await date.dispatchEvent('compositionend',{data:'이월'});}
      else {await assertTimezoneInvariant(browser,origin,{...fixture,framework},async (health: {timezoneId:string})=>{await info.attach(`native-health-${health.timezoneId.replaceAll('/','-')}.json`,{body:JSON.stringify(health),contentType:'application/json'});});}
    }
  });
});
