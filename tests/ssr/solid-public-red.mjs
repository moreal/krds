import { pathToFileURL } from 'node:url';
const parent = new URL('../../apps/fixture-solid/package.json', import.meta.url).href;
const server = import.meta.resolve('solid-js/web', parent);
const entry = import.meta.resolve('@unofficial-krds/solid', parent);
console.log({entry,server,document:typeof document});
const { renderToString } = await import(server);
const { Button } = await import(entry);
console.log(renderToString(() => Button({children:'Public SSR'})));
