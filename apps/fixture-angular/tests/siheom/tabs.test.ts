import { test } from 'vitest';
import { openPilot, assertions, query, runSiheom } from './pilot-fixture';
test('manual tabs activation after healthy fixture mount', async () => {
    await openPilot('tabs', 'manual-activation');
    await runSiheom(assertions.selected(query.tab('첫 번째')));
});
