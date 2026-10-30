import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import { KrdsElement } from '../base.js';
import { restoreModalAware } from '../../controllers/surface-controller.js';
export class BackButton extends KrdsElement {
  static override properties = { canGoBack: { type: Boolean, attribute: 'can-go-back' }, fallbackHref: { type: String, attribute: 'fallback-href' }, dirty: { type: Boolean }, requestConfirmation: { attribute: false }, pending: { state: true }, failure: { state: true } };
  declare canGoBack: boolean; declare fallbackHref: string; declare dirty: boolean;
  declare requestConfirmation: (() => boolean | Promise<boolean>) | undefined;
  declare private pending: boolean; declare private failure: string;
  private generation = 0;
  constructor() { super(); this.label = '뒤로가기'; this.canGoBack = false; this.fallbackHref = ''; this.dirty = false; this.pending = false; this.failure = ''; }
  override disconnectedCallback() { this.generation++; this.pending = false; super.disconnectedCallback(); }
  private activate = async (event: MouseEvent) => {
    if (this.pending || !this.canGoBack && !this.fallbackHref) { event.preventDefault(); return; }
    if (event.button !== 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) { if (this.dirty) event.preventDefault(); return; }
    const generation = ++this.generation; const initiator = event.currentTarget as HTMLElement;
    if (!this.dirty) { this.emit('back-request', { reason: 'activate' }); return; }
    event.preventDefault();
    if (!this.requestConfirmation) throw new TypeError('Dirty back needs a confirmation driver');
    this.pending = true; this.failure = ''; let confirmed = false;
    try {
      const accepted = await this.requestConfirmation();
      if (this.isConnected && generation === this.generation && accepted) { confirmed = true; this.emit('back-request', { reason: 'confirmed' }); }
    } catch { if (this.isConnected && generation === this.generation) this.failure = '뒤로가기 확인을 완료하지 못했습니다. 다시 시도하세요.'; }
    finally { if (generation === this.generation) this.pending = false; if (!confirmed && this.isConnected && generation === this.generation) { await this.updateComplete; if (this.isConnected && generation === this.generation) restoreModalAware(this, [initiator]); } }
  };
  override render() {
    if (this.dirty && !this.requestConfirmation) throw new TypeError('Dirty back needs a confirmation driver');
    const disabled = !this.canGoBack && !this.fallbackHref;
    const state = this.pending ? 'pending-confirmation' : disabled ? 'disabled' : '';
    return html`${!this.canGoBack && this.fallbackHref ? html`<a data-krds-component="back-button" data-krds-part="root" data-krds-state=${state} part="root" href=${this.fallbackHref} aria-disabled=${ifDefined(this.pending ? 'true' : undefined)} @click=${this.activate}>${this.label}</a>` : html`<button data-krds-component="back-button" data-krds-part="root" data-krds-state=${state} part="root" type="button" ?disabled=${disabled || this.pending} @click=${this.activate}>${this.label}</button>`}${this.failure ? html`<p role="status">${this.failure}</p>` : ''}`;
  }
}
