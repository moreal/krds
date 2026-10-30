import { useId, useLayoutEffect, useRef } from 'react';
import type { CheckboxContract } from '@unofficial-krds/contracts';
import { part, states, useValue, useFormReset, described } from '../../catalog-utils.js';
export type CheckboxProps = CheckboxContract;
export function Checkbox({ checked, defaultChecked, onCheckedChange, indeterminate = false, label, id: provided, name, value = 'on', required, disabled, invalid, helpId, errorId, appearance = 'default', size = 'medium' }: CheckboxProps) { const generated = useId(); const id = provided ?? generated; const state = useValue(checked, defaultChecked, false, 'Checkbox'); const ref = useRef<HTMLInputElement>(null); const reconcile = () => { if (ref.current) {
    ref.current.checked = state.latest.current;
    ref.current.indeterminate = indeterminate;
} }; useLayoutEffect(reconcile); useFormReset(ref, state.reset, reconcile); const token = states(indeterminate ? 'mixed' : state.current ? 'checked' : 'unchecked', disabled && 'disabled', invalid && 'invalid'); return <div {...part('checkbox', 'root', token)} data-krds-appearance={appearance} data-krds-size={size}><input {...part('checkbox', 'control', token)} ref={ref} id={id} name={name} type="checkbox" value={value} checked={state.current} aria-checked={indeterminate ? 'mixed' : state.current} required={required} disabled={disabled} aria-invalid={invalid || undefined} aria-describedby={described(helpId, errorId)} onChange={e => { if (disabled)
    return; const next = e.currentTarget.checked; if (next !== state.current) {
    state.commit(next);
    onCheckedChange?.({ checked: next });
} if (state.controlled)
    reconcile(); }}/><span {...part('checkbox', 'indicator', token)} aria-hidden="true">{indeterminate ? '−' : state.current ? '✓' : ''}</span><label {...part('checkbox', 'label')} htmlFor={id}>{label}</label></div>; }
