import { html } from 'lit';
import type { BreadcrumbContract } from '@unofficial-krds/contracts';
import { KrdsElement, unique } from '../base.js';
export class Breadcrumb extends KrdsElement {
    static override properties = { items: { attribute: false }, home: { attribute: false }, currentItem: { attribute: false }, omitCurrent: { type: Boolean, attribute: 'omit-current' }, maxVisible: { type: Number, attribute: 'max-visible' }, narrow: { state: true } };
    declare items: BreadcrumbContract['items'];
    declare home: BreadcrumbContract['home'];
    declare currentItem: BreadcrumbContract['currentItem'];
    declare omitCurrent: boolean;
    declare maxVisible: number;
    declare private narrow: boolean;
    private media?: MediaQueryList;
    constructor() { super(); this.items = []; this.omitCurrent = true; this.maxVisible = 4; this.narrow = false; }
    private resize = () => { this.narrow = this.media?.matches ?? false; };
    override connectedCallback() { super.connectedCallback(); this.media = this.ownerDocument.defaultView!.matchMedia('(max-width: 47.99rem)'); this.resize(); this.media.addEventListener('change', this.resize); }
    override disconnectedCallback() { this.media?.removeEventListener('change', this.resize); super.disconnectedCallback(); }
    override render() { unique(this.items.map(item => item.id)); if (!this.home?.href || !Number.isInteger(this.maxVisible) || this.maxVisible < 2 || !this.omitCurrent && !this.currentItem)
        throw new TypeError('Invalid breadcrumb'); const limit = this.narrow ? 2 : this.maxVisible; const tail = this.narrow ? 1 : Math.max(1, limit - 2); const collapsed = this.items.length > limit - 1; return html `<nav data-krds-component="breadcrumb" data-krds-part="root" data-krds-state=${collapsed ? 'collapsed' : ''} part="root" aria-label="브레드크럼"><ol data-krds-component="breadcrumb" data-krds-part="list" data-krds-state="" part="list"><li data-krds-component="breadcrumb" data-krds-part="item" data-krds-state="" part="item"><a data-krds-component="breadcrumb" data-krds-part="home" data-krds-state="" part="home" href=${this.home.href}>${this.home.label}</a></li>${collapsed ? html `<li><span data-krds-component="breadcrumb" data-krds-part="ellipsis" data-krds-state="collapsed" part="ellipsis"><span aria-hidden="true">…</span><span style="position:absolute;inline-size:1px;block-size:1px;overflow:hidden;clip-path:inset(50%)">생략된 상위 경로: ${this.items.slice(0, -tail).map(item => item.label).join(' > ')}</span></span></li>` : ''}${(collapsed ? this.items.slice(-tail) : this.items).map(item => html `<li data-krds-component="breadcrumb" data-krds-part="item" data-krds-state="" part="item"><span data-krds-component="breadcrumb" data-krds-part="separator" data-krds-state="" part="separator" aria-hidden="true">›</span>${item.href ? html `<a data-krds-component="breadcrumb" data-krds-part="link" data-krds-state="" part="link" href=${item.href}>${item.label}</a>` : html `<span data-krds-component="breadcrumb" data-krds-part="link" data-krds-state="" part="link">${item.label}</span>`}</li>`)}${this.currentItem && !this.omitCurrent ? html `<li data-krds-component="breadcrumb" data-krds-part="item" data-krds-state="current" part="item" aria-current="page"><span data-krds-component="breadcrumb" data-krds-part="separator" data-krds-state="" part="separator" aria-hidden="true">›</span><span data-krds-component="breadcrumb" data-krds-part="link" data-krds-state="current" part="link">${this.currentItem.label}</span></li>` : ''}</ol></nav>`; }
}
