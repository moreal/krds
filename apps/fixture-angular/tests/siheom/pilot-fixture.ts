import { actions, assertions, given, query, runSiheom } from '@siheom/angular';
import { expect } from 'vitest';
import { FixtureApplication } from '../../src/fixture-app';
/** Verify the native route and bridge before exercising the pilot. */
export async function openPilot(componentId: string, caseId: string) {
    history.replaceState(null, '', `/fixtures/${componentId}?case=${caseId}`);
    await runSiheom(given.render(FixtureApplication), assertions.textContent(query.status('Fixture health'), 'ready'));
    expect(window.__KRDS_FIXTURE__?.protocol).toBe(1);
    expect(window.__KRDS_FIXTURE__?.framework).toBe('angular');
}
export { actions, assertions, query, runSiheom };
