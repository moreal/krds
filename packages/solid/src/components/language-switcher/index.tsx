import { For, Show, createUniqueId, onMount, onCleanup } from 'solid-js';
import type { LanguageSwitcherContract } from '@unofficial-krds/contracts';
import { owned, keyedItems, stateValue, ignoredKey, safeRel } from '../../internal/catalog';
export type LanguageSwitcherProps=LanguageSwitcherContract;
export function LanguageSwitcher(props:LanguageSwitcherProps){
 const options=keyedItems(()=>props.options,'locale');const uid=createUniqueId();const open=stateValue(()=>props.open,props.defaultOpen,false,open=>props.onOpenChange?.({open}));let root!:HTMLElement,trigger:HTMLButtonElement|undefined;
 onMount(()=>{const outside=(event:PointerEvent)=>{if(open.read()&&!root.contains(event.target as Node))open.request(false);};document.addEventListener('pointerdown',outside);onCleanup(()=>document.removeEventListener('pointerdown',outside));});
 return <nav ref={root} {...owned('language-switcher')} aria-label="언어 선택" onKeyDown={event=>{if(!ignoredKey(event)&&event.key==='Escape'&&open.read()){event.preventDefault();open.request(false);queueMicrotask(()=>{if(!open.read())trigger?.focus();});}}}>
  <Show when={props.options.length>2}><button ref={trigger} type="button" {...owned('language-switcher','trigger')} aria-expanded={open.read()} aria-controls={uid} onClick={()=>open.request(!open.read())}>언어: <span {...owned('language-switcher','current')}>{props.options.find(option=>option.locale===props.currentLocale)?.nativeLabel}</span></button></Show>
  <ul id={uid} hidden={props.options.length>2&&!open.read()} {...owned('language-switcher','list')}><For each={options()}>{option=><li><a {...owned('language-switcher','option',option.locale===props.currentLocale?'current':'')} lang={option.locale} hreflang={option.locale} href={option.href} aria-describedby={`${uid}-${option.locale}-description`} aria-current={option.locale===props.currentLocale?'true':undefined} target={option.separateService?'_blank':undefined} rel={safeRel(option.separateService?'_blank':undefined)} onClick={event=>{if(props.onLocaleRequest&&!event.ctrlKey&&!event.metaKey&&!event.shiftKey&&event.button===0&&!option.separateService){event.preventDefault();props.onLocaleRequest({locale:option.locale,href:option.href});}}}>{option.nativeLabel}</a> <span id={`${uid}-${option.locale}-description`} lang="ko">({option.translatedLabel}){option.separateService?' (새 창)':''}</span></li>}</For></ul>
 </nav>;
}
