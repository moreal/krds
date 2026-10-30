import { createEffect, createMemo, createSignal, createUniqueId, flush, onSettled, Show, untrack } from 'solid-js';
import type { JSX } from '@solidjs/web';
import { parseIsoDate, type ValueChangeDetails } from '@unofficial-krds/contracts';
import { bounds, dictionary, empty, ends, equal, interpolate, text, validValue, type DateModeProps, type DateValue } from '../../internal/date';
import { focusBody, focusableSelector, lockDocumentScroll, nativeState, part, usable, useEnvironment, useParentDialog } from '../../internal/native';
import { Calendar, type CalendarProps, type CalendarTranslations } from '../calendar';
export interface DateInputTranslations {
    startLabel: string;
    endLabel: string;
    formatHint: string;
    openCalendar: string;
    calendarTitle: string;
    requiredError: string;
    formatError: string;
    incompleteRangeError: string;
    orderError: string;
    minError: string;
    maxError: string;
}
const chrome = {
    'ko-KR': { startLabel: '시작일', endLabel: '종료일', formatHint: 'YYYY-MM-DD 형식으로 입력하세요. 예: 2024-02-29', openCalendar: '달력 열기', calendarTitle: '날짜 선택', requiredError: '날짜를 입력하세요', formatError: 'YYYY-MM-DD 형식의 올바른 날짜를 입력하세요', incompleteRangeError: '시작일과 종료일을 모두 입력하세요', orderError: '종료일은 시작일보다 빠를 수 없습니다', minError: '{min} 이후 날짜를 입력하세요 (당일 포함)', maxError: '{max} 이전 날짜를 입력하세요 (당일 포함)' },
    'en-US': { startLabel: 'Start date', endLabel: 'End date', formatHint: 'Enter YYYY-MM-DD, for example 2024-02-29', openCalendar: 'Open calendar', calendarTitle: 'Choose date', requiredError: 'Enter a date', formatError: 'Enter a valid date in YYYY-MM-DD format', incompleteRangeError: 'Enter both start and end dates', orderError: 'End date must not precede start date', minError: 'Enter a date on or after {min}', maxError: 'Enter a date on or before {max}' },
};
interface Base {
    id?: string;
    name?: string;
    form?: string;
    label: JSX.Element;
    hint?: JSX.Element;
    error?: JSX.Element;
    errorMessage?: JSX.Element;
    invalid?: boolean;
    required?: boolean;
    disabled?: boolean;
    autocomplete?: JSX.InputHTMLAttributes<HTMLInputElement>['autocomplete'];
    min?: string;
    max?: string;
    referenceDate?: string;
    today?: string;
    locale?: 'ko-KR' | 'en-US';
    translations?: Partial<DateInputTranslations>;
    calendarTranslations?: Partial<CalendarTranslations>;
    withCalendar?: boolean;
    returnFocusId?: string;
}
export type DateInputProps = Base & DateModeProps;
interface Validation {
    message: string;
    fields: number[];
    value?: DateValue;
}
export function DateInput(props: DateInputProps) {
    const parentDialog = useParentDialog();
    const env = useEnvironment(), id = untrack(()=>props.id ?? `krds-date-${createUniqueId()}`), range = untrack(() => props.mode === 'range');
    const config = createMemo(() => bounds(props)), t = createMemo(() => dictionary(chrome[props.locale ?? env.locale ?? 'ko-KR'], props.translations));
    const state = nativeState<DateValue>(() => props.value, () => props.defaultValue ?? empty(range), () => props.defaultValue);
    const committed = createMemo(() => {
        if ((props.mode === 'range') !== range)
            throw new TypeError('Date mode immutable');
        return validValue(state.value(), range, config().min, config().max);
    });
    const [draft, setDraft] = createSignal<[
        string,
        string
    ]>(() => text(untrack(committed))), [error, setError] = createSignal<Validation | null>(null), [open, setOpen] = createSignal(false);
    let composing = false, pointerInside = false, root!: HTMLElement, first!: HTMLInputElement, second: HTMLInputElement | undefined, trigger: HTMLButtonElement | undefined, dialog: HTMLDialogElement | undefined, releaseScroll: (() => void) | undefined;
    const fields = () => [first, second].filter((el): el is HTMLInputElement => !!el);
    const external = () => props.error ?? props.errorMessage, invalid = () => !!error() || !!props.invalid || !!external();
    const fieldInvalid = (index: number) => !!props.invalid || !!external() || !!error()?.fields.includes(index);
    function validate(): Validation {
        const [start, end] = draft(), s = t(), b = config();
        const fail = (message: string, fields: number[]): Validation => ({ message, fields });
        if (start && !parseIsoDate(start))
            return fail(s.formatError, [0]);
        if (range && end && !parseIsoDate(end))
            return fail(s.formatError, [1]);
        if (!start && (!range || !end))
            return props.required ? fail(s.requiredError, range ? [0, 1] : [0]) : { message: '', fields: [], value: empty(range) };
        if (range && (!start || !end))
            return fail(s.incompleteRangeError, !start ? [0] : [1]);
        if (start < b.min)
            return fail(interpolate(s.minError, { min: b.min }), [0]);
        if (start > b.max)
            return fail(interpolate(s.maxError, { max: b.max }), [0]);
        if (range && end < b.min)
            return fail(interpolate(s.minError, { min: b.min }), [1]);
        if (range && end > b.max)
            return fail(interpolate(s.maxError, { max: b.max }), [1]);
        if (range && start > end)
            return fail(s.orderError, [0, 1]);
        return { message: '', fields: [], value: range ? { start, end } : start };
    }
    const mirror = (result = validate()) => fields().forEach((input, index) => input.setCustomValidity(!props.disabled && result.fields.includes(index) ? result.message : ''));
    function replace(value: DateValue) {
        const next = text(value);
        setDraft(next);
        setError(null);
        fields().forEach((input, index) => input.value = next[index]);
        flush();
        mirror();
    }
    createEffect(committed, value => replace(value), { defer: true });
    createEffect(() => [draft(), props.disabled, props.required, t(), config()] as const, () => {
        if (!composing)
            mirror();
    });
    const notify = (detail: ValueChangeDetails<DateValue>) => (props.onValueChange as ((d: ValueChangeDetails<DateValue>) => void) | undefined)?.(detail);
    function apply(value: DateValue) {
        if (!equal(value, committed()))
            state.request(value, notify);
        const accepted = equal(value, committed());
        replace(committed());
        return accepted;
    }
    function commit() {
        if (props.disabled || composing)
            return false;
        const result = validate();
        mirror(result);
        if (result.message) {
            setError(result);
            flush();
            return false;
        }
        return apply(result.value!);
    }
    const restoreFocus = () => {
        const doc = first.ownerDocument;
        const alternative = props.returnFocusId ? doc.getElementById(props.returnFocusId) : undefined;
        if (usable(trigger))
            trigger.focus({ preventScroll: true });
        else if (usable(alternative))
            alternative.focus({ preventScroll: true });
        else
            focusBody(doc);
    };
    function closePopup(returnFocus: boolean) {
        if (!open())
            return;
        dialog?.close();
        releaseScroll?.();
        releaseScroll = undefined;
        setOpen(false);
        flush();
        if (returnFocus) restoreFocus();
    }
    const close = () => closePopup(true);
    function show() {
        if (props.disabled || composing || open())
            return;
        setOpen(true);
        flush();
        onSettled(() => {
            if (!dialog || !open())
                return;
            releaseScroll = lockDocumentScroll(first.ownerDocument);
            dialog.showModal();
            const selected = dialog.querySelector<HTMLButtonElement>('[data-krds-part="day"][aria-pressed="true"]:not(:disabled)'), day = dialog.querySelector<HTMLButtonElement>('[data-krds-part="day"]:not([data-krds-state~="outside-month"]):not(:disabled)'), nav = dialog.querySelector<HTMLButtonElement>('[data-krds-part="previous"]:not(:disabled),[data-krds-part="next"]:not(:disabled)');
            (selected ?? day ?? nav ?? dialog).focus();
        });
    }
    createEffect(() => props.disabled, disabled => {
        if (disabled && open())
            close();
    });
    onSettled(() => {
        let alive = true;
        const unregisterParent = parentDialog?.register(() => closePopup(false));
        const doc = first.ownerDocument;
        const reset = (event: Event) => {
            if (event.target === first.form)
                setTimeout(() => {
                    if (!alive || event.defaultPrevented)
                        return;
                    replace(state.reset());
                    close();
                });
        };
        const submit = (event: Event) => {
            if (event.target === first.form && !props.disabled && !commit()) {
                event.preventDefault();
                fields()[error()?.fields[0] ?? 0]?.focus();
            }
        };
        doc.addEventListener('reset', reset, true);
        doc.addEventListener('submit', submit, true);
        mirror();
        return () => {
            alive = false;
            unregisterParent?.();
            doc.removeEventListener('reset', reset, true);
            doc.removeEventListener('submit', submit, true);
            if (open()) {
                dialog?.close();
                releaseScroll?.();
                releaseScroll = undefined;
                queueMicrotask(() => { if (!parentDialog || parentDialog.isOpen()) restoreFocus(); });
            }
        };
    });
    function input(index: number) {
        return <input ref={el => {
                if (index === 0)
                    first = el;
                else
                    second = el;
            }} id={index === 0 ? id : `${id}-end`} type="text" inputmode="numeric" placeholder="YYYY-MM-DD" autocomplete={props.autocomplete} form={props.form} required={props.required} disabled={props.disabled} value={draft()[index]} aria-invalid={fieldInvalid(index) ? 'true' : undefined} aria-describedby={`${id}-hint${invalid() ? ` ${id}-error` : ''}`} {...part('date-input', range ? index === 0 ? 'start-input' : 'end-input' : 'control', [props.disabled && 'disabled', fieldInvalid(index) && 'invalid'].filter(Boolean).join(' '))} onInput={event => {
                if (props.disabled)
                    return;
                const next: [
                    string,
                    string
                ] = [...draft()];
                next[index] = event.currentTarget.value;
                setDraft(next);
                flush();
                if (!composing && !event.isComposing)
                    mirror();
            }} onCompositionStart={() => {
                composing = true;
            }} onCompositionEnd={event => {
                const next: [
                    string,
                    string
                ] = [...draft()];
                next[index] = event.currentTarget.value;
                setDraft(next);
                composing = false;
            }} onKeyDown={event => {
                if (event.key === 'Enter' && !event.defaultPrevented && !composing && !event.isComposing && event.keyCode !== 229) {
                    event.preventDefault();
                    commit();
                }
            }} onInvalid={() => {
                if (!composing)
                    setError(validate());
            }}/>;
    }
    const popup = () => <Show when={open()}><dialog ref={el => {
            dialog = el;
            el.tabIndex = -1;
        }} id={`${id}-popup`} aria-modal="true" aria-labelledby={`${id}-title`} {...part('date-input', 'popup', 'open')} onCancel={event => event.preventDefault()} onKeyDown={event => {
            if (event.defaultPrevented)
                return;
            if (event.key === 'Escape') {
                event.stopPropagation();
                event.preventDefault();
                if (!composing && !event.isComposing && event.keyCode !== 229)
                    close();
            }
            else if (event.key === 'Tab') {
                event.stopPropagation();
                const nodes = Array.from(dialog!.querySelectorAll<HTMLElement>(focusableSelector)).filter(usable);
                if (event.shiftKey && dialog!.ownerDocument.activeElement === nodes[0]) {
                    event.preventDefault();
                    nodes.at(-1)?.focus();
                }
                else if (!event.shiftKey && dialog!.ownerDocument.activeElement === nodes.at(-1)) {
                    event.preventDefault();
                    nodes[0]?.focus();
                }
            }
        }}><h2 id={`${id}-title`}>{t().calendarTitle}</h2><Calendar {...({ mode: range ? 'range' : 'single', value: committed(), label: t().calendarTitle, min: props.min, max: props.max, required: props.required, disabled: props.disabled, locale: props.locale, referenceDate: props.referenceDate, today: props.today, translations: { startLabel: t().startLabel, endLabel: t().endLabel, ...props.calendarTranslations }, onConfirm: ({ value }: {
            value: DateValue;
        }) => {
            apply(value);
            close();
        }, onCancel: close } as CalendarProps)}/><button type="button" onClick={close}>{(props.locale ?? env.locale ?? 'ko-KR') === 'ko-KR' ? '닫기' : 'Close'}</button></dialog></Show>;
    const contents = <>{range && <label for={id} {...part('date-input', 'label')}>{t().startLabel}</label>}{input(0)}{range && <><label for={`${id}-end`} {...part('date-input', 'label')}>{t().endLabel}</label>{input(1)}</>}{props.withCalendar !== false && <button ref={el => trigger = el} type="button" aria-label={!range ? t().openCalendar : undefined} aria-labelledby={range ? `${id}-label ${id}-trigger-label` : undefined} aria-haspopup="dialog" aria-expanded={open() ? 'true' : 'false'} aria-controls={`${id}-popup`} disabled={props.disabled} {...part('date-input', 'trigger', open() ? 'open' : 'closed')} onClick={show}><span id={`${id}-trigger-label`}>{t().openCalendar}</span></button>}<span id={`${id}-hint`} {...part('date-input', 'hint')}>{props.hint ?? t().formatHint}</span><span id={`${id}-error`} role="status" aria-live="polite" aria-atomic="true" {...part('date-input', 'error', invalid() ? 'invalid' : '')}>{error()?.message || external()}</span><input type="hidden" name={props.name ? range ? `${props.name}.start` : props.name : undefined} form={props.form} disabled={props.disabled} value={ends(committed())[0] ?? ''}/>{range && <input type="hidden" name={props.name ? `${props.name}.end` : undefined} form={props.form} disabled={props.disabled} value={ends(committed())[1] ?? ''}/>} {popup()}</>;
    const blur = (event: FocusEvent) => {
        if (!composing && !pointerInside && !open() && !(event.relatedTarget instanceof Node && root.contains(event.relatedTarget)))
            commit();
    };
    return range ? <fieldset ref={el => root = el} dir={env.direction ?? 'ltr'} {...part('date-input', 'root', [props.disabled && 'disabled', invalid() && 'invalid'].filter(Boolean).join(' '))} onPointerDown={() => {
            pointerInside = true;
            setTimeout(() => {
                pointerInside = false;
            }, 0);
        }} onFocusOut={blur}><legend id={`${id}-label`} {...part('date-input', 'label')}>{props.label}</legend>{contents}</fieldset> : <div ref={el => root = el} dir={env.direction ?? 'ltr'} {...part('date-input', 'root', [props.disabled && 'disabled', invalid() && 'invalid'].filter(Boolean).join(' '))} onPointerDown={() => {
            pointerInside = true;
            setTimeout(() => {
                pointerInside = false;
            }, 0);
        }} onFocusOut={blur}><label for={id} {...part('date-input', 'label')}>{props.label}</label>{contents}</div>;
}
