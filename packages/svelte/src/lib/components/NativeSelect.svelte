<script lang="ts">
import {controlOwnership} from './control-ownership.svelte.js';
const generatedId = $props.id();
import { tick, untrack } from 'svelte';
import { context } from './context.js';
const provider = context();
import type { NativeSelectProps } from './types.js';
let { options, value, defaultValue, label, hint, error, name, form, required = false, disabled = false, invalid = false, size = 'medium', id = generatedId, 'aria-label': ariaLabel, 'aria-labelledby': labelledby, onValueChange }: NativeSelectProps = $props();
const ownership=controlOwnership(()=>value,untrack(()=>defaultValue),'NativeSelect');
const baseline = untrack(() => defaultValue ?? options.find(option => !option.disabled)?.value ?? '');
const baselineHasSelection = untrack(() => defaultValue !== undefined || options.some(option => !option.disabled));
let hasSelection = $state(baselineHasSelection);
let local = $state(baseline);
let control = $state<HTMLSelectElement>()!;
let current = $derived(ownership.read() === undefined ? local : value!);
$effect(() => {
    if (new Set(options.map(o => o.value)).size !== options.length)
        throw new RangeError('Duplicate option values');
    if (current !== '' && !options.some(o => o.value === current))
        throw new RangeError('Unknown option value');
    if (control)
        applySelection(control);
});
$effect(() => {
    const node = control;
    const owner = node?.form;
    if (!owner)
        return;
    const reset = (event: Event) => {
        queueMicrotask(() => {
            if (event.defaultPrevented || !node.isConnected)
                return;
            local = baseline;
            hasSelection = baselineHasSelection;
            applySelection(node);
        });
    };
    owner.addEventListener('reset', reset);
    return () => owner.removeEventListener('reset', reset);
});
function applySelection(node: HTMLSelectElement) {
    node.value = current;
    if (value === undefined && !hasSelection)
        node.selectedIndex = -1;
}
async function change() {
    const node = control;
    const next = node.value;
    if (value === undefined)
        hasSelection = node.selectedIndex >= 0;
    if (next !== current) {
        if (value === undefined)
            local = next;
        onValueChange?.({ value: next });
    }
    await tick();
    if (node.isConnected)
        applySelection(node);
}
</script>
<div dir={provider.direction} data-krds-component="native-select" data-krds-part="root" data-krds-state={[disabled&&'disabled',invalid&&'invalid'].filter(Boolean).join(' ')}>
 {#if label}<label for={id} data-krds-component="native-select" data-krds-part="label" data-krds-state="">{label}</label>{/if}
 <select bind:this={control!} {id} {name} {form} {required} {disabled} aria-label={ariaLabel} aria-labelledby={labelledby} aria-invalid={invalid?'true':undefined} aria-describedby={[hint?`${id}-hint`:'',error?`${id}-error`:''].filter(Boolean).join(' ')||undefined} onchange={change} data-krds-component="native-select" data-krds-part="control" data-krds-state={[disabled&&'disabled',invalid&&'invalid'].filter(Boolean).join(' ')} data-krds-size={size}>
 {#each options as option(option.value)}
<option value={option.value} selected={option.value===current&&(value!==undefined||hasSelection)} disabled={option.disabled}>{option.label}</option>{/each}
 </select>
 {#if hint}<div id={`${id}-hint`} data-krds-component="native-select" data-krds-part="hint" data-krds-state="">{hint}</div>{/if}
 {#if error}<div id={`${id}-error`} data-krds-component="native-select" data-krds-part="error" data-krds-state="">{error}</div>{/if}
</div>
