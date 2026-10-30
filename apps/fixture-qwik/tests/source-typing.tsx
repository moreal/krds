import {$}from '@builder.io/qwik';
import type{HeaderProps,StructuredListProps,PaginationProps,FABProps,TextInputProps,TabBarProps,FileUploadProps}from '@unofficial-krds/qwik';
const header:HeaderProps['search']={label:'찾기',onRequest:$(()=>{})};
const selection:StructuredListProps['selection']={ids:[],onChange:$((_detail:{ids:readonly string[]})=>{})};
const sort:StructuredListProps['sort']={key:'title',direction:'ascending',onChange:$((_detail:{key:string;direction:'ascending'|'descending'})=>{})};
const more:PaginationProps['loadMore']={shown:0,total:1,pending:false,onLoadMore:$(()=>{})};
const action:NonNullable<FABProps['actions']>[number]={id:'add',label:'추가',onAction:$(()=>{})};
const icon:TextInputProps['iconAction']={label:'검색',onAction:$(()=>{})};
const menu:TabBarProps['menuAction']={label:'메뉴',onRequest:$(()=>{})};
// @ts-expect-error Plain nested callbacks cannot cross Qwik paused serialization.
const badHeader:HeaderProps['search']={label:'찾기',onRequest:()=>{}};
// @ts-expect-error Plain nested callbacks cannot cross Qwik paused serialization.
const badSelection:StructuredListProps['selection']={ids:[],onChange:()=>{}};
// @ts-expect-error Plain nested callbacks cannot cross Qwik paused serialization.
const badSort:StructuredListProps['sort']={key:'title',direction:'ascending',onChange:()=>{}};
// @ts-expect-error Plain nested callbacks cannot cross Qwik paused serialization.
const badMore:PaginationProps['loadMore']={shown:0,total:1,pending:false,onLoadMore:()=>{}};
// @ts-expect-error Plain nested callbacks cannot cross Qwik paused serialization.
const badAction:NonNullable<FABProps['actions']>[number]={id:'add',label:'추가',onAction:()=>{}};
// @ts-expect-error Plain nested callbacks cannot cross Qwik paused serialization.
const badIcon:TextInputProps['iconAction']={label:'검색',onAction:()=>{}};
// @ts-expect-error Plain nested callbacks cannot cross Qwik paused serialization.
const badMenu:TabBarProps['menuAction']={label:'메뉴',onRequest:()=>{}};
declare const file:File;
const files:FileUploadProps['files']=[{id:'real-file',file,status:'staged'}];
void[header,selection,sort,more,action,icon,menu,files,badHeader,badSelection,badSort,badMore,badAction,badIcon,badMenu];
