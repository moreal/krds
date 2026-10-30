import { useKrdsEnvironment } from '../../providers';
import { $, component$, useComputed$, useId, useOnDocument, useSignal, useTask$, useVisibleTask$, type JSXChildren, type QRL } from '@builder.io/qwik';
import type { ValueChangeDetails } from '@unofficial-krds/contracts';
import { attrs, controlMode, states } from '../../internal/behavior';
import { initializeKeyboardBoundary, markTabFocus, markTabPointer, preventTabNavigation } from '../../internal/event-props';
export interface TabItem {
    value: string;
    label: JSXChildren;
    content: JSXChildren;
    disabled?: boolean;
    id?: string;
}
export interface TabsProps {
    id?: string;
    items: readonly TabItem[];
    label?: JSXChildren;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    value?: string;
    defaultValue?: string;
    onValueChange$?: QRL<(detail: ValueChangeDetails<string>) => void>;
    activationMode?: 'manual' | 'automatic';
    orientation?: 'horizontal' | 'vertical';
}
function itemId(rootId: string, item: TabItem): string {
    return item.id ?? `${rootId}-tab-${Array.from(item.value).map(character => character.codePointAt(0)!.toString(16)).join('-')}`;
}
export const Tabs = component$<TabsProps>((props) => {
    const environment = useKrdsEnvironment();
    useOnDocument('qinit', initializeKeyboardBoundary);
    const generated = useId(), id = props.id ?? `krds-tabs-${generated}`, controlled = props.value !== undefined;
    controlMode(props.value, props.defaultValue, controlled);
    const internal = useSignal(props.defaultValue ?? props.items.find(item => !item.disabled)?.value ?? '');
    const selected = useComputed$(() => { controlMode(props.value, props.defaultValue, controlled); return controlled ? props.value! : internal.value; });
    useTask$(({ track }) => {
        const items = track(() => props.items), value = track(() => selected.value);
        if (!props.label && !props['aria-label'] && !props['aria-labelledby'])
            throw new TypeError('Tabs requires a label');
        if (!['manual', 'automatic'].includes(props.activationMode ?? 'manual') || !['horizontal', 'vertical'].includes(props.orientation ?? 'horizontal'))
            throw new TypeError('Invalid Tabs mode');
        const values = new Set<string>(), ids = new Set<string>([id, `${id}-label`]);
        for (const item of items) {
            if (!item.value?.trim() || values.has(item.value) || item.id !== undefined && (!item.id.trim() || ids.has(item.id)))
                throw new TypeError('Tabs require unique values and IDs');
            values.add(item.value);
            const tab = itemId(id, item);
            for (const domId of [tab, `${tab}-panel`]) {
                if (ids.has(domId))
                    throw new TypeError('Tabs require unique DOM IDs');
                ids.add(domId);
            }
        }
        const enabled = items.filter(item => !item.disabled);
        if (enabled.length ? !enabled.some(item => item.value === value) : value !== '')
            throw new TypeError('Tabs selection must identify an enabled item');
    });
    useVisibleTask$(({ cleanup }) => {
        const root = document.getElementById(id);
        if (!root)
            return;
        const composedParent = (element: HTMLElement): HTMLElement | null => {
            if (element.parentElement) return element.parentElement;
            const tree = element.getRootNode();
            return 'host' in tree && tree.host instanceof HTMLElement ? tree.host : null;
        };
        const usable = (child: HTMLElement): boolean => {
            if (!child.matches('a[href],button,input:not([type="hidden"]),select,textarea,[tabindex],[contenteditable="true"]') || child.matches(':disabled') || child.tabIndex < 0) return false;
            for (let ancestor: HTMLElement | null = child; ancestor; ancestor = composedParent(ancestor)) {
                if (ancestor.hidden || ancestor.inert) return false;
            }
            const style = child.ownerDocument.defaultView?.getComputedStyle(child);
            return style?.display !== 'none' && style?.visibility !== 'hidden' && style?.visibility !== 'collapse'
                && Array.from(child.getClientRects()).some(rect => rect.width > 0 && rect.height > 0);
        };
        let resizeObserver: ResizeObserver | undefined;
        const observedChildren = new Set<HTMLElement>();
        const inspect = () => {
            if (!root.isConnected) return;
            const currentChildren = new Set<HTMLElement>();
            for (const panel of root.querySelectorAll<HTMLElement>('[role="tabpanel"]')) {
                const first = Array.from(panel.childNodes).find(node => node.nodeType === 1 || node.nodeType === 3 && !!node.textContent?.trim());
                const child = first?.nodeType === 1 ? first as HTMLElement : undefined;
                if (child) {
                    currentChildren.add(child);
                    if (!observedChildren.has(child)) resizeObserver?.observe(child);
                }
                if (child && usable(child)) {
                    if (panel.hasAttribute('tabindex')) panel.removeAttribute('tabindex');
                } else if (panel.getAttribute('tabindex') !== '0') panel.tabIndex = 0;
            }
            for (const child of observedChildren) if (!currentChildren.has(child)) resizeObserver?.unobserve(child);
            observedChildren.clear();
            for (const child of currentChildren) observedChildren.add(child);
        };
        const observer = new MutationObserver(inspect);
        resizeObserver = new ResizeObserver(inspect);
        inspect();
        observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ['disabled', 'tabindex', 'hidden', 'inert', 'href', 'style', 'class'] });
        for (let ancestor = composedParent(root); ancestor; ancestor = composedParent(ancestor)) {
            observer.observe(ancestor, { attributes: true, attributeFilter: ['hidden', 'inert', 'style', 'class'] });
        }
        root.ownerDocument.defaultView?.addEventListener('resize', inspect);
        cleanup(() => {
            observer.disconnect();
            resizeObserver?.disconnect();
            root.ownerDocument.defaultView?.removeEventListener('resize', inspect);
        });
    });
    const request = $(async (value: string) => {
        const item = props.items.find(item => item.value === value);
        if (!item || item.disabled || value === selected.value)
            return;
        if (!controlled)
            internal.value = value;
        await props.onValueChange$?.({ value });
    });
    const navigate = $((event: KeyboardEvent, element: HTMLButtonElement) => {
        if (event.isComposing || event.keyCode === 229 || event.ctrlKey || event.metaKey || event.altKey)
            return;
        const list = element.closest('[role="tablist"]')!, items = Array.from(list.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)')), index = items.indexOf(element), vertical = props.orientation === 'vertical';
        let target: HTMLButtonElement | undefined;
        if (event.key === (vertical ? 'ArrowUp' : 'ArrowLeft'))
            target = items[(index - 1 + items.length) % items.length];
        else if (event.key === (vertical ? 'ArrowDown' : 'ArrowRight'))
            target = items[(index + 1) % items.length];
        else if (event.key === 'Home')
            target = items[0];
        else if (event.key === 'End')
            target = items.at(-1);
        target?.focus();
    });
    return <div id={id} dir={environment.direction} {...attrs('tabs', 'root')}>
  {props.label && <div id={`${id}-label`}>{props.label}</div>}
  <div role="tablist" aria-label={props['aria-label']} aria-labelledby={props['aria-labelledby'] ?? (props.label ? `${id}-label` : undefined)} aria-orientation={props.orientation ?? 'horizontal'} data-krds-orientation={props.orientation ?? 'horizontal'} {...attrs('tabs', 'list')}>
   {props.items.map((item, index) => {
            const tabId = itemId(id, item);
            return <button key={item.value} type="button" role="tab" id={tabId} disabled={item.disabled} tabIndex={item.disabled ? -1 : 0} aria-selected={selected.value === item.value} aria-controls={`${tabId}-panel`} data-orientation={props.orientation ?? 'horizontal'} data-activation-mode={props.activationMode ?? 'manual'} {...attrs('tabs', 'trigger', states(selected.value === item.value && 'selected', item.disabled && 'disabled'))} onPointerDown$={markTabPointer} onFocus$={[markTabFocus, $(async () => {
                        if (props.activationMode === 'automatic')
                            await request(item.value);
                    })]} onClick$={async (event, element) => {
                    const paired = event.detail > 0 && element.dataset.krdsSkipClick === 'true';
                    delete element.dataset.krdsSkipClick;
                    delete element.dataset.krdsPointer;
                    if (!paired)
                        await request(item.value);
                }} onKeyDown$={[preventTabNavigation, navigate]}>{item.label}</button>;
        })}
  </div>
  {props.items.map((item, index) => { const tabId = itemId(id, item); return <div key={item.value} id={`${tabId}-panel`} role="tabpanel" aria-labelledby={tabId} hidden={selected.value !== item.value} tabIndex={0} {...attrs('tabs', 'panel', selected.value === item.value ? 'active' : 'inactive')}>{item.content}</div>; })}
 </div>;
});
