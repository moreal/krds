import { component$, useSignal } from '@builder.io/qwik';
import { actions, assertions, given, query, runSiheom } from '@siheom/qwik';
import { test } from 'vitest';
import { Button, Calendar, DateInput, Modal, NativeSelect, Tabs } from '@unofficial-krds/qwik';
const ButtonExample = component$(() => { const count = useSignal(0); return <><Button onClick$={() => count.value++}>저장</Button><Button disabled onClick$={() => count.value++}>비활성</Button><div role="status" aria-label="횟수">{count.value}</div></>; });
test('native Button emits once and disabled activation emits none', async () => { await runSiheom(given.render(<ButtonExample />), actions.click(query.button('저장')), assertions.textContent(query.status('횟수'), '1'), assertions.disabled(query.button('비활성'))); });
