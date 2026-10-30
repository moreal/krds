import { component$, useSignal } from '@builder.io/qwik';
import { actions, assertions, given, query, runSiheom } from '@siheom/qwik';
import { test } from 'vitest';
import { Button, Calendar, DateInput, Modal, NativeSelect, Tabs } from '@unofficial-krds/qwik';
const SelectExample = component$(() => { const value = useSignal('seoul'); return <><NativeSelect label="지역" value={value.value} options={[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }]} onValueChange$={({ value: next }) => value.value = next}/><button onClick$={() => value.value = 'busan'}>외부 갱신</button></>; });
test('native Select follows an external controlled prop', async () => { await runSiheom(given.render(<SelectExample />), actions.click(query.button('외부 갱신')), assertions.value(query.combobox('지역'), 'busan')); });
