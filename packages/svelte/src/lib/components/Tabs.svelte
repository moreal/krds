<script lang="ts">
import {controlOwnership} from './control-ownership.svelte.js';
const generatedId = $props.id();
import { untrack } from 'svelte';
import { context } from './context.js';
import { usable } from './modal-state.js';
const provider = context();
import type { TabsProps } from './types.js';
let { items, value, defaultValue, onValueChange, activationMode = 'manual', orientation = 'horizontal', label, 'aria-label': ariaLabel, 'aria-labelledby': labelledby, id = generatedId }: TabsProps = $props();
const ownership=controlOwnership(()=>value,untrack(()=>defaultValue),'Tabs');
let local = $state(untrack(() => defaultValue ?? items.find(i => !i.disabled)?.value ?? ''));
let selected = $derived(ownership.read() === undefined ? local : value!);
let root = $state<HTMLDivElement>()!;
let paired: string | undefined;
let pointerGesture: string | undefined;
$effect(() => {
    if (items.some(i => !i.value) || new Set(items.map(i => i.value)).size !== items.length)
        throw new RangeError('Invalid tab items');
    if (items.some(i => !i.disabled) ? !items.some(i => i.value === selected && !i.disabled) : selected !== '')
        throw new RangeError('Invalid tab selection');
});
$effect(() => {
    selected;
    if (!root)
        return;
    for (const panel of root.querySelectorAll<HTMLElement>('[role=tabpanel]')) {
        const first = panel.firstElementChild;
        panel.tabIndex = first instanceof HTMLElement && usable(first) && first.tabIndex >= 0 ? -1 : 0;
    }
});
function request(next: string) {
    if (next === selected)
        return;
    if (value === undefined)
        local = next;
    onValueChange?.({ value: next });
}
function focus(value: string) {
    if (activationMode === 'automatic') {
        paired = pointerGesture === value ? value : undefined;
        request(value);
    }
}
function click(value: string) {
    pointerGesture = undefined;
    if (activationMode === 'automatic' && paired === value) {
        paired = undefined;
        return;
    }
    request(value);
}
function key(event: KeyboardEvent, index: number) {
    paired = undefined;
    if (event.isComposing || event.keyCode === 229)
        return;
    const enabled = items.map((i, index) => ({ i, index })).filter(v => !v.i.disabled);
    const pos = enabled.findIndex(v => v.index === index);
    let next: number | undefined;
    const prev = orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp';
    const forward = orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
    if (event.key === prev)
        next = (pos - 1 + enabled.length) % enabled.length;
    else if (event.key === forward)
        next = (pos + 1) % enabled.length;
    else if (event.key === 'Home')
        next = 0;
    else if (event.key === 'End')
        next = enabled.length - 1;
    if (next !== undefined) {
        event.preventDefault();
        root.querySelector<HTMLElement>(`[id="${id}-tab-${enabled[next].index}"]`)?.focus();
    }
}
</script>
<div dir={provider.direction} bind:this={root!} data-krds-component="tabs" data-krds-part="root">
 <div role="tablist" aria-label={ariaLabel??label} aria-labelledby={labelledby} aria-orientation={orientation} data-krds-component="tabs" data-krds-part="list">
 {#each items as item,index(item.value)}
<button type="button" role="tab" id={`${id}-tab-${index}`} aria-controls={`${id}-panel-${index}`} aria-selected={selected===item.value} disabled={item.disabled} tabindex={item.disabled?-1:0} onpointerdown={()=>{pointerGesture=item.value;paired=undefined;}} onpointercancel={()=>{pointerGesture=undefined;paired=undefined;}} onfocus={()=>focus(item.value)} onblur={()=>{paired=undefined;}} onclick={()=>click(item.value)} onkeydown={event=>key(event,index)} data-krds-component="tabs" data-krds-part="trigger" data-krds-state={[selected===item.value?'selected':'',item.disabled?'disabled':''].join(' ')}>{item.label}</button>{/each}
 </div>
 {#each items as item,index(item.value)}
<div role="tabpanel" id={`${id}-panel-${index}`} aria-labelledby={`${id}-tab-${index}`} hidden={selected!==item.value} data-krds-component="tabs" data-krds-part="panel" data-krds-state={selected===item.value?'active':'inactive'}>{#if item.panel}{@render item.panel()}{:else}{item.content??''}{/if}
</div>{/each}
</div>
