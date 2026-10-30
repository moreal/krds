import test from 'node:test';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { browserPath, serveProduction } from '../../../../tools/testing/support.mjs';

process.env.PLAYWRIGHT_BROWSERS_PATH ??= browserPath;

// Removing the Lit state subscription, click event or teardown must break this test.
test('Lit production probe updates through its bridge and disposes on native disconnect', async () => {
  const server = await serveProduction(new URL('../../dist', import.meta.url).pathname, { fixture: true });
  let browser;
  try {
    browser = await chromium.launch();
    const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, locale: 'ko-KR', timezoneId: 'Asia/Seoul', colorScheme: 'light', reducedMotion: 'reduce' });
    await page.goto(`${server.origin}/fixtures/__probe?case=native-state`);
    await page.getByRole('status', { name: 'Fixture health' }).waitFor({ timeout: 5000 });
    assert.deepEqual(await page.evaluate(() => ({ protocol: window.__KRDS_FIXTURE__.protocol, framework: window.__KRDS_FIXTURE__.framework })), { protocol: 1, framework: 'lit' });
    const value = page.getByRole('status', { name: 'Probe value' });
    assert.equal(await value.textContent(), '0');
    await page.getByRole('button', { name: 'Probe increment', exact: true }).click();
    assert.equal(await value.textContent(), '1');
    await page.evaluate(() => window.__KRDS_FIXTURE__.setState({ count: 7, label: 'Updated probe' }));
    await page.getByRole('button', { name: 'Updated probe', exact: true }).click();
    assert.equal(await value.textContent(), '8');
    assert.deepEqual(await page.evaluate(() => window.__KRDS_FIXTURE__.readEvents()), [{ name: 'change', detail: { value: 1 } }, { name: 'change', detail: { value: 8 } }]);
    assert.equal(await page.evaluate(() => window.__KRDS_FIXTURE__.getState().count), 8);
    await page.evaluate(() => window.__KRDS_FIXTURE__.setState({ disabled: true }));
    assert.equal(await page.getByRole('button', { name: 'Updated probe' }).isDisabled(), true);
    await page.evaluate(() => window.__KRDS_FIXTURE__.setState({ disabled: false }));
    await page.getByRole('button', { name: 'Updated probe' }).focus();
    assert.equal(await page.getByRole('button', { name: 'Updated probe' }).evaluate(button => button === button.getRootNode().activeElement), true);
    await page.evaluate(() => document.querySelector('krds-lit-fixture').remove());
    assert.equal(await page.evaluate(() => window.__KRDS_FIXTURE__ === undefined), true);
    await page.goto(`${server.origin}/fixtures/button?case=disabled`);
    await page.getByRole('status', { name: 'Fixture health' }).waitFor();
    assert.equal(await page.getByRole('note').textContent(), 'Component not implemented: button/disabled');
    assert.deepEqual(await page.evaluate(() => window.__KRDS_FIXTURE__.readEvents()), []);
    assert.equal(await page.getByRole('button').count(), 0);
  } finally {
    await browser?.close();
    await server.close();
  }
});
