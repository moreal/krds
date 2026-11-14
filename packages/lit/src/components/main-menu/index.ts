import { html, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import type { NavigationItem } from '@unofficial-krds/contracts';
import { KrdsElement, ValueState, deepActive, unique } from '../base.js';
import { usable, validateTree } from '../catalog-support.js';
import { SurfaceController } from '../../controllers/surface-controller.js';

export class MainMenu extends KrdsElement {
    static override properties = {
        items: { attribute: false }, currentId: { type: String, attribute: 'current-id' },
        expandedId: { attribute: false }, defaultExpandedId: { attribute: false },
        mobileOpen: { type: Boolean }, defaultMobileOpen: { type: Boolean, attribute: 'default-mobile-open' },
        query: { type: String }, mobileVariant: { type: String, attribute: 'mobile-variant' },
        narrow: { state: true }, embedded: { type: Boolean },
        mobileTriggerId: { type: String, attribute: 'mobile-trigger-id' },
        mobileTriggerLabel: { type: String, attribute: 'mobile-trigger-label' }
    };
    declare items: readonly NavigationItem[];
    declare currentId: string;
    declare expandedId: string | null | undefined;
    declare defaultExpandedId: string | null | undefined;
    declare mobileOpen: boolean | undefined;
    declare defaultMobileOpen: boolean | undefined;
    declare query: string | undefined;
    declare mobileVariant: 'simple' | 'sections' | 'drilldown';
    declare private narrow: boolean;
    declare embedded: boolean;
    declare mobileTriggerId: string;
    declare mobileTriggerLabel: string;
    private media?: MediaQueryList;
    private expanded = new ValueState<string | null>();
    private mobile = new ValueState<boolean>();
    private queryState = new ValueState<string>();
    private queryComposing = false;
    private queryDraft = '';
    private branchReturn?: { expected: string | null; triggerId: string; initiator: Element | null };
    private desktopBounds?: () => void;
    readonly surface = new SurfaceController(this, {
        open: () => this.narrow && this.committedMobile,
        modal: () => true,
        onClose: () => this.showMobile(false),
        preferredReturn: () => this.renderRoot.querySelector<HTMLButtonElement>('[data-mobile-trigger]')
    });

    constructor() {
        super(); this.items = []; this.currentId = ''; this.mobileVariant = 'sections';
        this.narrow = false; this.embedded = false;
        this.mobileTriggerId = 'menu-mobile-trigger'; this.mobileTriggerLabel = '전체 메뉴';
    }
    get committedExpanded() { return this.expanded.read(this.expandedId, this.defaultExpandedId, () => null); }
    get committedMobile() { return this.mobile.read(this.mobileOpen, this.defaultMobileOpen, () => false); }
    private get committedQuery() { return this.queryState.read(this.query, undefined, () => ''); }
    private path(items: readonly NavigationItem[], id: string | null, parents: readonly string[] = []): readonly string[] {
        if (!id) return [];
        for (const item of items) {
            const current = [...parents, item.id];
            if (item.id === id) return current;
            const child = item.children ? this.path(item.children, id, current) : [];
            if (child.length) return child;
        }
        return [];
    }
    private expand(id: string | null) {
        if (id === this.committedExpanded) return;
        this.expanded.set(id); this.emit('expanded-change', { id }); this.requestUpdate();
    }
    private collapse(id: string | null, triggerId: string) {
        this.branchReturn = { expected: id, triggerId, initiator: deepActive(this.ownerDocument) };
        this.expand(id);
    }
    private showMobile(open: boolean) {
        if (open === this.committedMobile) return;
        this.mobile.set(open); this.emit('mobile-open-change', { open }); this.requestUpdate();
    }
    private containsBranch(item: NavigationItem, id: string | null): boolean {
        return !!id && (item.id === id || !!item.children?.some(child => this.containsBranch(child, id)));
    }
    private editQuery = (event: Event) => {
        const value = (event.currentTarget as HTMLInputElement).value;
        if (this.queryComposing) { this.queryDraft = value; return; }
        if (value !== this.committedQuery) {
            this.queryState.set(value); this.emit('query-change', { value });
        }
        this.requestUpdate();
    };
    /** One li[item] per entry: optional link, then the branch trigger and its ul[submenu] headed by an unparted li with the submenu title. */
    private entries(items: readonly NavigationItem[]): TemplateResult[] {
        unique(items.map(item => item.id));
        return items.filter(item => !this.committedQuery || item.children?.length || item.label.includes(this.committedQuery)).map(item => {
            const open = this.containsBranch(item, this.committedExpanded);
            const state = open ? 'expanded' : 'collapsed';
            const branch = !!item.children?.length;
            return html`<li data-krds-component="main-menu" data-krds-part="item" data-krds-state=${state} part="item">
                ${item.href ? html`<a data-krds-component="main-menu" data-krds-part="link" data-krds-state=${this.currentId === item.id ? 'current' : ''} part="link" href=${item.href} aria-current=${ifDefined(this.currentId === item.id ? 'page' : undefined)}>${item.label}</a>` : branch ? '' : html`<span>${item.label}</span>`}
                ${!branch && item.description ? html`<p data-krds-component="main-menu" data-krds-part="description" data-krds-state="" part="description">${item.description}</p>` : ''}
                ${branch ? html`<button data-krds-component="main-menu" data-krds-part="trigger" data-krds-state=${state} part="trigger" id=${`trigger-${item.id}`} type="button" aria-current=${ifDefined(this.containsBranch(item, this.currentId) ? 'true' : undefined)} aria-label=${item.label} aria-controls=${`submenu-${item.id}`} aria-expanded=${open} @click=${() => {
                    this.branchReturn = undefined;
                    this.expand(open ? null : item.id);
                }}>${item.label}<span data-krds-component="main-menu" data-krds-part="indicator" data-krds-state="" part="indicator" aria-hidden="true"></span></button>
                <ul id=${`submenu-${item.id}`} data-krds-component="main-menu" data-krds-part="submenu" data-krds-state=${state} part="submenu" ?hidden=${!open}><li><h3 data-krds-component="main-menu" data-krds-part="submenu-title" data-krds-state="" part="submenu-title">${item.label}</h3>${item.description ? html`<p data-krds-component="main-menu" data-krds-part="description" data-krds-state="" part="description">${item.description}</p>` : ''}</li>${this.entries(item.children!)}</ul>` : ''}
            </li>`;
        });
    }
    private list() { return html`<ul data-krds-component="main-menu" data-krds-part="list" data-krds-state="" part="list">${this.entries(this.items)}</ul>`; }
    private escape = (event: KeyboardEvent) => {
        if (event.key !== 'Escape' || event.defaultPrevented || event.isComposing || event.keyCode === 229) return;
        if (this.committedExpanded) {
            event.preventDefault(); event.stopPropagation();
            this.collapse(null, this.committedExpanded);
        } else if (this.narrow && this.committedMobile) {
            event.preventDefault(); event.stopPropagation(); this.showMobile(false);
        }
    };
    private resize = () => { this.narrow = !this.embedded && (this.media?.matches ?? false); };
    override connectedCallback() {
        super.connectedCallback();
        this.media = this.ownerDocument.defaultView!.matchMedia('(max-width: 47.99rem)');
        this.resize(); this.media.addEventListener('change', this.resize);
    }
    override disconnectedCallback() {
        this.media?.removeEventListener('change', this.resize);
        this.desktopBounds?.(); this.desktopBounds = undefined;
        this.branchReturn = undefined; super.disconnectedCallback();
    }
    override updated() {
        if (this.narrow || !this.committedExpanded) {
            this.desktopBounds?.(); this.desktopBounds = undefined;
        } else if (!this.desktopBounds) {
            const root = this.renderRoot.querySelector<HTMLElement>('nav')!, window = this.ownerDocument.defaultView!;
            const bounds = () => {
                const viewport = window.visualViewport;
                const bottom = viewport ? viewport.offsetTop + viewport.height : window.innerHeight;
                root.style.setProperty('--krds-main-menu-available-height', `${Math.max(0, bottom - root.getBoundingClientRect().bottom)}px`);
            };
            bounds();
            const observer = new ResizeObserver(bounds); observer.observe(root);
            window.addEventListener('resize', bounds);
            this.ownerDocument.addEventListener('scroll', bounds, true);
            window.visualViewport?.addEventListener('resize', bounds);
            window.visualViewport?.addEventListener('scroll', bounds);
            this.desktopBounds = () => {
                observer.disconnect(); root.style.removeProperty('--krds-main-menu-available-height');
                window.removeEventListener('resize', bounds);
                this.ownerDocument.removeEventListener('scroll', bounds, true);
                window.visualViewport?.removeEventListener('resize', bounds);
                window.visualViewport?.removeEventListener('scroll', bounds);
            };
        }
        const pending = this.branchReturn;
        if (pending && this.committedExpanded === pending.expected) {
            this.branchReturn = undefined;
            const active = deepActive(this.ownerDocument);
            const trigger = this.renderRoot.querySelector<HTMLButtonElement>(`#trigger-${CSS.escape(pending.triggerId)}`);
            if (usable(trigger) && (active === pending.initiator || active === this.ownerDocument.body)) trigger.focus();
        }
    }
    private content() {
        const path = this.mobileVariant === 'drilldown' ? this.path(this.items, this.committedExpanded) : [];
        return html`<button data-krds-component="main-menu" data-krds-part="close" data-krds-state="" part="close" type="button" @click=${() => this.showMobile(false)}>메뉴 닫기</button><button data-krds-component="main-menu" data-krds-part="back" data-krds-state="" part="back" type="button" ?hidden=${!path.length} @click=${() => { if (path.length) this.collapse(path.at(-2) ?? null, path.at(-1)!); }}>이전 메뉴</button><label>메뉴 검색<input data-krds-component="main-menu" data-krds-part="search" data-krds-state="" part="search" type="search" .value=${live(this.queryComposing ? this.queryDraft : this.committedQuery)} @input=${this.editQuery} @compositionstart=${(event: Event) => { this.queryComposing = true; this.queryDraft = (event.currentTarget as HTMLInputElement).value; }} @compositionend=${(event: Event) => { this.queryComposing = false; this.editQuery(event); }}></label>${this.list()}`;
    }
    override render() {
        validateTree(this.items);
        if (!['simple', 'sections', 'drilldown'].includes(this.mobileVariant)) throw new TypeError('Invalid mobile menu variant');
        return html`<nav data-krds-component="main-menu" data-krds-part="root" data-krds-state="" part="root" aria-label=${this.label || '메인 메뉴'} data-krds-layout=${this.narrow ? 'mobile' : 'desktop'} data-krds-variant=${this.mobileVariant} @keydown=${this.narrow ? undefined : this.escape}>
            <button data-krds-component="main-menu" data-krds-part="mobile-trigger" data-krds-state="" part="mobile-trigger" data-mobile-trigger id=${this.mobileTriggerId} type="button" ?hidden=${!this.narrow} aria-controls="mobile" aria-expanded=${this.committedMobile} @click=${() => this.showMobile(!this.committedMobile)}>${this.mobileTriggerLabel}</button>
            ${this.narrow ? html`<dialog data-krds-component="main-menu" data-krds-part="mobile-content" data-krds-state=${this.committedMobile ? 'mobile-open' : ''} part="mobile-content" id="mobile" aria-label=${this.label || '메인 메뉴'} tabindex="-1" style="margin:0;max-inline-size:none;max-block-size:none;inline-size:100%;block-size:100dvh" @keydown=${this.escape}>${this.content()}</dialog>` : this.list()}
        </nav>`;
    }
}
