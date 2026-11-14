import { useLayoutEffect, useRef, useState, type FocusEvent } from 'react';
import type { TagContract } from '@unofficial-krds/contracts';
import { part, usable } from '../../catalog-utils.js';
export interface TagProps extends TagContract {
    visibleCount?: number;
}
export function Tag({ items, mode = 'static', selectedIds = [], onSelectionChange, onRemove, onAdd, onClear, appliedBarId, visibleCount = items.length }: TagProps) { const root = useRef<HTMLDivElement>(null); const list = useRef<HTMLUListElement>(null); const [active, setActive] = useState(items.find(i => !i.disabled)?.id); const [more, setMore] = useState(false); const pending = useRef<{
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
            else { list.current?.focus(); setActive(roving); }
            return;
        }
        if (active === roving) return;
        setActive(roving);
        const previous = focusedControl.current;
        const doc = root.current?.ownerDocument;
        if (previous && doc && (doc.activeElement === previous || doc.activeElement === doc.body && (!previous.isConnected || !usable(previous)))) {
            const next = controls.find(node => node.dataset.tagControl === roving);
            if (usable(next)) next.focus(); else list.current?.focus();
        }
    }, [items, mode, visibleCount, more, active, roving]); const control = (id: string) => ({ 'data-tag-control': id, tabIndex: roving === id ? 0 : -1, onFocus: (event: FocusEvent<HTMLElement>) => { focusedControl.current = event.currentTarget; setActive(id); } }); return <div {...part('tag', 'root')} data-krds-mode={mode} ref={root} role={mode === 'static' ? undefined : 'group'} aria-label={mode === 'static' ? undefined : '옵션 태그'} onKeyDown={e => { if (e.nativeEvent.isComposing || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key))
    return; const controls = [...e.currentTarget.querySelectorAll<HTMLElement>('[data-tag-control]:not(:disabled):not([aria-disabled="true"])')]; const index = controls.indexOf(e.target as HTMLElement); if (index < 0)
    return; e.preventDefault(); const next = e.key === 'Home' ? controls[0] : e.key === 'End' ? controls.at(-1) : controls[(index + (e.key === 'ArrowLeft' ? -1 : 1) + controls.length) % controls.length]; next?.focus(); setActive(next?.dataset.tagControl); }}><ul {...part('tag', 'list')} ref={list} tabIndex={-1}>{visible.map(item => { const selected = selectedIds.includes(item.id); return <li {...part('tag', 'item', selected ? 'selected' : '')} key={item.id}>{mode === 'link' ? <a {...part('tag', 'label')} href={item.disabled ? undefined : item.href} aria-disabled={item.disabled || undefined} {...control(item.id)}>{item.label}</a> : mode === 'toggle' || mode === 'add-filter' ? <button {...part('tag', 'label')} {...control(item.id)} type="button" disabled={item.disabled} aria-pressed={mode === 'toggle' ? selected : undefined} aria-label={mode === 'add-filter' ? `${item.label} 필터 옵션 추가` : undefined} onClick={() => { if (mode === 'toggle')
    onSelectionChange?.({ ids: selected ? selectedIds.filter(id => id !== item.id) : [...selectedIds, item.id] }); else {
    onAdd?.({ id: item.id });
    queueMicrotask(() => { const bar = appliedBarId ? document.getElementById(appliedBarId) : null; if (bar) {
        bar.tabIndex = -1;
        bar.focus();
    } });
} }}>{item.label}</button> : <><span {...part('tag', 'label')}>{item.label}</span>{mode === 'removable' && <button {...part('tag', 'remove')} {...control(item.id)} type="button" disabled={item.disabled} aria-label={`${item.label} 옵션 삭제`} onClick={() => {
    const index = items.findIndex(i => i.id === item.id);
    pending.current = { id: item.id, previous: items.slice(0, index).reverse().find(i => !i.disabled)?.id, next: items.slice(index + 1).find(i => !i.disabled)?.id };
    onRemove?.({ id: item.id });
}}>×</button>}</>}</li>; })}</ul>{items.length > visibleCount && <button {...part('tag', 'more', more ? 'expanded' : '')} type="button" aria-expanded={more} onClick={() => setMore(!more)}>{more ? '접기' : '더 보기'}</button>}{onClear && items.length > 0 && ['toggle', 'removable', 'add-filter'].includes(mode) && <button {...part('tag', 'clear')} type="button" onClick={onClear}>전체 삭제</button>}</div>; }
