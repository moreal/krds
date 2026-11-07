// Shadow-inclusive reads for native previews (Lit renders into open shadow roots, which light-DOM
// `innerText`/`querySelectorAll` cannot see). Installed into a frame as `window.__krdsDeep` through a
// string evaluation, so page CSP never matters; callers invoke `ensureDeep(frame)` before reads.
export const DEEP_INSTALL = `window.__krdsDeep = (() => {
  const roots = (start = document) => { const out = [start]; for (let i = 0; i < out.length; i++) for (const el of out[i].querySelectorAll('*')) if (el.shadowRoot) out.push(el.shadowRoot); return out; };
  const all = (selector, start = document) => roots(start).flatMap(r => [...r.querySelectorAll(selector)]);
  const text = (node = document.body) => {
    const out = [];
    const walk = n => {
      if (n.nodeType === 3) { const p = n.parentElement; if (!p || p.checkVisibility?.() !== false) out.push(n.data); return; }
      if (n.nodeType === 1) {
        const tag = n.tagName; if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'TEMPLATE') return;
        if (n.checkVisibility?.() === false && !n.shadowRoot) return;
        const block = getComputedStyle(n).display !== 'inline';
        if (block) out.push(' ');
        if (n.shadowRoot) walk(n.shadowRoot);
        else if (tag === 'SLOT') { const a = n.assignedNodes({ flatten: true }); (a.length ? a : [...n.childNodes]).forEach(walk); }
        else n.childNodes.forEach(walk);
        if (block) out.push(' ');
        return;
      }
      if (n.nodeType === 11) n.childNodes.forEach(walk);
    };
    walk(node);
    return out.join('').replace(/\\s+/g, ' ').trim();
  };
  const active = () => { let a = document.activeElement; while (a?.shadowRoot?.activeElement) a = a.shadowRoot.activeElement; return a; };
  const byId = (from, id) => from.getRootNode().getElementById?.(id) ?? document.getElementById(id);
  return { roots, all, text, active, byId };
})();`;
/** Install the helper into the frame's current document (again after any navigation). */
export async function ensureDeep(frame) {
  if (!(await frame.evaluate(() => !!window.__krdsDeep))) await frame.evaluate(DEEP_INSTALL);
}
