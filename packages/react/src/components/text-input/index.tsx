import { useId, useRef, useState, type InputHTMLAttributes } from 'react';
import type { TextInputContract } from '@unofficial-krds/contracts';
import { part, states, useValue, useFormReset, described } from '../../catalog-utils.js';
export interface TextInputProps extends TextInputContract {
    placeholder?: string;
    help?: string;
    error?: string;
    nativeAttributes?: Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'defaultValue' | 'onChange' | 'type' | 'id' | 'name' | 'disabled'>;
}
export function TextInput({ value, defaultValue, onValueChange, label, id: provided, name, type = 'text', autocomplete, inputMode, required, disabled, readOnly, minLength, maxLength, pattern, status = 'default', invalid, helpId, errorId, size = 'medium', iconAction, placeholder, help, error, nativeAttributes }: TextInputProps) {
    const generated = useId();
    const id = provided ?? generated;
    const state = useValue(value, defaultValue, '', 'TextInput');
    const ref = useRef<HTMLInputElement>(null);
    const composing = useRef(false);
    const [draft, setDraft] = useState<string>();
    const [focused, setFocused] = useState(false);
    const reconcile = () => { if (ref.current)
        ref.current.value = state.latest.current; };
    useFormReset(ref, () => { state.reset(); setDraft(undefined); composing.current = false; }, reconcile);
    const token = states((invalid || status === 'error') && 'invalid', status === 'success' && 'success', disabled && 'disabled', readOnly && 'readonly', focused && 'focused');
    const helpTarget = help ? helpId ?? `${id}-help` : helpId;
    const errorTarget = error ? errorId ?? `${id}-error` : errorId;
    return <div {...part('text-input', 'root', token)} data-krds-size={size} data-krds-status={status}><label {...part('text-input', 'label')} htmlFor={id}>{label}</label><input {...nativeAttributes} {...part('text-input', 'control', token)} ref={ref} id={id} name={name} type={type} value={draft ?? state.current} required={required} disabled={disabled} readOnly={readOnly} autoComplete={autocomplete} inputMode={inputMode as InputHTMLAttributes<HTMLInputElement>['inputMode']} minLength={minLength} maxLength={maxLength} pattern={pattern} placeholder={placeholder} aria-invalid={invalid || status === 'error' || undefined} aria-describedby={described(helpTarget, errorTarget)} onFocus={() => setFocused(true)} onBlur={() => setFocused(false)} onCompositionStart={() => { composing.current = true;setDraft(ref.current?.value??state.current); }} onCompositionEnd={() => { composing.current = false; setDraft(undefined); queueMicrotask(reconcile); }} onChange={e => { const next = e.currentTarget.value; if (disabled || readOnly)
        return; if (composing.current)
        setDraft(next); if (next !== state.current) {
        state.commit(next);
        onValueChange?.({ value: next });
    } if (state.controlled && !composing.current)
        e.currentTarget.value = state.latest.current; }}/>{iconAction && <button {...part('text-input', 'icon-action', disabled ? 'disabled' : '')} type="button" disabled={disabled} onClick={iconAction.onAction}>{iconAction.label}</button>}{help && <p {...part('text-input', 'help')} id={helpTarget}>{help}</p>}{error && <p {...part('text-input', 'error')} id={errorTarget}>{error}</p>}{status === 'success' && <span>✓ 확인됨</span>}</div>;
}
