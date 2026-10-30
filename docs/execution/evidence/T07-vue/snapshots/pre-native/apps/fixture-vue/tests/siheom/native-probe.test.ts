/** Actual @siheom/vue rendering; default adapter input is synthetic user-event. */
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { cleanup } from '@testing-library/vue';
import { screen } from '@testing-library/dom';
import { actions, assertions, given, query, runSiheom } from '@siheom/vue';
import { FixtureApp } from '../../src/FixtureApp';

function openProbe() {
  history.replaceState(null, '', '/fixtures/__probe?case=native-state');
}

test('native render, click, controlled state, disabled input and cleanup', async () => {
  openProbe();
  await runSiheom(
    given.render(FixtureApp),
    assertions.textContent(query.status('Fixture health'), 'ready'),
    assertions.textContent(query.status('Probe value'), '0'),
    actions.click(query.button('Probe increment')),
    assertions.textContent(query.status('Probe value'), '1'),
  );
  const bridge = window.__KRDS_FIXTURE__!;
  expect(bridge.framework).toBe('vue');
  expect(bridge.readEvents()).toEqual([{ name: 'change', detail: { value: 1 } }]);
  await bridge.setState({ count: 7, label: 'Updated probe' });
  await runSiheom(
    assertions.textContent(query.status('Probe value'), '7'),
    actions.click(query.button('Updated probe')),
    assertions.textContent(query.status('Probe value'), '8'),
  );
  expect(bridge.getState().count).toBe(8);
  await bridge.setState({ disabled: true });
  await runSiheom(assertions.disabled(query.button('Updated probe')), actions.click(query.button('Updated probe')));
  expect(bridge.getState().count).toBe(8);
  expect(bridge.readEvents()).toHaveLength(2);
  cleanup();
  expect(screen.queryByRole('button', { name: 'Updated probe' })).toBeNull();
  expect(window.__KRDS_FIXTURE__).toBeUndefined();
  expect(() => bridge.recordEvent('late', {})).toThrow('disposed');
});

test('real provider click focus is checked separately with the published adapter', async () => {
  openProbe();
  await runSiheom(given.render(FixtureApp));
  await page.getByRole('button', { name: 'Probe increment', exact: true }).click();
  await runSiheom(assertions.focused(query.button('Probe increment')));
});
