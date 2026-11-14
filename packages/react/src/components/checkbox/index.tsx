import { useId, useLayoutEffect, useRef } from 'react';
import type { CheckboxContract } from '@unofficial-krds/contracts';
import { part, useValue, useFormReset, described } from '../../catalog-utils.js';
export type CheckboxProps = CheckboxContract;
export function Checkbox({ checked, defaultChecked, onCheckedChange, indeterminate = false, label, id: provided, name, value = 'on', required, disabled, invalid, helpId, errorId, appearance = 'default', size = 'medium' }: CheckboxProps) { const generated = useId(); const id = provided ?? generated; const state = useValue(checked, defaultChecked, false, 'Checkbox'); const ref = useRef<HTMLInputElement>(null); const reconcile = () => { if (ref.current) {
    ref.current.checked = state.latest.current;
    ref.current.indeterminate = indeterminate;
} }; useLayoutEffect(reconcile); useFormReset(ref, state.reset, reconcile); const token = indeterminate ? 'mixed' : state.current ? 'checked' : 'unchecked'; return <div {...part('checkbox', 'root', disabled ? 'disabled' : token)} data-krds-appearance={appearance} data-krds-size={size}><input {...part('checkbox', 'control')} ref={ref} id={id} name={name} type="checkbox" value={value} checked={state.current} required={required} disabled={disabled} aria-invalid={invalid || undefined} aria-describedby={described(helpId, errorId)} onChange={e => { if (disabled)
    return; const next = e.currentTarget.checked; if (next !== state.current) {
    state.commit(next);
    onCheckedChange?.({ checked: next });
} if (state.controlled)
    reconcile(); }}/><label {...part('checkbox', 'label')} htmlFor={id}>{label}<span {...part('checkbox', 'indicator', token)} aria-hidden="true"/></label></div>; }
