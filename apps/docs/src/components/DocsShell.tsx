import { createSignal, onMount, onCleanup, Show } from 'solid-js';
import { SkipLink } from '@unofficial-krds/solid/skip-link';
import { Header } from '@unofficial-krds/solid/header';
import { SideNavigation } from '@unofficial-krds/solid/side-navigation';
import { Breadcrumb } from '@unofficial-krds/solid/breadcrumb';
import { InPageNavigation } from '@unofficial-krds/solid/in-page-navigation';
import { Modal } from '@unofficial-krds/solid/modal';
import { Button } from '@unofficial-krds/solid/button';
import { Link } from '@unofficial-krds/solid/link';
import { Footer } from '@unofficial-krds/solid/footer';
import type { DocPage, NavigationItem } from '../content';
import { DocArticle } from './DocArticle';
import { SearchDialog } from './SearchDialog';
import { branding } from '../branding';
type Panel='search'|'section'|'header'|null;
export default function DocsShell(props:{page:DocPage;navigation:NavigationItem[]}) {
 const [ready,setReady]=createSignal(false),[active,setActive]=createSignal<Panel>(null);
 const section=()=>props.navigation.find(item=>item.id===props.page.currentId||item.children?.some(child=>child.id===props.page.currentId));
 const sideItems=()=>section()?.children??props.navigation.map(({children,...item})=>item);
 // MainMenu owns ancestor/current-descendant presentation; each page keeps its real ID/href.
 const topItems=()=>props.navigation.map(item=>{if(!item.children?.length)return item;const {href,...group}=item;return group;});
 const sections=()=>props.page.headings.filter(heading=>heading.level===2||heading.level===3).map(heading=>({id:heading.id,label:heading.title}));
 function request(panel:Panel){if(panel===active())return;setActive(null);if(panel)queueMicrotask(()=>{if(panel==='search')document.getElementById('docs-search-trigger')?.focus({preventScroll:true});setActive(panel);});}
 onMount(()=>{
  setReady(true);
  const shortcut=(event:KeyboardEvent)=>{if((event.ctrlKey||event.metaKey)&&event.key.toLowerCase()==='k'&&!event.isComposing){event.preventDefault();if(active()!=='search')request('search');}};
  const media=matchMedia('(max-width: 767px)');const resize=()=>{if(!media.matches&&(active()==='section'||active()==='header')){setActive(null);queueMicrotask(()=>document.getElementById('docs-main')?.focus({preventScroll:true}));}};
  document.addEventListener('keydown',shortcut);media.addEventListener('change',resize);
  onCleanup(()=>{document.removeEventListener('keydown',shortcut);media.removeEventListener('change',resize);});
 });
 return <div class="docs-shell" data-docs-ready={ready()?'true':'false'}>
  <SkipLink links={[{id:'main',label:'본문 바로가기',targetId:'docs-main'}]} />
  <div class="docs-header"><Header home={{href:'/krds/',label:'Unofficial KRDS 홈',logo:{src:branding.wordmark,alt:branding.alt}}} utilityItems={[]} mainNavigation={topItems()} currentId={props.page.currentId} search={ready()?{label:'문서 검색',onRequest:()=>request('search')}:undefined} searchTriggerId="docs-search-trigger" mobileTriggerId="docs-header-mobile-trigger" mobileTriggerLabel="주 메뉴" navigationLabel="주 탐색" mobileOpen={active()==='header'} onMobileOpenChange={({open})=>request(open?'header':null)} /></div>
  <aside class="docs-project-note" aria-label="프로젝트 안내">독립적으로 구현한 비공식 프로젝트입니다. 공식 KRDS 또는 정부 서비스가 아닙니다.</aside>
  <noscript><aside class="docs-project-note" aria-label="JavaScript 안내">문서 링크와 다운로드를 사용할 수 있습니다. 검색·코드 복사·상태 예시에는 JavaScript가 필요합니다.</aside></noscript>
  {/* Query container: the shell collapses by root-text-relative width, not viewport px. */}
  <div class="docs-frame"><div class="docs-layout">
   <aside class="docs-sidebar" aria-label="문서 탐색"><SideNavigation title={section()?.label??'문서 안내'} items={sideItems()} currentId={props.page.currentId} /></aside>
   <div class="docs-body">
    {/* The same compact home/current path is usable in SSR, no-JS and enlarged text. */}
    <Breadcrumb home={{href:'/krds/',label:'홈'}} items={props.page.breadcrumbs.filter(item=>item.id!=='home'&&item.href!==props.page.route)} currentItem={{id:props.page.currentId,label:props.page.title}} omitCurrent={props.page.sourcePath==='index.md'} maxVisible={3} />
    <div class="docs-section-control"><Button id="docs-section-trigger" variant="tertiary" disabled={!ready()} onClick={()=>request('section')}>문서 메뉴</Button></div>
    <div class="docs-reading"><main id="docs-main" tabIndex={-1}><DocArticle page={props.page} /><nav class="docs-previous-next" aria-label="이전과 다음 문서"><Show when={props.page.previous}>{previous=><Link href={previous().href} label={`이전: ${previous().label}`} />}</Show><Show when={props.page.next}>{next=><Link href={next().href} label={`다음: ${next().label}`} />}</Show></nav></main><aside class="docs-toc" aria-label="문서 구성"><InPageNavigation title="이 페이지에서" sections={sections()} narrowMode="disclosure" /></aside></div>
   </div>
  </div></div>
  <Footer serviceLogo={{src:branding.wordmark,alt:branding.alt}} contacts={[]} utilityLinks={[{href:'https://github.com/moreal/krds',label:'GitHub 저장소'},{href:'/krds/_legal/',label:'원본 출처와 라이선스 파일'}]} privacyPolicy={{href:'/krds/legal/',label:'출처와 권리'}} policyLinks={[]} copyrightText="Independent code © 2026 Lee Dogeon. KRDS and third-party materials retain their own terms." />
  <Show when={active()==='search'}><SearchDialog onClose={()=>request(null)} /></Show>
  <Modal id="docs-section-dialog" title="문서 메뉴" open={active()==='section'} initialFocusId="docs-section-dialog" returnFocusId="docs-section-trigger" onOpenChange={({open})=>{if(!open)request(null);}}><SideNavigation title={section()?.label??'문서 안내'} items={sideItems()} currentId={props.page.currentId} /></Modal>
 </div>;
}
