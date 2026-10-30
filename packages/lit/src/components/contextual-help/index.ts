import { html, type TemplateResult } from 'lit';
import { KrdsElement, ValueState } from '../base.js';
import { target, usable } from '../catalog-support.js';
import { AnchoredController } from '../../controllers/anchored-controller.js';
import { restoreModalAware } from '../../controllers/surface-controller.js';
export class ContextualHelp extends KrdsElement {
    static override properties = { open: { type: Boolean }, defaultOpen: { type: Boolean, attribute: 'default-open' }, title: { type: String }, content: { attribute: false }, variant: { type: String }, placement: { type: String }, triggerLabel: { type: String, attribute: 'trigger-label' }, relatedId: { type: String, attribute: 'related-id' }, fallbackFocusId: { type: String, attribute: 'fallback-focus-id' } };
    declare open: boolean | undefined;
    declare defaultOpen: boolean | undefined;
    declare content: string | TemplateResult;
    declare variant: string;
    declare placement: string;
    declare triggerLabel: string;
    declare relatedId: string;
    declare fallbackFocusId: string;
    private state = new ValueState<boolean>();
    private fallbackBoundary?: Document | ShadowRoot;
    private restoreRequested = false;
    private focusRequested = false;
    readonly anchor = new AnchoredController(this, { trigger: 'button', popup: '[part="popover"]' }, () => this.placement);
    constructor() { super(); this.content = ''; this.variant = 'information'; this.placement = 'bottom-start'; this.triggerLabel = ''; this.relatedId = ''; this.fallbackFocusId = ''; }
    get committedOpen() { return this.state.read(this.open, this.defaultOpen, () => false); }
    private show(open: boolean, restore = false) { if (open === this.committedOpen)
        return; this.state.set(open); this.restoreRequested = restore; this.focusRequested = open; this.emit('open-change', { open }); this.requestUpdate(); }
    private outside = (event: Event) => { if (this.committedOpen && !event.composedPath().includes(this))
        this.show(false, true); };
    private key = (event: KeyboardEvent) => { if (event.key === 'Escape' && this.committedOpen && !event.defaultPrevented && !event.isComposing && event.keyCode !== 229) {
        event.preventDefault(); event.stopPropagation();
        this.show(false, true);
    } };
    override connectedCallback() { super.connectedCallback(); this.fallbackBoundary = this.getRootNode() as Document | ShadowRoot; this.ownerDocument.addEventListener('click', this.outside); this.ownerDocument.addEventListener('keydown', this.key); }
    override disconnectedCallback() { this.restoreRequested = false; this.focusRequested = false; this.ownerDocument.removeEventListener('click', this.outside); this.ownerDocument.removeEventListener('keydown', this.key); if (this.committedOpen)
        restoreModalAware(this, [target(this, this.fallbackFocusId, this.fallbackBoundary)]); this.fallbackBoundary = undefined; super.disconnectedCallback(); }
    override updated() {
        if (this.restoreRequested && !this.committedOpen) { this.restoreRequested = false; restoreModalAware(this, [this.renderRoot.querySelector('button'), target(this, this.fallbackFocusId)]); }
        if (this.focusRequested && this.committedOpen) { this.focusRequested = false; (this.renderRoot.querySelector<HTMLElement>('[part="popover"] a[href]') ?? this.renderRoot.querySelector<HTMLElement>('[part="popover"]'))?.focus(); }
    }
    override render() { if (!this.triggerLabel || !this.title || !['information', 'help'].includes(this.variant) || !['top-start', 'top', 'top-end', 'bottom-start', 'bottom', 'bottom-end'].includes(this.placement))
        throw new TypeError('Invalid contextual help'); const state = this.committedOpen ? 'open' : 'closed'; return html `<div data-krds-component="contextual-help" data-krds-part="root" data-krds-state=${state} part="root" @keydown=${this.key}><button data-krds-component="contextual-help" data-krds-part="trigger" data-krds-state=${state} part="trigger" type="button" aria-expanded=${this.committedOpen} aria-controls="help" @click=${() => this.show(!this.committedOpen, this.committedOpen)}>${this.triggerLabel}</button><section data-krds-component="contextual-help" data-krds-part="popover" data-krds-state=${`${state} ${this.placement}`} part="popover" id="help" aria-labelledby="title" tabindex="-1" ?hidden=${!this.committedOpen}><h3 data-krds-component="contextual-help" data-krds-part="title" data-krds-state="" part="title" id="title">${this.title}</h3><div data-krds-component="contextual-help" data-krds-part="body" data-krds-state="" part="body">${this.content}</div><button type="button" aria-label=${`${this.title} 닫기`} @click=${() => this.show(false, true)}>닫기</button></section></div>`; }
}
