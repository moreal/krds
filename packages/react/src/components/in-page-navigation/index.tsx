import { useEffect, useId, useRef, useState } from 'react';
import type { InPageNavigationContract, InPageSection } from '@unofficial-krds/contracts';
import { part, states } from '../../catalog-utils.js';
import { useNarrow } from '../../native-layer.js';
export type InPageNavigationProps = InPageNavigationContract;
export function InPageNavigation({ sections, title = '이 페이지의 구성', activeId, onActiveChange, narrowMode = 'inline' }: InPageNavigationProps) {
    const id = useId();
    const narrow = useNarrow();
    const [expanded, setExpanded] = useState(false);
    const [local, setLocal] = useState<string>();
    const current = activeId ?? local;
    const latest = useRef({ current, onActiveChange });
    latest.current = { current, onActiveChange };
    const flatten = (rows: readonly InPageSection[]): InPageSection[] => rows.flatMap(i => [i, ...flatten(i.children ?? [])]);
    const targetIds = JSON.stringify(flatten(sections).map(section => section.id));
    const controlled = useRef(activeId !== undefined);
    controlled.current = activeId !== undefined;
    useEffect(() => {
        const observer = new IntersectionObserver(entries => {
            const first = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
            if (first && first.target.id !== latest.current.current) {
                if (!controlled.current) setLocal(first.target.id);
                latest.current.onActiveChange?.({ id: first.target.id, reason: 'scroll' });
            }
        }, { rootMargin: '-10% 0px -65% 0px' });
        const ids = JSON.parse(targetIds) as string[];
        const observed = new Set<Element>();
        const synchronize = () => {
            const current = new Set(ids.map(id => document.getElementById(id)).filter((node): node is HTMLElement => node !== null));
            for (const node of observed) if (!current.has(node as HTMLElement)) { observer.unobserve(node); observed.delete(node); }
            for (const node of current) if (!observed.has(node)) { observer.observe(node); observed.add(node); }
        };
        synchronize();
        const lifetime = new MutationObserver(synchronize);
        lifetime.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['id'] });
        return () => { lifetime.disconnect(); observer.disconnect(); };
    }, [targetIds]);
    const activate = (targetId: string, keyboard: boolean, anchor: HTMLAnchorElement) => { const node = anchor.ownerDocument.getElementById(targetId); if (!node)
        return; node.scrollIntoView({ block: 'start', behavior: 'instant' }); if (keyboard) {
        const previous = node.getAttribute('tabindex');
        node.tabIndex = -1;
        node.focus();
        node.addEventListener('blur', () => { if (previous === null)
            node.removeAttribute('tabindex');
        else
            node.setAttribute('tabindex', previous); }, { once: true });
    } if (current !== targetId) {
        if (activeId === undefined)
            setLocal(targetId);
        onActiveChange?.({ id: targetId, reason: 'activation' });
    } };
    const list = (rows: readonly InPageSection[], depth = 0) => <ul {...part('in-page-navigation', 'list', expanded ? 'expanded' : 'collapsed')}>{rows.map(section => <li {...part('in-page-navigation', 'item', current === section.id ? 'active' : '')} key={section.id}><a {...part('in-page-navigation', 'link', current === section.id ? 'active' : '')} href={`#${section.id}`} aria-current={current === section.id ? 'location' : undefined} onClick={e => { e.preventDefault(); activate(section.id, e.detail === 0, e.currentTarget); }} onKeyDown={e => { if (e.key === ' ' && !e.nativeEvent.isComposing) {
        e.preventDefault();
        activate(section.id, true, e.currentTarget);
    } }}>{section.label}{current === section.id && <span {...part('in-page-navigation', 'indicator', 'active')} aria-hidden="true"> ●</span>}</a>{section.children && depth < 2 ? list(section.children, depth + 1) : null}</li>)}</ul>;
    return <nav {...part('in-page-navigation', 'root', states(current !== undefined && 'active', expanded ? 'expanded' : 'collapsed'))} data-krds-layout={narrow ? narrowMode === 'disclosure' ? 'mobile-disclosure' : 'mobile-inline' : 'desktop-side'} aria-label={title}><h2 {...part('in-page-navigation', 'title')}>{title}</h2>{narrow && narrowMode === 'disclosure' && <button {...part('in-page-navigation', 'disclosure-trigger', expanded ? 'expanded' : 'collapsed')} type="button" aria-controls={id} aria-expanded={expanded} onClick={() => setExpanded(!expanded)}>구성 {expanded ? '접기' : '펼치기'}</button>}<div id={id} hidden={narrow && narrowMode === 'disclosure' && !expanded}>{list(sections)}</div></nav>;
}
