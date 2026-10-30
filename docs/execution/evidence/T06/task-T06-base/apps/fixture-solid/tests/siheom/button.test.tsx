import { expect, test } from 'vitest';
import { assertions, given, query, runSiheom } from '@siheom/solid';
import { FixtureApp } from '../../src/fixture-app';

test('disabled button pilot is RED after native health and bridge succeed', async () => {
  await runSiheom(given.render(() => <FixtureApp componentId="button" caseId="disabled" />), assertions.textContent(query.status('Fixture health'), 'ready'));
  expect(window.__KRDS_FIXTURE__?.framework).toBe('solid');
  expect(window.__KRDS_FIXTURE__?.protocol).toBe(1);
  await runSiheom(assertions.disabled(query.button('저장')));
});
