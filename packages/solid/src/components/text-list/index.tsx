import { For, Show, createEffect, type JSX } from 'solid-js';
import type { TextListContract, TextListItem } from '@unofficial-krds/contracts';
import { owned } from '../../internal/catalog';
export type TextListProps = TextListContract & {
  renderItem?: (item: TextListItem) => JSX.Element;
  /** Native ordered-list starting number. Ignored for unordered lists. */
  start?: number;
};
export function TextList(props: TextListProps) {
  createEffect(() => {
    const validate = (items: readonly TextListItem[], depth: number) => {
      if (depth > 3 && items.length) throw new TypeError('TextList supports at most three levels');
      items.forEach(item => validate(item.children ?? [], depth + 1));
    };
    validate(props.items, 1);
  });
  function Items(p: { items: readonly TextListItem[]; level: number }) {
    const contents = () => <For each={p.items}>{item => <li {...owned('text-list', 'item', `level-${p.level}`)}>
      <Show when={props.renderItem} fallback={<span {...owned('text-list', 'content')}>{item.content}</span>}>
        <div {...owned('text-list', 'content')}>{props.renderItem?.(item)}</div>
      </Show>
      <Show when={item.children?.length}><Items items={item.children!} level={p.level + 1} /></Show>
    </li>}</For>;
    return <Show when={props.ordered} fallback={<ul role="list" {...owned('text-list', p.level === 1 ? 'root' : 'list')} data-krds-ordering="unordered" data-krds-marker={props.marker ?? 'dot'}>{contents()}</ul>}>
      <ol role="list" start={p.level === 1 ? props.start : undefined} {...owned('text-list', p.level === 1 ? 'root' : 'list')} data-krds-ordering="ordered">{contents()}</ol>
    </Show>;
  }
  return <Items items={props.items} level={1} />;
}
