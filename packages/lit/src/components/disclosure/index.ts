import { html, type TemplateResult } from 'lit';
import { ValueState, KrdsElement } from '../base.js';
export class Disclosure extends KrdsElement {
    static override properties = { open: { type: Boolean }, defaultOpen: { type: Boolean, attribute: 'default-open' }, contentId: { type: String, attribute: 'content-id' }, content: { attribute: false } };
    declare open: boolean | undefined;
    declare defaultOpen: boolean | undefined;
    declare contentId: string;
    declare content: string | TemplateResult | undefined;
    private state = new ValueState<boolean>();
    constructor() { super(); this.contentId = 'content'; }
    get committedOpen() { return this.state.read(this.open, this.defaultOpen, () => false); }
    private toggle() { const open = !this.committedOpen; this.state.set(open); this.emit('open-change', { open }); this.requestUpdate(); }
    override willUpdate() { if (!this.ownerDocument?.defaultView)
        return; if (!this.committedOpen && this.renderRoot.querySelector('#' + CSS.escape(this.contentId))?.contains((this.renderRoot as ShadowRoot).activeElement))
        this.renderRoot.querySelector<HTMLButtonElement>('button')?.focus(); }
    override render() { if (!this.label || !this.contentId)
        throw new TypeError('Disclosure requires label and contentId'); const state = this.committedOpen ? 'open' : 'closed'; return html `<section data-krds-component="disclosure" data-krds-part="root" data-krds-state=${state} part="root"><button data-krds-component="disclosure" data-krds-part="trigger" data-krds-state=${state} part="trigger" id="trigger" type="button" aria-expanded=${this.committedOpen} aria-controls=${this.contentId} @click=${this.toggle}>${this.label}<span data-krds-component="disclosure" data-krds-part="icon" data-krds-state="" part="icon" aria-hidden="true">${this.committedOpen ? '−' : '+'}</span></button><div data-krds-component="disclosure" data-krds-part="content" data-krds-state=${state} part="content" id=${this.contentId} aria-labelledby="trigger" ?hidden=${!this.committedOpen}>${this.content ?? html `<slot></slot>`}</div></section>`; }
}
