import { test } from 'vitest';
import { openPilot, actions, query, runSiheom } from './pilot-fixture';
for (const caseId of ['leap-year', 'ime', 'timezone-invariance'])
    test(`date input ${caseId} after healthy fixture mount`, async () => {
        await openPilot('date-input', caseId);
        await runSiheom(actions.fill(query.textbox('날짜'), '2023-02-29'));
    });
