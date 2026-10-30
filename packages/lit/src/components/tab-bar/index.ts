import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { TabBarContract } from '@unofficial-krds/contracts';
import { KrdsElement, unique } from '../base.js';
export class TabBar extends KrdsElement {
    static override properties = { items: { attribute: false }, currentId: { type: String, attribute: 'current-id' }, menuAction: { attribute: false } };
    declare items: TabBarContract['items'];
    declare currentId: string;
    declare menuAction: TabBarContract['menuAction'];
    constructor() { super(); this.items = []; this.currentId = ''; }
    override render() { unique(this.items.map(item => item.id)); if (this.items.length + (this.menuAction ? 1 : 0) > 5 || this.items.length < 1 || !this.items.some(item => item.id === this.currentId))
        throw new TypeError('Tab bar requires at most five destinations and a valid current page'); return html `<nav data-krds-component="tab-bar" data-krds-part="root" data-krds-state="current" part="root" aria-label="주요 페이지"><ul data-krds-component="tab-bar" data-krds-part="list" data-krds-state="" part="list" style="display:flex;list-style:none;padding:0;margin:0">${this.items.map(item => html `<li data-krds-component="tab-bar" data-krds-part="item" data-krds-state=${item.id === this.currentId ? 'current' : ''} part="item" style="flex:1;min-inline-size:0"><a data-krds-component="tab-bar" data-krds-part="link" data-krds-state=${item.id === this.currentId ? 'current' : ''} part="link" href=${item.href} aria-current=${ifDefined(item.id === this.currentId ? 'page' : undefined)}><span aria-hidden="true">${item.id === this.currentId ? item.currentIcon ?? item.icon : item.icon}</span><span>${item.label}</span>${item.id === this.currentId ? html`<span data-krds-component="tab-bar" data-krds-part="indicator" data-krds-state="" part="indicator" aria-hidden="true">●</span>` : ''}${item.badge === undefined ? '' : html `<span data-krds-component="tab-bar" data-krds-part="badge" data-krds-state="" part="badge">${item.badge}</span>`}</a></li>`)}${this.menuAction ? html `<li style="flex:1"><button data-krds-component="tab-bar" data-krds-part="menu-trigger" data-krds-state="" part="menu-trigger" type="button" @click=${() => { this.menuAction?.onRequest(); this.emit('menu-request', {}); }}>${this.menuAction.label}</button></li>` : ''}</ul></nav>`; }
}
