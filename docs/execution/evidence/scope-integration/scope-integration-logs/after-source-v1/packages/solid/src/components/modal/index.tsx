import { createMemo, createSignal, createUniqueId, onCleanup, onMount, Show, splitProps, untrack, type JSX } from 'solid-js';
import { Portal } from 'solid-js/web';
import type { OpenChangeDetails } from '@unofficial-krds/contracts';
import { useKrdsEnvironment } from '../../providers';

export interface ModalProps extends Omit<JSX.HTMLAttributes<HTMLDivElement>, 'title' | 'children' | 'onChange'> {
  title: JSX.Element;
  titleId?: string;
  description?: JSX.Element;
  descriptionId?: string;
  children?: JSX.Element;
  actions?: JSX.Element;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (details: OpenChangeDetails) => void;
  closeOnOutsideClick?: boolean;
  showCloseButton?: boolean;
  initialFocusId?: string;
  returnFocusId?: string;
  closeLabel?: string;
  locale?: 'ko-KR' | 'en-US';
}

const focusableSelector = 'a[href],area[href],button,input:not([type="hidden"]),select,textarea,iframe,object,embed,[tabindex],[contenteditable="true"],audio[controls],video[controls]';
function usable(element: Element | null | undefined): element is HTMLElement {
  if (!element || !('focus' in element) || !element.isConnected || element.closest('[hidden],[inert]') || element.matches(':disabled,[aria-disabled="true"]')) return false;
  const doc = element.ownerDocument;
  const style = doc.defaultView?.getComputedStyle(element);
  return style?.display !== 'none' && style?.visibility !== 'hidden' && element.getClientRects().length > 0 && element.matches(focusableSelector);
}
function focusables(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(focusableSelector)).filter(element => usable(element) && element.tabIndex >= 0);
}
interface ModalEntry { root: HTMLElement; content: HTMLElement; }
interface ModalDocument {
  entries: ModalEntry[];
  inert: Map<HTMLElement, string | null>;
  overflow: string;
  priority: string;
  observer?: MutationObserver;
}
const documents = new WeakMap<Document, ModalDocument>();
function refreshIsolation(doc: Document, state: ModalDocument) {
  for (const [element, attribute] of state.inert) {
    if (attribute === null) element.removeAttribute('inert'); else element.setAttribute('inert', attribute);
  }
  state.inert.clear();
  let branch: HTMLElement | null = state.entries.at(-1)?.root ?? null;
  while (branch?.parentElement) {
    for (const sibling of branch.parentElement.children) {
      if (sibling === branch || !(sibling instanceof (doc.defaultView?.HTMLElement ?? HTMLElement))) continue;
      const element = sibling as HTMLElement;
      state.inert.set(element, element.getAttribute('inert'));
      element.inert = true;
    }
    if (branch.parentElement === doc.body) break;
    branch = branch.parentElement;
  }
}
function register(doc: Document, entry: ModalEntry) {
  let state = documents.get(doc);
  if (!state) { state = { entries: [], inert: new Map(), overflow: '', priority: '' }; documents.set(doc, state); }
  if (!state.entries.length) {
    state.overflow = doc.body.style.getPropertyValue('overflow'); state.priority = doc.body.style.getPropertyPriority('overflow');
    doc.body.style.setProperty('overflow', 'hidden');
    state.observer = new MutationObserver(() => refreshIsolation(doc, state!));
    state.observer.observe(doc.body, { childList: true, subtree: true });
  }
  state.entries.push(entry); entry.root.style.zIndex = String(1000 + state.entries.length);
  refreshIsolation(doc, state);
  return {
    top: () => state!.entries.at(-1) === entry,
    release: () => {
      const index = state!.entries.indexOf(entry); if (index < 0) return;
      state!.entries.splice(index, 1); refreshIsolation(doc, state!);
      if (!state!.entries.length) {
        state!.observer?.disconnect();
        if (state!.overflow) doc.body.style.setProperty('overflow', state!.overflow, state!.priority); else doc.body.style.removeProperty('overflow');
      }
    },
  };
}
function restoreFocus(doc: Document, opener: HTMLElement | undefined, ancestors: HTMLElement[], returnId: string | undefined) {
  const target = usable(opener) ? opener : (returnId && usable(doc.getElementById(returnId)) ? doc.getElementById(returnId) as HTMLElement : ancestors.find(usable));
  if (target) { target.focus({ preventScroll: true }); return; }
  // A parent modal still owns focus if an open child was removed with its opener.
  const parent = documents.get(doc)?.entries.at(-1)?.content;
  if (parent) { parent.focus({ preventScroll: true }); return; }
  const previous = doc.body.getAttribute('tabindex');
  doc.body.setAttribute('tabindex', '-1'); doc.body.focus({ preventScroll: true });
  if (previous === null) doc.body.removeAttribute('tabindex'); else doc.body.setAttribute('tabindex', previous);
}

