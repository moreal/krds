import { component$, useSignal } from '@builder.io/qwik';
import { actions, assertions, given, query, runSiheom } from '@siheom/qwik';
import { test } from 'vitest';
import { Button, Calendar, DateInput, Modal, NativeSelect, Tabs } from '@unofficial-krds/qwik';
test('native DateInput preserves a raw invalid draft', async () => { await runSiheom(given.render(<DateInput label="날짜" withCalendar={false}/>), actions.fill(query.textbox('날짜'), '2023-02-29'), actions.tab(query.textbox('날짜')), assertions.value(query.textbox('날짜'), '2023-02-29')); });
