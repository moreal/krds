import { useId, useRef, useState, useEffect, useLayoutEffect, type MouseEvent } from 'react';
import type { PaginationContract } from '@unofficial-krds/contracts';
import { part, useValue, useFormReset, usable } from '../../catalog-utils.js';
import { useNarrow } from '../../native-layer.js';
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
    const narrow = useNarrow();
    // Page window shared by every renderer: first and last stay visible, each gap is its own list item.
    const numbers: (number | 'start-gap' | 'end-gap')[] = (() => {
        const budget = narrow ? 7 : 11;
        if (pageCount <= budget) return Array.from({ length: pageCount }, (_, index) => index + 1);
        const radius = narrow ? 1 : 3;
        let first = Math.max(2, state.current - radius), last = Math.min(pageCount - 1, state.current + radius);
        const size = () => 2 + last - first + 1 + Number(first > 2) + Number(last < pageCount - 1);
        while (size() < budget) {
            if (first > 2) first--;
            else if (last < pageCount - 1) last++;
            else break;
        }
        return [1, ...(first > 2 ? ['start-gap' as const] : []), ...Array.from({ length: last - first + 1 }, (_, index) => first + index), ...(last < pageCount - 1 ? ['end-gap' as const] : []), pageCount];
    })();
    const plain = (e: MouseEvent) => !e.metaKey && !e.ctrlKey && !e.shiftKey && !e.altKey && e.button === 0;
    if (variant === 'load-more') {
        if (!loadMore)
            throw new TypeError('load-more requires host loading state.');
        return <nav {...part('pagination', 'root')} data-krds-variant={variant} aria-label="결과 더보기"><p {...part('pagination', 'count')} role="status">{loadMore.shown} / {loadMore.total}</p><button {...part('pagination', 'load-more', loadMore.pending ? 'pending' : '')} type="button" disabled={loadMore.pending || loadMore.shown >= loadMore.total} onClick={event => {
            loadOrigin.current = event.currentTarget.ownerDocument.activeElement === event.currentTarget ? event.currentTarget : null;
            loadFocusAbandoned.current = false;
            loadMore.onLoadMore();
        }}>더 보기</button></nav>;
    }
    return <nav {...part('pagination', 'root')} data-krds-variant={variant} aria-label="페이지 이동">{state.current > 1 && <a {...part('pagination', 'previous')} href={hrefForPage(state.current - 1)} rel="prev" onClick={e => { if (plain(e)) request(state.current - 1); }}>이전</a>}{variant === 'direct-page' ? <><label htmlFor={id}>페이지</label><input {...part('pagination', 'input', invalid ? 'invalid' : '')} id={id} ref={directInput} type="text" value={draft} inputMode="numeric" aria-invalid={invalid || undefined} aria-describedby={invalid ? `${id}-error` : undefined} onChange={e => setDraft(e.currentTarget.value)} onKeyDown={e => { if (e.key === 'Enter' && !e.nativeEvent.isComposing)
        e.preventDefault(); }}/><span {...part('pagination', 'total')}>/ {pageCount}</span><button {...part('pagination', 'go')} type="button" onClick={() => { const next = Number(draft); if (!/^\d+$/.test(draft) || !Number.isInteger(next) || next < 1 || next > pageCount) {
        setInvalid(true);
        return;
    } setInvalid(false); request(next); }}>이동</button>{invalid && <p id={`${id}-error`} role="status">1부터 {pageCount} 사이의 페이지를 입력하세요.</p>}</> : <ol {...part('pagination', 'list')}>{numbers.map(n => <li {...part('pagination', 'item')} key={n}>{typeof n === 'number' ? <a {...part('pagination', 'link', n === state.current ? 'current' : '')} href={n === state.current ? undefined : hrefForPage(n)} aria-current={n === state.current ? 'page' : undefined} tabIndex={n === state.current ? -1 : undefined} onClick={e => { if (plain(e)) request(n); }}>{n}</a> : <span {...part('pagination', 'ellipsis')}>…</span>}</li>)}</ol>}{state.current < pageCount && <a {...part('pagination', 'next')} href={hrefForPage(state.current + 1)} rel="next" onClick={e => { if (plain(e)) request(state.current + 1); }}>다음</a>}</nav>;
}
