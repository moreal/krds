import { html } from 'lit';
import type { IdentifierContract, LogoData } from '@unofficial-krds/contracts';
import { KrdsElement } from '../base.js';
export class Identifier extends KrdsElement {
    static override properties = { institutionName: { type: String, attribute: 'institution-name' }, logo: { attribute: false }, relationshipText: { type: String, attribute: 'relationship-text' }, theme: { type: String } };
    declare institutionName: string;
    declare logo: LogoData;
    declare relationshipText: string;
    declare theme: IdentifierContract['theme'];
    constructor() { super(); this.institutionName = ''; this.logo = { src: '', alt: '' }; this.relationshipText = ''; this.theme = 'light'; }
    override render() { if (!this.institutionName || !this.logo.src || !this.logo.alt || !['light', 'dark'].includes(this.theme!))
        throw new TypeError('Identifier needs institution, logo and theme'); return html `<section data-krds-component="identifier" data-krds-part="root" data-krds-state=${this.theme} part="root" data-krds-theme=${this.theme!} aria-label=${this.institutionName}><img data-krds-component="identifier" data-krds-part="logo" data-krds-state=${this.theme} part="logo" src=${this.logo.src} alt=${this.logo.alt}><p data-krds-component="identifier" data-krds-part="text" data-krds-state=${this.theme} part="text">${this.relationshipText} ${this.institutionName}</p></section>`; }
}
