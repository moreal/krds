import { html } from 'lit';
import type { SkipLinkContract } from '@unofficial-krds/contracts';
import { KrdsElement, unique } from '../base.js';
import { target, focusTarget } from '../catalog-support.js';
export class SkipLink extends KrdsElement {
    static override properties = { links: { attribute: false }, visibility: { type: String } };
    declare links: SkipLinkContract['links'];
    declare visibility: string;
    constructor() { super(); this.links = []; this.visibility = 'focus-revealed'; }
    private activate(event: Event, id: string) { const destination = target(this, id); if (!destination) { event.preventDefault(); this.emit('configuration-error', { message: `Missing skip destination: ${id}` }); return; } event.preventDefault(); focusTarget(destination); }
    override updated() { for (const link of this.links)
        if (!target(this, link.targetId))
            throw new TypeError(`Missing skip destination: ${link.targetId}`); }
    override render() { unique(this.links.map(link => link.id)); if (!['focus-revealed', 'visible'].includes(this.visibility))
        throw new TypeError('Invalid skip visibility'); return html `<nav data-krds-component="skip-link" data-krds-part="root" data-krds-state="" part="root" aria-label="건너뛰기" data-krds-visibility=${this.visibility}><ul data-krds-component="skip-link" data-krds-part="list" data-krds-state="" part="list">${this.links.map(link => html `<li data-krds-component="skip-link" data-krds-part="item" data-krds-state="" part="item"><a data-krds-component="skip-link" data-krds-part="link" data-krds-state="" part="link" href=${`#${link.targetId}`} @click=${(event: Event) => this.activate(event, link.targetId)}>${link.label}</a></li>`)}</ul></nav>`; }
}
