import { component$, useSignal } from '@builder.io/qwik';
import { actions, assertions, given, query, runSiheom } from '@siheom/qwik';
import { test } from 'vitest';
import { Button, Calendar, DateInput, Modal, NativeSelect, Tabs } from '@unofficial-krds/qwik';
const ModalExample = component$(() => { const open = useSignal(false); return <><Button onClick$={() => open.value = true}>열기</Button><Modal title="확인" open={open.value} onOpenChange$={({ open: next }) => open.value = next}><p>확인할 내용</p></Modal></>; });
test('native Modal opens and its explicit close action closes', async () => { await runSiheom(given.render(<ModalExample />), actions.click(query.button('열기')), assertions.textContent(query.button('닫기'), '×'), actions.click(query.button('닫기'))); });
