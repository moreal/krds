/** Canonical missing-component RED gates, separate from infrastructure probes and stories. */
import { expect, test } from 'vitest';
import { assertions, createReactSiheom, given, query } from '@siheom/react';
import { FixtureApp } from '../../src/FixtureApp';
const { runSiheom } = createReactSiheom();
test.each(['focus-return', 'trigger-removed'])('modal/%s requires the actual KRDS component', async (caseId) => {
  await runSiheom(
    given.render(<FixtureApp componentId="modal" caseId={caseId} />),
    assertions.textContent(query.status('Fixture health'), 'ready'),
  );
  expect(window.__KRDS_FIXTURE__?.framework).toBe('react');
  expect(window.__KRDS_FIXTURE__?.protocol).toBe(1);
  await runSiheom(assertions.visible(query.button('열기')));
});
