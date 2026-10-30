import { test } from 'vitest';
import { openPilot, assertions, query, runSiheom } from './pilot-fixture';
for (const caseId of ['controlled', 'form-reset'])
    test(`native select ${caseId} after healthy fixture mount`, async () => {
        await openPilot('native-select', caseId);
        await runSiheom(assertions.value(query.combobox('지역'), 'seoul'));
    });
