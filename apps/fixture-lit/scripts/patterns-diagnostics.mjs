import { chromium } from 'playwright';
import { writeFile } from 'node:fs/promises';
import { serveProduction, root } from '../../../tools/testing/support.mjs';
const server = await serveProduction(root + '/apps/fixture-lit/dist', { fixture: true });
const browser = await chromium.launch();
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on('pageerror', error => errors.push(error.stack ?? String(error)));
try {
    await page.goto(server.origin + '/examples/search-results?case=filter-resets-page');
    await page.waitForSelector('krds-structured-list');
    const rows = await page.locator('krds-structured-list [data-krds-part="item"]').evaluateAll(elements => elements.map(element => ({ id: element.id, dataItemId: element.getAttribute('data-item-id'), text: element.textContent })));
    await page.goto(server.origin + '/examples/form-errors?case=reset-cancels-pending');
    await page.locator('#example-form-submit button').click();
    await page.locator('#example-form-reset button').click();
    await writeFile(root + '/.superpowers/sdd/PLAN/t11-lit-logs/02-native-diagnostics-red.json', JSON.stringify({ snapshot: server.snapshot, rows, errors }, null, 2));
    console.log(JSON.stringify({ snapshot: server.snapshot.sha256, rows, errors }, null, 2));
}
finally {
    await context.close();
    await browser.close();
    await server.close();
}