/** A Solid-owned portal and actual-open lifecycle; rejected controlled requests retain isolation. */
export function Modal(props: ModalProps) {
  const [local, rest] = splitProps(props, ['title', 'titleId', 'description', 'descriptionId', 'children', 'actions', 'open', 'defaultOpen', 'onOpenChange', 'closeOnOutsideClick', 'showCloseButton', 'initialFocusId', 'returnFocusId', 'closeLabel', 'locale', 'id', 'ref']);
  const environment = useKrdsEnvironment();
  const generated = `krds-modal-${createUniqueId()}`;
  const contentId = () => local.id ?? generated;
  const controlled = local.open !== undefined;
  if (controlled && local.defaultOpen !== undefined) throw new TypeError('Modal cannot combine open and defaultOpen');
  const [internal, setInternal] = createSignal(local.defaultOpen ?? false);
  const isOpen = createMemo(() => {
    if ((local.open !== undefined) !== controlled) throw new TypeError('Modal cannot change controlled mode');
    if (local.title == null || typeof local.title === 'boolean' || (typeof local.title === 'string' && !local.title.trim())) throw new TypeError('Modal requires a visible title');
    if (local.closeLabel !== undefined && !local.closeLabel.trim()) throw new TypeError('Modal closeLabel cannot be blank');
    if (local.locale !== undefined && !['ko-KR', 'en-US'].includes(local.locale)) throw new TypeError('Invalid Modal locale');
    return controlled ? local.open! : internal();
  });
  const requestClose = () => {
    if (!isOpen()) return;
    if (!controlled) setInternal(false);
    local.onOpenChange?.({ open: false });
  };
  const initiallyOpen = isOpen();
  let firstOpening = true;
  function OpenModal() {
    const doc = environment.getDocument();
    if (!doc) return null;
    const active = doc.activeElement;
    // Initial mount is not an opening action, even when an unrelated control was focused.
    const withoutOpeningAction = firstOpening && initiallyOpen;
    firstOpening = false;
    const opener = !withoutOpeningAction && active !== doc.body && active && 'focus' in active ? active as HTMLElement : undefined;
    const ancestors: HTMLElement[] = []; let ancestor = opener?.parentElement;
    while (ancestor && ancestor !== doc.body) { ancestors.push(ancestor); ancestor = ancestor.parentElement; }
    let root!: HTMLDivElement; let content!: HTMLDivElement; let backdrop!: HTMLDivElement;
    let controller: ReturnType<typeof register> | undefined;
    let pointerStart: number | undefined;
    const clearPointer = () => { pointerStart = undefined; };
    const pointerDown = (event: PointerEvent) => {
      pointerStart = controller?.top() && event.target === backdrop && event.button === 0 && event.isPrimary ? event.pointerId : undefined;
    };
    const pointerUp = (event: PointerEvent) => {
      const dismiss = pointerStart === event.pointerId && event.target === backdrop && event.button === 0 && event.isPrimary;
      clearPointer();
      if (dismiss && local.closeOnOutsideClick && controller?.top()) requestClose();
    };
    const entryFocus = () => {
      const first = focusables(content)[0];
      const requested = local.initialFocusId ? doc.getElementById(local.initialFocusId) : content;
      if (requested !== content && requested !== first) throw new TypeError('Modal initialFocusId must identify the dialog or its first interactive element');
      (requested as HTMLElement).focus({ preventScroll: true });
    };
    const keydown = (event: KeyboardEvent) => {
      if (!controller?.top() || event.defaultPrevented || event.isComposing || event.keyCode === 229) return;
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); requestClose(); }
      else if (event.key === 'Tab') {
        const elements = focusables(content); const first = elements[0]; const last = elements.at(-1);
        if (!first) { event.preventDefault(); content.focus(); }
        else if (event.shiftKey && (doc.activeElement === first || doc.activeElement === content)) { event.preventDefault(); last!.focus(); }
        else if (!event.shiftKey && (doc.activeElement === last || doc.activeElement === content)) { event.preventDefault(); first.focus(); }
      }
    };
    const focusin = (event: FocusEvent) => { if (controller?.top() && !content.contains(event.target as Node)) content.focus({ preventScroll: true }); };
    onMount(() => {
      controller = register(doc, { root, content });
      doc.addEventListener('keydown', keydown); doc.addEventListener('focusin', focusin);
      // Observe the complete gesture, including ends outside the backdrop or a stopped bubble.
      doc.addEventListener('pointerdown', pointerDown, true); doc.addEventListener('pointerup', pointerUp, true);
      doc.addEventListener('pointercancel', clearPointer, true); doc.addEventListener('lostpointercapture', clearPointer, true);
      doc.defaultView?.addEventListener('blur', clearPointer);
      // Portal content is attached before onMount, and configuration errors remain catchable by Solid ErrorBoundary.
      if (local.showCloseButton === false && !focusables(content).some(element => element.matches('button,[role="button"]'))) throw new TypeError('Modal without its icon close button requires an enabled explicit close action');
      entryFocus();
    });
    onCleanup(() => {
      doc.removeEventListener('keydown', keydown); doc.removeEventListener('focusin', focusin);
      doc.removeEventListener('pointerdown', pointerDown, true); doc.removeEventListener('pointerup', pointerUp, true);
      doc.removeEventListener('pointercancel', clearPointer, true); doc.removeEventListener('lostpointercapture', clearPointer, true);
      doc.defaultView?.removeEventListener('blur', clearPointer); clearPointer();
      const wasTop = controller?.top(); controller?.release();
      if (wasTop) restoreFocus(doc, opener, ancestors, untrack(() => local.returnFocusId));
    });
    return <Portal mount={doc.body}><div ref={root} data-krds-component="modal" data-krds-part="root" data-krds-state="open" dir={rest.dir ?? environment.direction()} lang={(local.locale ?? environment.locale()).slice(0, 2)} style={{ position: 'fixed', inset: '0', 'z-index': '1000' }}>
      <div ref={backdrop} data-krds-component="modal" data-krds-part="backdrop" data-krds-state="open" />
      <div {...rest} ref={element => { content = element; if (typeof local.ref === 'function') local.ref(element); }} id={contentId()} role="dialog" aria-modal="true" aria-labelledby={local.titleId ?? `${contentId()}-title`} aria-describedby={local.description != null ? local.descriptionId ?? `${contentId()}-description` : undefined} tabIndex={-1} data-krds-component="modal" data-krds-part="content" data-krds-state="open">
        <h2 id={local.titleId ?? `${contentId()}-title`} data-krds-component="modal" data-krds-part="title" data-krds-state="">{local.title}</h2>
        <Show when={local.description != null}><div id={local.descriptionId ?? `${contentId()}-description`} data-krds-component="modal" data-krds-part="description" data-krds-state="">{local.description}</div></Show>
        <div data-krds-component="modal" data-krds-part="body" data-krds-state="">{local.children}</div>
        <Show when={local.actions != null}><div data-krds-component="modal" data-krds-part="actions" data-krds-state="">{local.actions}</div></Show>
        <Show when={local.showCloseButton !== false}><button type="button" aria-label={local.closeLabel ?? ((local.locale ?? environment.locale()) === 'en-US' ? 'Close' : '닫기')} onClick={requestClose} data-krds-component="modal" data-krds-part="close" data-krds-state=""><span aria-hidden="true">×</span></button></Show>
      </div>
    </div></Portal>;
  }
  return <Show when={isOpen()}><OpenModal /></Show>;
}
