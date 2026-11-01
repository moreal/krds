import { For, Show, createSignal, createUniqueId, onMount, onCleanup } from 'solid-js';
import type { HeaderContract } from '@unofficial-krds/contracts';
import { owned, safeRel, ignoredKey, stateValue } from '../../internal/catalog';
import { MainMenu } from '../main-menu';

/** Optional host ID belongs to the actual Header search control. */
export type HeaderProps = HeaderContract & { searchTriggerId?: string };
export function Header(props: HeaderProps) {
  const uid = createUniqueId();
  const mobile = stateValue(() => props.mobileOpen, props.defaultMobileOpen, false, open => props.onMobileOpenChange?.({ open }));
  const [utilitiesOpen, setUtilitiesOpen] = createSignal(false);
  let mobileTrigger!: HTMLButtonElement;
  let utilityTrigger: HTMLButtonElement | undefined;
  let utilities!: HTMLDivElement;
  onMount(() => {
    const outside = (event: PointerEvent) => { if (utilitiesOpen() && !utilities.contains(event.target as Node)) setUtilitiesOpen(false); };
    document.addEventListener('pointerdown', outside);
    onCleanup(() => document.removeEventListener('pointerdown', outside));
  });
  return <header {...owned('header', 'root', props.sticky ? 'sticky' : '')} data-krds-action-layout={props.actionLayout ?? 'horizontal'}>
    <a {...owned('header', 'identity')} href={props.home.href} target={props.home.target} rel={safeRel(props.home.target, props.home.rel)} aria-label={props.home.label} aria-describedby={props.home.target === '_blank' ? `${uid}-identity-window` : undefined}><img src={props.home.logo.src} alt={props.home.logo.alt}/><Show when={props.home.target === '_blank'}><span id={`${uid}-identity-window`}> (새 창)</span></Show></a>
    <div ref={utilities} {...owned('header', 'utilities')} onKeyDown={event => { if (!ignoredKey(event) && event.key === 'Escape' && utilitiesOpen()) { event.preventDefault(); setUtilitiesOpen(false); utilityTrigger?.focus(); } }} onFocusOut={event => { if (!utilities.contains(event.relatedTarget as Node)) setUtilitiesOpen(false); }}>
      <Show when={props.utilityItems.length > 4}><button ref={utilityTrigger} type="button" {...owned('header', 'utility-trigger', utilitiesOpen() ? 'expanded' : 'collapsed')} aria-expanded={utilitiesOpen()} aria-controls={`${uid}-utilities`} onClick={() => setUtilitiesOpen(!utilitiesOpen())}>유틸리티 메뉴</button></Show>
      <ul id={`${uid}-utilities`} hidden={props.utilityItems.length > 4 && !utilitiesOpen()}><For each={props.utilityItems}>{item => <li><a href={item.href} target={item.target} rel={safeRel(item.target, item.rel)}>{item.label}<Show when={item.target === '_blank'}><span> (새 창)</span></Show></a></li>}</For></ul>
    </div>
    <div {...owned('header', 'actions')}>
      <Show when={props.search}>{search => <button id={props.searchTriggerId} type="button" {...owned('header', 'search')} onClick={() => search().onRequest()}>{search().label}</button>}</Show>
      <Show when={props.mainNavigation.length}><button id={props.mobileTriggerId} ref={mobileTrigger} type="button" {...owned('header', 'mobile-trigger', mobile.read() ? 'expanded' : 'collapsed')} aria-expanded={mobile.read()} aria-controls={`${uid}-navigation`} onClick={() => mobile.request(!mobile.read())}>{props.mobileTriggerLabel ?? '메뉴'}</button></Show>
    </div>
    <Show when={props.mainNavigation.length}><div id={`${uid}-navigation`} {...owned('header', 'navigation')}><MainMenu label={props.navigationLabel} mobileTriggerRef={() => mobileTrigger} items={props.mainNavigation} currentId={props.currentId} mobileOpen={mobile.read()} onMobileOpenChange={({ open }) => mobile.request(open)}/></div></Show>
  </header>;
}
