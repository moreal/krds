import { test } from 'vitest';
import { openPilot, assertions, query, runSiheom } from './pilot-fixture';
test('calendar has a selectable leap day and confirmation after healthy mount', async () => {
    await openPilot('calendar', 'selection-confirm');
    await runSiheom(assertions.visible(query.button('2024년 2월 29일 목요일')), assertions.visible(query.button('확인')));
});
