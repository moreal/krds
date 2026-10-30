import { For, Show, createEffect, createSignal, createUniqueId, onCleanup } from 'solid-js';
import type { InPageNavigationContract, InPageSection } from '@unofficial-krds/contracts';
import { owned, keyedItems, focusTarget, ignoredKey, assertTreeDepth } from '../../internal/catalog';
import { narrowViewport } from '../../internal/panel';
export type InPageNavigationProps=InPageNavigationContract;
export function InPageNavigation(props:InPageNavigationProps){
 const uid=createUniqueId(),narrow=narrowViewport();createEffect(()=>assertTreeDepth(props.sections,3));const sections=keyedItems(()=>props.sections);const [active,setActive]=createSignal(props.activeId??props.sections[0]?.id),[open,setOpen]=createSignal(false);
 createEffect(()=>{
  const current=props.sections;
  if(!('IntersectionObserver' in window))return;
  const targets:HTMLElement[]=[];
  const collect=(items:readonly InPageSection[])=>items.forEach(item=>{const target=document.getElementById(item.id);if(target)targets.push(target);collect(item.children??[]);});
  collect(current);
  const observer=new IntersectionObserver(()=>{
   const readingLine=0,lowerLine=innerHeight;
   const candidate=targets.filter(target=>target.isConnected).map(target=>({target,box:target.getBoundingClientRect()})).filter(({box})=>box.bottom>readingLine&&box.top<lowerLine).sort((a,b)=>(Math.min(b.box.bottom,lowerLine)-Math.max(b.box.top,readingLine))-(Math.min(a.box.bottom,lowerLine)-Math.max(a.box.top,readingLine)))[0];
   if(candidate&&active()!==candidate.target.id){setActive(candidate.target.id);props.onActiveChange?.({id:candidate.target.id,reason:'scroll'});}
  },{rootMargin:'0px',threshold:[0,.1,.25,.5,.75,1]});
  targets.forEach(target=>observer.observe(target));
  onCleanup(()=>observer.disconnect());
 });
 // An effect's native observers have their own cleanup owner, including section replacement.
 function Section(p:{section:InPageSection}){const activate=(keyboard:boolean,link:HTMLAnchorElement)=>{const target=document.getElementById(p.section.id);if(!target)return;setActive(p.section.id);props.onActiveChange?.({id:p.section.id,reason:'activation'});target.scrollIntoView({block:'start',behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});if(keyboard){focusTarget(target);setOpen(false);}else link.focus({preventScroll:true});};return <li {...owned('in-page-navigation','item')}><a {...owned('in-page-navigation','link',(props.activeId??active())===p.section.id?'active':'')} href={`#${p.section.id}`} aria-current={(props.activeId??active())===p.section.id?'location':undefined} onClick={event=>{if(event.ctrlKey||event.metaKey||event.shiftKey)return;event.preventDefault();activate(event.detail===0,event.currentTarget);}} onKeyDown={event=>{if(!ignoredKey(event)&&event.key===' '){event.preventDefault();activate(true,event.currentTarget);}}}>{p.section.label}</a><Show when={p.section.children?.length}><ul><For each={p.section.children}>{section=><Section section={section}/>}</For></ul></Show></li>;}
 return <nav {...owned('in-page-navigation')} aria-label={props.title??'이 페이지의 구성'} data-krds-layout={narrow()?props.narrowMode==='disclosure'?'mobile-disclosure':'mobile-inline':'desktop-side'}><h2 {...owned('in-page-navigation','title')}>{props.title??'이 페이지의 구성'}</h2><Show when={narrow()&&props.narrowMode==='disclosure'}><button type="button" {...owned('in-page-navigation','disclosure-trigger')} aria-expanded={open()} aria-controls={uid} onClick={()=>setOpen(!open())}>{open()?'구성 접기':'구성 펼치기'}</button></Show><ul id={uid} {...owned('in-page-navigation','list')} hidden={narrow()&&props.narrowMode==='disclosure'&&!open()}><For each={sections()}>{section=><Section section={section}/>}</For></ul></nav>;
}
