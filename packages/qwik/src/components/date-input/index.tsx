import { useKrdsEnvironment } from '../../providers';
import { $, component$, sync$, useComputed$, useId, useOnDocument, useSignal, useTask$, useVisibleTask$, type JSXChildren, type QRL } from '@builder.io/qwik';
import { isServer } from '@builder.io/qwik/build';
import type { ValueChangeDetails } from '@unofficial-krds/contracts';
import { attrs, controlMode, copyValue, dateConfig, emptyValue, endpoints, sameValue, states, textFor, validateValue, type DateValue, type Locale } from '../../internal/behavior';
import { initializeKeyboardBoundary, preventDateEnter } from '../../internal/event-props';
import { Calendar, type CalendarTranslations } from '../calendar';
import { registerModalLayer } from '../../internal/modal-service';
import { restore } from '../../internal/catalog';
import { dateFields, dateTranslations, mirrorValidity, readDraft, sameDraft, validateDraft, type DateInputTranslations, type Validation } from './model';
export type { DateInputTranslations } from './model';
export interface DateInputProps {
    id?: string;
    mode?: 'single' | 'range';
    value?: DateValue;
    defaultValue?: DateValue;
    onValueChange$?: QRL<(detail: ValueChangeDetails<DateValue>) => void>;
    label: JSXChildren;
    name?: string;
    form?: string;
    autocomplete?: string;
    returnFocusId?: string;
    hint?: JSXChildren;
    error?: JSXChildren;
    invalid?: boolean;
    required?: boolean;
    disabled?: boolean;
    min?: string;
    max?: string;
    locale?: Locale;
    translations?: Partial<DateInputTranslations>;
    calendarTranslations?: Partial<CalendarTranslations>;
    withCalendar?: boolean;
    referenceDate?: string;
    today?: string;
}
interface CommitOperation {
    id: number;
    revision: number;
    raw: [string, string];
    value: DateValue;
}
const compositionStart = sync$((_: CompositionEvent, element: HTMLInputElement) => { element.dataset.krdsComposing = 'true'; element.setCustomValidity(''); });
const compositionEnd = sync$((_: CompositionEvent, element: HTMLInputElement) => { delete element.dataset.krdsComposing; });
export const DateInput = component$<DateInputProps>((props) => {
    const environment = useKrdsEnvironment();
    useOnDocument('qinit', initializeKeyboardBoundary);
    const generated = useId(), id = props.id ?? `krds-date-${generated}`, range = props.mode === 'range', controlled = props.value !== undefined;
    controlMode(props.value, props.defaultValue, controlled);
    if (props.mode !== undefined && !['single', 'range'].includes(props.mode))
        throw new TypeError('Invalid date mode');
    if (props.label == null || props.label === '')
        throw new TypeError('DateInput requires a task label');
    const config = useComputed$(() => dateConfig(props)), t = useComputed$(() => dateTranslations(props.locale ?? environment.locale, props.translations));
    const initial = copyValue(validateValue(props.value !== undefined ? props.value : (props.defaultValue !== undefined ? props.defaultValue : emptyValue(range)), range, config.value.min, config.value.max));
    const internal = useSignal<DateValue>(initial), draft = useSignal<[
        string,
        string
    ]>(textFor(initial)), error = useSignal<Validation | null>(null), open = useSignal(false), composing = useSignal(false);
    const editRevision = useSignal(0), requestSequence = useSignal(0);
    const inFlight = useSignal<CommitOperation[]>([]);
    const committed = useComputed$(() => {
        controlMode(props.value, props.defaultValue, controlled);
        if ((props.mode === 'range') !== range)
            throw new TypeError('Date mode is immutable');
        return validateValue(controlled ? props.value! : internal.value, range, config.value.min, config.value.max);
    });
    useTask$(({ track }) => {
        const value = track(() => committed.value);
        const acknowledged = inFlight.value.filter(operation => sameValue(operation.value, value)).at(-1);
        const currentRaw = isServer ? draft.value : readDraft(id);
        // A parent may accept an older request after the user has already edited again.
        // Update the canonical prop, while preserving that newer local draft.
        if (acknowledged && (acknowledged.revision !== editRevision.value || !sameDraft(currentRaw, acknowledged.raw)
            || !isServer && (composing.value || dateFields(id).some(input => input.dataset.krdsComposing === 'true')))) return;
        if (!acknowledged && inFlight.value.length) requestSequence.value++;
        draft.value = textFor(value);
        error.value = null;
        if (!isServer) {
            dateFields(id).forEach((input, index) => { input.value = textFor(value)[index]; });
            mirrorValidity(id, validateDraft(textFor(value), range, !!props.required, config.value.min, config.value.max, t.value), !!props.disabled);
        }
    });
    const replace = $(async (value: DateValue, operation?: CommitOperation) => {
        if (operation && (operation.id !== requestSequence.value || operation.revision !== editRevision.value
            || !sameDraft(readDraft(id), operation.raw) || composing.value
            || dateFields(id).some(input => input.dataset.krdsComposing === 'true'))) return false;
        if (!operation) {
            // Reset invalidates completions of requests that were already running.
            requestSequence.value++;
            inFlight.value = [];
        }
        editRevision.value++;
        draft.value = textFor(value);
        error.value = null;
        dateFields(id).forEach((input, index) => { input.value = textFor(value)[index]; });
        mirrorValidity(id, validateDraft(textFor(value), range, !!props.required, config.value.min, config.value.max, t.value), !!props.disabled);
        return true;
    });
    // A native reset can precede visibility-task installation. Register through the
    // serialized document event path so the first cold reset reaches this owner too.
    useOnDocument('reset', $((event: Event) => {
        const first = dateFields(id)[0];
        if (!first || event.target !== first.form) return;
        queueMicrotask(() => {
            if (event.defaultPrevented) return;
            if (!controlled) internal.value = copyValue(initial);
            void replace(controlled ? props.value! : initial);
            open.value = false;
        });
    }));
    const commitValue = $(async (value: DateValue, sourceRaw?: [string, string], sourceRevision?: number) => {
        const raw = sourceRaw ?? readDraft(id), revision = sourceRevision ?? editRevision.value;
        if (inFlight.value.some(operation => operation.revision === revision && sameDraft(operation.raw, raw) && sameValue(operation.value, value))) return false;
        if (sameValue(value, committed.value)) {
            // An unchanged value needs no parent acknowledgement or blocking work.
            // Keep reconciliation guarded, so a later raw edit still wins.
            await replace(committed.value, { id: requestSequence.value, revision, raw, value: copyValue(value) });
            return sameValue(value, controlled ? props.value! : internal.value);
        }
        const operation: CommitOperation = { id: ++requestSequence.value, revision, raw, value: copyValue(value) };
        // Only plain operation metadata is serialized; no Promise or DOM reference is stored.
        inFlight.value = [...inFlight.value, operation];
        try {
            if (!sameValue(value, committed.value)) {
                if (!controlled) internal.value = copyValue(value);
                await props.onValueChange$?.({ value: copyValue(value) });
            }
            // Parent props become authoritative after its QRL and the ensuing render.
            await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
            const current = controlled ? props.value! : internal.value;
            await replace(current, operation);
            return sameValue(value, current);
        } finally {
            inFlight.value = inFlight.value.filter(pending => pending.id !== operation.id);
        }
    });
    const commit = $(async () => {
        if (props.disabled || composing.value || dateFields(id).some(input => input.dataset.krdsComposing === 'true'))
            return false;
        const raw = readDraft(id);
        if (!sameDraft(raw, draft.value)) editRevision.value++;
        draft.value = raw;
        const result = validateDraft(raw, range, !!props.required, config.value.min, config.value.max, t.value);
        mirrorValidity(id, result, !!props.disabled);
        if (result.message) {
            error.value = result;
            return false;
        }
        return commitValue(result.value!, raw, editRevision.value);
    });
    const close = $(async () => { open.value = false; });
    // The native modal dialog owns the top layer, focus containment and Escape; the shared layer stack keeps an
    // ancestor Modal from handling the same keys and restores the opener once the popup has left the document.
    useVisibleTask$(({ track, cleanup }) => {
        if (!track(() => open.value))
            return;
        const dialog = document.getElementById(`${id}-popup`) as HTMLDialogElement | null;
        if (!dialog)
            return;
        if (!dialog.open)
            dialog.showModal();
        const layer = registerModalLayer(dialog, dialog), fallbackId = props.returnFocusId;
        const cancel = (event: Event) => { event.preventDefault(); if (!composing.value) open.value = false; };
        const closed = () => { if (open.value) open.value = false; };
        dialog.addEventListener('cancel', cancel);
        dialog.addEventListener('close', closed);
        cleanup(() => {
            dialog.removeEventListener('cancel', cancel);
            dialog.removeEventListener('close', closed);
            layer.dispose();
            if (dialog.isConnected && dialog.open)
                dialog.close();
            // The calendar trigger is the popup's only opener; returnFocusId is the host fallback when it is unavailable.
            queueMicrotask(() => restore(`${id}-trigger`, fallbackId));
        });
    }, { strategy: 'document-ready' });
    // Native form events need synchronous validity/default handling. This task installs only
    // form listeners; text commits, popup actions and parent callbacks remain QRLs.
    useVisibleTask$(({ track, cleanup }) => {
        track(() => props.form);
        track(() => props.disabled);
        const first = dateFields(id)[0], form = first?.form;
        if (!first)
            return;
        const currentValidation = () => validateDraft(readDraft(id), range, !!props.required, config.value.min, config.value.max, t.value);
        const input = (event: Event) => {
            if (!(event.target instanceof HTMLInputElement) || !dateFields(id).includes(event.target) || props.disabled) return;
            const raw = readDraft(id);
            if (!sameDraft(raw, draft.value)) { editRevision.value++; draft.value = raw; }
            if (event.target.dataset.krdsComposing === 'true' || composing.value) return;
            mirrorValidity(id, currentValidation(), !!props.disabled);
        };
        const submit = (event: Event) => {
            if (props.disabled) return;
            if (composing.value || dateFields(id).some(input => input.dataset.krdsComposing === 'true')) { event.preventDefault(); return; }
            const result = currentValidation();
            mirrorValidity(id, result, false);
            // An uncommitted differing draft cannot submit the previous hidden semantic value.
            if (inFlight.value.length || result.message || !sameValue(result.value!, committed.value)) {
                event.preventDefault();
                void commit();
                if (result.message)
                    dateFields(id)[result.fields[0] ?? 0]?.focus();
            }
        };
        document.addEventListener('input', input, true);
        form?.addEventListener('submit', submit);
        mirrorValidity(id, currentValidation(), !!props.disabled);
        cleanup(() => { document.removeEventListener('input', input, true); form?.removeEventListener('submit', submit); });
    });
    const update = $(async (_: InputEvent, element: HTMLInputElement) => {
        if (props.disabled)
            return;
        const raw = readDraft(id);
        if (!sameDraft(raw, draft.value)) editRevision.value++;
        draft.value = raw;
        if (!composing.value && !element.dataset.krdsComposing)
            mirrorValidity(id, validateDraft(draft.value, range, !!props.required, config.value.min, config.value.max, t.value), false);
    });
    const keydown = $(async (event: KeyboardEvent) => {
        if (event.key === 'Enter' && !event.isComposing && event.keyCode !== 229 && !event.ctrlKey && !event.metaKey && !event.altKey)
            await commit();
    });
    const focusout = $(async (event: FocusEvent, element: HTMLElement) => {
        if (!open.value && !composing.value && !(event.relatedTarget instanceof Node && element.contains(event.relatedTarget)))
            await commit();
    });
    const openPopup = $(async () => {
        if (props.disabled || composing.value || open.value)
            return;
        open.value = true;
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        const popup = document.getElementById(`${id}-popup`) as HTMLDialogElement | null;
        if (popup && !popup.open)
            popup.showModal();
        const target = popup?.querySelector<HTMLElement>('[data-krds-part="day"][aria-pressed="true"]:not(:disabled)') ?? popup?.querySelector<HTMLElement>('[data-krds-part="day"]:not([data-krds-state~="outside-month"]):not(:disabled)') ?? popup?.querySelector<HTMLElement>('[data-krds-part="previous"]:not(:disabled),[data-krds-part="next"]:not(:disabled)');
        target?.focus();
    });
    // Keep the persistent status region's text in this render's state. Direct optional
    // signal text bindings lose their anchor after a controlled-value reconciliation.
    const errorText = error.value?.message || props.error || '';
    const invalid = !!props.invalid || props.error != null || !!error.value?.message;
    const fieldInvalid = (index: number) => !!props.invalid || props.error != null || !!error.value?.fields.includes(index);
    const field = (index: number) => <input id={index === 0 ? id : `${id}-end`} type="text" inputMode="numeric" autoComplete={props.autocomplete as never} placeholder="YYYY-MM-DD" {...{ form: props.form }} required={props.required} disabled={props.disabled} value={draft.value[index]} aria-describedby={[`${id}-hint`, invalid && `${id}-error`].filter(Boolean).join(' ')} aria-invalid={fieldInvalid(index) ? 'true' : undefined} {...attrs('date-input', range ? index === 0 ? 'start-input' : 'end-input' : 'control', states(props.disabled && 'disabled', fieldInvalid(index) && 'invalid'))} onInput$={update} onKeyDown$={[preventDateEnter, keydown]} onCompositionStart$={[compositionStart, $(() => { composing.value = true; })]} onCompositionEnd$={[compositionEnd, $(() => { const raw = readDraft(id); if (!sameDraft(raw, draft.value)) editRevision.value++; draft.value = raw; composing.value = false; })]} onInvalid$={() => {
            if (!composing.value)
                error.value = validateDraft(readDraft(id), range, !!props.required, config.value.min, config.value.max, t.value);
        }}/>;
    const contents = <>
  {range && <label for={id} {...attrs('date-input', 'label')}>{t.value.startLabel}</label>}{field(0)}
  {range && <><label for={`${id}-end`} {...attrs('date-input', 'label')}>{t.value.endLabel}</label>{field(1)}</>}
  {props.withCalendar !== false && <button id={`${id}-trigger`} type="button" aria-label={range ? undefined : t.value.openCalendar} aria-labelledby={range ? `${id}-label ${id}-trigger-label` : undefined} aria-haspopup="dialog" aria-expanded={open.value} aria-controls={`${id}-popup`} disabled={props.disabled} {...attrs('date-input', 'trigger', open.value ? 'open' : 'closed')} onClick$={openPopup}><span id={`${id}-trigger-label`}>{t.value.openCalendar}</span></button>}
  <span id={`${id}-hint`} {...attrs('date-input', 'hint')}>{props.hint ?? t.value.formatHint}</span>
  <span id={`${id}-error`} role="status" aria-live="polite" aria-atomic="true" {...attrs('date-input', 'error')}>{errorText}</span>
  <input type="hidden" name={props.name ? range ? `${props.name}.start` : props.name : undefined} value={endpoints(committed.value)[0] ?? ''} disabled={props.disabled} {...{ form: props.form }}/>
  {range && <input type="hidden" name={props.name ? `${props.name}.end` : undefined} value={endpoints(committed.value)[1] ?? ''} disabled={props.disabled} {...{ form: props.form }}/>}
  {open.value && <dialog id={`${id}-popup`} aria-modal="true" aria-labelledby={`${id}-popup-title`} tabIndex={-1} {...attrs('date-input', 'popup', 'open')}>
   <h2 id={`${id}-popup-title`}>{t.value.calendarTitle}</h2>
   <Calendar mode={range ? 'range' : 'single'} value={committed.value} label={t.value.calendarTitle} min={props.min} max={props.max} disabled={props.disabled} required={props.required} locale={props.locale ?? environment.locale} referenceDate={props.referenceDate} today={props.today} translations={{ startLabel: t.value.startLabel, endLabel: t.value.endLabel, ...props.calendarTranslations }} onConfirm$={async ({ value }) => { await commitValue(value); await close(); }} onCancel$={close}/>
   <button type="button" onClick$={close}>{(props.locale ?? environment.locale) === 'ko-KR' ? '닫기' : 'Close'}</button>
  </dialog>}
 </>;
    return range ? <fieldset dir={environment.direction} {...attrs('date-input', 'root', states(props.disabled && 'disabled', invalid && 'invalid'))} onFocusOut$={focusout}><legend id={`${id}-label`} {...attrs('date-input', 'label')}>{props.label}</legend>{contents}</fieldset> : <div dir={environment.direction} {...attrs('date-input', 'root', states(props.disabled && 'disabled', invalid && 'invalid'))} onFocusOut$={focusout}><label for={id} {...attrs('date-input', 'label')}>{props.label}</label>{contents}</div>;
});
