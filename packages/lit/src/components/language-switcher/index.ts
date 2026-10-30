import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { LanguageOption } from '@unofficial-krds/contracts';
import { KrdsElement, ValueState, unique } from '../base.js';
export class LanguageSwitcher extends KrdsElement {
    static override properties = { currentLocale: { type: String, attribute: 'current-locale' }, options: { attribute: false }, open: { type: Boolean }, defaultOpen: { type: Boolean, attribute: 'default-open' } };
    declare currentLocale: string;
    declare options: readonly LanguageOption[];
    declare open: boolean | undefined;
    declare defaultOpen: boolean | undefined;
    private state = new ValueState<boolean>();
    constructor() { super(); this.currentLocale = 'ko'; this.options = []; }
    get committedOpen() { return this.state.read(this.open, this.defaultOpen, () => false); }
    private show(open: boolean) { if (open === this.committedOpen)
        return; this.state.set(open); this.emit('open-change', { open }); this.requestUpdate(); }
    private outside = (event: Event) => { if (!event.composedPath().includes(this))
        this.show(false); };
    override connectedCallback() { super.connectedCallback(); this.ownerDocument.addEventListener('pointerdown', this.outside); }
    override disconnectedCallback() { this.ownerDocument.removeEventListener('pointerdown', this.outside); super.disconnectedCallback(); }
    private option(option: LanguageOption) { return html `<a data-krds-component="language-switcher" data-krds-part="option" data-krds-state=${option.locale === this.currentLocale ? 'current' : ''} part="option" href=${option.href} aria-describedby=${ifDefined(option.separateService ? `service-${option.locale}` : undefined)} lang=${option.locale} hreflang=${option.locale} aria-current=${ifDefined(option.locale === this.currentLocale ? 'true' : undefined)} target=${ifDefined(option.separateService ? '_blank' : undefined)} rel=${ifDefined(option.separateService ? 'noopener noreferrer' : undefined)} @click=${() => this.emit('locale-request', { locale: option.locale, href: option.href })}>${option.nativeLabel}</a>${option.separateService ? html`<span id=${`service-${option.locale}`} style="position:absolute;inline-size:1px;block-size:1px;overflow:hidden;clip-path:inset(50%)">별도 서비스, 새 창</span>` : ''}`; }
    override render() { unique(this.options.map(option => option.locale)); if (!this.options.some(option => option.locale === this.currentLocale))
        throw new TypeError('Current language is absent'); const alternate = this.options.filter(option => option.locale !== this.currentLocale); return html `<nav data-krds-component="language-switcher" data-krds-part="root" data-krds-state=${this.committedOpen ? 'open' : 'closed'} part="root" aria-label="언어 선택" @keydown=${(event: KeyboardEvent) => { if (event.key === 'Escape') {
        this.show(false);
        this.renderRoot.querySelector<HTMLButtonElement>('button')?.focus();
    } if (event.key === 'ArrowDown' && this.options.length > 2) {
        event.preventDefault();
        this.show(true);
        void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLAnchorElement>('a')?.focus());
    } }}>${alternate.length === 1 ? this.option(alternate[0]!) : html `<button data-krds-component="language-switcher" data-krds-part="trigger" data-krds-state=${this.committedOpen ? 'open' : 'closed'} part="trigger" type="button" aria-controls="languages" aria-expanded=${this.committedOpen} @click=${() => this.show(!this.committedOpen)}>언어: ${this.options.find(option => option.locale === this.currentLocale)!.nativeLabel}</button><ul data-krds-component="language-switcher" data-krds-part="list" data-krds-state=${this.committedOpen ? 'open' : 'closed'} part="list" id="languages" ?hidden=${!this.committedOpen}>${this.options.map(option => html `<li>${this.option(option)}</li>`)}</ul>`}</nav>`; }
}
