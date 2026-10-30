# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: contract.spec.ts >> solid button/disabled
- Location: tools/testing/contract.spec.ts:13:29

# Error details

```
Error: Required KRDS feature not implemented: button/disabled; native health passed

expect(received).toBe(expected) // Object.is equality

Expected: 0
Received: 1
```

# Page snapshot

```yaml
- main [ref=e3]:
  - status "Fixture health" [ref=e4]: ready
  - note [ref=e5]: "Component not implemented: button/disabled"
  - generic [aria-hidden] [ref=e6]: T01 compiler probe
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | import {assertDisabledButton,assertModalFocus,assertTimezoneInvariant} from './observations.mjs';
  3  | import { readFileSync } from 'node:fs';
  4  | import { createFixtureDriver } from '../../packages/test-contracts/dist/driver.js';
  5  | import type { FrameworkId } from '../../packages/test-contracts/dist/types.js';
  6  | const framework=process.env.KRDS_FRAMEWORK as FrameworkId;
  7  | const origin=process.env.KRDS_FIXTURE_ORIGIN!;
  8  | if(!framework || !origin) throw new Error('Use test:contract runner to select a native built fixture');
  9  | const manifest=JSON.parse(readFileSync(new URL('../../catalog/fixture-cases.json',import.meta.url),'utf8'));
  10 | const probe=process.env.KRDS_TEST_MODE==='probe';
  11 | const cases: {componentId:string;caseId:string}[]=probe?[manifest.probe]:manifest.cases.filter((item:{componentId:string})=>!process.env.KRDS_COMPONENT || item.componentId===process.env.KRDS_COMPONENT);
  12 | if(!cases.length) throw new Error('No required fixture scenarios selected');
  13 | for(const fixture of cases) test(`${framework} ${fixture.componentId}/${fixture.caseId}`,async({page,browser},info)=>{
  14 |   const driver=createFixtureDriver(page,origin);
  15 |   await test.step('native server and control channel health',async()=>{
  16 |     await driver.open({...fixture,framework});
  17 |     await expect(page.getByRole('status',{name:'Fixture health',exact:true})).toHaveText('ready');
  18 |     await driver.setState({__health:'ok'});
  19 |     const state=await page.evaluate(()=>window.__KRDS_FIXTURE__!.getState());
  20 |     expect(state.__health).toBe('ok');
  21 |     await info.attach('native-health.json',{body:JSON.stringify({healthy:true,framework,fixture}),contentType:'application/json'});
  22 |   });
  23 |   await test.step('required observable behavior',async()=>{
  24 |     if(probe) {
  25 |       await expect(page.getByRole('status',{name:'Probe value',exact:true})).toHaveText('0');
  26 |       await page.getByRole('button',{name:'Probe increment',exact:true}).click();
  27 |       await expect(page.getByRole('status',{name:'Probe value',exact:true})).toHaveText('1');
  28 |       expect(await driver.readEvents()).toEqual([{name:'change',detail:{value:1}}]);
  29 |       await driver.setState({count:7,label:'Updated probe'});
  30 |       await page.getByRole('button',{name:'Updated probe',exact:true}).click();
  31 |       await expect(page.getByRole('status',{name:'Probe value',exact:true})).toHaveText('8');
  32 |       expect(await driver.readEvents()).toHaveLength(2);
  33 |       await page.evaluate(()=>document.fonts.ready); await page.screenshot({path:info.outputPath('native-probe.png'),animations:'disabled',caret:'hide',scale:'css'});return;
  34 |     }
  35 |     // Fail at the feature boundary immediately once healthy native control has been established.
  36 |     const missing=page.getByRole('note').filter({hasText:`Component not implemented: ${fixture.componentId}/${fixture.caseId}`});
> 37 |     expect(await missing.count(),`Required KRDS feature not implemented: ${fixture.componentId}/${fixture.caseId}; native health passed`).toBe(0);
     |                                                                                                                                           ^ Error: Required KRDS feature not implemented: button/disabled; native health passed
  38 |     if(fixture.componentId==='button') {
  39 |       await assertDisabledButton(page,driver);
  40 |     } else if(fixture.componentId==='native-select') {
  41 |       const select=page.getByRole('combobox',{name:'지역',exact:true});
  42 |       await driver.setState({value:'busan'});await expect(select).toHaveValue('busan');
  43 |       if(fixture.caseId==='controlled') {await select.selectOption('seoul');expect(await driver.readEvents()).toContainEqual({name:'valueChange',detail:{value:'seoul'}});}
  44 |       else {await page.getByRole('button',{name:'초기화',exact:true}).click();await expect(select).toHaveValue('seoul');}
  45 |     } else if(fixture.componentId==='modal') {
  46 |       await assertModalFocus(page,driver,{triggerRemoved:fixture.caseId==='trigger-removed'});
  47 |     } else if(fixture.componentId==='tabs') {
  48 |       const first=page.getByRole('tab',{name:'첫 번째',exact:true});const second=page.getByRole('tab',{name:'두 번째',exact:true});
  49 |       await first.focus();await page.keyboard.press('ArrowRight');await expect(second).toBeFocused();await expect(first).toHaveAttribute('aria-selected','true');
  50 |       await page.keyboard.press('Enter');await expect(second).toHaveAttribute('aria-selected','true');
  51 |     } else {
  52 |       const date=page.getByRole('textbox',{name:'날짜',exact:true});
  53 |       if(fixture.caseId==='leap-year') {await date.fill('2023-02-29');await date.blur();await expect(date).toHaveAttribute('aria-invalid','true');await date.fill('2024-02-29');await date.blur();await expect(date).not.toHaveAttribute('aria-invalid','true');}
  54 |       else if(fixture.caseId==='ime') {await date.dispatchEvent('compositionstart');await date.fill('이월');await expect(date).toHaveValue('이월');await date.dispatchEvent('compositionend',{data:'이월'});}
  55 |       else {await assertTimezoneInvariant(browser,origin,{...fixture,framework},async (health: {timezoneId:string})=>{await info.attach(`native-health-${health.timezoneId.replaceAll('/','-')}.json`,{body:JSON.stringify(health),contentType:'application/json'});});}
  56 |     }
  57 |   });
  58 | });
  59 | 
```