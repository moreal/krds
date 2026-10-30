import { renderToString, generateHydrationScript } from '@solidjs/web';
import { Pilots } from './Pilots';
export function html() {
    return `<!doctype html><html lang="ko"><head><meta charset="UTF-8"><title>SSR Solid2</title>${generateHydrationScript()}</head><body><div id="app">${renderToString(() => <Pilots />)}</div><script type="module" src="/client.js"></script></body></html>`;
}
