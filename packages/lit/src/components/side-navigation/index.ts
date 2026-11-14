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
    constructor() { super(); this.items = []; this.currentId = ''; }
    private initial(items = this.items): string[] { return items.flatMap(item => { const child = item.children ? this.initial(item.children) : []; return child.length || item.children?.some(child => child.id === this.currentId) ? [item.id, ...child] : []; }); }
    get committedIds() { return this.state.read(this.expandedIds, this.defaultExpandedIds ? [...new Set([...this.defaultExpandedIds, ...this.initial()])] : undefined, () => this.initial()); }
    private toggle(id: string) { const ids = this.committedIds.includes(id) ? this.committedIds.filter(value => value !== id) : [...this.committedIds, id]; this.state.set(ids); this.emit('expanded-change', { ids }); this.requestUpdate(); }
    private entries(items: readonly NavigationItem[]): TemplateResult[] { unique(items.map(item => item.id)); return items.map(item => { const open = this.committedIds.includes(item.id); return html `<li data-krds-component="side-navigation" data-krds-part="item" data-krds-state=${open ? 'expanded' : 'collapsed'} part="item">${item.href ? html `<a data-krds-component="side-navigation" data-krds-part="link" data-krds-state=${this.currentId === item.id ? 'current' : ''} part="link" href=${item.href} aria-current=${ifDefined(this.currentId === item.id ? 'page' : undefined)}>${item.label}</a>` : item.children?.length ? '' : html `<span>${item.label}</span>`}${item.children?.length ? html `<button data-krds-component="side-navigation" data-krds-part="trigger" data-krds-state="" part="trigger" id=${`trigger-${item.id}`} type="button" aria-expanded=${open} aria-controls=${`submenu-${item.id}`} @click=${() => this.toggle(item.id)}>${item.label} ${open ? '접기' : '펼치기'}<span data-krds-component="side-navigation" data-krds-part="indicator" data-krds-state="" part="indicator" aria-hidden="true"></span></button><ul id=${`submenu-${item.id}`} ?hidden=${!open} data-krds-component="side-navigation" data-krds-part="submenu" data-krds-state="" part="submenu">${this.entries(item.children)}</ul>` : ''}</li>`; }); }
    override render() { validateTree(this.items); unique(this.committedIds); return html `<nav data-krds-component="side-navigation" data-krds-part="root" data-krds-state="" part="root" aria-label=${this.title || this.label || '사이드 메뉴'}>${this.title ? html `<h2 tabindex="-1" data-krds-component="side-navigation" data-krds-part="header" data-krds-state="" part="header">${this.title}</h2>` : ''}${this.parentLink ? html `<a data-krds-component="side-navigation" data-krds-part="parent-link" data-krds-state="" part="parent-link" href=${this.parentLink.href}>${this.parentLink.label}</a>` : ''}<ul data-krds-component="side-navigation" data-krds-part="list" data-krds-state="" part="list">${this.entries(this.items)}</ul></nav>`; }
}
