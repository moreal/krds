import { html } from 'lit';
import type { FooterContract } from '@unofficial-krds/contracts';
import { KrdsElement } from '../base.js';
export class Footer extends KrdsElement {
    static override properties = { serviceLogo: { attribute: false }, contacts: { attribute: false }, utilityLinks: { attribute: false }, privacyPolicy: { attribute: false }, policyLinks: { attribute: false }, copyrightText: { type: String, attribute: 'copyright-text' }, institution: { attribute: false } };
    declare serviceLogo: FooterContract['serviceLogo'];
    declare contacts: FooterContract['contacts'];
    declare utilityLinks: FooterContract['utilityLinks'];
    declare privacyPolicy: FooterContract['privacyPolicy'];
    declare policyLinks: FooterContract['policyLinks'];
    declare copyrightText: string;
    declare institution: FooterContract['institution'];
    constructor() { super(); this.contacts = []; this.utilityLinks = []; this.policyLinks = []; this.copyrightText = ''; }
    override render() { if (!this.serviceLogo?.alt || !this.privacyPolicy?.href || !this.privacyPolicy.label)
        throw new TypeError('Footer requires service logo and privacy policy'); return html `<footer role="contentinfo" data-krds-component="footer" data-krds-part="root" data-krds-state="" part="root"><img data-krds-component="footer" data-krds-part="logo" data-krds-state="" part="logo" src=${this.serviceLogo.src} alt=${this.serviceLogo.alt}><address data-krds-component="footer" data-krds-part="contacts" data-krds-state="" part="contacts">${this.contacts.map(contact => html `<p>${contact.label}: ${contact.href ? html `<a href=${contact.href}>${contact.text}</a>` : contact.text}</p>`)}</address><nav data-krds-component="footer" data-krds-part="utilities" data-krds-state="" part="utilities" aria-label="서비스 정보">${this.utilityLinks.map(link => html `<a href=${link.href}>${link.label}</a>`)}</nav><nav data-krds-component="footer" data-krds-part="policies" data-krds-state="" part="policies" aria-label="정책"><a data-krds-component="footer" data-krds-part="privacy-link" data-krds-state="" part="privacy-link" href=${this.privacyPolicy.href}><strong>${this.privacyPolicy.label}</strong></a>${this.policyLinks.map(link => html `<a href=${link.href}>${link.label}</a>`)}</nav><p data-krds-component="footer" data-krds-part="copyright" data-krds-state="" part="copyright">${this.copyrightText}</p>${this.institution ? html `<krds-identifier data-krds-component="footer" data-krds-part="identifier" data-krds-state="" part="identifier" .institutionName=${this.institution.institutionName} .logo=${this.institution.logo} .relationshipText=${this.institution.relationshipText} .theme=${this.institution.theme ?? 'light'}></krds-identifier>` : ''}</footer>`; }
}
