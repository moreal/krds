# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: contract.spec.ts >> vue modal/focus-return
- Location: tools/testing/contract.spec.ts:13:29

# Error details

```
Error: expect(locator).toBeFocused() failed

Locator:  getByRole('button', { name: '열기', exact: true })
Expected: focused
Received: inactive
Timeout:  5000ms

Call log:
  - Expect "toBeFocused" getByRole('button', { name: '열기', exact: true }) with timeout 5000ms
  - waiting for getByRole('button', { name: '열기', exact: true })
    14 × locator resolved to <button type="button" data-krds-part="root" data-krds-size="medium" data-krds-variant="primary" data-krds-component="button">…</button>
       - unexpected value "inactive"

```

```yaml
- button "열기"
```

# Test source

```ts
  1   | import {expect} from '@playwright/test';
  2   | import {createFixtureDriver} from '../../packages/test-contracts/dist/driver.js';
  3   | 
  4   | const supportedFixtureCases=new Set([
  5   |   'button/disabled',
  6   |   'native-select/controlled','native-select/form-reset',
  7   |   'modal/focus-return','modal/trigger-removed',
  8   |   'tabs/manual-activation',
  9   |   'date-input/leap-year','date-input/ime','date-input/timezone-invariance',
  10  |   'calendar/selection-confirm',
  11  | ]);
  12  | 
  13  | /** Unknown case IDs must never select a different known observation. */
  14  | export function assertFixtureCaseSupported({componentId,caseId}) {
  15  |   const key=`${componentId}/${caseId}`;
  16  |   if(!supportedFixtureCases.has(key))throw new Error(`No common observer for fixture: ${key}`);
  17  | }
  18  | 
  19  | /** Browser pointer input preserves the native disabled activation boundary. */
  20  | export async function assertDisabledButton(page,driver) {
  21  |   const button=page.getByRole('button',{name:'저장',exact:true});
  22  |   await expect(button).toBeDisabled();
  23  |   await button.scrollIntoViewIfNeeded();
  24  |   const bounds=await button.boundingBox();
  25  |   expect(bounds,'Disabled button must have visible pointer bounds').not.toBeNull();
  26  |   await page.mouse.click(bounds.x+bounds.width/2,bounds.y+bounds.height/2);
  27  |   expect(await driver.readEvents()).toEqual([]);
  28  | }
  29  | 
  30  | /** Exact focus outcomes after closing a dialog, including a removed trigger. */
  31  | export async function assertModalFocus(page,driver,{triggerRemoved=false}={}) {
  32  |   const trigger=page.getByRole('button',{name:'열기',exact:true});
  33  |   await trigger.click();
  34  |   const dialog=page.getByRole('dialog',{name:'확인',exact:true});
  35  |   await expect(dialog).toBeVisible();
  36  |   const inside=dialog.getByRole('button',{name:'닫기',exact:true});
  37  |   await inside.focus();
  38  |   await expect(inside).toBeFocused();
  39  |   if(triggerRemoved) {
  40  |     await driver.setState({triggerVisible:false});
  41  |     await expect(trigger).toHaveCount(0);
  42  |     await expect(inside).toBeFocused();
  43  |   }
  44  |   await page.keyboard.press('Escape');
  45  |   await expect(dialog).toHaveCount(0);
  46  |   const target=triggerRemoved?page.getByRole('button',{name:'다음 작업',exact:true}):trigger;
> 47  |   await expect(target).toBeFocused();
      |                        ^ Error: expect(locator).toBeFocused() failed
  48  | }
  49  | 
  50  | /** A semantic date must survive independently healthy mounts across UTC offsets. */
  51  | export async function assertTimezoneInvariant(browser,origin,fixture,onHealth=()=>{}) {
  52  |   const observations=[];
  53  |   for(const timezoneId of ['Pacific/Kiritimati','America/Los_Angeles']) {
  54  |     const context=await browser.newContext({timezoneId,viewport:{width:1280,height:800},locale:'ko-KR',colorScheme:'light',reducedMotion:'reduce',serviceWorkers:'block'});
  55  |     try {
  56  |       const page=await context.newPage();
  57  |       const driver=createFixtureDriver(page,origin);
  58  |       await driver.open(fixture);
  59  |       await expect(page.getByRole('status',{name:'Fixture health',exact:true})).toHaveText('ready');
  60  |       await driver.setState({__health:'ok'});
  61  |       const state=await page.evaluate(()=>window.__KRDS_FIXTURE__.getState());
  62  |       expect(state.__health).toBe('ok');
  63  |       await onHealth({timezoneId,healthy:true,framework:fixture.framework,fixture});
  64  |       expect(await driver.readEvents(),'No unsolicited events after healthy date mount').toEqual([]);
  65  |       await driver.setState({value:'2024-02-29'});
  66  |       const date=page.getByRole('textbox',{name:'날짜',exact:true});
  67  |       await expect(date).toHaveValue('2024-02-29');
  68  |       expect(await driver.readEvents(),'Controlled date update must not emit unsolicited events').toEqual([]);
  69  |       observations.push({timezoneId,value:await date.inputValue()});
  70  |     } finally {await context.close();}
  71  |   }
  72  |   expect(observations.map(entry=>entry.value)).toEqual(['2024-02-29','2024-02-29']);
  73  |   return observations;
  74  | }
  75  | 
  76  | /** Controlled prop updates are distinct from one committed native user change. */
  77  | export async function assertNativeSelectControlled(page,driver) {
  78  |   const select=page.getByRole('combobox',{name:'지역',exact:true});
  79  |   expect(await driver.readEvents()).toEqual([]);
  80  |   await driver.setState({value:'busan'});
  81  |   await expect(select).toHaveValue('busan');
  82  |   expect(await driver.readEvents(),'Controlled prop updates emit no value change').toEqual([]);
  83  |   await select.selectOption('seoul');
  84  |   await expect(select).toHaveValue('seoul');
  85  |   expect(await driver.readEvents()).toEqual([{name:'valueChange',detail:{value:'seoul'}}]);
  86  | }
  87  | 
  88  | /** Form reset follows real user input on an uncontrolled native baseline. */
  89  | export async function assertNativeSelectReset(page,driver) {
  90  |   const select=page.getByRole('combobox',{name:'지역',exact:true});
  91  |   await expect(select).toHaveValue('seoul');
  92  |   expect(await driver.readEvents()).toEqual([]);
  93  |   await select.selectOption('busan');
  94  |   await expect(select).toHaveValue('busan');
  95  |   const userEvents=[{name:'valueChange',detail:{value:'busan'}}];
  96  |   expect(await driver.readEvents()).toEqual(userEvents);
  97  |   await page.getByRole('button',{name:'초기화',exact:true}).click();
  98  |   await expect(select).toHaveValue('seoul');
  99  |   expect(await driver.readEvents(),'Native reset must not add a change notification').toEqual(userEvents);
  100 | }
  101 | 
  102 | /** Standalone Calendar exposes native table structure and tentative selection. */
  103 | export async function assertCalendarSelectionConfirm(page,driver) {
  104 |   await expect(page.getByRole('heading',{name:'2024년 2월',exact:true})).toBeVisible();
  105 |   const table=page.getByRole('table');
  106 |   await expect(table).toHaveCount(1);
  107 |   expect(await table.evaluate(element=>element.tagName)).toBe('TABLE');
  108 |   await expect(table.getByRole('row')).toHaveCount(7);
  109 |   await expect(table.getByRole('cell')).toHaveCount(42);
  110 |   const bodyRows=table.locator(':scope > tbody > tr');
  111 |   await expect(bodyRows).toHaveCount(6);
  112 |   for(let row=0;row<6;row++) {
  113 |     const cells=bodyRows.nth(row).locator(':scope > td');
  114 |     await expect(cells).toHaveCount(7);
  115 |     for(let column=0;column<7;column++) {
  116 |       const cell=cells.nth(column);
  117 |       const day=cell.locator('button[type="button"]');
  118 |       await expect(day).toHaveCount(1);
  119 |       await expect(cell.getByRole('button')).toHaveCount(1);
  120 |       await expect(day).toBeVisible();
  121 |     }
  122 |   }
  123 |   await expect(table.getByRole('columnheader')).toHaveCount(7);
  124 |   for(const name of ['일요일','월요일','화요일','수요일','목요일','금요일','토요일']) {
  125 |     await expect(table.getByRole('columnheader',{name,exact:true})).toHaveAttribute('scope','col');
  126 |   }
  127 |   await expect(page.getByRole('dialog')).toHaveCount(0);
  128 |   await expect(page.getByRole('button',{name:'오늘',exact:true})).toHaveCount(0);
  129 |   await expect(table.getByRole('button',{pressed:true})).toHaveCount(0);
  130 |   expect(await driver.readEvents()).toEqual([]);
  131 |   await table.getByRole('button',{name:'2024년 2월 29일 목요일',exact:true}).click();
  132 |   const tentative=table.getByRole('button',{name:/^2024년 2월 29일 목요일(?:, 선택됨)?$/});
  133 |   await expect(tentative).toHaveAttribute('aria-pressed','true');
  134 |   expect(await driver.readEvents(),'Tentative date selection emits no value changes').toEqual([]);
  135 |   await page.getByRole('button',{name:'확인',exact:true}).click();
  136 |   expect(await driver.readEvents()).toEqual([{name:'valueChange',detail:{value:'2024-02-29'}}]);
  137 | }
  138 | 
```