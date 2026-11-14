import { useId, useLayoutEffect, useRef } from 'react';
import type { SwitchContract } from '@unofficial-krds/contracts';
import { part, useValue, useFormReset, described } from '../../catalog-utils.js';
export type SwitchProps = SwitchContract;
export function Switch({ checked, defaultChecked, onCheckedChange, label, id: provided, name, value = 'on', required, disabled, invalid, helpId, errorId, size = 'medium' }: SwitchProps) { const generated = useId(); const id = provided ?? generated; const state = useValue(checked, defaultChecked, false, 'Switch'); const ref = useRef<HTMLInputElement>(null); const reconcile = () => { if (ref.current)
    ref.current.checked = state.latest.current; }; useLayoutEffect(reconcile); useFormReset(ref, state.reset, reconcile); return <div {...part('switch', 'root', disabled ? 'disabled' : state.current ? 'checked' : 'unchecked')} data-krds-size={size}><input {...part('switch', 'control')} ref={ref} id={id} name={name} type="checkbox" role="switch" value={value} checked={state.current} aria-checked={state.current} required={required} disabled={disabled} aria-invalid={invalid || undefined} aria-describedby={described(helpId, errorId)} onChange={e => { if (disabled)
    return; const next = e.currentTarget.checked; if (next !== state.current) {
    state.commit(next);
    onCheckedChange?.({ checked: next });
} if (state.controlled)
    e.currentTarget.checked = state.latest.current; }}/><label {...part('switch', 'label')} htmlFor={id}>{label}<span {...part('switch', 'track')} aria-hidden="true"><span {...part('switch', 'handle')}/></span></label></div>; }
