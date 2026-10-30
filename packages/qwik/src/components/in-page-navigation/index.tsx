import { $, component$, useSignal, Slot, useId, useComputed$, useVisibleTask$, useTask$, type JSXChildren, type QRL } from '@builder.io/qwik';
import type { InPageNavigationContract } from '@unofficial-krds/contracts';
import { owned, states, safeRel, useField, useReset, useNarrow, usable, focusTarget, restore, ignoredKey, type NativeContract } from '../../internal/catalog';
import type { InPageSection } from '@unofficial-krds/contracts';
function readingTarget(targets:HTMLElement[]){return targets.filter(target=>target.isConnected).map(target=>{const box=target.getBoundingClientRect();return{target,box,visible:Math.max(0,Math.min(innerHeight,box.bottom)-Math.max(0,box.top))/Math.max(1,Math.min(innerHeight,box.height))};}).filter(item=>item.visible>0).sort((a,b)=>b.visible-a.visible||Math.abs(a.box.top)-Math.abs(b.box.top))[0];}
const SectionBranch = component$<{
    section: InPageSection;
    activeId?: string;
    onActivate$: QRL<(id: string, keyboard: boolean, link: HTMLAnchorElement) => unknown>;
}>(p => <li {...owned('in-page-navigation', 'item')}><a {...owned('in-page-navigation', 'link', p.activeId === p.section.id ? 'active' : '')} href={`#${p.section.id}`} aria-current={p.activeId === p.section.id ? 'location' : undefined} preventdefault:click onClick$={(e, link) => p.onActivate$(p.section.id, e.detail === 0, link)}>{p.section.label}</a>{!!p.section.children?.length && <ul>{p.section.children.map(section => <SectionBranch key={section.id} {...p} section={section}/>)}</ul>}</li>);
export type InPageNavigationProps = NativeContract<InPageNavigationContract>;
export const InPageNavigation = component$<InPageNavigationProps>((props) => { const root=useSignal<HTMLElement>();
    const uid = useId(), narrow = useNarrow(), active = useSignal(props.activeId ?? props.sections[0]?.id), open = useSignal(false); useVisibleTask$(({ track, cleanup }) => { const sections = track(() => props.sections); const targets: HTMLElement[] = []; const collect = (items: typeof sections) => items.forEach(item => { const target = document.getElementById(item.id); if (target)
    targets.push(target); collect(item.children ?? []); }); collect(sections); const observer = new IntersectionObserver(() => { const candidate=readingTarget(targets); if (candidate && active.value !== candidate.target.id) {
    active.value = candidate.target.id;
    void props.onActiveChange$?.({ id: candidate.target.id, reason: 'scroll' });
} }, { rootMargin: '-10% 0px -60% 0px' }); targets.forEach(t => observer.observe(t)); const measure=()=>{const candidate=readingTarget(targets);if(candidate&&active.value!==candidate.target.id){active.value=candidate.target.id;void props.onActiveChange$?.({id:candidate.target.id,reason:'scroll'});}};addEventListener('scroll',measure,true);cleanup(()=>{observer.disconnect();removeEventListener('scroll',measure,true);}); }, { strategy: 'document-ready' }); const activate = $(async (id: string, keyboard: boolean, link: HTMLAnchorElement) => { const target = document.getElementById(id); if (!target)
    return; active.value = id; await props.onActiveChange$?.({ id, reason: 'activation' }); target.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); if (keyboard) {
    focusTarget(target);
    open.value = false;
}
else
    link.focus({ preventScroll: true }); }); useVisibleTask$(({cleanup})=>{const key=(e:KeyboardEvent)=>{if(e.key!==' '||ignoredKey(e))return;const link=e.target as HTMLAnchorElement;if(!root.value?.contains(link)||!link.matches('a[href^="#"]'))return;e.preventDefault();void activate(link.hash.slice(1),true,link);};document.addEventListener('keydown',key);cleanup(()=>document.removeEventListener('keydown',key));},{strategy:'document-ready'});
    return <nav ref={root} {...owned('in-page-navigation')} aria-label={props.title ?? '이 페이지의 구성'} data-krds-layout={narrow.value ? props.narrowMode === 'disclosure' ? 'mobile-disclosure' : 'mobile-inline' : 'desktop-side'}><h2 {...owned('in-page-navigation', 'title')}>{props.title ?? '이 페이지의 구성'}</h2>{narrow.value && props.narrowMode === 'disclosure' && <button type="button" {...owned('in-page-navigation', 'disclosure-trigger')} aria-expanded={open.value} aria-controls={uid} onClick$={() => open.value = !open.value}>{open.value ? '구성 접기' : '구성 펼치기'}</button>}<ul id={uid} {...owned('in-page-navigation', 'list')} hidden={narrow.value && props.narrowMode === 'disclosure' && !open.value}>{props.sections.map(section => <SectionBranch key={section.id} section={section} activeId={props.activeId ?? active.value} onActivate$={activate}/>)}</ul></nav>; });
