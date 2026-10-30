import { createEffect, createMemo, createSignal, createUniqueId, For, onCleanup, onMount, splitProps, type JSX } from 'solid-js';
import type { ValueChangeDetails } from '@krds-native/contracts';
import { useKrdsEnvironment } from '../../providers';

export interface TabItem {
  value: string;
  label: JSX.Element;
  content: JSX.Element;
  disabled?: boolean;
  /** Stable tab ID; its panel uses this ID followed by "-panel". */
  id?: string;
}
export interface TabsProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'children' | 'onChange'> {
  items: readonly TabItem[];
  label?: JSX.Element;
  value?: string;
  defaultValue?: string;
  onValueChange?: (details: ValueChangeDetails<string>) => void;
  activationMode?: 'manual' | 'automatic';
  orientation?: 'horizontal' | 'vertical';
}

const focusableSelector = 'a[href],button:not(:disabled),input:not(:disabled):not([type="hidden"]),select:not(:disabled),textarea:not(:disabled),[tabindex]:not([tabindex="-1"]),[contenteditable="true"]';

/** Native Solid tabs. All enabled tabs participate in sequential keyboard navigation. */
export function Tabs(props: TabsProps) {
  const [local, rest] = splitProps(props, ['items', 'label', 'value', 'defaultValue', 'onValueChange', 'activationMode', 'orientation', 'id', 'aria-label', 'aria-labelledby']);
  const environment = useKrdsEnvironment();
  const generated = `krds-tabs-${createUniqueId()}`;
  const rootId = () => local.id ?? generated;
  const hasVisibleLabel = () => local.label != null && typeof local.label !== 'boolean' && (typeof local.label !== 'string' || !!local.label.trim());
  const ariaLabel = () => local['aria-label']?.trim() || undefined;
  const ariaLabelledby = () => local['aria-labelledby']?.trim() || undefined;
  const controlled = local.value !== undefined;
  if (controlled && local.defaultValue !== undefined) throw new TypeError('Tabs cannot combine value and defaultValue');
  const initial = local.defaultValue ?? local.items.find(item => !item.disabled)?.value ?? '';
  const [internal, setInternal] = createSignal(initial);
  const ids = new Map<string, string>();
  const tabId = (item: TabItem) => {
    if (item.id) return item.id;
    if (!ids.has(item.value)) ids.set(item.value, `${generated}-item-${ids.size + 1}`);
    return ids.get(item.value)!;
  };
  const selected = createMemo(() => {
    if ((local.value !== undefined) !== controlled) throw new TypeError('Tabs cannot change controlled mode');
    if (local.activationMode !== undefined && !['manual', 'automatic'].includes(local.activationMode)) throw new TypeError('Invalid Tabs activationMode');
    if (local.orientation !== undefined && !['horizontal', 'vertical'].includes(local.orientation)) throw new TypeError('Invalid Tabs orientation');
    if (!hasVisibleLabel() && !ariaLabel() && !ariaLabelledby()) throw new TypeError('Tabs requires an accessible tablist label');
    const values = new Set<string>(); const domIds = new Set<string>([rootId(), `${rootId()}-label`]);
    for (const item of local.items) {
      if (typeof item.value !== 'string' || !item.value.trim() || values.has(item.value)) throw new TypeError('Tabs requires unique nonempty item values');
      values.add(item.value);
      if (item.id !== undefined && !item.id.trim()) throw new TypeError('Tabs item IDs cannot be empty');
      for (const id of [tabId(item), `${tabId(item)}-panel`]) {
        if (domIds.has(id)) throw new TypeError('Tabs requires unique item IDs');
        domIds.add(id);
      }
    }
    const value = controlled ? local.value! : internal();
    const enabled = local.items.filter(item => !item.disabled);
    if (enabled.length ? !enabled.some(item => item.value === value) : value !== '') throw new TypeError('Tabs selection must identify an enabled item');
    return value;
  });
  let list!: HTMLDivElement;
  let pointerFocused: string | undefined;
  let pointerId: number | undefined;
  let pointerTarget: HTMLButtonElement | undefined;
  const clearPointer = () => { pointerId = undefined; pointerTarget = undefined; pointerFocused = undefined; };
  onMount(() => {
    const doc = list.ownerDocument;
    const endPointer = (event: PointerEvent) => {
      if (pointerId !== event.pointerId || !pointerTarget?.contains(event.target as Node) || event.button !== 0 || !event.isPrimary) clearPointer();
      // A completed gesture on its originating tab may still produce its paired click.
      pointerId = undefined;
    };
    doc.addEventListener('pointerdown', clearPointer, true); doc.addEventListener('pointerup', endPointer, true);
    // Capture release is not cancellation: its corresponding click can follow lostpointercapture.
    doc.addEventListener('pointercancel', clearPointer, true);
    doc.addEventListener('keydown', clearPointer, true); doc.defaultView?.addEventListener('blur', clearPointer);
    onCleanup(() => {
      doc.removeEventListener('pointerdown', clearPointer, true); doc.removeEventListener('pointerup', endPointer, true);
      doc.removeEventListener('pointercancel', clearPointer, true);
      doc.removeEventListener('keydown', clearPointer, true); doc.defaultView?.removeEventListener('blur', clearPointer); clearPointer();
    });
  });
  const request = (item: TabItem) => {
    if (item.disabled || item.value === selected()) return;
    if (!controlled) setInternal(item.value);
    local.onValueChange?.({ value: item.value });
  };
  const navigate = (event: KeyboardEvent, item: TabItem) => {
    if (event.defaultPrevented || event.isComposing || event.keyCode === 229) return;
    const enabled = local.items.filter(option => !option.disabled);
    const index = enabled.findIndex(option => option.value === item.value);
    const previous = local.orientation === 'vertical' ? 'ArrowUp' : 'ArrowLeft';
    const next = local.orientation === 'vertical' ? 'ArrowDown' : 'ArrowRight';
    let target: TabItem | undefined;
    if (event.key === previous) target = enabled[(index - 1 + enabled.length) % enabled.length];
    else if (event.key === next) target = enabled[(index + 1) % enabled.length];
    else if (event.key === 'Home') target = enabled[0];
    else if (event.key === 'End') target = enabled[enabled.length - 1];
    if (!target) return;
    event.preventDefault();
    Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]')).find(tab => tab.id === tabId(target!))?.focus();
  };
  // Keep validation active even when there are no children to read selected().
  createEffect(() => { selected(); });
  return <div {...rest} id={rootId()} dir={rest.dir ?? environment.direction()} data-krds-component="tabs" data-krds-part="root" data-krds-state="">
    {hasVisibleLabel() && <div id={`${rootId()}-label`}>{local.label}</div>}
    <div ref={list} role="tablist" aria-label={ariaLabel()} aria-labelledby={ariaLabelledby() ?? (hasVisibleLabel() ? `${rootId()}-label` : undefined)} aria-orientation={local.orientation ?? 'horizontal'} data-krds-component="tabs" data-krds-part="list" data-krds-state="" data-krds-orientation={local.orientation ?? 'horizontal'}>
      <For each={local.items}>{item => <button type="button" role="tab" id={tabId(item)} disabled={item.disabled} tabIndex={item.disabled ? -1 : 0} aria-selected={selected() === item.value} aria-controls={`${tabId(item)}-panel`} data-krds-component="tabs" data-krds-part="trigger" data-krds-state={[selected() === item.value && 'selected', item.disabled && 'disabled'].filter(Boolean).join(' ')}
        onPointerDown={event => { if (event.button === 0 && event.isPrimary) { pointerId = event.pointerId; pointerTarget = event.currentTarget; pointerFocused = undefined; } }}
        onFocus={event => { if (local.activationMode === 'automatic') { if (pointerTarget === event.currentTarget) pointerFocused = item.value; request(item); } }}
        onBlur={event => { if (!list.contains(event.relatedTarget as Node | null)) clearPointer(); }}
        onClick={event => { const paired = event.detail > 0 && pointerFocused === item.value && pointerTarget === event.currentTarget; clearPointer(); if (!paired) request(item); }}
        onKeyDown={event => navigate(event, item)}>{item.label}</button>}</For>
    </div>
    <For each={local.items}>{item => {
      let panel!: HTMLDivElement;
      const [hasFocusable, setHasFocusable] = createSignal(false);
      const inspect = () => {
        // Leading text or a nonfocusable wrapper is context, even when a later descendant is interactive.
        const first = Array.from(panel.childNodes).find(node => node.nodeType === 1 || (node.nodeType === 3 && !!node.textContent?.trim()));
        const element = first?.nodeType === 1 ? first as HTMLElement : undefined;
        const style = element?.ownerDocument.defaultView?.getComputedStyle(element);
        setHasFocusable(!!element && element.matches(focusableSelector) && element.tabIndex >= 0 && !element.closest('[hidden],[inert]') && !element.matches(':disabled') && style?.visibility !== 'hidden' && element.getClientRects().length > 0);
      };
      onMount(() => { inspect(); const observer = new MutationObserver(inspect); observer.observe(panel, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'tabindex', 'hidden', 'href', 'style', 'class'] }); onCleanup(() => observer.disconnect()); });
      // The panel remains mounted; selection never recreates its local controls.
      return <div ref={panel} role="tabpanel" id={`${tabId(item)}-panel`} aria-labelledby={tabId(item)} hidden={selected() !== item.value} tabIndex={hasFocusable() ? undefined : 0} data-krds-component="tabs" data-krds-part="panel" data-krds-state={selected() === item.value ? 'active' : 'inactive'}>{item.content}</div>;
    }}</For>
  </div>;
}
