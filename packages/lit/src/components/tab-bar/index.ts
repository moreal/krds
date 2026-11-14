import { html, svg } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { TabBarContract } from '@unofficial-krds/contracts';
import { KrdsElement, unique } from '../base.js';
const iconPaths: Record<string, string> = { home: 'M3 10 12 3l9 7v11h-6v-7H9v7H3Z', document: 'M6 3h9l4 4v14H6Zm9 0v5h4M9 12h7M9 16h7', person: 'M16 7a4 4 0 1 1-8 0 4 4 0 0 1 8 0ZM4 21v-3a8 8 0 0 1 16 0v3', help: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20ZM9 9a3 3 0 1 1 5 2c-2 1-2 2-2 3m0 3v1', search: 'M18 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Zm-2 6 6 6' };
/** Independent simple pictograms for the plain icon tokens used by local examples; unknown tokens print as text. */
function navigationIcon(name: string) {
    const path = iconPaths[name.replace(/-(filled|active)$/, '')];
    return path ? svg`<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" tabindex="-1" aria-hidden="true"><path d=${path}/></svg>` : html`<span>${name}</span>`;
}
export class TabBar extends KrdsElement {
    static override properties = { items: { attribute: false }, currentId: { type: String, attribute: 'current-id' }, menuAction: { attribute: false } };
    declare items: TabBarContract['items'];
    declare currentId: string;
    declare menuAction: TabBarContract['menuAction'];
    constructor() { super(); this.items = []; this.currentId = ''; }
    override render() { unique(this.items.map(item => item.id)); if (this.items.length + (this.menuAction ? 1 : 0) > 5 || this.items.length < 1 || !this.items.some(item => item.id === this.currentId))
        throw new TypeError('Tab bar requires at most five destinations and a valid current page'); return html `<nav data-krds-component="tab-bar" data-krds-part="root" data-krds-state="" part="root" aria-label="주요 페이지"><ul data-krds-component="tab-bar" data-krds-part="list" data-krds-state="" part="list" style="display:flex;list-style:none;padding:0;margin:0">${this.items.map(item => { const current = item.id === this.currentId; return html `<li data-krds-component="tab-bar" data-krds-part="item" data-krds-state=${current ? 'current' : ''} part="item" style="flex:1;min-inline-size:0"><a data-krds-component="tab-bar" data-krds-part="link" data-krds-state="" part="link" href=${item.href} aria-current=${ifDefined(current ? 'page' : undefined)}>${current ? html`<span data-krds-component="tab-bar" data-krds-part="indicator" data-krds-state="" part="indicator" aria-hidden="true">•</span>` : ''}<span data-krds-component="tab-bar" data-krds-part="icon" data-krds-state="" part="icon" aria-hidden="true">${navigationIcon(current ? item.currentIcon ?? item.icon : item.icon)}</span><span data-krds-component="tab-bar" data-krds-part="label" data-krds-state="" part="label">${item.label}</span>${item.badge === undefined ? '' : html `<span data-krds-component="tab-bar" data-krds-part="badge" data-krds-state="" part="badge">${item.badge}</span>`}</a></li>`; })}${this.menuAction ? html `<li style="flex:1"><button data-krds-component="tab-bar" data-krds-part="menu-trigger" data-krds-state="" part="menu-trigger" type="button" @click=${() => { this.menuAction?.onRequest(); this.emit('menu-request', {}); }}>${this.menuAction.label}</button></li>` : ''}</ul></nav>`; }
}
