import { component$, useSignal } from '@builder.io/qwik';
import { actions, assertions, given, query, runSiheom } from '@siheom/qwik';
import { test } from 'vitest';
import { Button, Calendar, DateInput, Modal, NativeSelect, Tabs } from '@unofficial-krds/qwik';
test('native Tabs selects second local panel once', async () => { await runSiheom(given.render(<Tabs label="정보" items={[{ value: 'a', label: '첫 번째', content: <p>첫 번째 내용</p> }, { value: 'b', label: '두 번째', content: <p>두 번째 내용</p> }]}/>), actions.click(query.tab('두 번째')), assertions.textContent(query.tabpanel('두 번째'), '두 번째 내용')); });
