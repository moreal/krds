import { useLayoutEffect, useRef, useState } from 'react';
import type { TagContract } from '@unofficial-krds/contracts';
import { part, states, usable } from '../../catalog-utils.js';
export interface TagProps extends TagContract {
    visibleCount?: number;
}
export function Tag({ items, mode = 'static', selectedIds = [], onSelectionChange, onRemove, onAdd, onClear, appliedBarId, visibleCount = items.length }: TagProps) { const root = useRef<HTMLDivElement>(null); const [active, setActive] = useState(items.find(i => !i.disabled)?.id); const [more, setMore] = useState(false); const pending = useRef<{
    id: string;
    previous?: string;
    next?: string;
 } | undefined>(undefined);
    const visible = more ? items : items.slice(0, visibleCount);
    const focusedControl = useRef<HTMLElement | null>(null);
    const roving = visible.some(item => item.id === active && !item.disabled) ? active : visible.find(item => !item.disabled)?.id;
    useLayoutEffect(() => {
        const removed = pending.current;
        const controls = [...root.current?.querySelectorAll<HTMLElement>('[data-tag-control]:not(:disabled):not([aria-disabled="true"])') ?? []];
        if (removed && !items.some(item => item.id === removed.id)) {
            pending.current = undefined;
            const next = controls.find(node => node.dataset.tagControl === removed.previous) ?? controls.find(node => node.dataset.tagControl === removed.next);
            if (usable(next)) { next.focus(); setActive(next.dataset.tagControl); }
            else { root.current?.focus(); setActive(roving); }
            return;
        }
        if (active === roving) return;
        setActive(roving);
        const previous = focusedControl.current;
        const doc = root.current?.ownerDocument;
        if (previous && doc && (doc.activeElement === previous || doc.activeElement === doc.body && (!previous.isConnected || !usable(previous)))) {
            const next = controls.find(node => node.dataset.tagControl === roving);
            if (usable(next)) next.focus(); else root.current?.focus();
        }
    }, [items, mode, visibleCount, more, active, roving]); return <div {...part('tag', 'root', states(selectedIds.length > 0 && 'selected', more && 'expanded'))} data-krds-mode={mode} ref={root} role={mode === 'static' ? 'list' : 'group'} aria-label="태그" tabIndex={-1} onKeyDown={e => { if (e.nativeEvent.isComposing || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key))
    return; const controls = [...e.currentTarget.querySelectorAll<HTMLElement>('[data-tag-control]:not(:disabled):not([aria-disabled="true"])')]; const index = controls.indexOf(e.target as HTMLElement); if (index < 0)
    return; e.preventDefault(); const next = e.key === 'Home' ? controls[0] : e.key === 'End' ? controls.at(-1) : controls[(index + (e.key === 'ArrowLeft' ? -1 : 1) + controls.length) % controls.length]; next?.focus(); setActive(next?.dataset.tagControl); }}><div {...part('tag', 'list', more ? 'expanded' : '')}>{visible.map(item => { const selected = selectedIds.includes(item.id); const token = states(selected && 'selected', item.disabled && 'disabled'); return <span {...part('tag', 'item', token)} role={mode==='static'?'listitem':undefined} key={item.id}>{mode === 'static' ? <span {...part('tag', 'label')}>{item.label}</span> : mode === 'link' ? <a {...part('tag', 'label')} href={item.disabled ? undefined : item.href} aria-disabled={item.disabled || undefined} data-tag-control={item.id} tabIndex={roving === item.id ? 0 : -1} onFocus={event => { focusedControl.current = event.currentTarget; setActive(item.id); }}>{item.label}</a> : <button {...part('tag', mode === 'removable' ? 'remove' : 'label', token)} data-tag-control={item.id} type="button" disabled={item.disabled} tabIndex={roving === item.id ? 0 : -1} aria-pressed={mode === 'toggle' ? selected : undefined} aria-label={mode === 'removable' ? `${item.label} 옵션 삭제` : mode === 'add-filter' ? `${item.label} 필터 옵션 추가` : undefined} onFocus={event => { focusedControl.current = event.currentTarget; setActive(item.id); }} onClick={() => { if (mode === 'toggle')
    onSelectionChange?.({ ids: selected ? selectedIds.filter(id => id !== item.id) : [...selectedIds, item.id] }); if (mode === 'removable') {
    const index = items.findIndex(i => i.id === item.id);
    pending.current = { id: item.id, previous: items.slice(0, index).reverse().find(i => !i.disabled)?.id, next: items.slice(index + 1).find(i => !i.disabled)?.id };
    onRemove?.({ id: item.id });
} if (mode === 'add-filter') {
    onAdd?.({ id: item.id });
    queueMicrotask(() => { const bar = appliedBarId ? document.getElementById(appliedBarId) : null; if (bar) {
        bar.tabIndex = -1;
        bar.focus();
    } });
} }}><span aria-hidden="true">{selected ? '✓ ' : ''}</span>{item.label}{mode === 'removable' ? ' ×' : ''}</button>}</span>; })}</div>{items.length > visibleCount && <button {...part('tag', 'more', more ? 'expanded' : '')} type="button" aria-expanded={more} onClick={() => setMore(!more)}>{more ? '접기' : '더 보기'}</button>}{onClear && <button {...part('tag', 'clear')} type="button" onClick={onClear}>전체 삭제</button>}</div>; }
