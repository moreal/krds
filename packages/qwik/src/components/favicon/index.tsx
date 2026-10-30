import { $, component$, useSignal, Slot, useId, useComputed$, useVisibleTask$, useTask$, type JSXChildren, type QRL } from '@builder.io/qwik';
import type { FaviconContract } from '@unofficial-krds/contracts';
import { owned, states, safeRel, useField, useReset, useNarrow, usable, focusTarget, restore, ignoredKey, type NativeContract } from '../../internal/catalog';
export type FaviconProps = NativeContract<FaviconContract>;
export const Favicon = component$<FaviconProps>((props) => { useVisibleTask$(({ track, cleanup }) => { const light = track(() => props.light), dark = track(() => props.dark), touch = track(() => props.touchIcon); const nodes: HTMLLinkElement[] = []; for (const [asset, rel, media] of [[light, 'icon', dark ? '(prefers-color-scheme: light)' : undefined], [dark, 'icon', '(prefers-color-scheme: dark)'], [touch, 'apple-touch-icon', undefined]] as const) {
    if (!asset)
        continue;
    const node = document.createElement('link');
    node.rel = rel;
    node.href = asset.href;
    node.type = asset.type;
    node.sizes.value = asset.sizes;
    if (media)
        node.media = media;
    document.head.append(node);
    nodes.push(node);
} cleanup(() => nodes.forEach(node => node.remove())); }, { strategy: 'document-ready' }); return null; });
