import { chromium } from 'playwright';
import { serveProduction, browserPath } from '../../../../tools/testing/support.mjs';
process.env.PLAYWRIGHT_BROWSERS_PATH = browserPath;
const server = await serveProduction('apps/storybook-angular/dist');
const browser = await chromium.launch();
const page = await browser.newPage();
page.on('console', message => { if (message.type() === 'error' || message.type() === 'warn') console.log(message.type(), message.text()); });
page.on('pageerror', error => console.log('pageerror', String(error)));
try {
  await page.goto(`${server.origin}/iframe.html?id=infrastructure-native-probe--default&viewMode=story`, { waitUntil: 'networkidle' });
  await page.waitForFunction(() => document.querySelector('.sb-errordisplay')?.textContent || document.querySelector('krds-story-native-probe'), { timeout: 5000 }).catch(() => {});
  console.log('BODY', await page.locator('body').innerText());
  await page.screenshot({ path: '.superpowers/sdd/PLAN/t05-angular-logs/story-debug.png' });
} finally { await browser.close(); await server.close(); }
