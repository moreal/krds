import { html } from 'lit';
import type { CriticalAlertContract } from '@unofficial-krds/contracts';
import { KrdsElement } from '../base.js';
export class CriticalAlert extends KrdsElement {
    static override properties = { urgency: { type: String }, message: { type: String }, details: { attribute: false } };
    declare urgency: CriticalAlertContract['urgency'];
    declare message: string;
    declare details: CriticalAlertContract['details'];
    constructor() { super(); this.urgency = 'low'; this.message = ''; }
    override render() { if (!['high', 'medium', 'low'].includes(this.urgency) || !this.label || !this.message)
        throw new TypeError('Invalid critical alert'); return html `<section data-krds-component="critical-alert" data-krds-part="root" data-krds-state="" part="root" data-krds-urgency=${this.urgency} role="banner" aria-label=${this.label}><span data-krds-component="critical-alert" data-krds-part="icon" data-krds-state="" part="icon" aria-hidden="true">!</span><strong data-krds-component="critical-alert" data-krds-part="label" data-krds-state="" part="label">${this.label}</strong><p data-krds-component="critical-alert" data-krds-part="message" data-krds-state="" part="message">${this.message}</p>${this.details ? html `<a data-krds-component="critical-alert" data-krds-part="link" data-krds-state="" part="link" href=${this.details.href} title=${this.details.destinationTitle}>${this.details.label}</a>` : ''}</section>`; }
}
