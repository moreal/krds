import { html } from 'lit';
import type { FABContract } from '@unofficial-krds/contracts';
import { KrdsElement, ValueState, unique } from '../base.js';
import { usable } from '../catalog-support.js';

export class FAB extends KrdsElement {
    static override properties = {
        icon: { type: String },
        showLabel: { type: Boolean, attribute: 'show-label' },
        disabled: { type: Boolean },
        expanded: { type: Boolean },
        defaultExpanded: { type: Boolean, attribute: 'default-expanded' },
        actions: { attribute: false }
    };
    declare icon: string;
    declare showLabel: boolean;
    declare disabled: boolean;
    declare expanded: boolean | undefined;
    declare defaultExpanded: boolean | undefined;
    declare actions: FABContract['actions'];
    private state = new ValueState<boolean>();
    private returnAfterClose = false;

    constructor() {
        super();
        this.icon = '+';
        this.showLabel = true;
        this.disabled = false;
    }
    get committedExpanded() {
        return this.state.read(this.expanded, this.defaultExpanded, () => false);
    }
    private show(expanded: boolean) {
        if (this.disabled || expanded === this.committedExpanded) return;
        if (!expanded && this.shadowRoot?.activeElement) this.returnAfterClose = true;
        this.state.set(expanded);
        this.emit('expanded-change', { expanded });
        this.requestUpdate();
    }
    private escape = (event: KeyboardEvent) => {
        if (event.key === 'Escape' && !event.defaultPrevented && !event.isComposing && this.committedExpanded) this.show(false);
    };
    override connectedCallback() {
        super.connectedCallback();
        this.ownerDocument.addEventListener('keydown', this.escape);
    }
    override disconnectedCallback() {
        this.ownerDocument.removeEventListener('keydown', this.escape);
        this.returnAfterClose = false;
        super.disconnectedCallback();
    }
    override updated() {
        if (!this.committedExpanded && this.returnAfterClose) {
            this.returnAfterClose = false;
            const trigger = this.renderRoot.querySelector<HTMLButtonElement>('[data-krds-part="trigger"]');
            if (usable(trigger)) trigger.focus({ preventScroll: true });
        }
    }
    override render() {
        if (!this.label || (this.actions?.length ?? 0) > 3) throw new TypeError('FAB requires a label and at most three actions');
        unique(this.actions?.map(action => action.id) ?? []);
        const state = `${this.committedExpanded ? 'expanded' : 'collapsed'} ${this.disabled ? 'disabled' : ''}`;
        return html`<div data-krds-component="fab" data-krds-part="root" data-krds-state=${state} part="root" style="inset-block-end:calc(var(--krds-fixed-navigation-height,6rem) + var(--krds-gap-5))">
            <div data-krds-component="fab" data-krds-part="overlay" data-krds-state=${state} part="overlay" aria-hidden="true" ?hidden=${!this.committedExpanded} @click=${() => this.show(false)}></div>
            <button data-krds-component="fab" data-krds-part="trigger" data-krds-state=${state} part="trigger" type="button" aria-label=${this.label} ?disabled=${this.disabled} aria-expanded=${this.actions?.length ? String(this.committedExpanded) : 'false'} aria-controls="actions" @click=${() => this.actions?.length ? this.show(!this.committedExpanded) : this.emit('action', {})}>
                <span data-krds-component="fab" data-krds-part="icon" data-krds-state="" part="icon" aria-hidden="true">${this.icon === 'plus' ? '+' : this.icon}</span>${this.showLabel ? html`<span data-krds-component="fab" data-krds-part="label" data-krds-state="" part="label">${this.label}</span>` : ''}
            </button>
            <div data-krds-component="fab" data-krds-part="actions" data-krds-state=${state} part="actions" id="actions" ?hidden=${!this.committedExpanded}>
                ${this.actions?.map(action => html`<button data-krds-component="fab" data-krds-part="action" data-krds-state="" part="action" type="button" ?disabled=${this.disabled} @click=${() => { action.onAction?.(); this.emit('action', { id: action.id }); }}>${action.label}</button>`)}
            </div>
        </div>`;
    }
}
