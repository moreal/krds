import { html, type TemplateResult } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { NavigationItem, LinkData } from '@unofficial-krds/contracts';
import { KrdsElement, ValueState, unique } from '../base.js';
import { validateTree } from '../catalog-support.js';
export class SideNavigation extends KrdsElement {
    static override properties = { items: { attribute: false }, currentId: { type: String, attribute: 'current-id' }, expandedIds: { attribute: false }, defaultExpandedIds: { attribute: false }, title: { type: String }, parentLink: { attribute: false } };
    declare items: readonly NavigationItem[];
    declare currentId: string;
    declare expandedIds: readonly string[] | undefined;
    declare defaultExpandedIds: readonly string[] | undefined;
    declare parentLink: LinkData | undefined;
    private state = new ValueState<readonly string[]>();
    /** The branch the list is drilled into; undefined shows the first level. */
    private contextId: string | undefined;
    private contextReady = false;
    private previousIds: readonly string[] = [];
    private pendingDrill: string | undefined;
    private pendingFocus: { target: 'header' } | { target: 'trigger'; id: string; onlyIfLost: boolean } | undefined;
    constructor() { super(); this.items = []; this.currentId = ''; }
    private pathTo(id: string | undefined, nodes: readonly NavigationItem[] = this.items, ancestors: readonly NavigationItem[] = []): readonly NavigationItem[] {
        for (const item of nodes) {
            if (item.id === id) return [...ancestors, item];
            const found = this.pathTo(id, item.children ?? [], [...ancestors, item]);
            if (found.length) return found;
        }
        return [];
    }
    private initial(items = this.items): string[] { return items.flatMap(item => { const child = item.children ? this.initial(item.children) : []; return child.length || item.children?.some(child => child.id === this.currentId) ? [item.id, ...child] : []; }); }
    get committedIds() { return this.state.read(this.expandedIds, this.defaultExpandedIds ? [...new Set([...this.defaultExpandedIds, ...this.initial()])] : undefined, () => this.initial()); }
    /**
     * KRDS shows at most two levels at once; deeper levels are disclosed progressively under a header naming the branch.
     * Keeps the drilled-in branch consistent with the committed expansion before each render.
     */
    private syncContext() {
        const ids = this.committedIds;
        if (!this.contextReady) {
            this.contextReady = true;
            const current = this.pathTo(this.currentId || undefined);
            const deepest = ids.map(id => this.pathTo(id)).sort((a, b) => b.length - a.length)[0] ?? [];
            this.contextId = current.length > 2 ? current.at(-3)?.id : deepest.length > 1 ? deepest.at(-2)?.id : undefined;
        } else if (this.pendingDrill !== undefined && ids.includes(this.pendingDrill)) {
            // A requested drill-down takes effect once its branch is actually expanded (a controlled owner may refuse).
            this.contextId = this.pendingDrill; this.pendingDrill = undefined; this.pendingFocus = { target: 'header' };
        } else {
            // Collapsing a branch on the drilled-in path steps the view back out to that branch's level.
            const collapsed = this.pathTo(this.contextId).find(item => this.previousIds.includes(item.id) && !ids.includes(item.id));
            if (collapsed) {
                if ((this.renderRoot as ShadowRoot).activeElement) this.pendingFocus = { target: 'trigger', id: collapsed.id, onlyIfLost: true };
                this.contextId = this.pathTo(collapsed.id).at(-2)?.id;
            }
        }
        this.previousIds = [...ids];
    }
    private triggerFor(id: string) { return [...this.renderRoot.querySelectorAll<HTMLElement>('[data-krds-part="trigger"]')].find(node => node.id === `trigger-${id}`); }
    protected override updated() {
        const focus = this.pendingFocus; this.pendingFocus = undefined;
        const active = (this.renderRoot as ShadowRoot).activeElement;
        if (focus?.target === 'header') { this.renderRoot.querySelector<HTMLElement>('[data-krds-part="header"]')?.focus(); return; }
        if (focus && !(focus.onlyIfLost && active && !active.closest('[hidden]'))) { this.triggerFor(focus.id)?.focus(); return; }
        // Focus left inside a branch that was just collapsed returns to that branch's trigger.
        const panel = active?.closest<HTMLElement>('[data-krds-part="submenu"][hidden]');
        if (panel) this.triggerFor(panel.id.replace(/^submenu-/, ''))?.focus();
    }
    private toggle(item: NavigationItem, depth: number) {
        const committed = this.committedIds.includes(item.id);
        // Second-level parents never open inline: their trigger enters the branch instead.
        if (depth === 2 && committed) { this.contextId = item.id; this.pendingFocus = { target: 'header' }; this.requestUpdate(); return; }
        if (depth === 2) this.pendingDrill = item.id;
        const ids = committed ? this.committedIds.filter(value => value !== item.id) : [...this.committedIds, item.id];
        this.state.set(ids); this.emit('expanded-change', { ids }); this.requestUpdate();
    }
    private back(item: NavigationItem) { this.contextId = this.pathTo(item.id).at(-2)?.id; this.pendingFocus = { target: 'trigger', id: item.id, onlyIfLost: false }; this.requestUpdate(); }
    private entries(items: readonly NavigationItem[], depth: 1 | 2): TemplateResult[] { unique(items.map(item => item.id)); return items.map(item => { const open = depth < 2 && this.committedIds.includes(item.id); return html `<li data-krds-component="side-navigation" data-krds-part="item" data-krds-state=${open ? 'expanded' : 'collapsed'} part="item">${item.href ? html `<a data-krds-component="side-navigation" data-krds-part="link" data-krds-state=${this.currentId === item.id ? 'current' : ''} part="link" href=${item.href} aria-current=${ifDefined(this.currentId === item.id ? 'page' : undefined)}>${item.label}</a>` : item.children?.length ? '' : html `<span>${item.label}</span>`}${item.children?.length ? html `<button data-krds-component="side-navigation" data-krds-part="trigger" data-krds-state="" part="trigger" id=${`trigger-${item.id}`} type="button" aria-expanded=${open} aria-controls=${`submenu-${item.id}`} @click=${() => this.toggle(item, depth)}>${item.label} ${open ? '접기' : '펼치기'}<span data-krds-component="side-navigation" data-krds-part="indicator" data-krds-state="" part="indicator" aria-hidden="true"></span></button><ul id=${`submenu-${item.id}`} ?hidden=${!open} data-krds-component="side-navigation" data-krds-part="submenu" data-krds-state="" part="submenu">${depth < 2 ? this.entries(item.children, 2) : ''}</ul>` : ''}</li>`; }); }
    override render() {
        validateTree(this.items); unique(this.committedIds); this.syncContext();
        const context = this.pathTo(this.contextId).at(-1), heading = context?.label ?? this.title;
        return html `<nav data-krds-component="side-navigation" data-krds-part="root" data-krds-state="" part="root" aria-label=${this.title || this.label || '사이드 메뉴'}>${heading ? html `<h2 tabindex="-1" data-krds-component="side-navigation" data-krds-part="header" data-krds-state="" part="header">${heading}</h2>` : ''}${context ? html `<button type="button" data-krds-component="side-navigation" data-krds-part="parent-link" data-krds-state="" part="parent-link" @click=${() => this.back(context)}>상위 메뉴</button>` : this.parentLink ? html `<a data-krds-component="side-navigation" data-krds-part="parent-link" data-krds-state="" part="parent-link" href=${this.parentLink.href}>${this.parentLink.label}</a>` : ''}<ul data-krds-component="side-navigation" data-krds-part="list" data-krds-state="" part="list">${this.entries(context?.children ?? this.items, 1)}</ul></nav>`;
    }
}
