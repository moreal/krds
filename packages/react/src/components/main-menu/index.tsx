import { useId, useRef, useLayoutEffect } from 'react';
import type { MainMenuContract, NavigationItem } from '@unofficial-krds/contracts';
import { part, states, useValue, unique, focusSafe, usable } from '../../catalog-utils.js';
import { NativeLayer, useNarrow } from '../../native-layer.js';
export interface MainMenuProps extends MainMenuContract {
    mobileTriggerComponent?: 'main-menu' | 'header';
}
function pathTo(items: readonly NavigationItem[], id: string | null): readonly string[] {
    if (id === null) return [];
    for (const item of items) {
        if (item.id === id) return [item.id];
        const children = item.children ? pathTo(item.children, id) : [];
        if (children.length) return [item.id, ...children];
    }
    return [];
}
function allIds(items: readonly NavigationItem[]): string[] {
    return items.flatMap(item => [item.id, ...allIds(item.children ?? [])]);
}
export function MainMenu({ items, currentId, expandedId, defaultExpandedId, onExpandedChange, mobileOpen, defaultMobileOpen, onMobileOpenChange, query = '', onQueryChange, mobileTriggerComponent = 'main-menu', label = '메인 메뉴', mobileTriggerId, mobileTriggerLabel = '전체 메뉴' }: MainMenuProps) {
    const id = useId();
    const expanded = useValue<string | null>(expandedId, defaultExpandedId, null, 'MainMenu.expanded');
    const mobile = useValue(mobileOpen, defaultMobileOpen, false, 'MainMenu.mobile');
    const narrow = useNarrow();
    const trigger = useRef<HTMLButtonElement>(null);
    const root = useRef<HTMLElement>(null);
    const pendingFocus = useRef<{ next: string | null; triggerId: string } | null>(null);
    unique(allIds(items), 'MainMenu');
    const path = pathTo(items, expanded.current);
    const parentOf = (itemId: string) => pathTo(items, itemId).at(-2) ?? null;
    const requestExpanded = (next: string | null, returnTrigger?: string) => {
        if (next === expanded.current) return;
        if (returnTrigger) pendingFocus.current = { next, triggerId: returnTrigger };
        expanded.commit(next);
        onExpandedChange?.({ id: next });
    };
    useLayoutEffect(() => {
        const pending = pendingFocus.current;
        if (!pending || pending.next !== expanded.current) return;
        pendingFocus.current = null;
        const target = root.current?.ownerDocument.getElementById(pending.triggerId);
        if (usable(target)) target.focus();
    }, [expanded.current]);
    const requestMobile = (next: boolean) => {
        if (next === mobile.current) return;
        mobile.commit(next);
        onMobileOpenChange?.({ open: next });
    };
    const normalizedQuery = query.toLocaleLowerCase();
    const ownMatch = (item: NavigationItem) => item.label.toLocaleLowerCase().includes(normalizedQuery);
    const matches = (item: NavigationItem): boolean => !query || ownMatch(item) || !!item.children?.some(matches);
    const list = (rows: readonly NavigationItem[], depth = 0, ancestorMatches = false) => <ul {...part('main-menu', depth ? 'submenu' : 'list', depth ? (expanded.current ? 'expanded' : 'collapsed') : '')}>
        {rows.filter(item => ancestorMatches || matches(item)).map(item => {
            const parent = !!item.children?.length;
            const open = path.includes(item.id);
            const current = item.id === currentId;
            return <li {...part('main-menu', 'item', states(current && 'current', parent && (open ? 'expanded' : 'collapsed')))} key={item.id}>
                {parent ? <button {...part('main-menu', 'trigger', states(open ? 'expanded' : 'collapsed', current && 'current'))} id={`${id}-${item.id}-trigger`} type="button" aria-expanded={open} aria-controls={`${id}-${item.id}`} aria-current={open ? 'true' : undefined} onClick={() => requestExpanded(open ? parentOf(item.id) : item.id)}>{item.label}<span {...part('main-menu', 'indicator')} aria-hidden="true"></span></button> : item.href ? <a {...part('main-menu', 'link', current ? 'current' : '')} href={item.href} aria-current={current ? 'page' : undefined}>{item.label}</a> : <span>{item.label}</span>}
                {parent && <div id={`${id}-${item.id}`} hidden={!open}>
                    {item.description && <p {...part('main-menu', 'description')}>{item.description}</p>}
                    {depth < 2 && list(item.children!, depth + 1, ancestorMatches || !!query && ownMatch(item))}
                </div>}
            </li>;
        })}
    </ul>;
    const retreat = () => {
        const previous = expanded.current;
        if (previous) requestExpanded(parentOf(previous), `${id}-${previous}-trigger`);
    };
    const content = <>
        <h2 {...part('main-menu', 'submenu-title')} id={`${id}-title`}>{label}</h2>
        {narrow && expanded.current && <button {...part('main-menu', 'back')} type="button" onClick={retreat}>이전 메뉴</button>}
        {onQueryChange && <label>메뉴 검색<input {...part('main-menu', 'search')} type="search" value={query} onChange={event => onQueryChange({ value: event.currentTarget.value })}/></label>}
        {list(items)}
    </>;
    return <nav {...part('main-menu', 'root', states(expanded.current ? 'expanded' : 'collapsed', mobile.current && 'mobile-open', currentId !== undefined && 'current'))} data-krds-layout={narrow ? 'mobile' : 'desktop'} aria-label={label} ref={root} onKeyDown={event => {
        if (event.key === 'Escape' && !event.defaultPrevented && !event.nativeEvent.isComposing && expanded.current) {
            event.preventDefault();
            requestExpanded(null, `${id}-${path[0]}-trigger`);
        }
    }}>
        {narrow ? <>
            <button {...part(mobileTriggerComponent, 'mobile-trigger', mobile.current ? 'expanded' : 'collapsed')} ref={trigger} id={mobileTriggerId ?? `${id}-mobile-trigger`} type="button" aria-expanded={mobile.current} aria-controls={`${id}-mobile`} onClick={() => requestMobile(true)}>{mobileTriggerLabel}</button>
            <NativeLayer component="main-menu" open={mobile.current} titleId={`${id}-title`} onEscape={() => requestMobile(false)} onReleased={() => focusSafe(document, trigger.current?.id, undefined, trigger.current)}>
                <div {...part('main-menu', 'mobile-content', 'mobile-open')} id={`${id}-mobile`}>{content}<button {...part('main-menu', 'close')} type="button" onClick={() => requestMobile(false)}>메뉴 닫기</button></div>
            </NativeLayer>
        </> : content}
    </nav>;
}
