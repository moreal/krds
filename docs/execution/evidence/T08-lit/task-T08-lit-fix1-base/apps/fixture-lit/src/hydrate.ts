import '@lit-labs/ssr-client/lit-element-hydrate-support.js';
import '@unofficial-krds/tokens/tokens.css';
// Load element classes only after the official hydration hook has been installed.
const { registerKrdsElements } = await import('@unofficial-krds/lit');
const state = JSON.parse(document.getElementById('krds-hydration-state')?.textContent ?? '{}') as Record<string, Record<string, unknown>>;
for (const [id, props] of Object.entries(state)) {
    const element = document.getElementById(id);
    if (element)
        Object.assign(element, props);
}
registerKrdsElements(customElements);
for (const element of document.querySelectorAll('[defer-hydration]'))
    element.removeAttribute('defer-hydration');
