import { For, Show, createEffect, createSignal, createUniqueId } from 'solid-js';
import type { SideNavigationContract, NavigationItem } from '@unofficial-krds/contracts';
import { owned, keyedItems, stateValue, usable } from '../../internal/catalog';
export type SideNavigationProps = SideNavigationContract;

export function SideNavigation(props: SideNavigationProps) {
  const items = keyedItems(() => props.items), uid = createUniqueId();
  function pathTo(id: string | undefined, nodes: readonly NavigationItem[] = items(), ancestors: NavigationItem[] = []): NavigationItem[] {
    for (const item of nodes) {
      if (item.id === id) return [...ancestors, item];
      const found = pathTo(id, item.children ?? [], [...ancestors, item]);
      if (found.length) return found;
    }
    return [];
  }
  const currentPath = pathTo(props.currentId);
  const expanded = stateValue(() => props.expandedIds, props.defaultExpandedIds, currentPath.slice(0, -1).map(item => item.id), ids => props.onExpandedChange?.({ ids }));
  const deepestExpanded = expanded.read().map(id => pathTo(id)).sort((a, b) => b.length - a.length)[0] ?? [];
  const [contextId, setContextId] = createSignal<string | undefined>(currentPath.length > 2 ? currentPath.at(-3)?.id : deepestExpanded.length > 1 ? deepestExpanded.at(-2)?.id : undefined);
  const context = () => pathTo(contextId()).at(-1);
  let root!: HTMLElement, heading!: HTMLHeadingElement;
  let previous = [...expanded.read()];
  createEffect(() => {
    const ids = expanded.read(), path = pathTo(contextId());
    const collapsed = path.find(item => previous.includes(item.id) && !ids.includes(item.id));
    previous = [...ids];
    if (collapsed) {
      const active = root?.ownerDocument.activeElement;
      const affected = active && root?.contains(active) ? active as HTMLElement : undefined;
      setContextId(pathTo(collapsed.id).at(-2)?.id);
      queueMicrotask(() => { if(affected&&!usable(affected)&&!usable(root.ownerDocument.activeElement)) (root.ownerDocument.getElementById(`${uid}-trigger-${collapsed.id}`) as HTMLButtonElement|null)?.focus(); });
    }
  });
  function Branch(p: { item: NavigationItem; depth: number }) {
    let trigger!: HTMLButtonElement, panel!: HTMLUListElement;
    const committed = () => expanded.read().includes(p.item.id);
    const inlineOpen = () => p.depth < 2 && committed();
    createEffect(() => { if (!inlineOpen() && panel?.contains(document.activeElement)) trigger.focus(); });
    function toggle() {
      if (p.depth === 2) {
        if (!committed()) expanded.request([...expanded.read(), p.item.id]);
        if (expanded.read().includes(p.item.id)) { setContextId(p.item.id); queueMicrotask(() => heading?.focus()); }
      } else expanded.request(committed() ? expanded.read().filter(id => id !== p.item.id) : [...expanded.read(), p.item.id]);
    }
    return <li {...owned('side-navigation', 'item', inlineOpen() ? 'expanded' : 'collapsed')}>
      <Show when={p.item.href} fallback={<Show when={!p.item.children?.length}><span>{p.item.label}</span></Show>}><a {...owned('side-navigation', 'link', props.currentId === p.item.id ? 'current' : '')} href={p.item.href} aria-current={props.currentId === p.item.id ? 'page' : undefined}>{p.item.label}</a></Show>
      <Show when={p.item.children?.length}>
        <button ref={trigger} id={`${uid}-trigger-${p.item.id}`} type="button" {...owned('side-navigation', 'trigger')} aria-expanded={inlineOpen()} aria-controls={`${uid}-${p.item.id}`} onClick={toggle}>{p.item.label} {inlineOpen() ? '접기' : '펼치기'}<span {...owned('side-navigation', 'indicator')} aria-hidden="true"></span></button>
        <ul ref={panel} id={`${uid}-${p.item.id}`} hidden={!inlineOpen()} {...owned('side-navigation', 'submenu')}><Show when={p.depth < 2}><For each={p.item.children}>{item => <Branch item={item} depth={p.depth + 1}/>}</For></Show></ul>
      </Show>
    </li>;
  }
  return <nav ref={root} {...owned('side-navigation')} aria-label={props.title ?? '사이드 메뉴'}>
    <Show when={context() || props.title}><h2 ref={heading} tabIndex={-1} {...owned('side-navigation', 'header')}>{context()?.label ?? props.title}</h2></Show>
    <Show when={context()} fallback={<Show when={props.parentLink}>{link => <a {...owned('side-navigation', 'parent-link')} href={link().href}>{link().label}</a>}</Show>}>{item => <button type="button" {...owned('side-navigation', 'parent-link')} onClick={() => { const id = item().id; setContextId(pathTo(id).at(-2)?.id); queueMicrotask(() => (root.ownerDocument.getElementById(`${uid}-trigger-${id}`) as HTMLButtonElement|null)?.focus()); }}>상위 메뉴</button>}</Show>
    <ul {...owned('side-navigation', 'list')}><For each={context()?.children ?? items()}>{item => <Branch item={item} depth={1}/>}</For></ul>
  </nav>;
}
