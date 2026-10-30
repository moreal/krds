import { $, component$, useSignal, Slot, useId, useComputed$, useVisibleTask$, useTask$, type JSXChildren, type QRL } from '@builder.io/qwik';
import type { MastheadContract } from '@unofficial-krds/contracts';
import { owned, states, safeRel, useField, useReset, useNarrow, usable, focusTarget, restore, ignoredKey, type NativeContract } from '../../internal/catalog';
export type MastheadProps = NativeContract<MastheadContract>;
export const Masthead = component$<MastheadProps>((props) => { return props.governmentService ? <div {...owned('masthead')}><p {...owned('masthead', 'text')}>이 누리집은 대한민국 공식 전자정부 누리집입니다.</p></div> : null; });
