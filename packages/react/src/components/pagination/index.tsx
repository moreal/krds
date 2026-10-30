import { useId, useRef, useState, useEffect, useLayoutEffect } from 'react';
import type { PaginationContract } from '@unofficial-krds/contracts';
import { part, states, useValue, useFormReset, usable } from '../../catalog-utils.js';
export type PaginationProps = PaginationContract;
export function Pagination({ page, defaultPage, pageCount, hrefForPage, onPageChange, variant = 'number-links', loadMore }: PaginationProps) {
    const id = useId();
    const state = useValue(page, defaultPage, 1, 'Pagination');
    if (!Number.isInteger(pageCount) || pageCount < 1 || !Number.isInteger(state.current) || state.current < 1 || state.current > pageCount)
        throw new RangeError('Invalid page count/page.');
    const [draft, setDraft] = useState(String(state.current));
    const [invalid, setInvalid] = useState(false);
    const directInput = useRef<HTMLInputElement>(null);
    useEffect(() => { setDraft(String(state.current)); setInvalid(false); }, [state.current]);
    useFormReset(directInput, () => {
        setDraft(String(state.latest.current));
        setInvalid(false);
    }, () => {});
    const previousPending = useRef(false);
    const loadTransaction = useRef<{ shown: number; existing: Set<Element>; origin: HTMLButtonElement | null } | null>(null);
    const loadOrigin = useRef<HTMLButtonElement | null>(null);
    const loadFocusAbandoned = useRef(false);
    useEffect(() => {
        const origin = loadOrigin.current;
        if (!loadMore?.pending || !origin) return;
        const doc = origin.ownerDocument;
        const focus = (event: FocusEvent) => {
            if (event.target !== origin && event.target !== doc.body) loadFocusAbandoned.current = true;
        };
        const pointer = (event: PointerEvent) => {
            if (!origin.contains(event.target as Node)) loadFocusAbandoned.current = true;
        };
        doc.addEventListener('focusin', focus, true);
        doc.addEventListener('pointerdown', pointer, true);
        return () => {
            doc.removeEventListener('focusin', focus, true);
            doc.removeEventListener('pointerdown', pointer, true);
        };
    }, [loadMore?.pending]);
    const temporaryTabIndex = useRef<(() => void) | null>(null);
    useLayoutEffect(() => {
        if (loadMore?.pending && !previousPending.current) {
            loadTransaction.current = {
                shown: loadMore.shown,
                existing: new Set([...document.querySelectorAll('[id]')].filter(usable)),
                origin: loadOrigin.current,
            };
        }
        const transaction = loadTransaction.current;
        if (previousPending.current && !loadMore?.pending) {
            loadTransaction.current = null;
            loadOrigin.current = null;
            if (loadMore && transaction && loadMore.shown <= transaction.shown && !loadFocusAbandoned.current && usable(transaction.origin) && transaction.origin.ownerDocument.activeElement === transaction.origin.ownerDocument.body) {
                transaction.origin.focus();
            }
        }
        if (previousPending.current && loadMore && !loadMore.pending && transaction && loadMore.shown > transaction.shown && loadMore.firstNewItemId) {
            const node = document.getElementById(loadMore.firstNewItemId);
            if (node && !transaction.existing.has(node)) {
                temporaryTabIndex.current?.();
                const original = node.getAttribute('tabindex');
                const restore = () => {
                    if (original === null) node.removeAttribute('tabindex'); else node.setAttribute('tabindex', original);
                    node.removeEventListener('blur', restore);
                    if (temporaryTabIndex.current === restore) temporaryTabIndex.current = null;
                };
                temporaryTabIndex.current = restore;
                node.tabIndex = -1;
                node.addEventListener('blur', restore, { once: true });
                node.focus();
                node.scrollIntoView({ block: 'nearest' });
            }
        }
        previousPending.current = loadMore?.pending ?? false;
    }, [loadMore?.pending, loadMore?.shown, loadMore?.firstNewItemId]);
    useEffect(() => () => temporaryTabIndex.current?.(), []);
    const request = (next: number) => { if (next === state.current || next < 1 || next > pageCount)
        return; state.commit(next); onPageChange?.({ page: next }); };
    const nums = [...new Set([1, ...Array.from({ length: Math.min(7, pageCount) }, (_, i) => Math.min(Math.max(1, state.current - 3), Math.max(1, pageCount - 6)) + i), pageCount])];
    if (variant === 'load-more') {
        if (!loadMore)
            throw new TypeError('load-more requires host loading state.');
        return <nav {...part('pagination', 'root', loadMore.pending ? 'pending' : '')} data-krds-variant={variant} aria-label="결과 더보기"><span {...part('pagination', 'count', loadMore.pending ? 'pending' : '')}>{loadMore.shown} / {loadMore.total}</span><button {...part('pagination', 'load-more', states(loadMore.pending && 'pending', (loadMore.pending || loadMore.shown >= loadMore.total) && 'disabled'))} type="button" disabled={loadMore.pending || loadMore.shown >= loadMore.total} onClick={event => {
            loadOrigin.current = event.currentTarget.ownerDocument.activeElement === event.currentTarget ? event.currentTarget : null;
            loadFocusAbandoned.current = false;
            loadMore.onLoadMore();
        }}>{loadMore.pending ? '불러오는 중' : '더 보기'}</button></nav>;
    }
    return <nav {...part('pagination', 'root', states('current', invalid && 'invalid'))} data-krds-variant={variant} aria-label="페이지 이동"><a {...part('pagination', 'previous', state.current === 1 ? 'disabled' : '')} href={state.current === 1 ? undefined : hrefForPage(state.current - 1)} aria-disabled={state.current === 1 || undefined} onClick={e=>{if(!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey&&e.button===0)request(state.current-1);}}>이전</a><ul {...part('pagination', 'list')}>{nums.map((n, i) => <li {...part('pagination', 'item', n === state.current ? 'current' : '')} key={n}>{i > 0 && n > nums[i - 1] + 1 && <span {...part('pagination', 'ellipsis')}>…</span>}<a {...part('pagination', 'link', n === state.current ? 'current' : '')} href={n === state.current ? undefined : hrefForPage(n)} aria-current={n === state.current ? 'true' : undefined} onClick={e=>{if(!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey&&e.button===0)request(n);}}>{n}</a></li>)}</ul><a {...part('pagination', 'next', state.current === pageCount ? 'disabled' : '')} href={state.current === pageCount ? undefined : hrefForPage(state.current + 1)} aria-disabled={state.current === pageCount || undefined} onClick={e=>{if(!e.metaKey&&!e.ctrlKey&&!e.shiftKey&&!e.altKey&&e.button===0)request(state.current+1);}}>다음</a>{variant === 'direct-page' && <div><label htmlFor={id}>페이지 번호</label><input {...part('pagination', 'input', invalid ? 'invalid' : '')} id={id} ref={directInput} value={draft} inputMode="numeric" aria-invalid={invalid || undefined} aria-describedby={invalid ? `${id}-error` : undefined} onChange={e => setDraft(e.currentTarget.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing)
        e.preventDefault(); }}/><span {...part('pagination', 'total')}>전체 {pageCount}페이지</span><button {...part('pagination', 'go')} type="button" onClick={() => { const next = Number(draft); if (!/^\d+$/.test(draft) || !Number.isInteger(next) || next < 1 || next > pageCount) {
        setInvalid(true);
        return;
    } setInvalid(false); request(next); }}>이동</button>{invalid && <p id={`${id}-error`}>1에서 {pageCount} 사이 페이지를 입력하세요.</p>}</div>}</nav>;
}
