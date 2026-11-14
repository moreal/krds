import { html } from 'lit';
import type { ResizeContract } from '@unofficial-krds/contracts';
import { KrdsElement, ValueState, unique } from '../base.js';
import { target } from '../catalog-support.js';
export class Resize extends KrdsElement {
    static override properties = { levels: { attribute: false }, value: { type: String }, defaultValue: { type: String, attribute: 'default-value' }, open: { type: Boolean }, defaultOpen: { type: Boolean, attribute: 'default-open' }, scaleTargetId: { type: String, attribute: 'scale-target-id' } };
    declare levels: NonNullable<ResizeContract['levels']>;
    declare value: string | undefined;
    declare defaultValue: string | undefined;
    declare open: boolean | undefined;
    declare defaultOpen: boolean | undefined;
    declare scaleTargetId: string;
    private selection = new ValueState<string>();
    private disclosure = new ValueState<boolean>();
    private scaled: HTMLElement | null = null;
    private priorSize = '';
    constructor() { super(); this.levels = [{ id: '90', label: '작게', percent: 90 }, { id: '100', label: '기본', percent: 100 }, { id: '110', label: '조금 크게', percent: 110 }, { id: '130', label: '크게', percent: 130 }, { id: '150', label: '아주 크게', percent: 150 }]; this.scaleTargetId = ''; }
    get committedValue() { const value = this.selection.read(this.value, this.defaultValue, () => this.levels.find(level => level.percent === 100)?.id ?? this.levels[0]!.id); if (!this.levels.some(level => level.id === value))
        throw new TypeError('Unknown resize value'); return value; }
    get committedOpen() { return this.disclosure.read(this.open, this.defaultOpen, () => false); }
    private choose(value: string) { if (value === this.committedValue)
        return; this.selection.set(value); this.emit('value-change', { value }); this.requestUpdate(); }
    private show(open: boolean) { if (open === this.committedOpen)
        return; this.disclosure.set(open); this.emit('open-change', { open }); this.requestUpdate(); }
    override updated() { const element = this.scaleTargetId ? target(this, this.scaleTargetId) : this.renderRoot.querySelector<HTMLElement>('[part="content"]'); if (this.scaled !== element) {
        this.restore();
        this.scaled = element;
        this.priorSize = element?.style.fontSize ?? '';
    } if (element)
        element.style.fontSize = `${this.levels.find(level => level.id === this.committedValue)!.percent}%`; }
    private restore() { if (this.scaled)
        this.scaled.style.fontSize = this.priorSize; this.scaled = null; }
    private outside = (event: Event) => { if (!event.composedPath().includes(this))
        this.show(false); };
    override connectedCallback() { super.connectedCallback(); this.ownerDocument.addEventListener('pointerdown', this.outside); }
    override disconnectedCallback() { this.restore(); this.ownerDocument.removeEventListener('pointerdown', this.outside); super.disconnectedCallback(); }
    private key = (event: KeyboardEvent) => { if (event.key === 'Escape') {
        this.show(false);
        this.renderRoot.querySelector<HTMLButtonElement>('button')?.focus();
        return;
    } if (!['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft'].includes(event.key))
        return; event.preventDefault(); const index = this.levels.findIndex(level => level.id === this.committedValue); const next = Math.max(0, Math.min(this.levels.length - 1, index + (['ArrowDown', 'ArrowRight'].includes(event.key) ? 1 : -1))); this.choose(this.levels[next]!.id); };
    override render() { unique(this.levels.map(level => level.id)); if (!this.levels.length || this.levels.some(level => !Number.isFinite(level.percent) || level.percent <= 0))
        throw new TypeError('Invalid resize levels'); const current = this.levels.find(level => level.id === this.committedValue)!; return html `<div data-krds-component="resize" data-krds-part="root" data-krds-state="" part="root" @keydown=${this.key}><button data-krds-component="resize" data-krds-part="trigger" data-krds-state="" part="trigger" type="button" aria-expanded=${this.committedOpen} aria-controls="levels" @click=${() => this.show(!this.committedOpen)}>화면 크기 <span data-krds-component="resize" data-krds-part="current" data-krds-state="" part="current">${current.label}</span></button><div data-krds-component="resize" data-krds-part="list" data-krds-state="" part="list" id="levels" ?hidden=${!this.committedOpen}>${this.levels.map(level => html `<button data-krds-component="resize" data-krds-part="option" data-krds-state=${level.id === current.id ? 'selected' : ''} part="option" type="button" aria-pressed=${level.id === current.id} @click=${() => { this.choose(level.id); this.show(false); this.renderRoot.querySelector<HTMLButtonElement>('button')?.focus(); }}>${level.label}</button>`)}</div><div part="content"><slot></slot></div></div>`; }
}
