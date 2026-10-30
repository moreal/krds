import { For, Show, createEffect } from 'solid-js';
import type { TextListContract, TextListItem } from '@unofficial-krds/contracts';
import { owned } from '../../internal/catalog';
export type TextListProps = TextListContract;
export function TextList(props: TextListProps) {createEffect(()=>{const validate=(items:readonly TextListItem[],depth:number)=>{if(depth>3&&items.length)throw new TypeError('TextList supports at most three levels');items.forEach(item=>validate(item.children??[],depth+1));};validate(props.items,1);}); function Items(p: {
    items: readonly TextListItem[];
    level: number;
}) { const contents = () => <For each={p.items}>{item => <li {...owned('text-list', 'item', `level-${p.level}`)}><span {...owned('text-list', 'content')}>{item.content}</span><Show when={item.children?.length}><Items items={item.children!} level={p.level + 1}/></Show></li>}</For>; return <Show when={props.ordered} fallback={<ul role="list" {...owned('text-list', p.level === 1 ? 'root' : 'list')} data-krds-marker={props.marker ?? 'dot'}>{contents()}</ul>}><ol role="list" {...owned('text-list', p.level === 1 ? 'root' : 'list')}>{contents()}</ol></Show>; } return <Items items={props.items} level={1}/>; }
