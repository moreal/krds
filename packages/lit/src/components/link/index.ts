import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { KrdsElement } from '../base.js';
export class Link extends KrdsElement {
    static override properties = { href: { type: String }, target: { type: String }, rel: { type: String }, disabled: { type: Boolean }, appearance: { type: String }, size: { type: String }, underline: { type: Boolean } };
    declare href: string;
    declare target: string;
    declare rel: string;
    declare disabled: boolean;
    declare appearance: string;
    declare size: string;
    declare underline: boolean;
    constructor() { super(); this.href = ''; this.target = ''; this.rel = ''; this.disabled = false; this.appearance = 'basic'; this.size = 'medium'; this.underline = true; }
    override render() { if (!this.href || !this.label || !['basic', 'emphasis'].includes(this.appearance) || !['small', 'medium', 'large'].includes(this.size))
        throw new TypeError('Invalid link'); const external = this.target === '_blank'; return html `<a data-krds-component="link" data-krds-part="root" data-krds-state=${`${this.disabled ? 'disabled' : ''} ${external ? 'external' : ''}`} part="root" href=${ifDefined(this.disabled ? undefined : this.href)} role=${ifDefined(this.disabled ? 'link' : undefined)} aria-disabled=${ifDefined(this.disabled ? 'true' : undefined)} tabindex=${ifDefined(this.disabled ? '-1' : undefined)} target=${ifDefined(this.target || undefined)} rel=${ifDefined([this.rel, external ? 'noopener noreferrer' : ''].filter(Boolean).join(' ') || undefined)} style=${this.underline ? 'text-decoration:underline' : 'text-decoration:none'} data-krds-appearance=${this.appearance} data-krds-size=${this.size}>${this.label}${external ? html `<span> (새 창)</span>` : ''}</a>`; }
}
