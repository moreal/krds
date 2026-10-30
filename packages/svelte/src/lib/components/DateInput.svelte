<script lang="ts">
import {controlOwnership} from './control-ownership.svelte.js';
const generatedId = $props.id();
import { tick, flushSync, untrack } from 'svelte';
import { parseIsoDate } from '@unofficial-krds/contracts';
import Calendar from './Calendar.svelte';
import type { DateInputProps, DateValue } from './types.js';
import { bounds, empty, equal, texts, validateValue, dateDictionary, template } from './date-utils.js';
import { context } from './context.js';
import { focusables, registerModal, restoreFocus, topModal, ancestorChain } from './modal-state.js';
const provider = context();
let { mode = 'single', value, defaultValue, onValueChange, id = generatedId, name, form, required = false, disabled = false, label, hint, error, invalid = false, autocomplete, withCalendar = true, min, max, locale, translations, referenceDate = '2000-01-01', today }: DateInputProps = $props();
const ownership=controlOwnership(()=>value,untrack(()=>defaultValue),'DateInput');
const initialMode = untrack(() => mode);
const baseline = untrack(() => defaultValue ?? empty(mode));
type FieldErrors = [string, string];
interface ValidationResult {
    value: DateValue;
    error: string;
    fields: FieldErrors;
}
let local = $state<DateValue>(baseline);
let committed = $derived(ownership.read() === undefined ? local : value!);
let draft = $state(untrack(() => texts(committed)));
let localError = $state('');
let localFields = $state<FieldErrors>(['', '']);
let announcement = $state('');
let composing = $state(false);
let opened = $state(false);
let root = $state<HTMLFieldSetElement>()!;
let first = $state<HTMLInputElement>()!;
let second = $state<HTMLInputElement>()!;
let popup = $state<HTMLDialogElement>()!;
let opener = $state<HTMLButtonElement>()!;
let t = $derived(dateDictionary(locale ?? provider.locale ?? 'ko-KR', translations));
let message = $derived(localError || error || '');
let isInvalid = $derived(Boolean(localError || error || invalid));
let firstInvalid = $derived(Boolean(localFields[0] || error || invalid));
let secondInvalid = $derived(Boolean(localFields[1] || error || invalid));
$effect(() => {
    if (mode !== initialMode)
        throw new TypeError('DateInput mode is immutable');
    bounds(min, max, referenceDate, today);
    validateValue(mode, committed, min, max);
    draft = texts(committed);
    localError = '';
    localFields = ['', ''];
    announcement = '';
});
function validation(): ValidationResult {
    const [a, b] = draft;
    const next = mode === 'single' ? (a || null) : { start: a || null, end: b || null };
    const result = (fields: FieldErrors): ValidationResult => ({
        value: next,
        error: fields.find(Boolean) ?? '',
        fields,
    });
    const formatErrors: FieldErrors = [
        a && !parseIsoDate(a) ? t.formatError : '',
        mode === 'range' && b && !parseIsoDate(b) ? t.formatError : '',
    ];
    if (formatErrors.some(Boolean))
        return result(formatErrors);
    if (mode === 'range' && Boolean(a) !== Boolean(b))
        return result([a ? '' : t.incompleteRangeError, b ? '' : t.incompleteRangeError]);
    if (required && !a && !b)
        return result([t.requiredError, mode === 'range' ? t.requiredError : '']);
    if (a && b && a > b)
        return result([t.orderError, t.orderError]);
    const boundErrors: FieldErrors = ['', ''];
    const fields = mode === 'single' ? [a] : [a, b];
    for (let index = 0; index < fields.length; index++) {
        const text = fields[index];
        if (text && min && text < min)
            boundErrors[index] = template(t.minError, { min });
        else if (text && max && text > max)
            boundErrors[index] = template(t.maxError, { max });
    }
    return result(boundErrors);
}
function showValidation(result: ValidationResult) {
    localError = result.error;
    localFields = result.fields;
    announcement = result.error;
}
function validity() {
    if (!first)
        return;
    const result = validation();
    first.setCustomValidity(disabled ? '' : result.fields[0]);
    second?.setCustomValidity(disabled ? '' : result.fields[1]);
}
$effect(() => {
    draft;
    disabled;
    required;
    min;
    max;
    t;
    validity();
});
function commit(next?: DateValue) {
    if (composing || disabled)
        return false;
    const result: ValidationResult = next === undefined ? validation() : { value: next, error: '', fields: ['', ''] };
    if (result.error) {
        showValidation(result);
        validity();
        return false;
    }
    localError = '';
    localFields = ['', ''];
    announcement = '';
    if (!equal(result.value, committed)) {
        flushSync(() => {
            if (value === undefined)
                local = result.value;
            onValueChange?.({ value: result.value });
        });
    }
    draft = texts(committed);
    validity();
    return equal(result.value, committed);
}
function input(event: Event, index: number) {
    draft[index] = (event.currentTarget as HTMLInputElement).value;
    if (!composing)
        validity();
}
function key(event: KeyboardEvent) {
    if (event.key === 'Enter' && !composing && !event.isComposing && event.keyCode !== 229) {
        event.preventDefault();
        commit();
    }
}
async function blur() {
    const node = root;
    await tick();
    if (!node?.isConnected || composing || opened)
        return;
    const active = node.ownerDocument.activeElement;
    if (!node.contains(active))
        commit();
}
$effect(() => {
    const owner = first?.form;
    if (!owner)
        return;
    const reset = (event: Event) => {
        queueMicrotask(() => {
            if (event.defaultPrevented)
                return;
            local = baseline;
            draft = texts(value === undefined ? baseline : value);
            localError = '';
            localFields = ['', ''];
            announcement = '';
            opened = false;
            validity();
        });
    };
    const submit = (event: Event) => {
        if (!commit()) {
            event.preventDefault();
            const result = validation();
            const affected = result.fields[0] ? first : result.fields[1] ? second : first;
            affected?.reportValidity();
            return;
        }
        flushSync();
    };
    owner.addEventListener('reset', reset);
    owner.addEventListener('submit', submit);
    return () => {
        owner.removeEventListener('reset', reset);
        owner.removeEventListener('submit', submit);
    };
});
$effect(() => {
    if (!opened || !popup)
        return;
    const node = popup;
    const doc = node.ownerDocument;
    const ancestors = ancestorChain(opener);
    const release = registerModal(node);
    node.showModal();
    const target = node.querySelector<HTMLElement>('[data-krds-part="day"][aria-pressed="true"]:not(:disabled)') ?? node.querySelector<HTMLElement>('[data-krds-part="day"]:not(:disabled):not([data-krds-state~="outside-month"])') ?? node.querySelector<HTMLElement>('[data-krds-part="previous"]:not(:disabled),[data-krds-part="next"]:not(:disabled)') ?? node;
    target.focus();
    return () => {
        release();
        node.close();
        restoreFocus(doc, opener, undefined, ancestors);
    };
});
function popupKey(event: KeyboardEvent) {
    if (!topModal(popup) || event.defaultPrevented || event.isComposing || event.keyCode === 229 || composing)
        return;
    if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        opened = false;
    }
    else if (event.key === 'Tab') {
        const nodes = focusables(popup);
        const active = popup.ownerDocument.activeElement;
        if (!nodes.length) {
            event.preventDefault();
            popup.focus();
        }
        else if (event.shiftKey && (active === nodes[0] || active === popup)) {
            event.preventDefault();
            nodes.at(-1)!.focus();
        }
        else if (!event.shiftKey && (active === nodes.at(-1) || active === popup)) {
            event.preventDefault();
            nodes[0].focus();
        }
    }
}
</script>
<fieldset dir={provider.direction} bind:this={root!} data-krds-component="date-input" data-krds-part="root" data-krds-state={[disabled?'disabled':'',isInvalid?'invalid':''].join(' ')} onfocusout={blur}>
 <legend id={`${id}-label`} data-krds-component="date-input" data-krds-part="label">{label}</legend>
 <label for={id} class:visually-hidden={mode==='single'}>{mode==='range'?t.startLabel:label}</label>
 <input bind:this={first!} {id} type="text" inputmode="numeric" {form} {autocomplete} placeholder="YYYY-MM-DD" {required} {disabled} value={draft[0]} aria-describedby={`${id}-hint${message?` ${id}-error`:''}`} aria-invalid={firstInvalid||undefined} data-krds-component="date-input" data-krds-part={mode==='single'?'control':'start-input'} data-krds-state={[disabled?'disabled':'',firstInvalid?'invalid':''].join(' ')} oninput={event=>input(event,0)} onkeydown={key} oncompositionstart={()=>{composing=true;}} oncompositionend={event=>{draft[0]=event.currentTarget.value;composing=false;}} oninvalid={()=>showValidation(validation())} />
 {#if mode==='range'}
<label for={`${id}-end`}>{t.endLabel}</label>
<input bind:this={second!} id={`${id}-end`} type="text" inputmode="numeric" {form} {autocomplete} placeholder="YYYY-MM-DD" {required} {disabled} value={draft[1]} aria-describedby={`${id}-hint${message?` ${id}-error`:''}`} aria-invalid={secondInvalid||undefined} data-krds-component="date-input" data-krds-part="end-input" data-krds-state={[disabled?'disabled':'',secondInvalid?'invalid':''].join(' ')} oninput={event=>input(event,1)} onkeydown={key} oncompositionstart={()=>{composing=true;}} oncompositionend={event=>{draft[1]=event.currentTarget.value;composing=false;}} oninvalid={()=>showValidation(validation())} />{/if}
 {#if name}
<input type="hidden" name={mode==='range'?`${name}.start`:name} {form} {disabled} value={texts(committed)[0]} />{#if mode==='range'}
<input type="hidden" name={`${name}.end`} {form} {disabled} value={texts(committed)[1]} />{/if}{/if}
 {#if withCalendar}
<button bind:this={opener!} type="button" {disabled} aria-haspopup="dialog" aria-expanded={opened} aria-controls={`${id}-popup`} aria-labelledby={mode==='range'?`${id}-label ${id}-open-label`:undefined} data-krds-component="date-input" data-krds-part="trigger" data-krds-state={opened?'open':'closed'} onclick={()=>{if(!disabled&&!composing)opened=true;}}><span id={`${id}-open-label`}>{t.openCalendar}</span></button>{/if}
 <p id={`${id}-hint`} data-krds-component="date-input" data-krds-part="hint">{hint??t.formatHint}</p>
 {#if message}
<p id={`${id}-error`} data-krds-component="date-input" data-krds-part="error">{message}</p>{/if}
 <span aria-live="polite" role="status" class="visually-hidden">{announcement}</span>
 {#if opened}
<dialog dir={provider.direction} lang={(locale??provider.locale??'ko-KR').slice(0,2)} bind:this={popup!} id={`${id}-popup`} tabindex="-1" aria-modal="true" aria-labelledby={`${id}-popup-title`} data-krds-component="date-input" data-krds-part="popup" data-krds-state="open" onkeydown={popupKey} oncancel={event=>event.preventDefault()}>
<h2 id={`${id}-popup-title`}>{t.calendarTitle}</h2>
<Calendar {mode} value={committed} {min} {max} {disabled} {required} locale={locale??provider.locale} {referenceDate} {today} label={t.calendarTitle} onConfirm={({value:next})=>{commit(next);opened=false;}} onCancel={()=>{opened=false;}}/>
<button type="button" onclick={()=>{opened=false;}}>{(locale??provider.locale)==='en-US'?'Close':'닫기'}</button>
</dialog>{/if}
</fieldset>
<style>.visually-hidden{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}</style>
