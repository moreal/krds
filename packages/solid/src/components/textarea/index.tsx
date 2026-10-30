import { Show, untrack, createEffect, createUniqueId, type JSX } from 'solid-js';
import type { TextareaContract } from '@unofficial-krds/contracts';
import { owned, stateValue, resetField } from '../../internal/catalog';
export type TextareaProps = TextareaContract;
export function Textarea(props: TextareaProps) { const uid = createUniqueId(); const value = stateValue(() => props.value, props.defaultValue, '', value => props.onValueChange?.({ value })); const initialValue=untrack(value.read); let input!: HTMLTextAreaElement; let composing = false; let lastComposition: string | undefined; const sync = () => { const next = value.read(); if (input && !composing)
    input.value = next; }; createEffect(sync); resetField(() => input, () => { composing = false; value.reset(); sync(); }); const commit = () => { const next = input.value; if (next !== value.read())
    value.request(next); sync(); }; return <div {...owned('textarea', 'root', props.invalid ? 'invalid' : '')}><label {...owned('textarea', 'label')} for={props.id ?? uid}>{props.label}</label><textarea ref={input} id={props.id ?? uid} {...owned('textarea', 'control')} rows={props.rows ?? 4} name={props.name} value={initialValue} disabled={props.disabled} required={props.required} readOnly={props.readOnly} maxLength={props.maxLength} aria-invalid={props.invalid || undefined} aria-describedby={[props.helpId, props.invalid ? props.errorId : undefined].filter(Boolean).join(' ') || undefined} onCompositionStart={() => { composing = true; }} onCompositionEnd={() => { composing = false; lastComposition = input.value; commit(); queueMicrotask(() => lastComposition = undefined); }} onInput={event => { if (composing || event.isComposing)
    return; if (lastComposition === event.currentTarget.value) {
    sync();
    return;
} commit(); }}/><span {...owned('textarea', 'count')} aria-live={undefined}>{value.read().length}{props.maxLength !== undefined ? ` / ${props.maxLength}` : ''}</span></div>; }
