import { hydrate } from '@solidjs/web';
import { Pilots } from './Pilots';
const control = document.querySelector('[data-krds-component="button"]');
hydrate(() => <Pilots />, document.getElementById('app')!);
(globalThis as unknown as {
    ssrSameNode: boolean;
}).ssrSameNode = control === document.querySelector('[data-krds-component="button"]');
