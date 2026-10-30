import { $, component$, useSignal, Slot, useId, useComputed$, useVisibleTask$, useTask$, type JSXChildren, type QRL } from '@builder.io/qwik';
import type { IdentifierContract } from '@unofficial-krds/contracts';
import { owned, states, safeRel, useField, useReset, useNarrow, usable, focusTarget, restore, ignoredKey, type NativeContract } from '../../internal/catalog';
export type IdentifierProps = NativeContract<IdentifierContract>;
export const Identifier = component$<IdentifierProps>((props) => { return <section {...owned('identifier', 'root', props.theme ?? 'light')} data-krds-theme={props.theme ?? 'light'} aria-label={props.institutionName}><img {...owned('identifier', 'logo')} src={props.logo.src} alt={props.logo.alt}/><p {...owned('identifier', 'text')}>{props.relationshipText}</p></section>; });
