import { $, component$, useSignal, Slot, useId, useComputed$, useVisibleTask$, useTask$, type JSXChildren, type QRL } from '@builder.io/qwik';
import type { RadioGroupContract } from '@unofficial-krds/contracts';
import { owned, states, safeRel, useField, useReset, useNarrow, usable, focusTarget, restore, ignoredKey, type NativeContract } from '../../internal/catalog';
export type RadioGroupProps = NativeContract<RadioGroupContract>;
export const RadioGroup = component$<RadioGroupProps>((props) => { const id = useId(), value = useField<string | null>(props, 'value', 'defaultValue', null), ref = useSignal<HTMLFieldSetElement>(); if (new Set(props.options.map(o => o.value)).size !== props.options.length || value.value.value !== null && !props.options.some(o => o.value === value.value.value))
    throw new TypeError('Radio choices must be unique and committed choice must exist'); const optionIds=props.options.map(option=>option.id??`${id}-${Array.from(option.value).map(character=>character.codePointAt(0)!.toString(16)).join('-')}`);if(optionIds.some(id=>!id.trim()||/\s/.test(id))||new Set(optionIds).size!==optionIds.length)throw new TypeError('Radio IDs must be nonempty, unique native identifiers'); const sync = $(() => ref.value?.querySelectorAll<HTMLInputElement>('input').forEach(input => input.checked = input.value === (value.controlled.value?props.value:value.local.value))); useReset(ref, value.reset, sync); useVisibleTask$(({ cleanup }) => { const root = ref.value; if (!root)
    return; let entry: 'forward' | 'backward' | undefined; const key = (event: KeyboardEvent) => { if (event.key === 'Tab' && !root.contains(event.target as Node))
    entry = event.shiftKey ? 'backward' : 'forward'; if (ignoredKey(event) || !root.contains(event.target as Node) || !['Tab', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Home', 'End'].includes(event.key))
    return; const inputs = [...root.querySelectorAll<HTMLInputElement>('input:not(:disabled)')], index = inputs.indexOf(document.activeElement as HTMLInputElement); if (index < 0)
    return; const next = event.key === 'Home' ? 0 : event.key === 'End' ? inputs.length - 1 : index + (['ArrowLeft', 'ArrowUp'].includes(event.key) || event.key === 'Tab' && event.shiftKey ? -1 : 1); if (event.key === 'Tab') {
    if (next < 0 || next >= inputs.length)
        return;
    event.preventDefault();
    inputs[next]?.focus();
}
else {
    event.preventDefault();
    const input = inputs[(next + inputs.length) % inputs.length];
    input?.focus();
    if (input)
        void (async () => { await value.request(input.value, async() => {if(!value.controlled.value)await sync();await props.onValueChange$?.({ value: input.value });}); await sync(); })();
} }; const focus = (event: FocusEvent) => { if (!entry || root.contains(event.relatedTarget as Node))
    return; const inputs = [...root.querySelectorAll<HTMLInputElement>('input:not(:disabled)')]; (entry === 'backward' ? inputs.at(-1) : inputs[0])?.focus(); entry = undefined; }; document.addEventListener('keydown', key, true); root.addEventListener('focusin', focus); cleanup(() => { document.removeEventListener('keydown', key, true); root.removeEventListener('focusin', focus); }); }, { strategy: 'document-ready' }); return <fieldset ref={ref} id={props.id} {...owned('radio-group', 'root', props.invalid ? 'invalid' : '')} disabled={props.disabled} data-krds-appearance={props.appearance ?? 'default'} data-krds-size={props.size ?? 'medium'} aria-describedby={[props.helpId, props.invalid ? props.errorId : undefined].filter(Boolean).join(' ') || undefined}><legend {...owned('radio-group', 'legend')}>{props.label}</legend>{props.options.map((option, index) => <div key={option.value} {...owned('radio-group', 'item', states(value.value.value === option.value ? 'checked' : 'unchecked', (props.disabled || option.disabled) && 'disabled'))}><input id={option.id??`${id}-${Array.from(option.value).map(character=>character.codePointAt(0)!.toString(16)).join('-')}`} {...owned('radio-group', 'control')} type="radio" name={props.name ?? id} value={option.value} checked={value.value.value === option.value} disabled={props.disabled || option.disabled} required={props.required} tabIndex={0} onChange$={async (_, element) => { if (!props.disabled && !option.disabled && await value.request(element.value))
    await props.onValueChange$?.({ value: element.value }); await sync(); }}/><label for={option.id??`${id}-${Array.from(option.value).map(character=>character.codePointAt(0)!.toString(16)).join('-')}`} {...owned('radio-group', 'label')}>{option.label}<span {...owned('radio-group', 'indicator')} aria-hidden="true"></span></label></div>)}</fieldset>; });
