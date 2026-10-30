import { useId, useLayoutEffect, useRef } from 'react';
import type { RadioGroupContract } from '@unofficial-krds/contracts';
import { part, states, useValue, unique, described, useFormReset } from '../../catalog-utils.js';
export interface RadioGroupProps extends RadioGroupContract {optionIds?:Readonly<Record<string,string>>;}
export function RadioGroup({ value, defaultValue, onValueChange, options, label, id: provided, name, required, disabled, invalid, helpId, errorId, appearance = 'default', size = 'medium', optionIds }: RadioGroupProps) {
    const generated = useId();
    const id = provided ?? generated;
    const state = useValue<string | null>(value, defaultValue, null, 'RadioGroup');
    unique(options.map(o => o.value), 'RadioGroup');
    const controlIds=options.map((option,index)=>option.id??optionIds?.[option.value]??`${id}-${index}`);unique(controlIds,'RadioGroup controls');if(controlIds.some(id=>!id.trim()))throw new TypeError('RadioGroup control IDs cannot be empty.');
    if (state.current !== null && !options.some(o => o.value === state.current))
        throw new RangeError('Unknown RadioGroup value.');
    const root = useRef<HTMLFieldSetElement>(null);
    const reconcile = () => root.current?.querySelectorAll<HTMLInputElement>('input[type="radio"]').forEach(input => { input.defaultChecked = input.value === (state.controlled?state.latest.current:state.initial); input.checked = input.value === state.latest.current; });
    useLayoutEffect(reconcile);
    useFormReset(root,state.reset,reconcile);
    return <fieldset {...part('radio-group', 'root', states(state.current === null ? 'unchecked' : 'checked', disabled && 'disabled', invalid && 'invalid'))} ref={root} disabled={disabled} data-krds-appearance={appearance} data-krds-size={size} aria-describedby={described(helpId, errorId)} aria-invalid={invalid || undefined} onKeyDown={e => { if (e.key !== 'Tab' || e.defaultPrevented)
        return; const inputs = [...e.currentTarget.querySelectorAll<HTMLInputElement>('input:not(:disabled)')]; const index = inputs.indexOf(e.target as HTMLInputElement); const next = inputs[index + (e.shiftKey ? -1 : 1)]; if (index >= 0 && next) {
        e.preventDefault();
        next.focus();
    } }}><legend {...part('radio-group', 'legend')}>{label}</legend>{options.map((option, i) => { const token = states(state.current === option.value ? 'checked' : 'unchecked', (disabled || option.disabled) && 'disabled', invalid && 'invalid'); return <div {...part('radio-group', 'item', token)} key={option.value}><input {...part('radio-group', 'control', token)} type="radio" id={controlIds[i]} name={name ?? id} value={option.value} checked={state.current === option.value} required={required} disabled={option.disabled} onChange={e => { if (disabled || option.disabled)
        return; if (option.value !== state.current) {
        state.commit(option.value);
        onValueChange?.({ value: option.value });
    } if (state.controlled)
        reconcile(); }}/><span {...part('radio-group', 'indicator', token)} aria-hidden="true" hidden/><label {...part('radio-group', 'label')} htmlFor={controlIds[i]}>{option.label}</label></div>; })}</fieldset>;
}
