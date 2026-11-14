import { html } from 'lit';
import type { ToastMessage } from '@unofficial-krds/contracts';
import { KrdsElement } from '../base.js';
import { target } from '../catalog-support.js';
import { ExposureController } from '../../controllers/exposure-controller.js';
export class Toast extends KrdsElement {
    static override properties = { message: { attribute: false }, durationMs: { type: Number, attribute: 'duration-ms' } };
    declare message: ToastMessage | null;
    declare durationMs: number | undefined;
    readonly exposure = new ExposureController(this);
    constructor() { super(); this.message = null; }
    override updated() { const message = this.message; const duration = this.durationMs ?? (message?.tone === 'warning' ? 4000 : 3000); if (message) {
        const persistent = target(this, message.persistentResultId);
        if (!persistent || this.contains(persistent) || !persistent.textContent?.includes(message.text))
            throw new TypeError('Toast requires the same result in persistent accessible host content');
    } this.exposure.update(message ? JSON.stringify([message.id, message.text, message.tone, duration]) : '', duration, false, generation => { if (this.message)
        this.emit('dismiss', { id: this.message.id, reason: 'timeout', generation }); }); }
    override render() { if (this.message && (!this.message.id || !this.message.text || !this.message.persistentResultId || !['information', 'warning'].includes(this.message.tone)))
        throw new TypeError('Invalid toast'); if (!this.message) return html ``; return html `<div data-krds-component="toast" data-krds-part="root" data-krds-state=${`open ${this.message.tone}`} part="root" data-krds-tone=${this.message.tone} style="inset-block-end:calc(var(--krds-fixed-navigation-height,6rem) + var(--krds-gap-5))"><span data-krds-component="toast" data-krds-part="message" data-krds-state="" part="message" role="status" aria-live="polite" aria-atomic="true">${this.message.text}</span></div>`; }
}
