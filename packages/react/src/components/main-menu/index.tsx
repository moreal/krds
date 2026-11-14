import { useId, useRef, useLayoutEffect, type ReactNode, type RefObject } from 'react';
import type { MainMenuContract, NavigationItem } from '@unofficial-krds/contracts';
import { part, useValue, unique, focusSafe, usable } from '../../catalog-utils.js';
import { NativeLayer, useNarrow } from '../../native-layer.js';
export interface MainMenuProps extends MainMenuContract {
    mobileTriggerComponent?: 'main-menu' | 'header';
    /** A composing surface owns the visible mobile trigger; this menu hides its own and returns focus there. */
    mobileTriggerRef?: RefObject<HTMLButtonElement | null>;
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
export function MainMenu({ items, currentId, expandedId, defaultExpandedId, onExpandedChange, mobileOpen, defaultMobileOpen, onMobileOpenChange, query = '', onQueryChange, mobileTriggerComponent = 'main-menu', mobileTriggerRef, label = '메인 메뉴', mobileTriggerId, mobileTriggerLabel = '전체 메뉴' }: MainMenuProps) {
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
    const containsCurrent = (item: NavigationItem): boolean => item.id === currentId || !!item.children?.some(containsCurrent);
    // Three levels are exposed; a parent keeps its own link (when it has one) beside the disclosure trigger.
    const rowsOf = (rows: readonly NavigationItem[], depth = 0, ancestorMatches = false): ReactNode => rows.filter(item => ancestorMatches || matches(item)).map(item => {
        const parent = !!item.children?.length;
        const open = parent && depth < 2 && path.includes(item.id);
        const current = item.id === currentId;
        const token = open ? 'expanded' : 'collapsed';
        return <li {...part('main-menu', 'item', token)} key={item.id}>
            {item.href ? <a {...part('main-menu', 'link', current ? 'current' : '')} href={item.href} aria-current={current ? 'page' : undefined}>{item.label}</a> : !parent && <span>{item.label}</span>}
            {!parent && item.description && <p {...part('main-menu', 'description')}>{item.description}</p>}
            {parent && <>
                <button {...part('main-menu', 'trigger', token)} id={`${id}-${item.id}-trigger`} type="button" aria-current={containsCurrent(item) ? 'true' : undefined} aria-label={item.label} aria-controls={`${id}-${item.id}`} aria-expanded={open} onClick={() => requestExpanded(open ? parentOf(item.id) : item.id)}>{item.label}<span {...part('main-menu', 'indicator')} aria-hidden="true"></span></button>
                <ul id={`${id}-${item.id}`} {...part('main-menu', 'submenu', token)} hidden={!open}>
                    {depth < 2 && <>
                        <li><h3 {...part('main-menu', 'submenu-title')}>{item.label}</h3>{item.description && <p {...part('main-menu', 'description')}>{item.description}</p>}</li>
                        {rowsOf(item.children!, depth + 1, ancestorMatches || !!query && ownMatch(item))}
                    </>}
                </ul>
            </>}
        </li>;
    });
    const retreat = () => {
        const previous = expanded.current;
        if (previous) requestExpanded(parentOf(previous), `${id}-${previous}-trigger`);
    };
    const search = onQueryChange && <label>메뉴 검색<input {...part('main-menu', 'search')} type="search" value={query} onChange={event => onQueryChange({ value: event.currentTarget.value })}/></label>;
    const menu = <ul {...part('main-menu', 'list')}>{rowsOf(items)}</ul>;
    return <nav {...part('main-menu', 'root')} aria-label={label} data-krds-layout={narrow ? 'mobile' : 'desktop'} ref={root} onKeyDown={event => {
        if (event.key === 'Escape' && !event.defaultPrevented && !event.nativeEvent.isComposing && expanded.current) {
            event.preventDefault();
            requestExpanded(null, `${id}-${path[0]}-trigger`);
        }
    }}>
        <button {...part(mobileTriggerComponent, 'mobile-trigger')} ref={trigger} id={mobileTriggerId ?? `${id}-mobile-trigger`} type="button" hidden={!narrow || mobileTriggerRef !== undefined} aria-expanded={mobile.current} aria-controls={`${id}-mobile`} onClick={() => requestMobile(true)}>{mobileTriggerLabel}</button>
        {narrow ? <NativeLayer open={mobile.current} label={label} onEscape={() => requestMobile(false)} onReleased={() => { const opener = mobileTriggerRef?.current ?? trigger.current; focusSafe(document, opener?.id || undefined, undefined, opener); }}>
            <div {...part('main-menu', 'mobile-content', 'mobile-open')} id={`${id}-mobile`}><button {...part('main-menu', 'close')} type="button" onClick={() => requestMobile(false)}>메뉴 닫기</button><button {...part('main-menu', 'back')} type="button" hidden={!expanded.current} onClick={retreat}>이전 메뉴</button>{search}{menu}</div>
        </NativeLayer> : <>{search}{menu}</>}
    </nav>;
}
