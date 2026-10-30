import type { ReactiveController, LitElement } from 'lit';
/** Position native same-root popup without moving/cloning its trigger. */
export class AnchoredController implements ReactiveController {
    constructor(private host: LitElement, private selectors: {
        trigger: string;
        popup: string;
    }, private placement: () => string) { host.addController(this); }
    hostConnected() { this.host.ownerDocument.defaultView?.addEventListener('resize', this.position); this.host.ownerDocument.addEventListener('scroll', this.position, true); }
    hostDisconnected() { this.host.ownerDocument.defaultView?.removeEventListener('resize', this.position); this.host.ownerDocument.removeEventListener('scroll', this.position, true); }
    hostUpdated() { this.position(); }
    position = () => { const trigger = this.host.renderRoot.querySelector<HTMLElement>(this.selectors.trigger); const popup = this.host.renderRoot.querySelector<HTMLElement>(this.selectors.popup); if (!trigger || !popup || popup.hidden)
        return; const rect = trigger.getBoundingClientRect(); const view = this.host.ownerDocument.defaultView!; popup.style.position = 'fixed'; popup.style.maxInlineSize = 'min(24rem,calc(100vw - 16px))'; popup.style.maxBlockSize = 'calc(100dvh - 16px)'; popup.style.overflow = 'auto'; popup.style.zIndex = '1000'; const box = popup.getBoundingClientRect(); const top = this.placement().startsWith('top') ? rect.top - box.height - 8 : rect.bottom + 8; const left = this.placement().endsWith('end') ? rect.right - box.width : this.placement().endsWith('start') ? rect.left : rect.left + (rect.width - box.width) / 2; popup.style.top = `${Math.max(8, Math.min(top, view.innerHeight - box.height - 8))}px`; popup.style.left = `${Math.max(8, Math.min(left, view.innerWidth - box.width - 8))}px`; };
}
