import { createEffect, createUniqueId, For, omit, onSettled } from 'solid-js';
import type { JSX } from '@solidjs/web';
import type { SelectOption, ValueChangeDetails } from '@unofficial-krds/contracts';
import { nativeState, part } from '../../internal/native';
export interface NativeSelectProps extends Omit<JSX.SelectHTMLAttributes<HTMLSelectElement>, 'children' | 'value' | 'size' | 'multiple' | 'onChange'> {
    options: readonly SelectOption[];
    value?: string;
    defaultValue?: string;
    label?: JSX.Element;
    hint?: JSX.Element;
    error?: JSX.Element;
    invalid?: boolean;
    size?: 'small' | 'medium' | 'large';
    onValueChange?: (details: ValueChangeDetails<string>) => void;
}
export function NativeSelect(props: NativeSelectProps) {
    const native = omit(props, 'options', 'value', 'defaultValue', 'label', 'hint', 'error', 'invalid', 'size', 'onValueChange', 'id', 'ref');
    const generated = `krds-select-${createUniqueId()}`, id = () => props.id ?? generated;
    const state = nativeState(() => props.value, () => props.defaultValue ?? props.options.find(o => !o.disabled)?.value ?? '', () => props.defaultValue);
    let control!: HTMLSelectElement;
    const status = () => [props.disabled && 'disabled', props.invalid && 'invalid'].filter(Boolean).join(' ');
    const selection = () => {
        const values = new Set<string>();
        for (const option of props.options) {
            if (values.has(option.value))
                throw new TypeError('Duplicate option');
            values.add(option.value);
        }
        if (state.value() && !values.has(state.value()))
            throw new RangeError('Selection is absent from options');
        return state.value();
    };
    const restore = () => {
        if (control)
            control.value = selection();
    };
    createEffect(selection, restore);
    onSettled(() => {
        restore();
        const doc = control.ownerDocument;
        let alive = true;
        const reset = (event: Event) => {
            if (event.target === control.form)
                setTimeout(() => {
                    if (alive && !event.defaultPrevented) {
                        state.reset();
                        restore();
                    }
                });
        };
        doc.addEventListener('reset', reset, true);
        return () => {
            alive = false;
            doc.removeEventListener('reset', reset, true);
        };
    });
    return <div {...part('native-select', 'root', status())}>{props.label != null && <label for={id()} {...part('native-select', 'label')}>{props.label}</label>}<select {...native} ref={el => {
            control = el;
            if (typeof props.ref === 'function')
                props.ref(el);
        }} id={id()} disabled={props.disabled} aria-invalid={props.invalid ? 'true' : undefined} aria-describedby={[props['aria-describedby'], props.hint != null && `${id()}-hint`, props.error != null && `${id()}-error`].filter(Boolean).join(' ') || undefined} {...part('native-select', 'control', status())} data-krds-size={props.size ?? 'medium'} onChange={event => {
            const next = event.currentTarget.value;
            const option = props.options.find(o => o.value === next);
            if (!props.disabled && option && !option.disabled && next !== state.value())
                state.request(next, props.onValueChange);
            restore();
        }}><For each={props.options}>{option => <option value={option.value} disabled={option.disabled} selected={selection() === option.value}>{option.label}</option>}</For></select>{props.hint != null && <div id={`${id()}-hint`} {...part('native-select', 'hint')}>{props.hint}</div>}{props.error != null && <div id={`${id()}-error`} {...part('native-select', 'error')}>{props.error}</div>}</div>;
}
