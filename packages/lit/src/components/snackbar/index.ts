import { html } from 'lit';
import { ifDefined } from 'lit/directives/if-defined.js';
import type { SnackbarMessage, SnackbarAction } from '@unofficial-krds/contracts';
import { KrdsElement, deepActive, composedParent } from '../base.js';
import { target, usable, focusTarget } from '../catalog-support.js';
import { ExposureController } from '../../controllers/exposure-controller.js';
export class Snackbar extends KrdsElement {
    static override properties = { message: { attribute: false }, action: { attribute: false }, durationMs: { attribute: false }, fallbackFocusId: { type: String, attribute: 'fallback-focus-id' }, hovered: { state: true }, focused: { state: true } };
    declare message: SnackbarMessage | null;
    declare action: SnackbarAction | undefined;
    declare durationMs: number | null;
    declare fallbackFocusId: string;
    declare private hovered: boolean;
    declare private focused: boolean;
    readonly exposure = new ExposureController(this);
    private opener: HTMLElement | null = null;
    private priorId = '';
    private hadFocusedControl = false;
    constructor() { super(); this.message = null; this.durationMs = null; this.fallbackFocusId = ''; this.hovered = false; this.focused = false; }
    override willUpdate() { if (!this.ownerDocument?.defaultView)
        return; if (this.message && !this.priorId)
        this.opener = deepActive(this.ownerDocument) as HTMLElement | null; this.hadFocusedControl = !!(this.renderRoot as ShadowRoot).activeElement; }
    override updated() { const message = this.message; const key = message ? JSON.stringify([message.id, message.title, message.text, message.error, message.icon, this.action, this.durationMs]) : ''; this.exposure.update(key, this.durationMs, this.hovered || this.focused || !!message?.actionPending, generation => this.dismiss('timeout', generation)); if (this.priorId && this.hadFocusedControl && (!message || message.id !== this.priorId))
        this.restoreFocus(); this.priorId = message?.id ?? ''; }
    private restoreFocus() { const active = deepActive(this.ownerDocument) as HTMLElement | null; if (usable(active) && active !== this.ownerDocument.body && active !== this)
        return; let ancestor: Element | null = this.opener; while (ancestor && !usable(ancestor as HTMLElement))
        ancestor = composedParent(ancestor); focusTarget(usable(this.opener) && this.opener !== this.ownerDocument.body && this.opener !== this.ownerDocument.documentElement ? this.opener : target(this, this.fallbackFocusId) ?? ancestor as HTMLElement ?? this.ownerDocument.body); }
    private dismiss(reason: 'close' | 'timeout', generation = this.exposure.generation) { if (this.message)
        this.emit('dismiss', { id: this.message.id, reason, generation }); }
    override disconnectedCallback() { if ((this.renderRoot as ShadowRoot).activeElement)
        this.restoreFocus(); super.disconnectedCallback(); }
    override render() { const message = this.message; const action = this.action; if (action && (!['button', 'link'].includes(action.kind) || !action.id || !action.label || action.kind === 'link' && !action.href))
        throw new TypeError('Invalid snackbar action'); const state = message ? `open ${message.actionPending ? 'action-pending' : ''} ${message.error ? 'error' : ''}` : 'closed'; return html `<section data-krds-component="snackbar" data-krds-part="root" data-krds-state=${state} part="root" style="inset-block-end:calc(var(--krds-fixed-navigation-height,6rem) + var(--krds-gap-5))" ?hidden=${!message} @pointerenter=${() => { this.hovered = true; }} @pointerleave=${() => { this.hovered = false; }} @focusin=${() => { this.focused = true; }} @focusout=${() => { queueMicrotask(() => { this.focused = !!(this.renderRoot as ShadowRoot).activeElement; }); }}>${message?.icon ? html `<span data-krds-component="snackbar" data-krds-part="icon" data-krds-state="" part="icon" aria-hidden="true">${message.icon}</span>` : ''}<div role="status" aria-live="polite" aria-atomic="true"><strong data-krds-component="snackbar" data-krds-part="title" data-krds-state="" part="title">${message?.title ?? ''}</strong><p data-krds-component="snackbar" data-krds-part="message" data-krds-state=${message?.error ? 'error' : ''} part="message">${message?.text ?? ''}${message?.error ? ` ${message.error}` : ''}</p></div>${message && action ? action.kind === 'link' ? html `<a data-krds-component="snackbar" data-krds-part="action" data-krds-state=${state} part="action" href=${action.href} target=${ifDefined(action.target)} rel=${ifDefined(action.rel ?? (action.target === '_blank' ? 'noopener noreferrer' : undefined))}>${action.label}${action.target === '_blank' ? ' (새 창)' : ''}</a>` : html `<button data-krds-component="snackbar" data-krds-part="action" data-krds-state=${state} part="action" type="button" ?disabled=${message.actionPending} @click=${() => this.emit('action', { id: message.id, generation: this.exposure.generation, actionId: action.id })}>${action.label}</button>` : ''}<button data-krds-component="snackbar" data-krds-part="close" data-krds-state="" part="close" type="button" aria-label="알림 닫기" @click=${() => this.dismiss('close')}>닫기</button></section>`; }
}
