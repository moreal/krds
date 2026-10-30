import { test as base, expect } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import { createFixtureDriver } from '@krds-native/test-contracts/driver';
import { serveProduction } from '../../../tools/testing/support.mjs';

// Use the same production server as the common runner; no dev server or HMR.
const test = base.extend<{}, { origin: string }>({
  origin: [async ({}, use) => {
    const directory = fileURLToPath(new URL('../dist/', import.meta.url));
    const server = await serveProduction(directory, { fixture: true });
    try { await use(server.origin); } finally { await server.close(); }
  }, { scope: 'worker' }],
});

test('native controlled state, disabled interaction, focus and event history', async ({ page, origin }) => {
  const errors: string[] = [];
  page.on('pageerror', error => errors.push(error.message));
  const driver = createFixtureDriver(page, origin);
  await driver.open({ framework: 'solid-next', componentId: '__probe', caseId: 'native-state' });
  await expect(page.getByRole('status', { name: 'Fixture health', exact: true })).toHaveText('ready');
  const button = page.getByRole('button', { name: 'Probe increment', exact: true });
  await button.click();
  await expect(page.getByRole('status', { name: 'Probe value', exact: true })).toHaveText('1');
  expect(await driver.readEvents()).toEqual([{ name: 'change', detail: { value: 1 } }]);
  await driver.setState({ count: 7, label: 'Updated probe', disabled: true });
  const updated = page.getByRole('button', { name: 'Updated probe', exact: true });
  await expect(updated).toBeDisabled();
  await updated.dispatchEvent('click');
  await expect(page.getByRole('status', { name: 'Probe value', exact: true })).toHaveText('7');
  expect(await driver.readEvents()).toHaveLength(1);
  await driver.setState({ disabled: false });
  await updated.focus();
  await expect(updated).toBeFocused();
  await page.keyboard.press('Enter');
  await expect(page.getByRole('status', { name: 'Probe value', exact: true })).toHaveText('8');
  expect(await driver.readEvents()).toEqual([
    { name: 'change', detail: { value: 1 } },
    { name: 'change', detail: { value: 8 } },
  ]);
  expect(await page.evaluate(() => window.__KRDS_FIXTURE__!.getState())).toMatchObject({ count: 8 });
  expect(errors).toEqual([]);
});

test('all canonical pilot routes stay healthy while declaring missing components', async ({ page, origin }) => {
  const driver = createFixtureDriver(page, origin);
  for (const [componentId, caseId] of [
    ['button', 'disabled'], ['native-select', 'controlled'], ['native-select', 'form-reset'],
    ['modal', 'focus-return'], ['modal', 'trigger-removed'], ['tabs', 'manual-activation'],
    ['date-input', 'leap-year'], ['date-input', 'ime'], ['date-input', 'timezone-invariance'],
  ]) {
    await driver.open({ framework: 'solid-next', componentId, caseId });
    await expect(page.getByRole('status', { name: 'Fixture health', exact: true })).toHaveText('ready');
    await expect(page.getByRole('note')).toHaveText(`Component not implemented: ${componentId}/${caseId}`);
    await driver.setState({ healthy: true });
    expect(await page.evaluate(() => window.__KRDS_FIXTURE__!.getState())).toEqual({ healthy: true });
    expect(await driver.readEvents()).toEqual([]);
  }
});

test('route navigation resets state and page lifecycle disposes the native root', async ({ page, origin }) => {
  const driver = createFixtureDriver(page, origin);
  const probe = { framework: 'solid-next', componentId: '__probe', caseId: 'native-state' } as const;
  await driver.open(probe);
  await page.getByRole('button', { name: 'Probe increment', exact: true }).click();
  await driver.open({ framework: 'solid-next', componentId: 'button', caseId: 'disabled' });
  expect(await driver.readEvents()).toEqual([]);
  await driver.open(probe);
  await expect(page.getByRole('status', { name: 'Probe value', exact: true })).toHaveText('0');
  expect(await driver.readEvents()).toEqual([]);
  await page.evaluate(() => window.dispatchEvent(new PageTransitionEvent('pagehide')));
  expect(await page.evaluate(() => window.__KRDS_FIXTURE__)).toBeUndefined();
  await expect(page.getByRole('button')).toHaveCount(0);
});
