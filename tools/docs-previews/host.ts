import { parsePreviewInit, parsePreviewMessage, type FrameworkId, type PreviewIdentity, type PreviewMessage } from './protocol';
/** Native renderers own mount/dispose. This helper only owns frame transport and its final exit control. */
export function createPreviewHost(options: { framework: FrameworkId; root: HTMLElement; componentId?: string; exampleId?: string }) {
 const query = new URLSearchParams(window.location.search);
 const componentId = options.componentId ?? query.get('component') ?? '';
 const exampleId = options.exampleId ?? query.get('example') ?? '';
 const token = query.get('token') ?? '';
 const candidate = { version: 1 as const, framework: options.framework, componentId, exampleId, token };
 // Full-page entries intentionally work without a parent session; they do not emit messages.
 const embedded = window.parent !== window;
 if (!/^[a-z][a-z0-9-]*$/.test(componentId) || componentId === 'splash-screen' || !/^[a-z][a-z0-9-]*$/.test(exampleId) || (embedded && !parsePreviewMessage({ ...candidate, type: 'ready' }))) throw new Error('Invalid native preview identity');
 const identity: PreviewIdentity = candidate;
 let disposed = false;
 let scheduled = 0;
 let largest = 0;
 let observer: ResizeObserver;
 let mutations: MutationObserver | undefined;
 const send = (message: PreviewMessage) => { if (!disposed && embedded) window.parent.postMessage(message, window.location.origin); };
 const measure = () => {
  scheduled = 0;
  if (disposed) return;
  const rect = options.root.getBoundingClientRect();
  const spacing = bottomSpacing();
  const flow = Math.max(rect.height, options.root.scrollHeight) + Math.max(0, rect.top) + spacing;
  // Monotonic within a frame session: viewport-clamped overlays must not make the size oscillate.
  largest = Math.max(largest, Math.ceil(Math.max(flow, positionedBottom() + spacing)));
  const height = largest;
  send({ ...identity, type: 'size', height });
 };
 // Fixed/absolute overlays (side panels, popups) sit outside the root's flow; union their visible bottom edges.
 // Popup helpers portal overlays to document.body, so scan the whole document (root included), not just the root.
 const scanScope = (): ParentNode | null => {
  const body = document.body as ParentNode | null;
  if (body && typeof body.querySelectorAll === 'function') return body;
  return typeof options.root.querySelectorAll === 'function' ? options.root : null;
 };
 const observedPositioned = new Set<Element>();
 const positionedBottom = () => {
  const scope = scanScope();
  if (!scope || typeof getComputedStyle !== 'function') return 0;
  const scrollY = window.scrollY || 0;
  let bottom = 0;
  for (const element of Array.from(scope.querySelectorAll('*')).slice(0, 2000)) {
   const style = getComputedStyle(element);
   if (style.position !== 'fixed' && style.position !== 'absolute') continue;
   if (!observedPositioned.has(element)) { observedPositioned.add(element); observer.observe(element); }
   if (style.display === 'none' || style.visibility === 'hidden') continue;
   const box = element.getBoundingClientRect();
   if (!(box.width > 0 && box.height > 0)) continue;
   // Fixed boxes track the viewport (and therefore the frame): use their content need, never their bounding bottom.
   // Computed insets resolve to px, so classify fixed boxes by geometry: a box whose bottom meets the viewport bottom
   // (bottom sheets, full-height panels) tracks the frame and contributes nothing; any other fixed box extends from its top.
   if (style.position === 'fixed') { if (!(Math.abs(box.bottom - window.innerHeight) <= 1)) bottom = Math.max(bottom, box.top + Math.max((element as HTMLElement).scrollHeight || 0, (element as HTMLElement).offsetHeight || 0)); }
   else bottom = Math.max(bottom, box.bottom + scrollY);
  }
  return bottom;
 };
 // Each native entry owns its page padding; measure the real html/body bottom spacing below the root, never a fixed allowance.
 const bottomSpacing = () => {
  const elements = [document.documentElement, document.body];
  const total = elements.reduce((sum, element) => {
   if (!element || typeof getComputedStyle !== 'function') return sum;
   const style = getComputedStyle(element);
   return sum + (parseFloat(style.paddingBottom) || 0) + (parseFloat(style.marginBottom) || 0) + (parseFloat(style.borderBottomWidth) || 0);
  }, 0);
  return Math.max(16, total);
 };
 const schedule = () => { if (!scheduled && !disposed) scheduled = window.requestAnimationFrame(measure); };
 // The host owns the transport control and its separation from the example: it lives in its own block-level row,
 // so inline example roots (e.g. a lone trigger button) never sit flush against it.
 const exitRow = document.createElement('div');
 exitRow.dataset.previewReturnRow = ''; exitRow.style.marginBlockStart = '16px';
 const exit = document.createElement('button');
 exit.type = 'button'; exit.dataset.previewReturn = '';
 // Apply the shared button CSS anatomy to this transport action; no renderer is mounted here.
 exit.dataset.krdsComponent = 'button'; exit.dataset.krdsPart = 'root';
 exit.dataset.krdsVariant = 'tertiary'; exit.dataset.krdsSize = 'small';
 const exitLabel = document.createElement('span');
 exitLabel.dataset.krdsComponent = 'button'; exitLabel.dataset.krdsPart = 'label';
 exitLabel.textContent = '문서로 돌아가기'; exit.append(exitLabel); exitRow.append(exit);
 exit.addEventListener('click', () => {
  if (embedded) send({ ...identity, type: 'return-focus' });
  // Docs routes are emitted as components/<id>.html (astro build.format 'preserve'); a trailing slash 404s on Pages.
  else window.location.assign(`/krds/components/${componentId}.html`);
 });
 const onMessage = (event: MessageEvent) => {
  if (disposed || event.origin !== window.location.origin || event.source !== window.parent) return;
  const init = parsePreviewInit(event.data);
  if (!init || (['version','framework','componentId','exampleId','token'] as const).some(key => init[key] !== identity[key])) return;
  largest = 0;
  document.documentElement.dataset.previewColorMode = init.presentation.colorMode;
  document.documentElement.dataset.previewReducedMotion = String(init.presentation.reducedMotion);
  schedule();
 };
 window.addEventListener('message', onMessage);
 observer = new ResizeObserver(schedule);
 observer.observe(options.root);
 // Positioned overlays do not change the root's box; watch the subtree so their appearance or change re-measures.
 if (typeof MutationObserver === 'function') {
  mutations = new MutationObserver(schedule);
  mutations.observe(typeof document.body?.querySelectorAll === 'function' ? document.body : options.root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['class', 'style', 'hidden', 'open', 'aria-expanded', 'data-krds-state'] });
 }
 const onLoad = () => schedule();
 options.root.addEventListener('load', onLoad, true);
 return {
  identity,
  ready() {
   if (disposed) return;
   largest = 0;
   options.root.append(exitRow);
   // Web fonts change line boxes after first paint; announce and measure once they settle so the first size is final.
   const announce = () => { if (disposed) return; send({ ...identity, type: 'ready' }); schedule(); };
   const fonts = document.fonts?.ready;
   if (fonts) fonts.then(announce, announce); else announce();
  },
  error(message: string) { send({ ...identity, type: 'error', message: message.slice(0, 2000) }); },
  dispose() { if (disposed) return; disposed = true; observer.disconnect(); mutations?.disconnect(); observedPositioned.clear(); window.removeEventListener('message', onMessage); options.root.removeEventListener('load', onLoad, true); if (scheduled) window.cancelAnimationFrame(scheduled); exitRow.remove(); },
 };
}
