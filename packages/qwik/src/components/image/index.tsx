import { $, component$, useSignal, Slot, useId, useComputed$, useVisibleTask$, useTask$, type JSXChildren, type QRL } from '@builder.io/qwik';
import type { ImageContract } from '@unofficial-krds/contracts';
import { owned, states, safeRel, useField, useReset, useNarrow, usable, focusTarget, restore, ignoredKey, type NativeContract } from '../../internal/catalog';
export type ImageProps = NativeContract<ImageContract>;
export const Image = component$<ImageProps>((props) => { const state = useSignal('loaded'); if (!props.decorative && !props.alt.trim())
    throw new TypeError('Meaningful images require an alternative'); return <figure {...owned('image', 'figure', state.value)}><img {...owned('image', 'root', state.value)} src={props.src} alt={props.decorative ? '' : props.alt} width={props.width} height={props.height} srcset={props.srcset} sizes={props.sizes} loading={props.loading ?? 'lazy'} aria-describedby={props.descriptionId} onLoad$={() => state.value = 'loaded'} onError$={() => state.value = 'error'}/>{props.caption && <figcaption {...owned('image', 'caption')}>{props.caption}</figcaption>}</figure>; });
