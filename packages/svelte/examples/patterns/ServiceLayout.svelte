<script lang="ts">
import { SkipLink, Header, SideNavigation, Footer, Link } from '@unofficial-krds/svelte';
import type { Identity, NavigationItem, LayoutView } from './types';
let { view, identity, navigation, section, logo, homeHref, privacyHref, helpHref, onNavigate = () => { }, onExpanded = () => { }, onMobile = () => { } }: {
    view: LayoutView;
    identity: Identity;
    navigation: readonly NavigationItem[];
    section: {
        title: string;
        body: string;
    };
    logo: {
        src: string;
        alt: string;
    };
    homeHref: string;
    privacyHref: string;
    helpHref: string;
    onNavigate?: (id: string) => void;
    onExpanded?: (ids: readonly string[]) => void;
    onMobile?: (open: boolean) => void;
} = $props();
function navigate(e: MouseEvent) { if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
    return; const target = (e.target as Element).closest('a'); if (!target)
    return; const parsed = new URL(target.href, location.href); const id = parsed.searchParams.get('section'); if (parsed.origin === location.origin && id) {
    e.preventDefault();
    onNavigate(id);
} }
</script>
<div class="page" onclick={navigate} role="presentation"><SkipLink links={[{id:'main',label:'본문 바로가기',targetId:'example-main-heading'}]}/><Header home={{href:homeHref,label:identity.name,logo}} utilityItems={[{id:'help',label:'키보드 이용 안내',href:helpHref}]} mainNavigation={navigation} currentId={view.currentId} navigationLabel="주요 메뉴" mobileOpen={view.mobileOpen} mobileTriggerId="example-layout-mobile-open" mobileTriggerLabel="전체메뉴" onMobileOpenChange={({open})=>onMobile(open)}/><aside class="notice" aria-label="독립 예제 안내"><p>{identity.name} · {identity.notice}</p></aside><div class="body"><aside class="sidebar"><SideNavigation title="예제 메뉴" items={navigation} currentId={view.currentId} expandedIds={view.expandedIds} onExpandedChange={({ids})=>onExpanded(ids)}/></aside><main><h1 id="example-main-heading" tabindex="-1">{section.title}</h1><p>{section.body}</p><p>{identity.dataNotice}</p><Link label="키보드 이용 안내" href={helpHref}/></main></div><Footer serviceLogo={logo} contacts={[]} utilityLinks={[{id:'accessibility',label:'키보드 이용 안내',href:helpHref}]} privacyPolicy={{label:'개인정보 처리방침',href:privacyHref}} policyLinks={[]} copyrightText={identity.copyrightText}/></div>
<style>.page{min-height:100vh;display:flex;flex-direction:column}.body{display:grid;grid-template-columns:minmax(12rem,18rem) minmax(0,1fr);gap:2rem;flex:1;padding:1rem}main{min-width:0}.notice{padding:1rem}p{overflow-wrap:anywhere}@media(max-width:767px){.body{grid-template-columns:minmax(0,1fr)}.sidebar{display:none}}</style>
