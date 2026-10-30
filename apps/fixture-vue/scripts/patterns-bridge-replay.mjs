import assert from 'node:assert/strict';
import {writeFile} from 'node:fs/promises';
import {join,resolve} from 'node:path';
import {chromium} from 'playwright';
import {expect} from '@playwright/test';
import {serveProduction,root} from '../../../tools/testing/support.mjs';
if(process.env.PLAYWRIGHT_BROWSERS_PATH!=='/private/tmp/krds-playwright-1.64.1')throw new Error('Use the selected browser cache before execution.');
const server=await serveProduction(resolve(process.env.KRDS_PATTERN_DIST??join(root,'apps/fixture-vue/dist')),{fixture:true});const browser=await chromium.launch();const page=await browser.newPage();
try{
 await page.goto(server.origin+'/examples/form-errors?case=retry-success');await page.waitForFunction(()=>window.__KRDS_FIXTURE__);
 await page.locator('#example-form-submit').click();await page.evaluate(()=>window.__KRDS_FIXTURE__.setState({__patternCommand:{sequence:1,command:'settle'}}));await expect(page.locator('#example-form-retry')).toBeVisible();
 const snapshot=await page.evaluate(()=>window.__KRDS_FIXTURE__.getState());await page.locator('#example-form-retry').click();await expect(page.locator('form')).toHaveAttribute('aria-busy','true');
 await page.evaluate(snapshot=>window.__KRDS_FIXTURE__.setState(snapshot),snapshot);await expect(page.locator('form')).toHaveAttribute('aria-busy','true');await expect(page.getByText('DEMO-FORM-001',{exact:false})).toHaveCount(0);
 const requests=await page.evaluate(()=>window.__KRDS_FIXTURE__.readEvents());assert.equal(requests.length,2);assert.ok(requests.every(event=>event.name==='pattern:request'));
 await page.evaluate(()=>window.__KRDS_FIXTURE__.setState({__patternCommand:{sequence:2,command:'settle'}}));await expect(page.getByRole('status').filter({hasText:'DEMO-FORM-001'})).toBeVisible();
 const result={pass:true,browserVersion:browser.version(),browserCache:process.env.PLAYWRIGHT_BROWSERS_PATH,artifact:server.snapshot,requests,replayedSnapshot:snapshot};await writeFile(join(root,'.superpowers/sdd/PLAN/t11-vue-logs/39-bridge-replay.json'),JSON.stringify(result,null,2));console.log('PASS real UI retry remains loading when previous command/snapshot is replayed; next sequence settles once.');
}finally{await browser.close();await server.close();}
