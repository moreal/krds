import { $, component$, useSignal, Slot, useId, useComputed$, useVisibleTask$, useTask$, type JSXChildren, type QRL } from '@builder.io/qwik';
import type { TagContract } from '@unofficial-krds/contracts';
import { owned, states, safeRel, useField, useReset, useNarrow, usable, focusTarget, restore, ignoredKey, type NativeContract } from '../../internal/catalog';
export type TagProps = NativeContract<TagContract>;
export const Tag = component$<TagProps>((props) => { const uid = useId(), active = useSignal(props.items.find(i => !i.disabled)?.id), list = useSignal<HTMLUListElement>(), pending = useSignal<{
    id: string;
    order: string[];
}>(); useVisibleTask$(({ track, cleanup }) => { const items = track(() => props.items); const eligible = items.filter(i => !i.disabled).map(i => i.id); if (!eligible.includes(active.value ?? ''))
    active.value = eligible[0]; if (pending.value && !items.some(i => i.id === pending.value!.id)) {
    const { id, order } = pending.value;
    pending.value = undefined;
    const index = order.indexOf(id), next = order.slice(0, index).reverse().find(id => eligible.includes(id)) ?? order.slice(index + 1).find(id => eligible.includes(id));
    active.value = next;
    focusTarget(next ? document.getElementById(`${uid}-${next}`) : list.value);
} const root = list.value; if (!root)
    return; let armed: HTMLButtonElement | undefined; const key = (e: KeyboardEvent) => { if (ignoredKey(e))
    return; const target = e.target as HTMLButtonElement; if (['Enter', ' '].includes(e.key) && target.matches('button')) {
    e.preventDefault();
    if (!e.repeat)
        armed = target;
}
else if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) {
    const controls = [...root.querySelectorAll<HTMLElement>('button:not(:disabled),a[href]')];
    if (!controls.length)
        return;
    e.preventDefault();
    const index = controls.indexOf(document.activeElement as HTMLElement), next = e.key === 'Home' ? 0 : e.key === 'End' ? controls.length - 1 : (index + (e.key === 'ArrowRight' ? 1 : -1) + controls.length) % controls.length;
    controls[next]?.focus();
} }; const up = (e: KeyboardEvent) => { if (!['Enter', ' '].includes(e.key))
    return; const ignored=ignoredKey(e);e.preventDefault(); const target = armed; armed = undefined; if (!ignored && target === e.target)
    target.click(); }; root.addEventListener('keydown', key); root.addEventListener('keyup', up); cleanup(() => { root.removeEventListener('keydown', key); root.removeEventListener('keyup', up); }); }, { strategy: 'document-ready' }); const activate = $(async (id: string) => { if (props.mode === 'removable') {
    pending.value = { id, order: props.items.map(i => i.id) };
    await props.onRemove$?.({ id });
}
else if (props.mode === 'toggle') {
    await props.onSelectionChange$?.({ ids: props.selectedIds?.includes(id) ? props.selectedIds.filter(v => v !== id) : [...(props.selectedIds ?? []), id] });
}
else if (props.mode === 'add-filter') {
    await props.onAdd$?.({ id });
    if (props.appliedBarId)
        focusTarget(document.getElementById(props.appliedBarId));
} }); return <div {...owned('tag')} role={props.mode && props.mode !== 'static' ? 'group' : undefined} data-krds-mode={props.mode ?? 'static'}><ul ref={list} tabIndex={-1} {...owned('tag', 'list')}>{props.items.map(item => <li key={item.id} {...owned('tag', 'item', props.selectedIds?.includes(item.id) ? 'selected' : '')}>{props.mode === 'link' ? <a id={`${uid}-${item.id}`} href={item.disabled ? undefined : item.href} aria-disabled={item.disabled || undefined} tabIndex={!item.disabled && active.value === item.id ? 0 : -1} onFocus$={() => active.value = item.id}>{item.label}</a> : ['toggle', 'add-filter'].includes(props.mode ?? '') ? <button id={`${uid}-${item.id}`} type="button" {...owned('tag', 'label')} disabled={item.disabled} tabIndex={!item.disabled && active.value === item.id ? 0 : -1} onFocus$={() => active.value = item.id} aria-pressed={props.mode === 'toggle' ? props.selectedIds?.includes(item.id) ?? false : undefined} aria-label={props.mode === 'add-filter' ? `${item.label} 필터 옵션 추가` : undefined} onClick$={() => activate(item.id)}>{item.label}</button> : <><span {...owned('tag', 'label')}>{item.label}</span>{props.mode === 'removable' && <button id={`${uid}-${item.id}`} type="button" {...owned('tag', 'remove')} disabled={item.disabled} tabIndex={!item.disabled && active.value === item.id ? 0 : -1} onFocus$={() => active.value = item.id} aria-label={`${item.label} 옵션 삭제`} onClick$={() => activate(item.id)}>×</button>}</>}</li>)}</ul>{props.onClear$ && !!props.items.length && ['toggle', 'removable', 'add-filter'].includes(props.mode ?? 'static') && <button type="button" {...owned('tag', 'clear')} onClick$={() => props.onClear$?.()}>전체 삭제</button>}</div>; });
