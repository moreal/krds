import { useId, useRef, useState } from 'react';
import type { TextareaContract } from '@unofficial-krds/contracts';
import { part, useValue, useFormReset, described } from '../../catalog-utils.js';
export interface TextareaProps extends TextareaContract {
    placeholder?: string;
    help?: string;
    error?: string;
}
export function Textarea({ value, defaultValue, onValueChange, label, id: provided, name, required, disabled, readOnly, rows = 5, maxLength, invalid, helpId, errorId, placeholder, help, error }: TextareaProps) {
    const generated = useId();
    const id = provided ?? generated;
    const state = useValue(value, defaultValue, '', 'Textarea');
    const ref = useRef<HTMLTextAreaElement>(null);
    const composing = useRef(false);
    const [draft, setDraft] = useState<string>();
    const reconcile = () => { if (ref.current)
        ref.current.value = state.latest.current; };
    useFormReset(ref, () => { state.reset(); setDraft(undefined); composing.current = false; }, reconcile);
    const helpTarget = help ? helpId ?? `${id}-help` : helpId;
    const errorTarget = error ? errorId ?? `${id}-error` : errorId;
    return <div {...part('textarea', 'root', invalid ? 'invalid' : '')}><label {...part('textarea', 'label')} htmlFor={id}>{label}</label><textarea {...part('textarea', 'control')} ref={ref} id={id} name={name} value={draft ?? state.current} required={required} disabled={disabled} readOnly={readOnly} rows={rows} maxLength={maxLength} placeholder={placeholder} aria-invalid={invalid || undefined} aria-describedby={described(helpTarget, errorTarget)} onCompositionStart={() => { composing.current = true;setDraft(ref.current?.value??state.current); }} onCompositionEnd={() => { composing.current = false; setDraft(undefined); queueMicrotask(reconcile); }} onChange={e => { const next = e.currentTarget.value; if (disabled || readOnly)
        return; if (composing.current)
        setDraft(next); if (next !== state.current) {
        state.commit(next);
        onValueChange?.({ value: next });
    } if (state.controlled && !composing.current)
        e.currentTarget.value = state.latest.current; }}/><span {...part('textarea', 'count')}>{(draft ?? state.current).length}{maxLength !== undefined ? ` / ${maxLength}` : ''}</span>{help && <p {...part('textarea', 'help')} id={helpTarget}>{help}</p>}{error && <p {...part('textarea', 'error')} id={errorTarget}>{error}</p>}</div>;
}
