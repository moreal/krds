import { html, type TemplateResult } from 'lit';
import { repeat } from 'lit/directives/repeat.js';
import { ValueState, KrdsElement, unique } from '../base.js';
export interface AccordionItem {
    id: string;
    title: string;
    content: string | TemplateResult;
}
export class Accordion extends KrdsElement {
    static override properties = { items: { attribute: false }, openIds: { attribute: false }, defaultOpenIds: { attribute: false }, multiple: { type: Boolean }, variant: { type: String } };
    declare items: readonly AccordionItem[];
    declare openIds: readonly string[] | undefined;
    declare defaultOpenIds: readonly string[] | undefined;
    declare multiple: boolean;
    declare variant: string;
    private state = new ValueState<readonly string[]>();
    constructor() { super(); this.items = []; this.multiple = true; this.variant = 'default'; }
    get committedIds() { const ids = this.state.read(this.openIds, this.defaultOpenIds, () => []); unique(ids); if (ids.some(id => !this.items.some(item => item.id === id)) || !this.multiple && ids.length > 1)
        throw new TypeError('Invalid open accordion IDs'); return ids; }
    private toggle(id: string) { const ids = this.committedIds.includes(id) ? this.committedIds.filter(value => value !== id) : [...this.multiple ? this.committedIds : [], id]; this.state.set(ids); this.emit('open-change', { ids }); this.requestUpdate(); }
    override willUpdate() { if (!this.ownerDocument?.defaultView)
        return; for (const panel of this.renderRoot.querySelectorAll<HTMLElement>('[data-panel]'))
        if (!this.committedIds.includes(panel.dataset.panel!) && panel.contains((this.renderRoot as ShadowRoot).activeElement))
            this.renderRoot.querySelector<HTMLButtonElement>(`[data-trigger="${CSS.escape(panel.dataset.panel!)}"]`)?.focus(); }
    override render() { unique(this.items.map(item => item.id)); if (!['default', 'line'].includes(this.variant))
        throw new TypeError('Invalid accordion variant'); return html `<div data-krds-component="accordion" data-krds-part="root" data-krds-state="" part="root" data-krds-variant=${this.variant}>${repeat(this.items, item => item.id, item => { const open = this.committedIds.includes(item.id); const state = open ? 'open' : 'closed'; return html `<section data-krds-component="accordion" data-krds-part="item" data-krds-state=${state} part="item"><h3 data-krds-component="accordion" data-krds-part="heading" data-krds-state="" part="heading"><button data-krds-component="accordion" data-krds-part="trigger" data-krds-state=${state} part="trigger" id=${`trigger-${item.id}`} data-trigger=${item.id} type="button" aria-controls=${`panel-${item.id}`} aria-expanded=${open} @click=${() => this.toggle(item.id)}>${item.title}<span data-krds-component="accordion" data-krds-part="icon" data-krds-state="" part="icon" aria-hidden="true">${open ? '−' : '+'}</span></button></h3><div data-krds-component="accordion" data-krds-part="panel" data-krds-state=${state} part="panel" id=${`panel-${item.id}`} data-panel=${item.id} ?hidden=${!open}>${item.content}</div></section>`; })}</div>`; }
}
