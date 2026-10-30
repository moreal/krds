import { useKrdsEnvironment } from '../../providers';
import { createEffect, onCleanup } from 'solid-js';
import type { FaviconContract } from '@unofficial-krds/contracts';
export type FaviconProps = FaviconContract;
/** Owned head nodes, not a body placeholder. Host must supply cleared local assets. */
export function Favicon(props: FaviconProps) { const environment=useKrdsEnvironment(); createEffect(() => { const document=environment.getDocument();if(!document)return;const nodes: HTMLLinkElement[] = []; for (const [asset, rel, media] of [[props.light, 'icon', props.dark ? '(prefers-color-scheme: light)' : undefined], [props.dark, 'icon', '(prefers-color-scheme: dark)'], [props.touchIcon, 'apple-touch-icon', undefined]] as const) {
    if (!asset)
        continue;
    const link = document.createElement('link');
    link.rel = rel;
    link.href = asset.href;
    link.type = asset.type;
    link.sizes.value = asset.sizes;
    if (media)
        link.media = media;
    document.head.append(link);
    nodes.push(link);
} onCleanup(() => nodes.forEach(node => node.remove())); }); return null; }
