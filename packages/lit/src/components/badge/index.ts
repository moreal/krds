import { html } from 'lit';
import { KrdsElement } from '../base.js';
export class Badge extends KrdsElement {
    static override properties = { appearance: { type: String }, tone: { type: String }, size: { type: String }, numeric: { type: Boolean } };
    declare appearance: string;
    declare tone: string;
    declare size: string;
    declare numeric: boolean;
    constructor() { super(); this.appearance = 'outline'; this.tone = 'secondary'; this.size = 'medium'; this.numeric = false; }
    override render() { if (!this.label || !['outline', 'filled', 'pastel'].includes(this.appearance) || !['secondary', 'gray', 'point', 'danger', 'warning', 'success', 'information', 'disabled'].includes(this.tone) || !['small', 'medium', 'large'].includes(this.size))
        throw new TypeError('Invalid badge'); return html `<span data-krds-component="badge" data-krds-part="root" data-krds-state=${`${this.appearance} ${this.tone} ${this.size}${this.numeric ? ' numeric' : ''}`} part="root" data-krds-appearance=${this.appearance} data-krds-tone=${this.tone} data-krds-size=${this.size}><span data-krds-component="badge" data-krds-part="label" data-krds-state="" part="label">${this.label}</span></span>`; }
}
