<script lang="ts">
import { onMount, tick } from 'svelte';
import { createPatternState, createLocalDriver, patternScenarios, searchResources, transition, layoutSections } from '@unofficial-krds/test-contracts/patterns';
import type { PatternId, PatternState, PatternAction, PatternEffect, PatternFixtureCommand, Category, LayoutId } from '@unofficial-krds/test-contracts/patterns';
import { createFixtureBridge } from '@unofficial-krds/test-contracts/driver';
import type { FixtureBridge } from '@unofficial-krds/test-contracts';
import FormErrors from '../../../../packages/svelte/examples/patterns/FormErrors.svelte';
import SearchResults from '../../../../packages/svelte/examples/patterns/SearchResults.svelte';
import ConsentConfirmation from '../../../../packages/svelte/examples/patterns/ConsentConfirmation.svelte';
import ServiceLayout from '../../../../packages/svelte/examples/patterns/ServiceLayout.svelte';
import { demoIdentity, formCategories, resourceCategories, consentContent, navigation, layoutHref } from './presentation';
let snapshot = $state<PatternState>();
let caseId = $state('');
let ready = $state(false);
let mounted = $state(true);
let driver: ReturnType<typeof createLocalDriver>;
let bridge: FixtureBridge;
let unsubscribe = () => { };
let sequence = -1;
let generation = 0;
let pendingPageFocus: {
    requestId: number;
    element: Element;
} | null = null;
let savedScroll: {
    x: number;
    y: number;
} | null = null;
function createRoute() {
    generation++;
    unsubscribe();
    driver?.dispose();
    const url = new URL(location.href);
    const id = url.pathname.split('/')[2] as PatternId;
    const selected = patternScenarios.find(s => s.patternId === id && s.caseId === url.searchParams.get('case')) ?? patternScenarios.find(s => s.patternId === id);
    if (!selected)
        throw new RangeError('Unknown pattern route');
    caseId = selected.caseId;
    let initial = createPatternState(id, caseId);
    for (const action of selected.initialActions)
        initial = transition(initial, action).state;
    if (initial.patternId === 'search-results') {
        const category = resourceCategories.some(c => c.value === url.searchParams.get('category')) ? url.searchParams.get('category') as Category : initial.category;
        const query = url.searchParams.get('query') ?? initial.query;
        const rawPage = url.searchParams.get('page');
        const page = rawPage === null ? initial.page : /^\d+$/.test(rawPage) ? Number(rawPage) : Number.NaN;
        initial = { ...initial, query, appliedQuery: query, category, ...searchResources({ query, category, page }) };
    }
    if (initial.patternId === 'service-layout') {
        const section = url.searchParams.get('section');
        if (section && Object.hasOwn(layoutSections, section))
            initial = transition(initial, { type: 'navigate', id: section as LayoutId }).state;
    }
    driver = createLocalDriver(id, { caseId, seed: selected.seed, initialState: initial });
    snapshot = driver.getState();
    unsubscribe = driver.subscribe(next => { snapshot = next; });
    savedScroll = null;
    pendingPageFocus = null;
}
function searchHref(page: number) {
    if (snapshot?.patternId !== 'search-results')
        return '';
    return `/examples/search-results?${new URLSearchParams({ case: caseId, query: snapshot.appliedQuery, category: snapshot.category, page: String(page) })}`;
}
function updateURL() { if (snapshot?.patternId === 'search-results' && snapshot.phase === 'success')
    history.pushState(null, '', searchHref(snapshot.page));
else if (snapshot?.patternId === 'service-layout')
    history.pushState(null, '', layoutHref(caseId, snapshot.currentId)); }
