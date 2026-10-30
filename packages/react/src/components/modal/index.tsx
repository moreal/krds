import { acquireDocumentLayer, offerDocumentEscape } from '../../document-layer.js';
import { useControlledMode } from '../../use-controlled-mode.js';
import { useId, useLayoutEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import type { OpenChangeDetails } from '@unofficial-krds/contracts';
import { useKrdsEnvironment, type KrdsLocale } from '../../providers/index.js';
export interface ModalProps {
  locale?: KrdsLocale;
  /** Native popup composition may reuse the modal lifetime with its own public CSS part. */
  contentAttributes?: { 'data-krds-component'?: string; 'data-krds-part'?: string; className?: string; style?: CSSProperties };
  open?: boolean; defaultOpen?: boolean; onOpenChange?: (details: OpenChangeDetails) => void;
  title: ReactNode; titleId?: string; description?: ReactNode; descriptionId?: string; children?: ReactNode;
  actions?: ReactNode | ((close: () => void) => ReactNode); trigger?: ReactNode; closeOnOutsideClick?: boolean; showCloseButton?: boolean; closeLabel?: string; initialFocusId?: string; returnFocusId?: string; id?: string;
  /** DateInput owns its specialized entry policy while retaining modal trapping and restoration. */ onEntryFocus?: (dialog: HTMLElement) => void;
}
const focusableSelector = 'button:not(:disabled),input:not(:disabled):not([type="hidden"]),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex]';
function usable(element: Element | null): element is HTMLElement {
  return element !== null && 'focus' in element && element.isConnected && !element.closest('[inert],[hidden]') && !element.matches(':disabled,[aria-disabled="true"]') && element.getClientRects().length > 0 && element.ownerDocument.defaultView?.getComputedStyle(element).visibility !== 'hidden';
}
function focusables(element: HTMLElement) { return Array.from(element.querySelectorAll<HTMLElement>(focusableSelector)).filter(node => usable(node) && node.tabIndex >= 0); }
function restoreFocus(doc: Document, opener: HTMLElement | null, ancestors: HTMLElement[], fallback?: string) {
  const alternate = fallback ? doc.getElementById(fallback) : null;
  const target = usable(opener) && opener.matches(focusableSelector) ? opener : usable(alternate) && alternate.matches(focusableSelector) ? alternate : ancestors.find(node => usable(node) && node.matches(focusableSelector));
  if (target) target.focus(); else { const old = doc.body.getAttribute('tabindex'); doc.body.tabIndex = -1; doc.body.focus(); if (old === null) doc.body.removeAttribute('tabindex'); else doc.body.setAttribute('tabindex', old); }
}
export function Modal(props: ModalProps) {
  const controlled = useControlledMode(props.open, props.defaultOpen, 'Modal');
  const env = useKrdsEnvironment(); const locale = props.locale ?? env.locale; const [local, setLocal] = useState(props.defaultOpen ?? false); const open = controlled ? props.open! : local;
  const initiallyOpen = useRef(open); const hasClosed = useRef(!open); if (!open) hasClosed.current = true;
  const [portal, setPortal] = useState<HTMLDivElement | null>(null); const content = useRef<HTMLDivElement>(null); const gestureOpener = useRef<HTMLElement | null>(null); const activeOpen = useRef(open); activeOpen.current = open;
  const currentProps = useRef(props); currentProps.current = props; const generatedId = useId(); const id = props.id ?? generatedId;
  const request = (next: boolean) => { if (activeOpen.current === next) return; if (!controlled) setLocal(next); props.onOpenChange?.({ open: next }); };
  const requestRef = useRef(request); requestRef.current = request;
  useLayoutEffect(() => { const doc = env.getDocument(); if (!doc) return; const node = doc.createElement('div'); node.dataset.krdsComponent = 'modal'; node.dataset.krdsPart = 'root'; node.dir = env.direction; node.lang = locale; doc.body.append(node); setPortal(node);
    const rememberOpeningControl = (event: MouseEvent) => {
      if (activeOpen.current) return;
      const target = event.target instanceof (doc.defaultView?.Element ?? Element) ? event.target.closest(focusableSelector) : null;
      if (!usable(target)) return;
      gestureOpener.current = target;
      // Safari does not focus pointer-activated buttons. Keep the actual action
      // through React's discrete-event flush, then discard it before a later task.
      queueMicrotask(() => queueMicrotask(() => { if (gestureOpener.current === target) gestureOpener.current = null; }));
    };
    doc.addEventListener('click', rememberOpeningControl, true);
    return () => { doc.removeEventListener('click', rememberOpeningControl, true); node.remove(); }; }, [env.getDocument()]);
  useLayoutEffect(() => { if (portal) { portal.lang = locale; portal.dir = env.direction; } }, [portal, locale, env.direction]);
  useLayoutEffect(() => {
    const dialog = content.current; if (!open || !portal || !dialog) return;
    const doc = portal.ownerDocument; const noOpeningAction = initiallyOpen.current && !hasClosed.current;
    const opener = noOpeningAction ? null : gestureOpener.current ?? (doc.activeElement instanceof (doc.defaultView?.HTMLElement ?? HTMLElement) && doc.activeElement !== doc.body ? doc.activeElement : null);
    const ancestors: HTMLElement[] = []; for (let node = opener?.parentElement; node; node = node.parentElement) ancestors.push(node);
    const registration = acquireDocumentLayer(doc, dialog, portal);
    portal.style.position = 'fixed'; portal.style.inset = '0'; portal.style.zIndex = String(1000 + registration.depth); portal.dataset.krdsState = 'open';
    try {
    const first = focusables(dialog)[0];
    if (props.showCloseButton === false && !focusables(dialog).some(node => node.matches('button,[role="button"]'))) throw new TypeError('A modal needs an enabled close action.');
    if (props.initialFocusId) { const requested = doc.getElementById(props.initialFocusId); if (requested !== dialog && requested !== first) throw new RangeError('initialFocusId must identify the dialog or its first interactive element.'); requested?.focus(); }
    else if (props.onEntryFocus) props.onEntryFocus(dialog); else dialog.focus();
    } catch (error) {
      const wasTop = registration.top(); registration.release();
      portal.style.removeProperty('position'); portal.style.removeProperty('inset'); portal.style.removeProperty('z-index'); portal.dataset.krdsState = 'closed';
      if (wasTop) restoreFocus(doc, opener, ancestors, props.returnFocusId);
      throw error;
    }
    const top = registration.top;
    const key = (event: globalThis.KeyboardEvent) => {
      if (!top() || event.defaultPrevented || event.isComposing || event.keyCode === 229) return;
      if (event.key === 'Escape') { offerDocumentEscape(doc, event); if (event.defaultPrevented) return; event.preventDefault(); event.stopPropagation(); requestRef.current(false); }
      if (event.key === 'Tab') { const nodes = focusables(dialog); const first = nodes[0]; const last = nodes.at(-1); if (!first) { event.preventDefault(); dialog.focus(); } else if (event.shiftKey ? doc.activeElement === first || doc.activeElement === dialog : doc.activeElement === last || doc.activeElement === dialog) { event.preventDefault(); (event.shiftKey ? last : first)?.focus(); } }
    };
    const focus = (event: FocusEvent) => { if (top() && !dialog.contains(event.target as Node)) dialog.focus(); };
    const backdrop = portal.querySelector('[data-krds-part="backdrop"]');
    let pointerId: number | null = null;
    const cancelPointer = () => { pointerId = null; };
    const pointerDown = (event: PointerEvent) => { pointerId = top() && event.isPrimary && event.button === 0 && event.target === backdrop ? event.pointerId : null; };
    const pointerUp = (event: PointerEvent) => { const dismiss = pointerId === event.pointerId && event.isPrimary && event.button === 0 && event.target === backdrop; cancelPointer(); if (dismiss && top() && currentProps.current.closeOnOutsideClick) requestRef.current(false); };
    doc.addEventListener('keydown', key); doc.addEventListener('focusin', focus);
    doc.addEventListener('pointerdown', pointerDown, true); doc.addEventListener('pointerup', pointerUp, true); doc.addEventListener('pointercancel', cancelPointer, true); doc.addEventListener('lostpointercapture', cancelPointer, true); doc.defaultView?.addEventListener('blur', cancelPointer);
    return () => {
      doc.removeEventListener('pointerdown', pointerDown, true); doc.removeEventListener('pointerup', pointerUp, true); doc.removeEventListener('pointercancel', cancelPointer, true); doc.removeEventListener('lostpointercapture', cancelPointer, true); doc.defaultView?.removeEventListener('blur', cancelPointer);
      doc.removeEventListener('keydown', key); doc.removeEventListener('focusin', focus);
      const wasTop = registration.top(); registration.release();
      portal.style.removeProperty('position'); portal.style.removeProperty('inset'); portal.style.removeProperty('z-index'); portal.dataset.krdsState = 'closed';
      if (wasTop) restoreFocus(doc, opener, ancestors, currentProps.current.returnFocusId);
    };
  }, [open, portal]);
  const attrs = (part: string) => ({ 'data-krds-component': 'modal', 'data-krds-part': part, 'data-krds-state': open ? 'open' : 'closed' });
  return <>{props.trigger != null && <span {...attrs('trigger')} onClick={event => { const target = event.target instanceof HTMLElement ? event.target.closest<HTMLElement>(focusableSelector) : null; target?.focus({ preventScroll: true }); request(true); }}>{props.trigger}</span>}{open && portal && createPortal(<>
    <div {...attrs('backdrop')} />
    <div {...attrs('content')} {...props.contentAttributes} id={id} ref={content} role="dialog" aria-modal="true" aria-labelledby={props.titleId ?? `${id}-title`} aria-describedby={props.description != null ? props.descriptionId ?? `${id}-description` : undefined} tabIndex={-1}>
      <h2 {...attrs('title')} id={props.titleId ?? `${id}-title`}>{props.title}</h2>
      {props.description != null && <div {...attrs('description')} id={props.descriptionId ?? `${id}-description`}>{props.description}</div>}
      <div {...attrs('body')}>{props.children}</div>
      {props.actions != null && <div {...attrs('actions')}>{typeof props.actions === 'function' ? props.actions(() => request(false)) : props.actions}</div>}
      {props.showCloseButton !== false && <button {...attrs('close')} type="button" onClick={() => request(false)}>{props.closeLabel ?? (locale === 'en-US' ? 'Close' : '닫기')}</button>}
    </div>
  </>, portal)}</>;
}
