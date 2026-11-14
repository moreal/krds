import { For, Show, createEffect, createSignal, createUniqueId, untrack, onCleanup } from 'solid-js';
import { Portal } from 'solid-js/web';
import type { MainMenuContract, NavigationItem } from '@unofficial-krds/contracts';
import { owned, keyedItems, stateValue, ignoredKey, restore, usable, assertTreeDepth } from '../../internal/catalog';
import { narrowViewport, panelLifecycle } from '../../internal/panel';
import { activeModalContent } from '../../internal/modal-layer';

export interface MainMenuProps extends MainMenuContract { mobileTriggerRef?: () => HTMLButtonElement | undefined; }
export function MainMenu(props: MainMenuProps) {
  // Input may contain deeper drilldown data; only three levels are exposed in a frame.
  createEffect(() => assertTreeDepth(props.items, Number.MAX_SAFE_INTEGER));
  const items = keyedItems(() => props.items), uid = createUniqueId(), narrow = narrowViewport();
  const expanded = stateValue(() => props.expandedId, props.defaultExpandedId, null, id => props.onExpandedChange?.({ id }));
  const mobile = stateValue(() => props.mobileOpen, props.defaultMobileOpen, false, open => props.onMobileOpenChange?.({ open }));
  const query = stateValue(() => props.query, undefined, '', value => props.onQueryChange?.({ value }));
  const [childrenOpen, setChildrenOpen] = createSignal<readonly string[]>([]);
  const [contextId, setContextId] = createSignal<string>();
  const frames: { contextId: string | undefined; triggerId: string }[] = [];
  let trigger!: HTMLButtonElement;
  let root!: HTMLElement;
  let contextRoot: string | null = null;
  const [panel, setPanel] = createSignal<HTMLElement>();
  let wasMobile = false;
  const containsCurrent = (item: NavigationItem): boolean => item.id === props.currentId || (item.children ?? []).some(containsCurrent);
  function find(id: string | undefined, nodes: readonly NavigationItem[] = items()): NavigationItem | undefined {
    for (const item of nodes) { if (item.id === id) return item; const child = find(id, item.children ?? []); if (child) return child; }
  }
  const context = () => find(contextId());
  createEffect(() => {
    const committedRoot = expanded.read();
    if (!contextId() || committedRoot === contextRoot) return;
    const previousRoot = contextRoot;
    const active = document.activeElement as HTMLElement | null;
    const affected = active && (root?.contains(active) || panel()?.contains(active)) ? active : undefined;
    frames.length = 0;
    contextRoot = null;
    setContextId(undefined);
    setChildrenOpen([]);
    queueMicrotask(() => {
      if (affected && !usable(affected) && !usable(document.activeElement) && expanded.read() === committedRoot && !contextId())
        document.getElementById(`${uid}-trigger-${previousRoot}`)?.focus();
    });
  });
  const focusTrigger = (id: string) => queueMicrotask(() => document.getElementById(`${uid}-trigger-${id}`)?.focus());
  function back() {
    if (contextId()) {
      const frame = frames.pop(); setContextId(frame?.contextId); if (frame) focusTrigger(frame.triggerId);
    } else {
      const id = expanded.read(); expanded.request(null);
      queueMicrotask(() => { if (id && !expanded.read()) document.getElementById(`${uid}-trigger-${id}`)?.focus(); });
    }
  }
  panelLifecycle(() => narrow() && mobile.read(), () => true, panel, () => mobile.request(false));
  createEffect(() => { const actual = narrow() && mobile.read(); if (wasMobile && !actual) queueMicrotask(() => restore(props.mobileTriggerRef?.() ?? trigger)); wasMobile = actual; });
  function escape(event: KeyboardEvent) {
    if (ignoredKey(event) || event.key !== 'Escape') return;
    if (contextId() || expanded.read()) { event.preventDefault(); event.stopPropagation(); back(); }
    else if (mobile.read()) { event.preventDefault(); mobile.request(false); }
  }
  // Desktop disclosure dismissal is independent of the mobile modal lifecycle.
  // Requests never optimistically hide a controlled panel or move outside focus.
  createEffect(() => {
    if (narrow() || !expanded.read()) return;
    const document = root.ownerDocument;
    const window = document.defaultView!;
    let active = true, pointerAction = false, pointerEnd: ReturnType<typeof setTimeout> | undefined;
    const bounds = () => {
      const viewport = window.visualViewport;
      const bottom = viewport ? viewport.offsetTop + viewport.height : window.innerHeight;
      root.style.setProperty('--krds-main-menu-available-height', `${Math.max(0, bottom - root.getBoundingClientRect().bottom)}px`);
    };
    bounds();
    const observer = new ResizeObserver(bounds); observer.observe(root);
    window.addEventListener('resize', bounds);
    document.addEventListener('scroll', bounds, true);
    window.visualViewport?.addEventListener('resize', bounds);
    window.visualViewport?.addEventListener('scroll', bounds);
    const pointer = (event: PointerEvent) => {
      clearTimeout(pointerEnd); pointerAction = !root.contains(event.target as Node);
      if (pointerAction) expanded.request(null);
    };
    const endPointer = () => {
      clearTimeout(pointerEnd);
      pointerEnd = setTimeout(() => { pointerAction = false; }, 0);
    };
    const focus = (event: FocusEvent) => {
      if (!pointerAction && !root.contains(event.target as Node)) expanded.request(null);
    };
    const key = (event: KeyboardEvent) => {
      pointerAction = false; clearTimeout(pointerEnd);
      const modal = activeModalContent(document);
      if (modal && !modal.contains(root)) return;
      escape(event);
    };
    const leave = (event: FocusEvent) => {
      // A context change removes its old heading and can emit the same null
      // relatedTarget as leaving the document. Ignore those detached nodes.
      const departing = event.target as Node;
      if (event.relatedTarget || !root.contains(departing)) return;
      queueMicrotask(() => {
        if (active && !pointerAction && root.isConnected && departing.isConnected && !narrow() && !root.contains(document.activeElement)) expanded.request(null);
      });
    };
    document.addEventListener('pointerdown', pointer);
    document.addEventListener('pointerup', endPointer);
    document.addEventListener('pointercancel', endPointer);
    document.addEventListener('click', endPointer);
    document.addEventListener('focusin', focus);
    root.addEventListener('focusout', leave);
    document.addEventListener('keydown', key);
    onCleanup(() => {
      active = false; clearTimeout(pointerEnd); observer.disconnect();
      root.style.removeProperty('--krds-main-menu-available-height');
      window.removeEventListener('resize', bounds);
      document.removeEventListener('scroll', bounds, true);
      window.visualViewport?.removeEventListener('resize', bounds);
      window.visualViewport?.removeEventListener('scroll', bounds);
      document.removeEventListener('pointerdown', pointer);
      document.removeEventListener('pointerup', endPointer);
      document.removeEventListener('pointercancel', endPointer);
      document.removeEventListener('click', endPointer);
      document.removeEventListener('focusin', focus);
      root.removeEventListener('focusout', leave);
      document.removeEventListener('keydown', key);
    });
  });
  function SearchField() {
    let input!: HTMLInputElement;
    let composing = false;
    const initialValue = untrack(query.read);
    createEffect(() => { const committed = query.read(); if (input && !composing && input.value !== committed) input.value = committed; });
    const commit = () => { query.request(input.value); input.value = query.read(); };
    return <label>메뉴 검색<input ref={input} {...owned('main-menu', 'search')} type="search" value={initialValue} onCompositionStart={() => composing = true} onCompositionEnd={() => { composing = false; commit(); }} onInput={event => { if (!composing && !event.isComposing) commit(); }}/></label>;
  }
  function Branch(p: { item: NavigationItem; depth: number }) {
    const outer = () => p.depth === 0 && !contextId();
    const committed = () => outer() ? expanded.read() === p.item.id : childrenOpen().includes(p.item.id);
    const exposed = () => p.depth < 2 && committed();
    function toggle() {
      if (p.depth === 2) {
        if (!contextId()) contextRoot = expanded.read();
        frames.push({ contextId: contextId(), triggerId: p.item.id }); setContextId(p.item.id);
        queueMicrotask(() => document.getElementById(`${uid}-context-title`)?.focus());
      } else if (outer()) expanded.request(committed() ? null : p.item.id);
      else setChildrenOpen(previous => committed() ? previous.filter(id => id !== p.item.id) : [...previous, p.item.id]);
    }
    return <li {...owned('main-menu', 'item', exposed() ? 'expanded' : 'collapsed')}>
      <Show when={p.item.href} fallback={<Show when={!p.item.children?.length}><span>{p.item.label}</span></Show>}><a {...owned('main-menu', 'link', props.currentId === p.item.id ? 'current' : '')} href={p.item.href} aria-current={props.currentId === p.item.id ? 'page' : undefined}>{p.item.label}</a></Show>
      <Show when={!p.item.children?.length && p.item.description}><p {...owned('main-menu', 'description')}>{p.item.description}</p></Show>
      <Show when={p.item.children?.length}>
        <button type="button" {...owned('main-menu', 'trigger', exposed() ? 'expanded' : 'collapsed')} id={`${uid}-trigger-${p.item.id}`} aria-current={containsCurrent(p.item) ? 'true' : undefined} aria-label={p.item.label} aria-controls={`${uid}-${p.item.id}`} aria-expanded={exposed()} onClick={toggle}>{p.item.label}<span {...owned('main-menu', 'indicator')} aria-hidden="true"></span></button>
        <ul id={`${uid}-${p.item.id}`} {...owned('main-menu', 'submenu', exposed() ? 'expanded' : 'collapsed')} hidden={!exposed()}>
          <Show when={p.depth < 2}>
            <li><h3 {...owned('main-menu', 'submenu-title')}>{p.item.label}</h3><Show when={p.item.description}><p {...owned('main-menu', 'description')}>{p.item.description}</p></Show></li>
            <For each={p.item.children}>{item => <Branch item={item} depth={p.depth + 1}/>}</For>
          </Show>
        </ul>
      </Show>
    </li>;
  }
  function MenuList() {
    return <><Show when={context()}>{item => <><h3 id={`${uid}-context-title`} tabIndex={-1} {...owned('main-menu', 'submenu-title')}>{item().label}</h3><Show when={item().description}><p {...owned('main-menu', 'description')}>{item().description}</p></Show></>}</Show><ul {...owned('main-menu', 'list')}><For each={context()?.children ?? items()}>{item => <Branch item={item} depth={0}/>}</For></ul></>;
  }
  function BackControl() { return <button type="button" {...owned('main-menu', 'back')} hidden={!contextId() && !expanded.read()} onClick={back}>이전 메뉴</button>; }
  // Native nodes and local child state survive responsive movement into the portal.
  const searchField = <Show when={props.query !== undefined || props.onQueryChange}><SearchField/></Show>;
  const menuList = <MenuList/>;
  return <nav ref={root} {...owned('main-menu')} aria-label={props.label ?? '메인 메뉴'} data-krds-layout={narrow() ? 'mobile' : 'desktop'} onKeyDown={escape}>
    <button id={props.mobileTriggerId} ref={trigger} type="button" {...owned('main-menu', 'mobile-trigger')} hidden={!narrow() || Boolean(props.mobileTriggerRef)} aria-expanded={mobile.read()} aria-controls={`${uid}-mobile`} onClick={() => mobile.request(!mobile.read())}>{props.mobileTriggerLabel ?? '전체 메뉴'}</button>
    <Show when={narrow()} fallback={<>{searchField}<Show when={contextId()}><BackControl/></Show>{menuList}</>}>
      <Show when={mobile.read()}><Portal><div ref={setPanel} id={`${uid}-mobile`} {...owned('main-menu', 'mobile-content', 'mobile-open')} role="dialog" aria-modal="true" aria-label={props.label ?? '메인 메뉴'} tabIndex={-1} onKeyDown={escape}>
        <button type="button" {...owned('main-menu', 'close')} onClick={() => mobile.request(false)}>메뉴 닫기</button><BackControl/>{searchField}{menuList}
      </div></Portal></Show>
    </Show>
  </nav>;
}
