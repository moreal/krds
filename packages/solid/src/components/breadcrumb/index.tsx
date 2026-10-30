import { For, Show, createMemo, createEffect } from 'solid-js';
import type { BreadcrumbContract } from '@unofficial-krds/contracts';
import { owned, keyedItems } from '../../internal/catalog';
import { narrowViewport } from '../../internal/panel';
export type BreadcrumbProps=BreadcrumbContract;
export function Breadcrumb(props:BreadcrumbProps){
 createEffect(()=>{if(props.omitCurrent===false&&!props.currentItem)throw new TypeError('Breadcrumb currentItem is required when omitCurrent is false');});
 const items=keyedItems(()=>props.items);const narrow=narrowViewport();
 const limit=()=>Math.max(2,Math.min(props.maxVisible??4,narrow()?2:Infinity));
 const omitted=createMemo(()=>items().length+1>limit()?items().slice(0,-(limit()-1)):[]);
 const visible=createMemo(()=>omitted().length?items().slice(-(limit()-1)):items());
 return <nav {...owned('breadcrumb')} aria-label="브레드크럼"><ol {...owned('breadcrumb','list')}><li {...owned('breadcrumb','item')}><a {...owned('breadcrumb','home')} href={props.home.href}>{props.home.label}</a></li><Show when={omitted().length}><li {...owned('breadcrumb','item')}><span {...owned('breadcrumb','separator')} aria-hidden="true"> / </span><span {...owned('breadcrumb','ellipsis')} aria-label={`생략된 경로: ${omitted().map(item=>item.label).join(', ')}`}>…</span></li></Show><For each={visible()}>{item=><li {...owned('breadcrumb','item')}><span aria-hidden="true" {...owned('breadcrumb','separator')}> / </span><Show when={item.href} fallback={<span {...owned('breadcrumb','link')}>{item.label}</span>}><a {...owned('breadcrumb','link')} href={item.href}>{item.label}</a></Show></li>}</For><Show when={props.currentItem&&props.omitCurrent===false}><li {...owned('breadcrumb','item')}><span aria-hidden="true" {...owned('breadcrumb','separator')}> / </span><span {...owned('breadcrumb','link')} aria-current="page">{props.currentItem?.label}</span></li></Show></ol></nav>;
}
