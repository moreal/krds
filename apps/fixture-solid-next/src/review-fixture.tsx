import { createSignal, flush, onSettled, Show, untrack } from 'solid-js';
import { Button, DateInput, Modal, Tabs } from '@unofficial-krds/solid-next';

declare global {
    interface Window {
        __KRDS_REVIEW__?: {
            setOuter(open: boolean): void;
            setInner(open: boolean): void;
            mountOuter(mounted: boolean): void;
        };
    }
}

/** Local regression fixtures; no bridge callback changes the notification under test. */
export function ReviewFixture(props: { scenario: string }) {
    const scenario = untrack(() => props.scenario);
    const record = (name: string, detail: unknown) => window.__KRDS_FIXTURE__?.recordEvent(name, detail);
    const [snapshot, setSnapshot] = createSignal('');
    const [outer, setOuter] = createSignal(false);
    const [inner, setInner] = createSignal(false);
    const [mounted, setMounted] = createSignal(true);
    let form!: HTMLFormElement;
    let notifications = 0;

    onSettled(() => {
        window.__KRDS_REVIEW__ = {
            setOuter(open) { setOuter(open); flush(); },
            setInner(open) { setInner(open); flush(); },
            mountOuter(value) { setMounted(value); flush(); },
        };
        return () => { delete window.__KRDS_REVIEW__; };
    });

    return <main>
        <h1>Solid 2 review regressions</h1>
        <p role="status" aria-label="Fixture health">ready</p>
        {scenario === 'uncontrolled' ? <>
            <form ref={element => { form = element; }}>
                <DateInput label="날짜" name="date" defaultValue="2024-02-29" withCalendar={false}
                    onValueChange={detail => {
                        setSnapshot(JSON.stringify({ count: ++notifications, detail, form: Object.fromEntries(new FormData(form)) }));
                    }} />
            </form>
            <output role="status" aria-label="Callback snapshot">{snapshot()}</output>
        </> : <>
            <Button id="review-return">외부 작업</Button>
            <Button onClick={() => { setOuter(true); }}>바깥 열기</Button>
            <Show when={mounted()}>
                <Modal title="바깥" open={outer()} returnFocusId="review-return"
                    onOpenChange={detail => { record('outerOpenChange', detail); setOuter(detail.open); }}
                    actions={scenario === 'actions-slot' ?
                        <DateInput label="작업 날짜" defaultValue="2024-02-29" referenceDate="2024-02-01"
                            onValueChange={detail => { record('actionsValueChange', detail); }} /> : undefined}>
                    <Button onClick={() => { setInner(true); }}>안쪽 열기</Button>
                    <DateInput label="날짜" defaultValue="2024-02-29" referenceDate="2024-02-01" onValueChange={detail => { record('valueChange', detail); }} />
                    <Show when={scenario === 'panel-entry'}>
                        <Tabs id="review-nested-tabs" label="중첩 정보" defaultValue="input" items={[
                            { value: 'text', label: '설명', content: '설명 내용' },
                            { value: 'input', label: '입력', content: <input aria-label="중첩 패널 입력" /> },
                        ]} />
                    </Show>
                </Modal>
            </Show>
            <Modal title="안쪽" open={inner()} returnFocusId="review-return"
                onOpenChange={detail => { record('innerOpenChange', detail); setInner(detail.open); }}>
                <p>독립된 안쪽 모달</p>
            </Modal>
        </>}
    </main>;
}
