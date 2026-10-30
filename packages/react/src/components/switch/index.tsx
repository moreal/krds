import { useId, useLayoutEffect, useRef } from 'react';
import type { SwitchContract } from '@unofficial-krds/contracts';
import { part, states, useValue, useFormReset, described } from '../../catalog-utils.js';
export type SwitchProps = SwitchContract;
export function Switch({ checked, defaultChecked, onCheckedChange, label, id: provided, name, value = 'on', required, disabled, helpId, errorId, size = 'medium' }: SwitchProps) { const generated = useId(); const id = provided ?? generated; const state = useValue(checked, defaultChecked, false, 'Switch'); const ref = useRef<HTMLInputElement>(null); const reconcile = () => { if (ref.current)
    ref.current.checked = state.latest.current; }; useLayoutEffect(reconcile); useFormReset(ref, state.reset, reconcile); const token = states(state.current ? 'checked' : 'unchecked', disabled && 'disabled'); return <div {...part('switch', 'root', token)} data-krds-size={size}><input {...part('switch', 'control', token)} ref={ref} id={id} name={name} type="checkbox" role="switch" value={value} checked={state.current} aria-checked={state.current} required={required} disabled={disabled} aria-describedby={described(helpId, errorId)} onChange={e => { if (disabled)
    return; const next = e.currentTarget.checked; if (next !== state.current) {
    state.commit(next);
    onCheckedChange?.({ checked: next });
} if (state.controlled)
    e.currentTarget.checked = state.latest.current; }}/><span {...part('switch', 'track', token)} aria-hidden="true"><span {...part('switch', 'handle', token)}><span {...part('switch', 'state-icon', token)}>{state.current ? '✓' : '−'}</span></span></span><label {...part('switch', 'label')} htmlFor={id}>{label}</label></div>; }
