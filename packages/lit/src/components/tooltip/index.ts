import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { KrdsElement, ValueState, deepActive } from '../base.js';
import { target } from '../catalog-support.js';
import { AnchoredController } from '../../controllers/anchored-controller.js';
import { restoreModalAware } from '../../controllers/surface-controller.js';
export class Tooltip extends KrdsElement {
    static override properties = { open: { type: Boolean }, defaultOpen: { type: Boolean, attribute: 'default-open' }, text: { type: String }, relationship: { type: String }, triggerLabel: { type: String, attribute: 'trigger-label' }, triggerId: { type: String, attribute: 'trigger-id' }, textId: { type: String, attribute: 'text-id' }, placement: { type: String }, fallbackFocusId: { type: String, attribute: 'fallback-focus-id' }, touchToggle: { type: Boolean, attribute: 'touch-toggle' }, suppressed: { state: true } };
    declare open: boolean | undefined;
    declare defaultOpen: boolean | undefined;
    declare text: string;
    declare relationship: string;
    declare triggerLabel: string;
    declare triggerId: string;
    declare textId: string;
    declare placement: string;
    declare fallbackFocusId: string;
    declare touchToggle: boolean;
    declare private suppressed: boolean;
    private state = new ValueState<boolean>();
    private fallbackBoundary?: Document | ShadowRoot;
    private pendingEscape = false;
    private escapeOrigin: Element | null = null;
    private closeTimer?: ReturnType<typeof setTimeout>;
    private hovered = false;
    private blurGeneration = 0;
    private keyboardDeparture = false;
    private tabDeparturePending = false;
    private handleFocus() {
        if (this.suppressed && this.keyboardDeparture) {
            this.suppressed = false;
            this.keyboardDeparture = false;
        }
        if (!this.touchToggle) this.show(true);
    }
    private handleBlur(event: FocusEvent) {
        const generation = ++this.blurGeneration;
        const tabDeparture = this.tabDeparturePending;
        this.tabDeparturePending = false;
        const destination = event.relatedTarget;
        // Removal blurs before disconnectedCallback in Chromium; let that lifecycle restore its fallback.
        queueMicrotask(() => {
            if (generation !== this.blurGeneration || !this.isConnected) return;
            const active = destination instanceof Element ? destination : deepActive(this.ownerDocument);
            const trigger = this.renderRoot.querySelector('button');
            if (tabDeparture && active && active !== trigger && active !== this.ownerDocument.body && active.isConnected) this.keyboardDeparture = true;
            if (!(this.renderRoot as ShadowRoot).activeElement) this.show(false);
        });
    }
    readonly anchor = new AnchoredController(this, { trigger: 'button', popup: '[role="tooltip"]' }, () => this.placement);
    constructor() { super(); this.text = ''; this.relationship = 'description'; this.triggerLabel = ''; this.triggerId = ''; this.textId = ''; this.placement = 'bottom-start'; this.fallbackFocusId = ''; this.touchToggle = false; this.suppressed = false; }
    get committedOpen() { return this.state.read(this.open, this.defaultOpen, () => false); }
    private show(open: boolean) { clearTimeout(this.closeTimer); if (open && !this.suppressed) { this.pendingEscape = false; this.escapeOrigin = null; } if (open && this.suppressed || open === this.committedOpen)
        return; this.state.set(open); this.emit('open-change', { open }); this.requestUpdate(); }
    private leave() { this.hovered = false; this.closeTimer = setTimeout(() => { if (!this.hovered && !(this.renderRoot as ShadowRoot).activeElement)
        this.show(false); }, 100); }
    private key = (event: KeyboardEvent) => {
        if (event.defaultPrevented || event.isComposing || event.keyCode === 229) return;
        if (event.key === 'Tab' && this.suppressed && event.composedPath().includes(this.renderRoot.querySelector('button')!)) {
            this.tabDeparturePending = true;
            return;
        }
        if (event.key !== 'Escape' || !this.committedOpen) return;
        event.preventDefault(); event.stopPropagation(); this.pendingEscape = true; this.escapeOrigin = deepActive(this.ownerDocument); this.show(false); };
    private keyUp = (event: KeyboardEvent) => { if (event.key === 'Tab') this.tabDeparturePending = false; };
    private outside = (event: PointerEvent) => { this.tabDeparturePending = false; if ((this.touchToggle || event.pointerType === 'touch') && this.committedOpen && !event.composedPath().includes(this)) { this.pendingEscape = false; this.escapeOrigin = null; this.show(false); } };
    override connectedCallback() { super.connectedCallback(); this.fallbackBoundary = this.getRootNode() as Document | ShadowRoot; this.ownerDocument.addEventListener('keydown', this.key); this.ownerDocument.addEventListener('keyup', this.keyUp, true); this.ownerDocument.addEventListener('pointerdown', this.outside); }
    override disconnectedCallback() { this.blurGeneration++; this.hovered = false; this.keyboardDeparture = false; this.tabDeparturePending = false; clearTimeout(this.closeTimer); this.ownerDocument.removeEventListener('keydown', this.key); this.ownerDocument.removeEventListener('keyup', this.keyUp, true); this.ownerDocument.removeEventListener('pointerdown', this.outside); this.pendingEscape = false; this.escapeOrigin = null; if (this.committedOpen)
        restoreModalAware(this, [target(this, this.fallbackFocusId, this.fallbackBoundary)]); this.fallbackBoundary = undefined; super.disconnectedCallback(); }
    override updated() { if (this.pendingEscape && !this.committedOpen) {
        this.suppressed = true;
        this.keyboardDeparture = false;
        this.tabDeparturePending = false;
        const active = deepActive(this.ownerDocument);
        if (active === this.escapeOrigin || active === this.ownerDocument.body || this.renderRoot.contains(active)) restoreModalAware(this, [this.renderRoot.querySelector('button'), target(this, this.fallbackFocusId)]);
        this.pendingEscape = false; this.escapeOrigin = null;
    } }
    override render() { if (!this.text || !this.triggerId || !this.textId || this.triggerId === this.textId || !['description', 'label'].includes(this.relationship) || this.relationship === 'description' && !this.triggerLabel)
        throw new TypeError('Tooltip requires distinct IDs and nonduplicated naming'); const state = this.suppressed ? 'suppressed' : this.committedOpen ? 'open' : 'closed'; return html `<span data-krds-component="tooltip" data-krds-part="root" data-krds-state=${state} part="root" @keydown=${this.key} @pointerenter=${() => { if (!this.touchToggle) { this.hovered = true; clearTimeout(this.closeTimer); this.show(true); } }} @pointerleave=${() => { if (!this.touchToggle) this.leave(); }}><button data-krds-component="tooltip" data-krds-part="trigger" data-krds-state=${state} part="trigger" id=${this.triggerId} type="button" tabindex="0" aria-labelledby=${ifDefined(this.relationship === 'label' ? this.textId : undefined)} aria-describedby=${ifDefined(this.relationship === 'description' ? this.textId : undefined)} @focus=${this.handleFocus} @blur=${this.handleBlur} @click=${() => { if (this.touchToggle)
        this.show(!this.committedOpen);
    else
        this.emit('action', {}); }}><span aria-hidden="true">ⓘ</span>${this.triggerLabel}</button><span data-krds-component="tooltip" data-krds-part="popup" data-krds-state=${`${state} ${this.placement}`} part="popup" id=${this.textId} role="tooltip" ?hidden=${!this.committedOpen} @pointerenter=${() => { this.hovered = true; clearTimeout(this.closeTimer); }} @pointerleave=${() => { if (!this.touchToggle) this.leave(); }}>${this.text}</span></span>`; }
}
