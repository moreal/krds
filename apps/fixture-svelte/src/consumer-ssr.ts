import { render } from 'svelte/server';
import DocsConsumer from './DocsConsumer.svelte';
export const output = render(DocsConsumer);
const expected = ['button', 'native-select', 'modal', 'tabs', 'calendar', 'date-input'];
const rendered = new Set(Array.from(output.body.matchAll(/data-krds-component="([^"]+)"/g), match => match[1]));
if (expected.some(component => !rendered.has(component)))
    throw new Error('Public six-component consumer SSR output missing');
for (const text of ['Visit date', 'Seoul', 'Retained local panel', 'Open review']) {
    if (!output.body.includes(text))
        throw new Error(`Public consumer output missing ${text}`);
}
console.log(JSON.stringify({ components: [...rendered], htmlBytes: output.body.length, browserDocument: typeof document }));
