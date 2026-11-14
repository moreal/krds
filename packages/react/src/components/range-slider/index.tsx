import { useId, useLayoutEffect, useRef } from 'react';
import type { RangeSliderContract } from '@unofficial-krds/contracts';
import { part, useValue, useFormReset, numberBounds, stepped, described } from '../../catalog-utils.js';
export type RangeSliderProps = RangeSliderContract;
export function RangeSlider({ value, defaultValue, onValueChange, label, id: provided, name, min = 0, max = 100, step = 10, disabled, valueText, helpId, errorId }: RangeSliderProps) { const generated = useId(); const id = provided ?? generated; const state = useValue(value, defaultValue, min, 'RangeSlider'); numberBounds(min, max, step, state.current); const ref = useRef<HTMLInputElement>(null); const reconcile = () => { if (ref.current)
    ref.current.value = String(state.latest.current); }; useLayoutEffect(reconcile); useFormReset(ref, state.reset, reconcile); return <div {...part('range-slider', 'root', disabled ? 'disabled' : '')}><label {...part('range-slider', 'label')} htmlFor={id}>{label}</label><input {...part('range-slider', 'control')} ref={ref} id={id} name={name} type="range" min={min} max={max} step={step} value={state.current} disabled={disabled} aria-valuetext={valueText?.(state.current)} aria-describedby={described(helpId, errorId)} onInput={e => { if (disabled)
    return; const next = stepped(e.currentTarget.valueAsNumber, min, max, step); if (next !== state.current) {
    state.commit(next);
    onValueChange?.({ value: next });
} if (state.controlled)
    e.currentTarget.value = String(state.latest.current); }} onChange={() => { }}/><output {...part('range-slider', 'output')} htmlFor={id}>{valueText?.(state.current) ?? state.current}</output><span {...part('range-slider', 'minimum')}>{min}</span><span {...part('range-slider', 'maximum')}>{max}</span></div>; }
