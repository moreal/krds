import { createEffect, createUniqueId } from 'solid-js';
import type { CheckboxContract } from '@unofficial-krds/contracts';
import { owned, stateValue, resetField } from '../../internal/catalog';
export type CheckboxProps = CheckboxContract;
export function Checkbox(props: CheckboxProps) { const uid = createUniqueId(); const checked = stateValue(() => props.checked, props.defaultChecked, false, checked => props.onCheckedChange?.({ checked })); let input!: HTMLInputElement; const sync = () => { if (input) {
    input.checked = checked.read();
    input.indeterminate = props.indeterminate ?? false;
} }; createEffect(sync); createEffect(() => { if (input)
    input.indeterminate = props.indeterminate ?? false; }); resetField(() => input, () => { checked.reset(); sync(); }); return <label {...owned('checkbox', 'root', props.disabled ? 'disabled' : props.indeterminate ? 'mixed' : checked.read() ? 'checked' : 'unchecked')} data-krds-appearance={props.appearance??'default'} data-krds-size={props.size ?? 'medium'}><input ref={input} id={props.id ?? uid} type="checkbox" role={undefined} {...owned('checkbox', 'control')} name={props.name} value={props.value ?? 'on'} checked={checked.read()} disabled={props.disabled} required={props.required} aria-invalid={props.invalid || undefined} aria-describedby={[props.helpId, props.invalid ? props.errorId : undefined].filter(Boolean).join(' ') || undefined} onChange={event => { checked.request(event.currentTarget.checked); sync(); }}/><span {...owned('checkbox', "indicator", props.indeterminate ? 'mixed' : checked.read() ? 'checked' : 'unchecked')} aria-hidden="true"></span><span {...owned('checkbox', 'label')}>{props.label}</span></label>; }
