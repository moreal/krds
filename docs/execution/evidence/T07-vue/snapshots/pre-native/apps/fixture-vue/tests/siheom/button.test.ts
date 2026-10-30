/** Canonical pilot behavior remains RED until the owning component task ships. */
import { expect, test } from 'vitest';
import { actions, assertions, given, query, runSiheom } from '@siheom/vue';
import { FixtureApp } from '../../src/FixtureApp';

test('button/disabled: healthy route must expose the actual disabled KRDS button', async () => {
  history.replaceState(null, '', '/fixtures/button?case=disabled');
  await runSiheom(given.render(FixtureApp), assertions.textContent(query.status('Fixture health'), 'ready'));
  expect(window.__KRDS_FIXTURE__?.framework).toBe('vue');
  await window.__KRDS_FIXTURE__!.setState({ disabled: true, label: '저장' });
  await runSiheom(assertions.disabled(query.button('저장')), actions.click(query.button('저장')));
  expect(window.__KRDS_FIXTURE__!.readEvents()).toEqual([]);
});
