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
    private option(option: LanguageOption) { return html `<a data-krds-component="language-switcher" data-krds-part="option" data-krds-state=${option.locale === this.currentLocale ? 'current' : ''} part="option" lang=${option.locale} hreflang=${option.locale} href=${option.href} aria-describedby=${`description-${option.locale}`} aria-current=${ifDefined(option.locale === this.currentLocale ? 'true' : undefined)} target=${ifDefined(option.separateService ? '_blank' : undefined)} rel=${ifDefined(option.separateService ? 'noopener noreferrer' : undefined)} @click=${() => this.emit('locale-request', { locale: option.locale, href: option.href })}>${option.nativeLabel}</a> <span id=${`description-${option.locale}`} lang="ko">(${option.translatedLabel})${option.separateService ? ' (새 창)' : ''}</span>`; }
    override render() { unique(this.options.map(option => option.locale)); if (!this.options.some(option => option.locale === this.currentLocale))
        throw new TypeError('Current language is absent'); const alternate = this.options.filter(option => option.locale !== this.currentLocale); const collapsible = this.options.length > 2; return html `<nav data-krds-component="language-switcher" data-krds-part="root" data-krds-state="" part="root" aria-label="언어 선택" @keydown=${(event: KeyboardEvent) => { if (event.key === 'Escape') {
        this.show(false);
        this.renderRoot.querySelector<HTMLButtonElement>('button')?.focus();
    } if (event.key === 'ArrowDown' && this.options.length > 2) {
        event.preventDefault();
        this.show(true);
        void this.updateComplete.then(() => this.renderRoot.querySelector<HTMLAnchorElement>('a')?.focus());
    } }}>${alternate.length === 1 ? this.option(alternate[0]!) : html `${collapsible ? html `<button data-krds-component="language-switcher" data-krds-part="trigger" data-krds-state="" part="trigger" type="button" aria-controls="languages" aria-expanded=${this.committedOpen} @click=${() => this.show(!this.committedOpen)}>언어: <span data-krds-component="language-switcher" data-krds-part="current" data-krds-state="" part="current">${this.options.find(option => option.locale === this.currentLocale)!.nativeLabel}</span></button>` : ''}<ul data-krds-component="language-switcher" data-krds-part="list" data-krds-state="" part="list" id="languages" ?hidden=${collapsible && !this.committedOpen}>${this.options.map(option => html `<li>${this.option(option)}</li>`)}</ul>`}</nav>`; }
}
