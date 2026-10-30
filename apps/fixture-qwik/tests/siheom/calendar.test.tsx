import { component$, useSignal } from '@builder.io/qwik';
import { actions, assertions, given, query, runSiheom } from '@siheom/qwik';
import { test } from 'vitest';
import { Button, Calendar, DateInput, Modal, NativeSelect, Tabs } from '@unofficial-krds/qwik';
test('native Calendar has a Korean full date and tentative selection', async () => { await runSiheom(given.render(<Calendar label="날짜 선택" referenceDate="2024-02-01"/>), actions.click(query.button('2024년 2월 29일 목요일')), assertions.textContent(query.button('확인'), '확인')); });
