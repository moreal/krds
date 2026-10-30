import { component$, useSignal } from '@builder.io/qwik';
import { DateInput, Tabs, type DateValue } from '@unofficial-krds/qwik';
import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/all.css';

/** Local state for focused review regressions; no app startup task or external state. */
export default component$(() => {
    const value = useSignal<DateValue>('2024-02-29');
    const requests = useSignal(0);
    const pending = useSignal(0);
    const accept = useSignal(false);
    const tabRequests = useSignal(0);
    const rangeValue = useSignal<DateValue>({ start: '2024-02-12', end: '2024-02-18' });
    const rangeRequests = useSignal(0);
    return <main>
        <h1>Qwik fix round 1</h1>
        <label><input type="checkbox" checked={accept.value} onChange$={(_, element) => accept.value = element.checked}/>Accept date requests</label>
        <output aria-label="Date policy">{accept.value ? 'accept' : 'reject'}</output>
        <form id="delayed-date-form">
            <DateInput id="delayed-date" label="Delayed date" name="visit" value={value.value} withCalendar={false}
                onValueChange$={async ({ value: next }) => {
                    requests.value++;
                    pending.value++;
                    await new Promise<void>(resolve => setTimeout(resolve, 500));
                    if (accept.value) value.value = next;
                    pending.value--;
                }}/>
            <button type="submit">Submit date</button>
        </form>
        <button id="date-outside" type="button">Outside date group</button>
        <output aria-label="Date requests">{requests.value}</output>
        <output aria-label="Pending date requests">{pending.value}</output>
        <output aria-label="Committed date">{typeof value.value === 'string' ? value.value : ''}</output>
        <form id="unchanged-range-form">
            <DateInput id="unchanged-range" label="Unchanged range" name="period" mode="range" value={rangeValue.value} withCalendar={false}
                onValueChange$={({ value: next }) => { rangeRequests.value++; rangeValue.value = next; }}/>
            <button type="submit">Submit unchanged range</button>
        </form>
        <output aria-label="Range requests">{rangeRequests.value}</output>
        <section id="hidden-tabs-container">
            <Tabs id="hidden-child-tabs" label="Panel usability" onValueChange$={() => tabRequests.value++}
                items={[
                    { value: 'first', label: 'Hidden first', content: <><button id="leading-tab-control" tabIndex={0} style={{ display: 'none' }}>Leading action</button><p>Panel information</p></> },
                    { value: 'second', label: 'Second tab', content: <p>Other information</p> },
                ]}/>
        </section>
        <button id="tabs-after" type="button" tabIndex={0}>After tabs</button>
        <output aria-label="Tab requests">{tabRequests.value}</output>
    </main>;
});
