import { $, component$, useComputed$, useId, useOnDocument, useSignal, useTask$, useVisibleTask$, type JSXChildren, type QRL, type QwikIntrinsicElements } from '@builder.io/qwik';
import type { SelectOption, ValueChangeDetails } from '@unofficial-krds/contracts';
import { attrs, controlMode, states } from '../../internal/behavior';
export interface NativeSelectProps extends Omit<QwikIntrinsicElements['select'], 'children' | 'value' | 'size' | 'multiple' | 'onChange$'> {
    options: SelectOption[];
    value?: string;
    defaultValue?: string;
    label?: JSXChildren;
    hint?: JSXChildren;
    error?: JSXChildren;
    invalid?: boolean;
    size?: 'small' | 'medium' | 'large';
    onValueChange$?: QRL<(details: ValueChangeDetails<string>) => void>;
}
export const NativeSelect = component$<NativeSelectProps>((props) => {
    const generated = useId(), id = props.id ?? `krds-select-${generated}`, controlled = props.value !== undefined;
    controlMode(props.value, props.defaultValue, controlled);
    const initial = controlled ? props.value! : props.defaultValue ?? props.options.find(option => !option.disabled)?.value ?? '';
    const internal = useSignal(initial);
    const selected = useComputed$(() => { controlMode(props.value, props.defaultValue, controlled); return controlled ? props.value! : internal.value; });
    useTask$(({ track }) => {
        const options = track(() => props.options), value = track(() => selected.value), size = track(() => props.size);
        const values = new Set<string>();
        for (const option of options) {
            if (typeof option.value !== 'string' || typeof option.label !== 'string' || values.has(option.value))
                throw new TypeError('Options require unique string values');
            values.add(option.value);
        }
        if (typeof value !== 'string' || value !== '' && !values.has(value))
            throw new TypeError('Selection must exist in options');
        if (!['small', 'medium', 'large'].includes(size ?? 'medium'))
            throw new TypeError('Invalid NativeSelect size');
        if (props.label == null && !props['aria-label'] && !props['aria-labelledby'])
            throw new TypeError('NativeSelect requires a name');
    });
    useOnDocument('reset', $((event: Event) => {
        const element = document.getElementById(id) as HTMLSelectElement | null;
        if (!element || event.target !== element.form)
            return;
        queueMicrotask(() => {
            if (event.defaultPrevented)
                return;
            if (!controlled)
                internal.value = initial;
            element.value = controlled ? props.value! : initial;
        });
    }));
    useVisibleTask$(({ track }) => {
        const value = track(() => selected.value);
        track(() => props.options);
        const element = document.getElementById(id) as HTMLSelectElement | null;
        if (element) {
            if (value === '' && !props.options.some(option => option.value === ''))
                element.selectedIndex = -1;
            else
                element.value = value;
        }
    });
    const change = $(async (_: Event, element: HTMLSelectElement) => {
        const next = element.value, option = props.options.find(item => item.value === next);
        if (!props.disabled && option && !option.disabled && next !== selected.value) {
            if (!controlled)
                internal.value = next;
            await props.onValueChange$?.({ value: next });
        }
        element.value = controlled ? props.value! : internal.value;
    });
    const { options, value, defaultValue, label, hint, error, invalid, size, onValueChange$, id: ignored, ...native } = props;
    const state = states(props.disabled && 'disabled', props.invalid && 'invalid');
    return <div {...attrs('native-select', 'root', state)}>
  {props.label != null && <label for={id} {...attrs('native-select', 'label')}>{props.label}</label>}
  <select {...native} id={id} value={selected.value} disabled={props.disabled} onChange$={change} aria-invalid={props.invalid ? 'true' : undefined} aria-describedby={[props['aria-describedby'], props.hint != null && `${id}-hint`, props.error != null && `${id}-error`].filter(Boolean).join(' ') || undefined} data-krds-size={props.size ?? 'medium'} {...attrs('native-select', 'control', state)}>
   {props.options.map(option => <option key={option.value} value={option.value} selected={selected.value === option.value} disabled={option.disabled}>{option.label}</option>)}
  </select>
  {props.hint != null && <div id={`${id}-hint`} {...attrs('native-select', 'hint')}>{props.hint}</div>}
  {props.error != null && <div id={`${id}-error`} {...attrs('native-select', 'error')}>{props.error}</div>}
 </div>;
});
