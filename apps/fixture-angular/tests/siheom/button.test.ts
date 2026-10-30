import { test } from 'vitest';
import { openPilot, assertions, query, runSiheom } from './pilot-fixture';
test('disabled button is unavailable after healthy native fixture mount', async () => {
    await openPilot('button', 'disabled');
    await runSiheom(assertions.disabled(query.button('저장')));
});
