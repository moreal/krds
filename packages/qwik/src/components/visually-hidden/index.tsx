import { $, component$, useSignal, Slot, useId, useComputed$, useVisibleTask$, useTask$, type JSXChildren, type QRL } from '@builder.io/qwik';
import type { VisuallyHiddenContract } from '@unofficial-krds/contracts';
import { owned, states, safeRel, useField, useReset, useNarrow, usable, focusTarget, restore, ignoredKey, type NativeContract } from '../../internal/catalog';
export type VisuallyHiddenProps = NativeContract<VisuallyHiddenContract> & {
    children?: JSXChildren;
    surrogate?: JSXChildren;
    control?: JSXChildren;
};
export const VisuallyHidden = component$<VisuallyHiddenProps>((props) => { if (props.variant === 'interactive-overlay' && !props.control)
    throw new TypeError('Interactive overlay requires an actual native control'); return <span id={props.id} lang={props.lang} {...owned('visually-hidden', 'root', props.variant ?? 'text')} data-krds-variant={props.variant ?? 'text'} style={props.variant === 'interactive-overlay' ? { position: 'relative', display: 'inline-block' } : { position: 'absolute', width: '1px', height: '1px', padding: '0', margin: '-1px', overflow: 'hidden', clip: 'rect(0,0,0,0)', whiteSpace: 'nowrap', borderWidth: '0' }}>{props.variant === 'interactive-overlay' ? <>{props.control}<span {...owned('visually-hidden', 'visible-surrogate')} aria-hidden="true">{props.surrogate}</span></> : props.content ?? props.children}</span>; });
