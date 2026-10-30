import { expect, test } from 'vitest';
import { cleanup } from '@solidjs/testing-library';
import { actions, assertions, given, query, runSiheom } from '@siheom/solid';
import { FixtureApp } from '../../src/fixture-app';

const Probe = () => <FixtureApp componentId="__probe" caseId="native-state" />;
const button = query.button('Probe increment');
const value = query.status('Probe value');

test('native adapter renders, clicks, applies controlled bridge updates and cleans up', async () => {
  await runSiheom(given.render(Probe), assertions.textContent(value, '0'), actions.click(button), assertions.textContent(value, '1'));
  expect(window.__KRDS_FIXTURE__?.readEvents()).toEqual([{ name: 'change', detail: { value: 1 } }]);
  await window.__KRDS_FIXTURE__!.setState({ count: 7, label: 'Updated probe' });
  await runSiheom(assertions.textContent(value, '7'), actions.click(query.button('Updated probe')), assertions.textContent(value, '8'));
  await window.__KRDS_FIXTURE__!.setState({ disabled: true });
  await runSiheom(assertions.disabled(query.button('Updated probe')), actions.click(query.button('Updated probe')), assertions.textContent(value, '8'));
  expect(window.__KRDS_FIXTURE__?.readEvents()).toEqual([{ name: 'change', detail: { value: 1 } }, { name: 'change', detail: { value: 8 } }]);
  const bridge = window.__KRDS_FIXTURE__!;
  expect(bridge.getState().count).toBe(8);
  cleanup();
  expect(document.querySelector('[aria-label="Probe value"]')).toBeNull();
  expect(window.__KRDS_FIXTURE__).toBeUndefined();
  await expect(bridge.setState({ count: 10 })).rejects.toThrow('Fixture bridge disposed');
});

test('native adapter reports focus separately after its synthetic click', async () => {
  await runSiheom(given.render(Probe), actions.click(button), assertions.focused(button));
});
