import { html, type PropertyValues } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { repeat } from 'lit/directives/repeat.js';
import * as tabs from '@zag-js/tabs';
import type { Machine } from '@zag-js/core';
type TabsSchema = tabs.Machine extends Machine<infer T> ? T : never;
import { KrdsElement, ValueState, unique, focusable } from '../base.js';
import { ZagController } from '../../controllers/zag-controller.js';
import { machineProps } from '../../directives/machine-props.js';
export interface TabItem {
    value: string;
    label: unknown;
    content: unknown;
    disabled?: boolean;
    id?: string;
}
export class Tabs extends KrdsElement {
    static override properties = { items: { attribute: false }, value: { type: String }, defaultValue: { attribute: 'default-value' }, activationMode: { attribute: 'activation-mode' }, orientation: { type: String } };
    declare items: readonly TabItem[];
    declare value: string | undefined;
    declare defaultValue: string | undefined;
    declare activationMode: 'manual' | 'automatic';
    declare orientation: 'horizontal' | 'vertical';
    private state = new ValueState<string>();
    readonly machine: ZagController<TabsSchema, ReturnType<typeof tabs.connect>>;
    private pointerFocus?: string;
    private pointerDown = false;
    constructor() { super(); this.items = []; this.activationMode = 'manual'; this.orientation = 'horizontal'; this.machine = new ZagController(this, tabs.machine, { id: 'tabs', getRootNode: () => this.shadowRoot! }, tabs.connect); }
    get selectedValue() { const value = this.state.read(this.value, this.defaultValue, () => this.items.find(item => !item.disabled)?.value ?? ''); if (this.items.some(item => !item.disabled) ? !this.items.some(item => item.value === value && !item.disabled) : value !== '')
        throw new TypeError('Tabs value must identify an enabled item'); return value; }
    protected override willUpdate(_changed: PropertyValues) {
        unique(this.items.map(item => item.value));
        unique(this.items.map((item, index) => item.id ?? `tab-${index}`));
        if (!['manual', 'automatic'].includes(this.activationMode) || !['horizontal', 'vertical'].includes(this.orientation) || (!this.label && !this.explicitName))
            throw new TypeError('Invalid Tabs options or missing label');
        this.machine.update({ id: 'tabs', getRootNode: () => this.shadowRoot!, value: this.selectedValue, activationMode: 'manual', orientation: this.orientation, composite: false, dir: this.direction, onValueChange: details => this.request(details.value) });
    }
    private request(value: string) { if (value === this.selectedValue || this.items.find(item => item.value === value)?.disabled)
        return; this.state.set(value); this.emit('value-change', { value }); this.requestUpdate(); }
    private key = (event: KeyboardEvent, index: number) => {
        this.pointerFocus = undefined;
        this.pointerDown = false;
        if (event.defaultPrevented || event.isComposing || event.keyCode === 229)
            return;
        const enabled = this.items.map((item, i) => item.disabled ? -1 : i).filter(i => i >= 0);
        const current = enabled.indexOf(index);
        let target: number | undefined;
        const previous = this.orientation === 'horizontal' ? 'ArrowLeft' : 'ArrowUp', next = this.orientation === 'horizontal' ? 'ArrowRight' : 'ArrowDown';
        if (event.key === previous)
            target = enabled[(current - 1 + enabled.length) % enabled.length];
        else if (event.key === next)
            target = enabled[(current + 1) % enabled.length];
        else if (event.key === 'Home')
            target = enabled[0];
        else if (event.key === 'End')
            target = enabled.at(-1);
        if (target !== undefined) {
            event.preventDefault();
            this.renderRoot.querySelectorAll<HTMLButtonElement>('[role="tab"]')[target]?.focus();
        }
    };
    override updated() { this.applyExplicitNaming(this.renderRoot.querySelector('[role="tablist"]')!); for (const panel of this.renderRoot.querySelectorAll<HTMLElement>('[role="tabpanel"]'))
        panel.tabIndex = panel.querySelector(focusable) ? -1 : 0; }
    override render() {
        const selected = this.selectedValue;
        const api = this.machine.active ? this.machine.getApi() : undefined;
        return html `<div ${machineProps({ ...api?.getRootProps(), ...this.named('root', 'tabs') })} data-krds-component="tabs" data-krds-part="root" part="root" data-krds-state="">${this.label ? html`<p id="label">${this.label}</p>` : ''}<div ${machineProps({ ...api?.getListProps(), ...this.named('list', 'tabs'), onkeydown: undefined, role: 'tablist', 'aria-labelledby': this.label && !this.explicitName ? 'label' : undefined, 'aria-label': this.explicitName, 'aria-orientation': this.orientation, 'data-krds-orientation': this.orientation })} data-krds-component="tabs" data-krds-part="list" part="list" data-krds-state="" data-krds-orientation=${this.orientation} role="tablist" aria-labelledby=${ifDefined(this.label && !this.explicitName ? 'label' : undefined)} aria-label=${ifDefined(this.explicitName)} aria-orientation=${this.orientation}>
    ${repeat(this.items, item => item.value, (item, index) => html `<button ${machineProps({ ...api?.getTriggerProps({ value: item.value, disabled: item.disabled }), ...this.named('trigger', 'tabs', [selected === item.value ? 'selected' : '', item.disabled ? 'disabled' : ''].filter(Boolean).join(' ')), onclick: undefined, onkeydown: undefined, id: item.id ?? `tab-${index}`, role: 'tab', type: 'button', disabled: !!item.disabled, tabIndex: item.disabled ? -1 : 0, 'aria-controls': `${item.id ?? `tab-${index}`}-panel`, 'aria-selected': String(selected === item.value) })} data-krds-component="tabs" data-krds-part="trigger" part="trigger" data-krds-state=${[selected===item.value?'selected':'',item.disabled?'disabled':''].filter(Boolean).join(' ')} role="tab" type="button" id=${item.id ?? `tab-${index}`} aria-selected=${String(selected === item.value)} aria-controls=${`${item.id ?? `tab-${index}`}-panel`} ?disabled=${item.disabled} tabindex=${item.disabled ? -1 : 0} @keydown=${(event: KeyboardEvent) => this.key(event, index)} @pointerdown=${() => { this.pointerFocus = undefined; this.pointerDown = true; }} @pointercancel=${() => { this.pointerFocus = undefined; this.pointerDown = false; }} @focus=${() => { if (this.activationMode === 'automatic') {
            this.request(item.value);
            if (this.pointerDown)
                this.pointerFocus = item.value;
        } }} @click=${() => { this.pointerDown = false; if (this.pointerFocus === item.value) {
            this.pointerFocus = undefined;
            return;
        } if (api)
            api.setValue(item.value);
        else
            this.request(item.value); }}>${item.label}</button>`)}</div>
    ${repeat(this.items, item => item.value, (item, index) => html `<section data-krds-component="tabs" data-krds-part="panel" part="panel" data-krds-state=${selected === item.value ? 'active' : 'inactive'} role="tabpanel" id=${`${item.id ?? `tab-${index}`}-panel`} aria-labelledby=${item.id ?? `tab-${index}`} ?hidden=${selected !== item.value} tabindex="0">${item.content}</section>`)}</div>`;
    }
}
