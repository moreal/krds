import { getContext } from 'svelte';
import type { Locale } from './types.js';
export const providerKey = Symbol.for('@unofficial-krds/svelte/provider');
export interface KrdsContext {
    locale?: Locale;
    direction?: 'ltr' | 'rtl';
    document?: Document;
}
export function context(): KrdsContext {
    return getContext<KrdsContext>(providerKey) ?? {};
}
