import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { KrdsElement } from '../base.js';
export class Spinner extends KrdsElement {
    static override properties = { pending: { type: Boolean }, value: { type: Number }, completionMessage: { type: String, attribute: 'completion-message' }, size: { type: String } };
    declare pending: boolean;
    declare value: number | undefined;
    declare completionMessage: string;
    declare size: string;
    constructor() { super(); this.pending = false; this.completionMessage = ''; this.size = 'medium'; }
    override render() { if (!this.label || !this.completionMessage || this.value !== undefined && (!Number.isFinite(this.value) || this.value < 0 || this.value > 100) || !['small', 'medium', 'large'].includes(this.size))
        throw new RangeError('Invalid spinner configuration'); const state = this.pending ? 'pending' : 'complete'; return html `<div data-krds-component="spinner" data-krds-part="root" data-krds-state=${state} part="root" aria-busy=${this.pending ? 'true' : 'false'} data-krds-size=${this.size}>${this.pending ? html `<progress data-krds-component="spinner" data-krds-part="indicator" data-krds-state=${this.value === undefined ? 'indeterminate' : 'determinate'} part="indicator" max="100" value=${ifDefined(this.value)} aria-label=${this.label} aria-valuemin="0" aria-valuemax="100" aria-valuenow=${ifDefined(this.value)}></progress>` : ''}<span data-krds-component="spinner" data-krds-part="label" data-krds-state="" part="label"><span data-krds-component="spinner" data-krds-part="status" data-krds-state="" part="status" role="status" aria-live="polite">${this.pending ? this.label : this.completionMessage}</span></span></div>`; }
}
