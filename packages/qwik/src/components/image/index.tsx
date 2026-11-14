import { sync$, useOnDocument, $, component$, useSignal, Slot, useId, useComputed$, useVisibleTask$, useTask$, type JSXChildren, type QRL } from '@builder.io/qwik';
import type { ImageContract } from '@unofficial-krds/contracts';
import { owned, states, safeRel, useField, useReset, useNarrow, usable, focusTarget, restore, ignoredKey, type NativeContract } from '../../internal/catalog';
export type ImageProps = NativeContract<ImageContract>;
/** Eager, DOM-only replay: a source that failed while the container was paused (before qwikloader listened for `error`) re-dispatches `error`, so the lazy handler still records it. */
const replayEarlyError = sync$((_: Event, root: HTMLElement) => {
    const image = root instanceof HTMLImageElement ? root : root.querySelector<HTMLImageElement>('img[data-krds-component="image"]');
    if (image && image.complete && image.naturalWidth === 0 && image.getAttribute('src'))
        image.decode().catch(() => { if (image.complete && image.naturalWidth === 0) image.dispatchEvent(new Event('error')); });
});
export const Image = component$<ImageProps>((props) => { useOnDocument('qinit', replayEarlyError); const state = useSignal('loaded'); if (!props.decorative && !props.alt.trim())
    throw new TypeError('Meaningful images require an alternative'); return <figure {...owned('image', 'figure')}><img {...owned('image', 'root', state.value)} src={props.src} alt={props.decorative ? '' : props.alt} width={props.width} height={props.height} srcset={props.srcset} sizes={props.sizes} loading={props.loading ?? 'lazy'} aria-describedby={props.descriptionId} onLoad$={() => state.value = 'loaded'} onError$={() => state.value = 'error'}/>{props.caption && <figcaption {...owned('image', 'caption')}>{props.caption}</figcaption>}{state.value === 'error' && <span {...owned('image', 'description')}>이미지를 불러올 수 없습니다.</span>}</figure>; });
