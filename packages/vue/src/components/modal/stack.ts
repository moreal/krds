export interface ModalEntry {
  portal: HTMLElement;
  dialog: HTMLElement;
}
interface Isolation {
  overflow: string;
  elements: Map<HTMLElement, boolean>;
  observer: MutationObserver;
}
const stacks = new WeakMap<Document, ModalEntry[]>();
const originals = new WeakMap<Document, Isolation>();

export function usable(element: Element | null | undefined): element is HTMLElement {
  if (!(element instanceof HTMLElement) || !element.isConnected) return false;
  if (element.closest('[inert],[hidden]') || element.matches(':disabled')) return false;
  return element.getClientRects().length > 0 && getComputedStyle(element).visibility !== 'hidden';
}
const focusCandidateSelector = 'button,input,select,textarea,a[href],summary,[tabindex],[contenteditable="true"]';

export function canFocus(element: Element | null | undefined): element is HTMLElement {
  if (!usable(element) || !element.matches(focusCandidateSelector)) return false;
  if (element.matches('summary') && !element.hasAttribute('tabindex')) {
    const disclosure = element.parentElement;
    if (!disclosure?.matches('details')) return false;
    return Array.from(disclosure.children).find(child => child.matches('summary')) === element;
  }
  return true;
}
export function focusables(root: HTMLElement) {
  return Array.from(root.querySelectorAll<HTMLElement>(focusCandidateSelector))
    .filter(element => canFocus(element) && element.tabIndex >= 0);
}
export function top(doc: Document, entry: ModalEntry) {
  return stacks.get(doc)?.at(-1) === entry;
}
function isolate(doc: Document) {
  const state = originals.get(doc);
  if (!state) return;
  const active = stacks.get(doc)?.at(-1);
  for (const child of Array.from(doc.body.children)) {
    if (!(child instanceof HTMLElement)) continue;
    if (!state.elements.has(child)) state.elements.set(child, child.inert);
    child.inert = child !== active?.portal;
  }
}
export function enter(doc: Document, entry: ModalEntry) {
  if (!originals.has(doc)) {
    const observer = new MutationObserver(() => isolate(doc));
    originals.set(doc, { overflow: doc.body.style.overflow, elements: new Map(), observer });
    observer.observe(doc.body, { childList: true });
    doc.body.style.overflow = 'hidden';
  }
  const stack = stacks.get(doc) ?? [];
  stack.push(entry);
  stacks.set(doc, stack);
  isolate(doc);
}
export function leave(doc: Document, entry: ModalEntry) {
  stacks.set(doc, (stacks.get(doc) ?? []).filter(item => item !== entry));
  if (stacks.get(doc)?.length) {
    isolate(doc);
    return;
  }
  const state = originals.get(doc);
  if (!state) return;
  state.observer.disconnect();
  for (const [element, inert] of state.elements) element.inert = inert;
  doc.body.style.overflow = state.overflow;
  originals.delete(doc);
}
export function restore(doc: Document, opener: HTMLElement | null, alternate?: string, ancestors: HTMLElement[] = []) {
  let target = canFocus(opener) ? opener : null;
  if (!target && alternate) {
    const candidate = doc.getElementById(alternate);
    if (canFocus(candidate)) target = candidate;
  }
  if (!target) target = ancestors.find(canFocus) ?? null;
  if (target) {
    target.focus();
    return;
  }
  const tabindex = doc.body.getAttribute('tabindex');
  doc.body.tabIndex = -1;
  doc.body.focus();
  if (tabindex === null) doc.body.removeAttribute('tabindex');
  else doc.body.setAttribute('tabindex', tabindex);
}
