import { getContext } from 'svelte';
import type { Locale } from './types.js';
export const providerKey = Symbol.for('@unofficial-krds/svelte/provider');
/** Title id owned by a composing surface (BottomSheet); the matching Modal then yields its own heading and description. */
export const modalOwnedHeadingKey = Symbol.for('@unofficial-krds/svelte/modal-owned-heading');
export interface KrdsContext {
    locale?: Locale;
    direction?: 'ltr' | 'rtl';
    document?: Document;
}
export function context(): KrdsContext {
    return getContext<KrdsContext>(providerKey) ?? {};
}
