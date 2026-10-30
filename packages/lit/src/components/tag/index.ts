import { html, type PropertyValues } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { TagContract } from '@unofficial-krds/contracts';
import { KrdsElement, deepActive, unique } from '../base.js';
import { focusTarget, target, usable } from '../catalog-support.js';

type Removal = { id: string; previous: readonly string[]; next: readonly string[]; control: HTMLElement };
export class Tag extends KrdsElement {
    static override properties = { items: { attribute: false }, mode: { type: String }, selectedIds: { attribute: false }, appliedBarId: { type: String, attribute: 'applied-bar-id' }, activeId: { state: true }, clearActive: { state: true } };
    declare items: TagContract['items'];
    declare mode: NonNullable<TagContract['mode']>;
    declare selectedIds: readonly string[] | undefined;
    declare appliedBarId: string;
    declare private activeId: string;
    declare private clearActive: boolean;
    private localSelected: readonly string[] = [];
    private removal?: Removal;
    private restoreRemoval = false;
    private pendingAdd = false;
    private pendingClear = false;
    private enterControl: HTMLButtonElement | null = null;
    private enterIdentity: string | undefined;
    private enterMode: string | undefined;
    constructor() { super(); this.items = []; this.mode = 'static'; this.appliedBarId = ''; this.activeId = ''; this.clearActive = false; }
    private toggle(id: string) {
        const current = this.selectedIds ?? this.localSelected;
        const ids = current.includes(id) ? current.filter(value => value !== id) : [...current, id];
        if (this.selectedIds === undefined) this.localSelected = ids;
        this.emit('selection-change', { ids }); this.requestUpdate();
    }
    override willUpdate(_changed: PropertyValues) {
        if (!this.ownerDocument?.defaultView) return;
        const active = deepActive(this.ownerDocument);
        this.restoreRemoval = !!this.removal && (active === this.removal.control || active === this.ownerDocument.body);
    }
    private controls() { return [...this.renderRoot.querySelectorAll<HTMLElement>('[data-tag]:not(:disabled):not([aria-disabled="true"]),[part="clear"]')]; }
    private focusControl(control: HTMLElement) {
        this.clearActive = control.getAttribute('part') === 'clear';
        if (!this.clearActive) this.activeId = control.dataset.tag!;
        control.focus();
    }
    private key = (event: KeyboardEvent) => {
        if (event.defaultPrevented || event.isComposing || event.keyCode === 229) return;
        const control = event.composedPath().find(node => node instanceof HTMLElement && (node.hasAttribute('data-tag') || node.getAttribute('part') === 'clear')) as HTMLElement | undefined;
        if (!control) return;
        if (event.key === 'Enter' && control instanceof HTMLButtonElement) {
            event.preventDefault(); if (!event.repeat) { this.enterControl = control; this.enterIdentity = control.dataset.tag; this.enterMode = this.mode; } return;
        }
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const controls = this.controls(); const index = controls.indexOf(control);
        const direction = (event.key === 'ArrowRight' ? 1 : -1) * (this.direction === 'rtl' ? -1 : 1);
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? controls.length - 1 : (index + direction + controls.length) % controls.length;
        if (controls[next]) this.focusControl(controls[next]);
    };
    private keyUp = (event: KeyboardEvent) => {
        if (event.key !== 'Enter') return;
        const control = this.enterControl; this.enterControl = null;
        if (!event.defaultPrevented && !event.isComposing && event.keyCode !== 229 && control && control.dataset.tag === this.enterIdentity && this.mode === this.enterMode && usable(control) && deepActive(this.ownerDocument) === control) {
            event.preventDefault(); control.click();
        }
    };
    override updated() {
        if (this.pendingAdd) {
            this.pendingAdd = false;
            focusTarget(target(this, this.appliedBarId));
        }
        if (this.removal && !this.items.some(item => item.id === this.removal!.id)) {
            const pending = this.removal; this.removal = undefined;
            const ids = [...pending.previous, ...pending.next];
            const next = ids.map(id => this.renderRoot.querySelector<HTMLElement>(`[data-tag="${CSS.escape(id)}"]`)).find(control => usable(control));
            if (this.restoreRemoval) {
                if (next) this.focusControl(next);
                else this.renderRoot.querySelector<HTMLElement>('[part="root"]')?.focus();
            }
        }
        if (this.pendingClear && !this.items.length) {
            this.pendingClear = false;
            this.renderRoot.querySelector<HTMLElement>('[part="root"]')?.focus();
        }
    }
    override disconnectedCallback() {
        this.pendingAdd = false; this.pendingClear = false; this.removal = undefined; this.enterControl = null;
        super.disconnectedCallback();
    }
    override render() {
        unique(this.items.map(item => item.id));
        if (!['static', 'toggle', 'removable', 'add-filter', 'link'].includes(this.mode)) throw new TypeError('Invalid tag mode');
        if (this.mode !== 'removable' || !this.items.length) this.clearActive = false;
        if (!this.items.some(item => item.id === this.activeId && !item.disabled)) this.activeId = this.items.find(item => !item.disabled)?.id ?? '';
        const tabIndex = (id: string, disabled?: boolean) => !disabled && !this.clearActive && this.activeId === id ? 0 : -1;
        return html`<div data-krds-component="tag" data-krds-part="root" data-krds-state="" part="root" role="group" aria-label=${this.label || '태그'} tabindex="-1" @keydown=${this.key} @keyup=${this.keyUp}>
            <ul data-krds-component="tag" data-krds-part="list" data-krds-state="" part="list">${this.items.map((item, index) => {
                const selected = (this.selectedIds ?? this.localSelected).includes(item.id);
                const focused = (event: FocusEvent) => { this.clearActive = false; this.activeId = item.id; if (this.enterControl !== event.currentTarget) this.enterControl = null; };
                return html`<li data-krds-component="tag" data-krds-part="item" data-krds-state=${`${selected ? 'selected' : ''} ${item.disabled ? 'disabled' : ''}`} part="item">
                    ${this.mode === 'static' ? html`<span>${item.label}</span>` : this.mode === 'link' ? html`<a data-tag=${item.id} tabindex=${tabIndex(item.id, item.disabled)} href=${ifDefined(item.disabled ? undefined : item.href)} aria-disabled=${ifDefined(item.disabled ? 'true' : undefined)} @focus=${focused}>${item.label}</a>` : this.mode === 'removable' ? html`<span>${item.label}</span><button data-krds-component="tag" data-krds-part="remove" data-krds-state="" part="remove" data-tag=${item.id} tabindex=${tabIndex(item.id, item.disabled)} type="button" aria-label=${`${item.label} 옵션 삭제`} ?disabled=${item.disabled} @focus=${focused} @click=${(event: MouseEvent) => {
                        this.removal = { id: item.id, previous: this.items.slice(0, index).map(item => item.id).reverse(), next: this.items.slice(index + 1).map(item => item.id), control: event.currentTarget as HTMLElement };
                        this.emit('remove', { id: item.id }); this.requestUpdate();
                    }}>×</button>` : html`<button data-tag=${item.id} tabindex=${tabIndex(item.id, item.disabled)} aria-label=${ifDefined(this.mode === 'add-filter' ? `${item.label} 필터 옵션 추가` : undefined)} type="button" ?disabled=${item.disabled} aria-pressed=${selected} @focus=${focused} @click=${() => {
                        if (this.mode === 'toggle') this.toggle(item.id);
                        else { this.pendingAdd = true; this.emit('add', { id: item.id }); this.requestUpdate(); }
                    }}>${item.label}</button>`}
                </li>`;
            })}</ul>
            ${this.mode === 'removable' && this.items.length ? html`<button data-krds-component="tag" data-krds-part="clear" data-krds-state="" part="clear" tabindex=${this.clearActive || !this.activeId ? 0 : -1} type="button" @focus=${() => { this.clearActive = true; }} @click=${() => { this.pendingClear = true; this.emit('clear', {}); this.requestUpdate(); }}>모두 삭제</button>` : ''}
        </div>`;
    }
}
