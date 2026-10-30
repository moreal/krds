import {expect} from '@playwright/test';
import {createFixtureDriver} from '../../packages/test-contracts/dist/driver.js';

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
