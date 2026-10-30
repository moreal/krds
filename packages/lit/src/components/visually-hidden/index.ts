import { css, html } from 'lit';
import { KrdsElement } from '../base.js';
export class VisuallyHidden extends KrdsElement {
    static override styles = [...KrdsElement.styles, css`:host(:not([variant="interactive-overlay"])){position:absolute;inline-size:1px;block-size:1px;margin:-1px;padding:0;overflow:hidden;clip-path:inset(50%);white-space:nowrap}`];
    static override properties = { content: { type: String }, variant: { type: String, reflect: true } };
    declare content: string;
    declare variant: string;
    constructor() { super(); this.content = ''; this.variant = 'text'; }
    private control(slot: HTMLSlotElement) {
        const control = slot.assignedElements().find(element => element.matches('button,input,a[href]')) as HTMLElement | undefined;
        if (!control) throw new TypeError('Interactive overlay requires one real native control');
        control.dataset.krdsComponent = 'visually-hidden'; control.dataset.krdsPart = 'overlay-control'; control.setAttribute('part', 'overlay-control');
        Object.assign(control.style, { position: 'absolute', inset: '0', inlineSize: '100%', blockSize: '100%', opacity: '0', cursor: 'pointer', margin: '0', boxSizing: 'border-box' });
    }
    private showFocus(active: boolean) { const surrogate = this.shadowRoot?.querySelector<HTMLElement>('[part="visible-surrogate"]'); if (surrogate) surrogate.style.outline = active ? '2px solid currentColor' : ''; }
    override render() {
        if (!['text', 'interactive-overlay', 'aria-association'].includes(this.variant)) throw new TypeError('Invalid visually hidden variant');
        return this.variant === 'interactive-overlay' ? html`<span data-krds-component="visually-hidden" data-krds-part="root" data-krds-state="interactive-overlay" part="root" data-krds-variant=${this.variant} style="position:relative;display:inline-grid;vertical-align:middle" @focusin=${() => this.showFocus(true)} @focusout=${() => this.showFocus(false)}><span data-krds-component="visually-hidden" data-krds-part="visible-surrogate" data-krds-state="" part="visible-surrogate" aria-hidden="true">${this.content}</span><slot @slotchange=${(event: Event) => this.control(event.target as HTMLSlotElement)}></slot></span>` : html`<span data-krds-component="visually-hidden" data-krds-part="root" data-krds-state="text" part="root" data-krds-variant=${this.variant} style="position:absolute;inline-size:1px;block-size:1px;padding:0;margin:-1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap;border:0">${this.content}<slot></slot></span>`;
    }
}
