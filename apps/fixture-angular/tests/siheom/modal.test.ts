import { test } from 'vitest';
import { openPilot, actions, query, runSiheom } from './pilot-fixture';
for (const caseId of ['focus-return', 'trigger-removed'])
    test(`modal ${caseId} after healthy fixture mount`, async () => {
        await openPilot('modal', caseId);
        await runSiheom(actions.click(query.button('열기')));
    });
