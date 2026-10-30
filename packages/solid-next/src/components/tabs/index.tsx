import { createEffect, createUniqueId, For, onSettled, untrack } from 'solid-js';
import type { JSX } from '@solidjs/web';
import type { ValueChangeDetails } from '@unofficial-krds/contracts';
import { focusableSelector, nativeState, part, useEnvironment } from '../../internal/native';
export interface TabItem {
    value: string;
    label: JSX.Element;
    content: JSX.Element;
    disabled?: boolean;
    id?: string;
}
export interface TabsProps {
    id?: string;
    items: readonly TabItem[];
    label?: JSX.Element;
    'aria-label'?: string;
    'aria-labelledby'?: string;
    value?: string;
    defaultValue?: string;
    activationMode?: 'manual' | 'automatic';
    orientation?: 'horizontal' | 'vertical';
    onValueChange?: (details: ValueChangeDetails<string>) => void;
}
export function Tabs(props: TabsProps) {
    const env = useEnvironment(), id = untrack(()=>props.id ?? `krds-tabs-${createUniqueId()}`);
    const state = nativeState(() => props.value, () => props.defaultValue ?? props.items.find(i => !i.disabled)?.value ?? '', () => props.defaultValue);
    const tabId = (item: TabItem) => item.id ?? `${id}-tab-${encodeURIComponent(item.value)}`;
    const selected = () => {
        const enabled = props.items.filter(i => !i.disabled);
        if (new Set(props.items.map(i => i.value)).size !== props.items.length || props.items.some(i => !i.value))
            throw new TypeError('Tabs require unique values');
        if (enabled.length ? !enabled.some(i => i.value === state.value()) : state.value() !== '')
            throw new RangeError('Invalid enabled tab selection');
        return state.value();
    };
    createEffect(selected, () => { });
    let list!: HTMLDivElement, pointer: HTMLButtonElement | undefined, paired: string | undefined;
    const clear = () => {
        pointer = undefined;
        paired = undefined;
    };
    onSettled(() => {
        const doc = list.ownerDocument;
        doc.addEventListener('pointerdown', clear, true);
        doc.addEventListener('keydown', clear, true);
        doc.addEventListener('pointercancel', clear, true);
        return () => {
            doc.removeEventListener('pointerdown', clear, true);
            doc.removeEventListener('keydown', clear, true);
            doc.removeEventListener('pointercancel', clear, true);
        };
    });
    const request = (item: TabItem) => {
        if (!item.disabled && item.value !== selected())
            state.request(item.value, props.onValueChange);
    };
    function key(event: KeyboardEvent, item: TabItem) {
        if (event.defaultPrevented || event.isComposing || event.keyCode === 229)
            return;
        const items = props.items.filter(i => !i.disabled), index = items.findIndex(candidate => candidate.value === item.value), vertical = props.orientation === 'vertical';
        let target: TabItem | undefined;
        if (event.key === (vertical ? 'ArrowUp' : 'ArrowLeft'))
            target = items[(index + items.length - 1) % items.length];
        else if (event.key === (vertical ? 'ArrowDown' : 'ArrowRight'))
            target = items[(index + 1) % items.length];
        else if (event.key === 'Home')
            target = items[0];
        else if (event.key === 'End')
            target = items.at(-1);
        if (target) {
            event.preventDefault();
            list.ownerDocument.getElementById(tabId(target))?.focus();
        }
    }
    return <div dir={env.direction ?? 'ltr'} {...part('tabs', 'root')}>{props.label != null && <div id={`${id}-label`}>{props.label}</div>}<div ref={el => list = el} role="tablist" aria-label={props['aria-label']} aria-labelledby={props['aria-labelledby'] ?? (props.label != null ? `${id}-label` : undefined)} aria-orientation={props.orientation ?? 'horizontal'} data-krds-orientation={props.orientation ?? 'horizontal'} {...part('tabs', 'list')}><For each={props.items}>{item => <button id={tabId(item)} type="button" role="tab" tabindex={item.disabled ? -1 : 0} disabled={item.disabled} aria-selected={selected() === item.value ? 'true' : 'false'} aria-controls={`${tabId(item)}-panel`} {...part('tabs', 'trigger', [selected() === item.value && 'selected', item.disabled && 'disabled'].filter(Boolean).join(' '))} onPointerDown={event => {
                if (event.button === 0 && event.isPrimary)
                    pointer = event.currentTarget;
            }} onFocus={event => {
                if (props.activationMode === 'automatic') {
                    if (pointer === event.currentTarget)
                        paired = item.value;
                    request(item);
                }
            }} onClick={event => {
                const suppress = event.detail > 0 && paired === item.value && pointer === event.currentTarget;
                clear();
                if (!suppress)
                    request(item);
            }} onKeyDown={event => key(event, item)}>{item.label}</button>}</For></div><For each={props.items}>{item => {
            let panel!: HTMLDivElement;
            onSettled(() => {
                const inspect = () => {
                    const first = Array.from(panel.childNodes).find(n => n.nodeType === 1 || n.nodeType === 3 && !!n.textContent?.trim());
                    const el = first?.nodeType === 1 ? first as HTMLElement : undefined;
                    const style = el?.ownerDocument.defaultView?.getComputedStyle(el);
                    // The panel or a containing Modal may be temporarily hidden at setup.
                    const firstChildCanTakeFocus = !!el && el.matches(focusableSelector) && el.tabIndex >= 0
                        && !el.matches(':disabled') && !el.hidden && !el.inert
                        && style?.display !== 'none' && style?.visibility !== 'hidden';
                    const next = firstChildCanTakeFocus ? -1 : 0;
                    if (panel.tabIndex !== next) panel.tabIndex = next;
                };
                inspect();
                const observer = new MutationObserver(inspect);
                observer.observe(panel, {
                    childList: true, subtree: true, attributes: true,
                    attributeFilter: ['hidden', 'disabled', 'tabindex', 'style', 'class', 'href', 'contenteditable', 'type'],
                });
                return () => observer.disconnect();
            });
            return <div ref={el => panel = el} id={`${tabId(item)}-panel`} role="tabpanel" aria-labelledby={tabId(item)} hidden={selected() !== item.value} tabindex={0} {...part('tabs', 'panel', selected() === item.value ? 'active' : 'inactive')}>{item.content}</div>;
        }}</For></div>;
}
