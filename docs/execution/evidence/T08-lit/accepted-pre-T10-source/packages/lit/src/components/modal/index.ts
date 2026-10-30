import { html, type PropertyValues } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { KrdsElement, ValueState, deepActive, focusable, shadowFocusables, effectivelyInert, composedParent } from '../base.js';
const locks = new WeakMap<Document, {
    count: number;
    overflow: string;
}>();
const stack: Modal[] = [];
/** Native top-layer dialog preserves same-root names and inherited theme tokens. */
export class Modal extends KrdsElement {
    static override properties = { open: { type: Boolean }, defaultOpen: { attribute: 'default-open', type: Boolean }, title: { type: String }, description: { type: String }, body: { attribute: false }, actions: { attribute: false }, showCloseButton: { attribute: 'show-close-button', type: Boolean }, closeOnOutsideClick: { attribute: 'close-on-outside-click', type: Boolean }, initialFocusId: { attribute: 'initial-focus-id' }, returnFocusId: { attribute: 'return-focus-id' } };
    declare open: boolean | undefined;
    declare defaultOpen: boolean | undefined;
    declare title: string;
    declare description: string;
    declare body: unknown;
    declare actions: unknown;
    declare showCloseButton: boolean;
    declare closeOnOutsideClick: boolean;
    declare initialFocusId: string | undefined;
    declare returnFocusId: string | undefined;
    private state = new ValueState<boolean>();
    private opener: Element | null = null;
    private active = false;
    private outside = false;
    constructor() { super(); this.title = ''; this.description = ''; this.body = ''; this.actions = ''; this.showCloseButton = true; this.closeOnOutsideClick = false; }
    get isOpen() { return this.state.read(this.open, this.defaultOpen, () => false); }
    requestOpen(open: boolean) { if (open === this.isOpen)
        return; this.state.set(open); this.emit('open-change', { open }); this.requestUpdate(); }
    override willUpdate(_changed: PropertyValues) { if (this.isOpen && !this.active) {
        this.opener = deepActive(this.ownerDocument);
        if (this.opener === this.ownerDocument.body)
            this.opener = null;
    } }
    override updated() {
        if (!this.isConnected)
            return;
        if (this.isOpen && !this.active) {
            const dialog = this.renderRoot.querySelector('dialog')!;
            if (!this.title.trim())
                throw new TypeError('Modal needs a visible title');
            if (!this.showCloseButton && !this.focusables().some(element => element.hasAttribute('data-krds-close')))
                throw new TypeError('Modal needs an enabled close action');
            dialog.showModal();
            this.active = true;
            stack.push(this);
            const lock = locks.get(this.ownerDocument) ?? { count: 0, overflow: this.ownerDocument.body.style.overflow };
            lock.count++;
            locks.set(this.ownerDocument, lock);
            this.ownerDocument.body.style.overflow = 'hidden';
            const target = this.initialFocusId ? this.renderRoot.querySelector<HTMLElement>(`#${CSS.escape(this.initialFocusId)}`) ?? this.focusables().find(element => element.id === this.initialFocusId) : dialog;
            const first = this.focusables()[0];
            if (target !== dialog && target !== first)
                throw new TypeError('initialFocusId must identify the dialog or first interactive element');
            (target ?? dialog).focus();
        }
        else if (!this.isOpen && this.active)
            this.cleanup();
    }
    private focusables() { return shadowFocusables(this.renderRoot); }
    private usable(node: Element | null): node is HTMLElement { return !!node && node instanceof HTMLElement && node.isConnected && !effectivelyInert(node) && !node.matches(':disabled') && node.getClientRects().length > 0 && node.matches(focusable); }
    private cleanup() {
        this.renderRoot.querySelector('dialog')?.close();
        this.active = false;
        const index = stack.indexOf(this);
        if (index >= 0)
            stack.splice(index, 1);
        const lock = locks.get(this.ownerDocument);
        if (lock && !--lock.count) {
            this.ownerDocument.body.style.overflow = lock.overflow;
            locks.delete(this.ownerDocument);
        }
        let target: Element | null = this.opener;
        if (!this.usable(target))
            target = this.returnFocusId ? (this.getRootNode() as Document | ShadowRoot).querySelector(`#${CSS.escape(this.returnFocusId)}`) ?? this.ownerDocument.getElementById(this.returnFocusId) : null;
        if (!this.usable(target)) {
            target = this.opener ? composedParent(this.opener) : null;
            while (target && !this.usable(target))
                target = composedParent(target);
        }
        if (this.usable(target))
            target.focus();
        else {
            const body = this.ownerDocument.body;
            const prior = body.getAttribute('tabindex');
            body.tabIndex = -1;
            body.focus();
            if (prior === null)
                body.removeAttribute('tabindex');
            else
                body.setAttribute('tabindex', prior);
        }
        this.opener = null;
    }
    override disconnectedCallback() { if (this.active)
        this.cleanup(); super.disconnectedCallback(); }
    private key = (event: KeyboardEvent) => {
        if (stack.at(-1) !== this || event.defaultPrevented) return;
        if (event.isComposing || event.keyCode === 229) { if (event.key === 'Escape') event.preventDefault(); return; }
        if (event.key === 'Escape') {
            event.preventDefault();
            event.stopPropagation();
            this.requestOpen(false);
        }
        if (event.key === 'Tab') {
            const elements = this.focusables();
            const active = deepActive(this.ownerDocument);
            const index = elements.indexOf(active as HTMLElement);
            if (!elements.length) {
                event.preventDefault();
                this.renderRoot.querySelector('dialog')?.focus();
            }
            else if (event.shiftKey && index <= 0) {
                event.preventDefault();
                elements.at(-1)!.focus();
            }
            else if (!event.shiftKey && (index < 0 || index === elements.length - 1)) {
                event.preventDefault();
                elements[0].focus();
            }
        }
    };
    override render() {
        if (!this.isOpen)
            return html ``;
        return html `<dialog data-krds-component="modal" data-krds-part="content" part="content" data-krds-state=${'open'} style="margin:0" id="dialog" role="dialog" aria-modal="true" aria-labelledby="title" aria-describedby=${ifDefined(this.description ? 'description' : undefined)} tabindex="-1" @click=${(event: Event) => { if ((event.target as Element).closest('[data-krds-close]'))
            this.requestOpen(false); }} @keydown=${this.key} @cancel=${(event: Event) => { event.preventDefault(); this.requestOpen(false); }} @pointerdown=${(event: PointerEvent) => { const rect = (event.currentTarget as HTMLElement).getBoundingClientRect(); this.outside = event.button === 0 && event.isPrimary && (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom); }} @pointerup=${(event: PointerEvent) => { const rect = (event.currentTarget as HTMLElement).getBoundingClientRect(); const outside = event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom; if (this.closeOnOutsideClick && this.outside && outside && event.button === 0 && event.isPrimary)
            this.requestOpen(false); this.outside = false; }}>
      <h2 data-krds-component="modal" data-krds-part="title" part="title" data-krds-state="" id="title">${this.title}</h2>${this.description ? html `<p data-krds-component="modal" data-krds-part="description" part="description" data-krds-state="" id="description">${this.description}</p>` : ''}
      <div data-krds-component="modal" data-krds-part="body" part="body" data-krds-state="">${this.body}<slot></slot></div><div data-krds-component="modal" data-krds-part="actions" part="actions" data-krds-state="">${this.actions}<slot name="actions"></slot></div>
      ${this.showCloseButton ? html `<button data-krds-component="modal" data-krds-part="close" part="close" data-krds-state="" type="button" aria-label=${this.locale === 'en-US' ? 'Close' : '닫기'} @click=${() => this.requestOpen(false)}>${this.locale === 'en-US' ? 'Close' : '닫기'}</button>` : ''}
    </dialog>`;
    }
}
