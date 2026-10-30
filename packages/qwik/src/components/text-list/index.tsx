import { $, component$, useSignal, Slot, useId, useComputed$, useVisibleTask$, useTask$, type JSXChildren, type QRL } from '@builder.io/qwik';
import type { TextListContract } from '@unofficial-krds/contracts';
import { owned, states, safeRel, useField, useReset, useNarrow, usable, focusTarget, restore, ignoredKey, type NativeContract } from '../../internal/catalog';
const TextListBranch = component$<{
    items: TextListContract['items'];
    ordered?: boolean;
    marker?: TextListContract['marker'];
    level: number;
}>(p => { const contents = p.items.map(item => <li key={item.id} {...owned('text-list', 'item', `level-${p.level}`)}><span {...owned('text-list', 'content')}>{item.content}</span>{item.children?.length && <TextListBranch items={item.children} ordered={p.ordered} marker={p.marker} level={p.level + 1}/>}</li>); return p.ordered ? <ol {...owned('text-list', p.level === 1 ? 'root' : 'nested-list')} role="list">{contents}</ol> : <ul {...owned('text-list', p.level === 1 ? 'root' : 'nested-list')} role="list" data-krds-marker={p.marker ?? 'dot'}>{contents}</ul>; });
export type TextListProps = NativeContract<TextListContract>;
export const TextList = component$<TextListProps>((props) => { return <TextListBranch items={props.items} ordered={props.ordered} marker={props.marker} level={1}/>; });
