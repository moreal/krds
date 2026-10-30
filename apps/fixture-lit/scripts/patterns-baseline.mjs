import { chromium } from 'playwright';
import { writeFile, mkdir } from 'node:fs/promises';
import { serveProduction, root } from '../../../tools/testing/support.mjs';
const server = await serveProduction(root + '/apps/fixture-lit/dist', { fixture: true });
const browser = await chromium.launch();
const page = await browser.newPage();
try {
    await page.goto(server.origin + '/examples/form-errors?case=error-summary-focus');
    await page.waitForTimeout(100);
    const result = { snapshot: server.snapshot, nativeHostCount: await page.locator('krds-pattern-host').count(), body: await page.locator('body').innerText() };
    await mkdir(root + '/.superpowers/sdd/PLAN/t11-lit-logs', { recursive: true });
    await writeFile(root + '/.superpowers/sdd/PLAN/t11-lit-logs/01-browser-red.json', JSON.stringify(result, null, 2));
    if (result.nativeHostCount !== 0)
        throw new Error('Expected missing native route baseline');
    console.log('RED native pattern route absent', server.snapshot.sha256);
}
finally {
    await browser.close();
    await server.close();
}