async function effects(output: {
    state: PatternState;
    effects: PatternEffect[];
}, wasOpen: boolean, urlChange: boolean) {
    const ownGeneration = generation;
    for (const effect of output.effects)
        if (effect.type === 'request')
            bridge.recordEvent('pattern:request', { operation: effect.operation, requestId: effect.requestId, payload: effect.payload });
    if (urlChange)
        updateURL();
    await tick();
    if (ownGeneration !== generation || !mounted)
        return;
    for (const effect of output.effects)
        if (effect.type === 'focus')
            document.getElementById(effect.targetId)?.focus();
    if (output.state.patternId === 'search-results' && output.state.phase !== 'loading' && pendingPageFocus) {
        const previous = pendingPageFocus;
        pendingPageFocus = null;
        if (output.state.phase === 'success' && previous.requestId === output.state.requestId && !previous.element.isConnected && document.activeElement === document.body) {
            const target = document.querySelector<HTMLElement>('[data-krds-component="pagination"][data-krds-part="link"][aria-current="page"]');
            if (target) {
                target.tabIndex = -1;
                target.focus();
                target.addEventListener('blur', () => target.removeAttribute('tabindex'), { once: true });
            }
        }
    }
    if (wasOpen && output.state.patternId === 'consent-confirmation' && !output.state.modalOpen && savedScroll) {
        window.scrollTo({ left: savedScroll.x, top: savedScroll.y, behavior: 'instant' });
        savedScroll = null;
    }
}
function dispatch(action: PatternAction) {
    const before = driver.getState();
    const active = document.activeElement;
    if (action.type === 'review' && before.patternId === 'consent-confirmation' && before.requiredChoice === true && !before.modalOpen)
        savedScroll = { x: scrollX, y: scrollY };
    const result = driver.dispatch(action);
    const request = result.effects.find(effect => effect.type === 'request');
    if (request)
        pendingPageFocus = action.type === 'page' && active?.matches('[data-krds-component="pagination"][data-krds-part="link"]') ? { requestId: request.requestId, element: active } : null;
    void effects(result, before.patternId === 'consent-confirmation' && before.modalOpen, action.type === 'navigate' && before.patternId === 'service-layout' && result.state.patternId === 'service-layout' && before.currentId !== result.state.currentId);
}
onMount(() => {
    createRoute();
    bridge = createFixtureBridge('svelte', {});
    const off = bridge.subscribe(patch => {
        const command = patch.__patternCommand as PatternFixtureCommand | undefined;
        if (command && command.command === 'settle' && Number.isSafeInteger(command.sequence) && command.sequence > sequence) {
            sequence = command.sequence;
            if (mounted) {
                const before = driver.getState();
                const result = driver.settle({ ok: command.ok });
                void effects(result, before.patternId === 'consent-confirmation' && before.modalOpen, result.state.patternId === 'search-results' && result.state.phase === 'success' && before.phase === 'loading');
            }
        }
        if (typeof patch.__patternMounted === 'boolean' && patch.__patternMounted !== mounted) {
            mounted = patch.__patternMounted;
            if (!mounted) {
                generation++;
                unsubscribe();
                driver.dispose();
            }
            else
                createRoute();
        }
    });
    const pop = () => createRoute();
    addEventListener('popstate', pop);
    ready = true;
    return () => { generation++; off(); unsubscribe(); driver?.dispose(); bridge.dispose(); removeEventListener('popstate', pop); };
});
</script>
{#if ready&&snapshot&&mounted}
{#if snapshot.patternId==='form-errors'}<FormErrors view={snapshot} identity={demoIdentity} categories={formCategories} onField={(field,value)=>dispatch({type:'field',field,value})} onSubmit={()=>dispatch({type:'submit'})} onReset={()=>dispatch({type:'reset'})} onErrorLink={field=>dispatch({type:'error-link',field})} onRetry={()=>dispatch({type:'retry'})}/>{:else if snapshot.patternId==='search-results'}<SearchResults view={snapshot} identity={demoIdentity} categories={resourceCategories} hrefForPage={searchHref} onQuery={value=>dispatch({type:'query',value})} onSearch={()=>dispatch({type:'search'})} onFilter={category=>dispatch({type:'filter',category:category as Category})} onPage={page=>dispatch({type:'page',page})} onRetry={()=>dispatch({type:'retry'})}/>{:else if snapshot.patternId==='consent-confirmation'}<ConsentConfirmation view={snapshot} identity={demoIdentity} content={consentContent} onChoice={(field,value)=>dispatch({type:'consent',field,value})} onReview={()=>dispatch({type:'review'})} onClose={()=>dispatch({type:'close'})} onConfirm={()=>dispatch({type:'confirm'})} onRetry={()=>dispatch({type:'retry'})}/>{:else}<ServiceLayout view={snapshot} identity={demoIdentity} navigation={navigation(caseId)} section={layoutSections[snapshot.currentId]} logo={{src:'/local-assets/service-logo.svg',alt:demoIdentity.name}} homeHref={layoutHref(caseId,'overview')} privacyHref={layoutHref(caseId,'privacy')} helpHref={layoutHref(caseId,'accessibility')} onNavigate={id=>{if(Object.hasOwn(layoutSections,id))dispatch({type:'navigate',id:id as LayoutId});}} onExpanded={ids=>{if(snapshot?.patternId!=='service-layout')return;for(const id of ['examples','help'] as const)if(ids.includes(id)!==snapshot.expandedIds.includes(id))dispatch({type:'expand',id,expanded:ids.includes(id)});}} onMobile={open=>dispatch({type:'mobile',open})}/>{/if}
{/if}
