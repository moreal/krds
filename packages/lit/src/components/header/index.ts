import { css, html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { HeaderContract } from '@unofficial-krds/contracts';
import { KrdsElement, ValueState, unique } from '../base.js';
import { SurfaceController } from '../../controllers/surface-controller.js';
export class Header extends KrdsElement {
    static override styles = [...KrdsElement.styles, css`:host([sticky]){position:sticky;inset-block-start:0;z-index:60}`];
    static override properties = {
        home: { attribute: false }, utilityItems: { attribute: false }, search: { attribute: false }, mainNavigation: { attribute: false },
        actionLayout: { type: String, attribute: 'action-layout' }, sticky: { type: Boolean, reflect: true }, currentId: { type: String, attribute: 'current-id' },
        mobileOpen: { type: Boolean, attribute: 'mobile-open' }, defaultMobileOpen: { type: Boolean, attribute: 'default-mobile-open' },
        mobileTriggerId: { type: String, attribute: 'mobile-trigger-id' }, mobileTriggerLabel: { type: String, attribute: 'mobile-trigger-label' },
        navigationLabel: { type: String, attribute: 'navigation-label' }, utilitiesOpen: { state: true }, narrow: { state: true }
    };
    declare home: HeaderContract['home'];
    declare utilityItems: HeaderContract['utilityItems'];
    declare search: HeaderContract['search'];
    declare mainNavigation: HeaderContract['mainNavigation'];
    declare actionLayout: string;
    declare sticky: boolean;
    declare currentId: string;
    declare mobileOpen: boolean | undefined;
    declare defaultMobileOpen: boolean | undefined;
    declare mobileTriggerId: string;
    declare mobileTriggerLabel: string;
    declare navigationLabel: string;
    declare private utilitiesOpen: boolean;
    declare private narrow: boolean;
    private mobile = new ValueState<boolean>();
    private media?: MediaQueryList;
    readonly surface = new SurfaceController(this, { open: () => this.narrow && this.committedMobile, modal: () => true, onClose: () => this.showMobile(false), preferredReturn: () => this.shadowRoot?.getElementById(this.mobileTriggerId) ?? null });
    constructor() { super(); this.utilityItems = []; this.mainNavigation = []; this.actionLayout = 'horizontal'; this.sticky = false; this.currentId = ''; this.mobileTriggerId = 'header-mobile-trigger'; this.mobileTriggerLabel = '전체 메뉴'; this.navigationLabel = '메인 메뉴'; this.utilitiesOpen = false; this.narrow = false; }
    get committedMobile() { return this.mobile.read(this.mobileOpen, this.defaultMobileOpen, () => false); }
    private showMobile(open: boolean) { if (open === this.committedMobile) return; this.mobile.set(open); this.emit('mobile-open-change', { open }); this.requestUpdate(); }
    private resize = () => { this.narrow = this.media?.matches ?? false; };
    override connectedCallback() { super.connectedCallback(); this.media = this.ownerDocument.defaultView!.matchMedia('(max-width:47.99rem)'); this.resize(); this.media.addEventListener('change', this.resize); }
    override disconnectedCallback() { this.media?.removeEventListener('change', this.resize); super.disconnectedCallback(); }
    private menu() { return html`<krds-main-menu .embedded=${true} .items=${this.mainNavigation} .currentId=${this.currentId} .label=${this.navigationLabel}></krds-main-menu>`; }
    override render() {
        if (!this.home?.href || !this.home.logo?.alt || !['horizontal', 'vertical'].includes(this.actionLayout) || !this.mobileTriggerId.trim() || !this.mobileTriggerLabel.trim() || !this.navigationLabel.trim()) throw new TypeError('Header requires home logo, named controls and action layout');
        unique(this.utilityItems.map(item => item.id)); const collapsed = this.utilityItems.length >= 5;
        return html`<header data-krds-component="header" data-krds-part="root" data-krds-state=${this.sticky ? 'sticky' : ''} part="root" data-krds-action-layout=${this.actionLayout}>
          <a data-krds-component="header" data-krds-part="identity" data-krds-state="" part="identity" href=${this.home.href} aria-label=${this.home.label}><img src=${this.home.logo.src} alt=${this.home.logo.alt}></a>
          <div data-krds-component="header" data-krds-part="utilities" data-krds-state="" part="utilities">
            ${collapsed ? html`<button data-krds-component="header" data-krds-part="utility-trigger" data-krds-state=${this.utilitiesOpen ? 'expanded' : 'collapsed'} part="utility-trigger" type="button" aria-expanded=${this.utilitiesOpen} aria-controls="utilities" @click=${() => { this.utilitiesOpen = !this.utilitiesOpen; }}>보조 메뉴</button>` : ''}
            <ul id="utilities" ?hidden=${collapsed && !this.utilitiesOpen}>${this.utilityItems.map(item => html`<li><a href=${item.href}>${item.label}</a></li>`)}</ul>
          </div>
          <div data-krds-component="header" data-krds-part="actions" data-krds-state="" part="actions">${this.search ? html`<button data-krds-component="header" data-krds-part="search" data-krds-state="" part="search" type="button" @click=${() => { this.search?.onRequest(); this.emit('search-request', {}); }}>${this.search.label}</button>` : ''}
            ${this.mainNavigation.length ? html`<button data-krds-component="header" data-krds-part="mobile-trigger" data-krds-state=${this.committedMobile ? 'expanded' : 'collapsed'} part="mobile-trigger" id=${this.mobileTriggerId} type="button" ?hidden=${!this.narrow} aria-controls=${ifDefined(this.narrow ? 'header-mobile-navigation' : undefined)} aria-expanded=${this.committedMobile} @click=${() => this.showMobile(!this.committedMobile)}>${this.mobileTriggerLabel}</button>` : ''}
          </div>
          ${this.mainNavigation.length ? html`<div data-krds-component="header" data-krds-part="navigation" data-krds-state="" part="navigation">${this.narrow ? html`<dialog id="header-mobile-navigation" aria-label=${this.navigationLabel} tabindex="-1"><button type="button" @click=${() => this.showMobile(false)}>메뉴 닫기</button>${this.menu()}</dialog>` : this.menu()}</div>` : ''}
        </header>`;
    }
}
