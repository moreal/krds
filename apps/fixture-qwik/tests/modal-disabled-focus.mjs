import {chromium}from 'playwright';
import {expect}from '@playwright/test';
import {resolve}from 'node:path';
import {pathToFileURL}from 'node:url';
const production=process.env.KRDS_MODAL_FOCUS_PRODUCTION;
const {startProductionSsr}=await import(production?pathToFileURL(resolve(production,'server.mjs')):new URL('../server.mjs',import.meta.url));
const server=await startProductionSsr(),browser=await chromium.launch();
try{const page=await browser.newPage();await page.goto(server.origin+'/examples/consent-confirmation?case=retry-in-dialog');await page.locator('#example-consent-review').click();const modal=page.getByRole('dialog',{name:'예제 선택 확인'});await expect(modal).toBeVisible();await page.locator('#example-consent-confirm').click();await page.locator('[data-krds-component="spinner"] progress').waitFor();await expect(page.locator('#example-consent-confirm')).toBeDisabled();await expect.poll(()=>modal.evaluate(node=>node.contains(node.ownerDocument.activeElement)),{timeout:2000,message:'Open native Modal retains focus after its active child becomes disabled'}).toBe(true);console.log('Actual native Modal disabled-active-descendant focus recovery: passed');}finally{await browser.close();await server.close();}
