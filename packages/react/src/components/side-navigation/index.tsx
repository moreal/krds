import { useId, useRef, useState, useLayoutEffect, type ReactNode } from 'react';
import type { SideNavigationContract, NavigationItem } from '@unofficial-krds/contracts';
import { part, useValue, unique } from '../../catalog-utils.js';
export type SideNavigationProps = SideNavigationContract;

function pathTo(id: string | undefined, nodes: readonly NavigationItem[], ancestors: readonly NavigationItem[] = []): readonly NavigationItem[] {
  for (const item of nodes) {
    if (item.id === id) return [...ancestors, item];
    const found = pathTo(id, item.children ?? [], [...ancestors, item]);
    if (found.length) return found;
  }
  return [];
}

/**
 * KRDS shows at most two levels at once. A deeper level is disclosed progressively: the list is replaced by that
 * branch under a header naming it, with a "상위 메뉴" button that steps back to the level above.
 */
export function SideNavigation({ items, currentId, expandedIds, defaultExpandedIds, onExpandedChange, title, parentLink }: SideNavigationProps) {
  const id = useId();
  const [currentPath] = useState(() => pathTo(currentId, items));
  const state = useValue<readonly string[]>(expandedIds, defaultExpandedIds, currentPath.slice(0, -1).map(item => item.id), 'SideNavigation');
  const [contextId, setContextId] = useState<string | undefined>(() => {
    if (currentPath.length > 2) return currentPath.at(-3)?.id;
    const deepest = state.current.map(value => pathTo(value, items)).sort((a, b) => b.length - a.length)[0] ?? [];
    return deepest.length > 1 ? deepest.at(-2)?.id : undefined;
  });
  const context = pathTo(contextId, items).at(-1);
  const root = useRef<HTMLElement>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const previous = useRef(state.current);
  const pendingDrill = useRef<string | undefined>(undefined);
  const pendingFocus = useRef<{ target: 'header' } | { target: 'trigger'; id: string; onlyIfLost: boolean } | undefined>(undefined);
  unique(items.map(i => i.id), 'SideNavigation');
  const triggerId = (itemId: string) => `${id}-trigger-${itemId}`;

  useLayoutEffect(() => {
    const ids = state.current, before = previous.current;
    previous.current = ids;
    const focused = root.current?.ownerDocument.activeElement;
    // A requested drill-down takes effect once its branch is actually expanded (a controlled owner may refuse).
    const drill = pendingDrill.current;
    pendingDrill.current = undefined;
    if (drill !== undefined && ids.includes(drill)) { pendingFocus.current = { target: 'header' }; setContextId(drill); return; }
    // Collapsing a branch on the drilled-in path steps the view back out to that branch's level.
    const collapsed = pathTo(contextId, items).find(item => before.includes(item.id) && !ids.includes(item.id));
    if (collapsed) {
      if (focused && root.current?.contains(focused)) pendingFocus.current = { target: 'trigger', id: collapsed.id, onlyIfLost: true };
      setContextId(pathTo(collapsed.id, items).at(-2)?.id);
      return;
    }
    const panel = focused?.closest<HTMLElement>('[data-krds-part="submenu"]');
    if (panel?.hidden) root.current?.querySelector<HTMLElement>(`[aria-controls="${panel.id}"]`)?.focus();
  }, [state.current]);

  useLayoutEffect(() => {
    const focus = pendingFocus.current;
    pendingFocus.current = undefined;
    if (!focus) return;
    if (focus.target === 'header') { heading.current?.focus(); return; }
    const active = root.current?.ownerDocument.activeElement;
    if (focus.onlyIfLost && active && root.current?.contains(active) && !active.closest('[hidden]')) return;
    root.current?.ownerDocument.getElementById(triggerId(focus.id))?.focus();
  }, [contextId]);

  const rowsOf = (rows: readonly NavigationItem[], depth: 1 | 2): ReactNode => rows.map(item => {
    const parent = !!item.children?.length;
    const committed = state.current.includes(item.id);
    // Second-level parents never open inline: their trigger enters the branch instead.
    const open = parent && depth < 2 && committed;
    const toggle = () => {
      if (depth === 2) {
        if (committed) { pendingFocus.current = { target: 'header' }; setContextId(item.id); return; }
        const ids = [...state.current, item.id];
        pendingDrill.current = item.id;
        state.commit(ids);
        onExpandedChange?.({ ids });
        return;
      }
      const ids = committed ? state.current.filter(v => v !== item.id) : [...state.current, item.id];
      state.commit(ids);
      onExpandedChange?.({ ids });
    };
    return <li {...part('side-navigation', 'item', open ? 'expanded' : 'collapsed')} key={item.id}>
      {item.href ? <a {...part('side-navigation', 'link', currentId === item.id ? 'current' : '')} href={item.href} aria-current={currentId === item.id ? 'page' : undefined}>{item.label}</a> : !parent && <span>{item.label}</span>}
      {parent ? <>
        <button {...part('side-navigation', 'trigger')} id={triggerId(item.id)} type="button" aria-expanded={open} aria-controls={`${id}-${item.id}`} onClick={toggle}>{item.label} {open ? '접기' : '펼치기'}<span {...part('side-navigation', 'indicator')} aria-hidden="true"></span></button>
        <ul {...part('side-navigation', 'submenu')} id={`${id}-${item.id}`} hidden={!open}>{depth < 2 && rowsOf(item.children!, 2)}</ul>
      </> : null}
    </li>;
  });

  return <nav {...part('side-navigation', 'root')} aria-label={title ?? '사이드 메뉴'} ref={root}>
    {(context || title) && <h2 {...part('side-navigation', 'header')} tabIndex={-1} ref={heading}>{context?.label ?? title}</h2>}
    {context
      ? <button {...part('side-navigation', 'parent-link')} type="button" onClick={() => { pendingFocus.current = { target: 'trigger', id: context.id, onlyIfLost: false }; setContextId(pathTo(context.id, items).at(-2)?.id); }}>상위 메뉴</button>
      : parentLink && <a {...part('side-navigation', 'parent-link')} href={parentLink.href}>{parentLink.label}</a>}
    <ul {...part('side-navigation', 'list')}>{rowsOf(context?.children ?? items, 1)}</ul>
  </nav>;
}
