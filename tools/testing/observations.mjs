import {expect} from '@playwright/test';
import {createFixtureDriver} from '../../packages/test-contracts/dist/driver.js';

const supportedFixtureCases=new Set([
  'button/disabled',
  'native-select/controlled','native-select/form-reset',
  'modal/focus-return','modal/trigger-removed',
  'tabs/manual-activation',
  'date-input/leap-year','date-input/ime','date-input/timezone-invariance',
  'calendar/selection-confirm',
]);

/** Unknown case IDs must never select a different known observation. */
export function assertFixtureCaseSupported({componentId,caseId}) {
  const key=`${componentId}/${caseId}`;
  if(!supportedFixtureCases.has(key))throw new Error(`No common observer for fixture: ${key}`);
}

/** Browser pointer input preserves the native disabled activation boundary. */
export async function assertDisabledButton(page,driver) {
  const button=page.getByRole('button',{name:'저장',exact:true});
  await expect(button).toBeDisabled();
  await button.scrollIntoViewIfNeeded();
  const bounds=await button.boundingBox();
  expect(bounds,'Disabled button must have visible pointer bounds').not.toBeNull();
  await page.mouse.click(bounds.x+bounds.width/2,bounds.y+bounds.height/2);
  expect(await driver.readEvents()).toEqual([]);
}

/** Exact focus outcomes after closing a dialog, including a removed trigger. */
export async function assertModalFocus(page,driver,{triggerRemoved=false}={}) {
  const trigger=page.getByRole('button',{name:'열기',exact:true});
  await trigger.click();
  const dialog=page.getByRole('dialog',{name:'확인',exact:true});
  await expect(dialog).toBeVisible();
  const inside=dialog.getByRole('button',{name:'닫기',exact:true});
  await inside.focus();
  await expect(inside).toBeFocused();
  if(triggerRemoved) {
    await driver.setState({triggerVisible:false});
    await expect(trigger).toHaveCount(0);
    await expect(inside).toBeFocused();
  }
  await page.keyboard.press('Escape');
  await expect(dialog).toHaveCount(0);
  const target=triggerRemoved?page.getByRole('button',{name:'다음 작업',exact:true}):trigger;
  await expect(target).toBeFocused();
}

/** A semantic date must survive independently healthy mounts across UTC offsets. */
export async function assertTimezoneInvariant(browser,origin,fixture,onHealth=()=>{}) {
  const observations=[];
  for(const timezoneId of ['Pacific/Kiritimati','America/Los_Angeles']) {
    const context=await browser.newContext({timezoneId,viewport:{width:1280,height:800},locale:'ko-KR',colorScheme:'light',reducedMotion:'reduce',serviceWorkers:'block'});
    try {
      const page=await context.newPage();
      const driver=createFixtureDriver(page,origin);
      await driver.open(fixture);
      await expect(page.getByRole('status',{name:'Fixture health',exact:true})).toHaveText('ready');
      await driver.setState({__health:'ok'});
      const state=await page.evaluate(()=>window.__KRDS_FIXTURE__.getState());
      expect(state.__health).toBe('ok');
      await onHealth({timezoneId,healthy:true,framework:fixture.framework,fixture});
      expect(await driver.readEvents(),'No unsolicited events after healthy date mount').toEqual([]);
      await driver.setState({value:'2024-02-29'});
      const date=page.getByRole('textbox',{name:'날짜',exact:true});
      await expect(date).toHaveValue('2024-02-29');
      expect(await driver.readEvents(),'Controlled date update must not emit unsolicited events').toEqual([]);
      observations.push({timezoneId,value:await date.inputValue()});
    } finally {await context.close();}
  }
  expect(observations.map(entry=>entry.value)).toEqual(['2024-02-29','2024-02-29']);
  return observations;
}

/** Controlled prop updates are distinct from one committed native user change. */
export async function assertNativeSelectControlled(page,driver) {
  const select=page.getByRole('combobox',{name:'지역',exact:true});
  expect(await driver.readEvents()).toEqual([]);
  await driver.setState({value:'busan'});
  await expect(select).toHaveValue('busan');
  expect(await driver.readEvents(),'Controlled prop updates emit no value change').toEqual([]);
  await select.selectOption('seoul');
  await expect(select).toHaveValue('seoul');
  expect(await driver.readEvents()).toEqual([{name:'valueChange',detail:{value:'seoul'}}]);
}

/** Form reset follows real user input on an uncontrolled native baseline. */
export async function assertNativeSelectReset(page,driver) {
  const select=page.getByRole('combobox',{name:'지역',exact:true});
  await expect(select).toHaveValue('seoul');
  expect(await driver.readEvents()).toEqual([]);
  await select.selectOption('busan');
  await expect(select).toHaveValue('busan');
  const userEvents=[{name:'valueChange',detail:{value:'busan'}}];
  expect(await driver.readEvents()).toEqual(userEvents);
  await page.getByRole('button',{name:'초기화',exact:true}).click();
  await expect(select).toHaveValue('seoul');
  expect(await driver.readEvents(),'Native reset must not add a change notification').toEqual(userEvents);
}

/** Standalone Calendar exposes native table structure and tentative selection. */
export async function assertCalendarSelectionConfirm(page,driver) {
  await expect(page.getByRole('heading',{name:'2024년 2월',exact:true})).toBeVisible();
  const table=page.getByRole('table');
  await expect(table).toHaveCount(1);
  expect(await table.evaluate(element=>element.tagName)).toBe('TABLE');
  await expect(table.getByRole('row')).toHaveCount(7);
  await expect(table.getByRole('cell')).toHaveCount(42);
  const bodyRows=table.locator(':scope > tbody > tr');
  await expect(bodyRows).toHaveCount(6);
  for(let row=0;row<6;row++) {
    const cells=bodyRows.nth(row).locator(':scope > td');
    await expect(cells).toHaveCount(7);
    for(let column=0;column<7;column++) {
      const cell=cells.nth(column);
      const day=cell.locator('button[type="button"]');
      await expect(day).toHaveCount(1);
      await expect(cell.getByRole('button')).toHaveCount(1);
      await expect(day).toBeVisible();
    }
  }
  await expect(table.getByRole('columnheader')).toHaveCount(7);
  for(const name of ['일요일','월요일','화요일','수요일','목요일','금요일','토요일']) {
    await expect(table.getByRole('columnheader',{name,exact:true})).toHaveAttribute('scope','col');
  }
  await expect(page.getByRole('dialog')).toHaveCount(0);
  await expect(page.getByRole('button',{name:'오늘',exact:true})).toHaveCount(0);
  await expect(table.getByRole('button',{pressed:true})).toHaveCount(0);
  expect(await driver.readEvents()).toEqual([]);
  await table.getByRole('button',{name:'2024년 2월 29일 목요일',exact:true}).click();
  const tentative=table.getByRole('button',{name:/^2024년 2월 29일 목요일(?:, 선택됨)?$/});
  await expect(tentative).toHaveAttribute('aria-pressed','true');
  expect(await driver.readEvents(),'Tentative date selection emits no value changes').toEqual([]);
  await page.getByRole('button',{name:'확인',exact:true}).click();
  expect(await driver.readEvents()).toEqual([{name:'valueChange',detail:{value:'2024-02-29'}}]);
}
