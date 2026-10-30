import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { StepIndicatorContract } from '@unofficial-krds/contracts';
import { KrdsElement, unique } from '../base.js';
export class StepIndicator extends KrdsElement {
    static override properties = { steps: { attribute: false }, mode: { type: String } };
    declare steps: StepIndicatorContract['steps'];
    declare mode: NonNullable<StepIndicatorContract['mode']>;
    constructor() { super(); this.steps = []; this.mode = 'sequential'; }
    override render() { unique(this.steps.map(step => step.id)); const completed = this.steps.length > 0 && this.steps.every(step => step.status === 'complete'); const current = completed ? this.steps.length - 1 : this.steps.findIndex(step => step.status === 'current'); if (current < 0 || !completed && this.steps.filter(step => step.status === 'current').length !== 1 || !['sequential', 'adaptive'].includes(this.mode))
        throw new TypeError('Step indicator needs one current step'); return html `<nav data-krds-component="step-indicator" data-krds-part="root" data-krds-state="" part="root" aria-label="진행 단계"><p>${current + 1} / ${this.steps.length} 단계</p><ol data-krds-component="step-indicator" data-krds-part="list" data-krds-state="" part="list">${this.steps.map((step, index) => { const blocked = this.mode === 'sequential' && index > current; return html `<li data-krds-component="step-indicator" data-krds-part="item" data-krds-state=${blocked ? 'blocked' : step.status} part="item" aria-current=${ifDefined(step.status === 'current' ? 'step' : undefined)}><span data-krds-component="step-indicator" data-krds-part="number" data-krds-state=${step.status} part="number" aria-hidden="true">${step.status === 'complete' ? '✓' : index + 1}</span>${step.href && !blocked && step.status !== 'current' ? html `<a data-krds-component="step-indicator" data-krds-part="label" data-krds-state=${step.status} part="label" href=${step.href} @click=${() => this.emit('step-request', { id: step.id })}>${step.label}</a>` : html `<span data-krds-component="step-indicator" data-krds-part="label" data-krds-state=${step.status} part="label">${step.label}</span>`}<span>${step.status === 'current' ? '현재 단계' : step.status === 'complete' ? '완료' : '진행 전'}${step.optional ? ' (선택)' : ''}</span></li>`; })}</ol></nav>`; }
}
