<script setup lang="ts">
import { computed, nextTick, onUnmounted, shallowRef } from 'vue';
import { KrdsProvider } from '@unofficial-krds/vue';
import { createFixtureBridge } from '@unofficial-krds/test-contracts/driver';
import { createLocalDriver, createPatternState, transition, searchResources, patternScenarios, layoutSections, resourceCategories, type PatternId, type PatternState, type PatternAction, type PatternEffect, type PatternFixtureCommand, type Category, type LayoutId } from '@unofficial-krds/test-contracts/patterns';
import PatternPresentation from '../../../../packages/vue/examples/patterns/PatternPresentation.vue';
import { identity, mapPresentation } from './presentation';
const initialURL = new URL(window.location.href);
const patternId = initialURL.pathname.split('/')[2] as PatternId;
const caseId = initialURL.searchParams.get('case') ?? '';
const scenario = patternScenarios.find(item => item.patternId === patternId && item.caseId === caseId);
if (!scenario)
    throw new RangeError('Unknown example scenario');
const bridge = createFixtureBridge('vue', { patternId, caseId });
let disposed = false, generation = 0, sequence = 0, savedScroll: {
    x: number;
    y: number;
} | null = null;
let paginationFocus = false;
function ready(url: URL): PatternState {
    let state: PatternState = createPatternState(patternId, caseId);
    for (const action of scenario!.initialActions)
        state = transition(state, action).state;
    if (state.patternId === 'search-results') {
        const query = url.searchParams.get('query') ?? state.query;
        const category = (resourceCategories.some(x => x.value === url.searchParams.get('category')) ? url.searchParams.get('category') : state.category) as Category;
        const supplied = url.searchParams.get('page');
        const page = supplied !== null && /^\d+$/.test(supplied) && Number.isSafeInteger(Number(supplied)) ? Number(supplied) : supplied === null ? state.page : 1;
        state = { ...state, query, appliedQuery: query, category, ...searchResources({ query, category, page }) };
    }
    else if (state.patternId === 'service-layout') {
        const section = url.searchParams.get('section');
        if (section && Object.hasOwn(layoutSections, section))
            state = transition(state, { type: 'navigate', id: section as LayoutId }).state;
    }
    return state;
}
let driver = createLocalDriver(patternId, { caseId, seed: scenario.seed, initialState: ready(initialURL) });
const state = shallowRef<PatternState>(driver.getState());
let unsubscribe = driver.subscribe(next => { state.value = next; });
const presentation = computed(() => mapPresentation(state.value, caseId));
function hrefForPage(page: number): string {
    if (state.value.patternId !== 'search-results')
        return '#';
    return `/examples/search-results?${new URLSearchParams({ case: caseId, query: state.value.appliedQuery, category: state.value.category, page: String(page) })}`;
}
function syncURL() {
    const current = state.value;
    const url = new URL(window.location.href);
    if (current.patternId === 'search-results' && current.phase === 'success') {
        url.searchParams.set('case', caseId);
        url.searchParams.set('query', current.appliedQuery);
        url.searchParams.set('category', current.category);
        url.searchParams.set('page', String(current.page));
    }
    else if (current.patternId === 'service-layout')
        url.searchParams.set('section', current.currentId);
    else
        return;
    if (url.href !== window.location.href)
        history.pushState(null, '', url);
}
async function effects(list: PatternEffect[], token: number) {
    for (const effect of list)
        if (effect.type === 'request')
            bridge.recordEvent('pattern:request', { operation: effect.operation, requestId: effect.requestId, payload: effect.payload });
    await nextTick();
    await nextTick();
    if (disposed || generation !== token)
        return;
    for (const effect of list)
        if (effect.type === 'focus') {
            // Modal owns its saved opener. A fallback must never override that usable opener.
            if (effect.targetId === 'example-consent-review')
                continue;
            document.getElementById(effect.targetId)?.focus();
        }
}
function apply(action: PatternAction) {
    if (disposed)
        return;
    const before = state.value;
    if (before.patternId === 'consent-confirmation' && action.type === 'review' && before.requiredChoice === true && !before.modalOpen)
        savedScroll = { x: window.scrollX, y: window.scrollY };
    const output = driver.dispatch(action);
    void after(before, output.effects);
}
async function after(before: PatternState, list: PatternEffect[]) {
    const token = generation;
    void effects(list, token);
    if (before.patternId === 'search-results' && before.phase === 'loading' && state.value.patternId === 'search-results' && state.value.phase === 'success'
        || before.patternId === 'service-layout' && state.value.patternId === 'service-layout' && before.currentId !== state.value.currentId)
        syncURL();
    if (before.patternId === 'search-results' && before.phase === 'loading' && state.value.patternId === 'search-results' && state.value.phase === 'success' && paginationFocus) {
        paginationFocus = false;
        await nextTick();
        if (!disposed && generation === token && document.activeElement === document.body) {
            const current = document.querySelector<HTMLElement>('[data-krds-component="pagination"] [aria-current="page"]');
            if (current) {
                current.tabIndex = -1;
                current.focus();
            }
        }
    }
    if (before.patternId === 'consent-confirmation' && before.modalOpen && state.value.patternId === 'consent-confirmation' && !state.value.modalOpen && savedScroll) {
        const position = savedScroll;
        savedScroll = null;
        await nextTick();
        await nextTick();
        if (!disposed && generation === token)
            window.scrollTo({ left: position.x, top: position.y, behavior: 'instant' });
    }
}
const unsubscribeBridge = bridge.subscribe(snapshot => {
    const command = snapshot.__patternCommand as PatternFixtureCommand | undefined;
    if (!command || !Number.isSafeInteger(command.sequence) || command.sequence <= sequence || command.command !== 'settle' || (command.ok !== undefined && typeof command.ok !== 'boolean'))
        return;
    sequence = command.sequence;
    const before = state.value;
    const output = driver.settle(command.ok === undefined ? {} : { ok: command.ok });
    void after(before, output.effects);
});
function navigate(event: MouseEvent) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey)
        return;
    const anchor = (event.target as Element).closest('a[href]') as HTMLAnchorElement | null;
    if (!anchor || anchor.target && anchor.target !== '_self' || anchor.hasAttribute('download'))
        return;
    const url = new URL(anchor.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || url.searchParams.get('case') !== caseId)
        return;
    if (state.value.patternId === 'service-layout') {
        const section = url.searchParams.get('section');
        if (section && Object.hasOwn(layoutSections, section)) {
            event.preventDefault();
            apply({ type: 'navigate', id: section as LayoutId });
        }
    }
    else if (state.value.patternId === 'search-results' && anchor.closest('[data-krds-component="pagination"]')) {
        const page = Number(url.searchParams.get('page'));
        if (Number.isSafeInteger(page)) {
            event.preventDefault();
            paginationFocus = true;
            apply({ type: 'page', page });
        }
    }
}
function expanded(ids: readonly string[]) {
    if (state.value.patternId !== 'service-layout')
        return;
    for (const id of ['examples', 'help'] as const)
        if (state.value.expandedIds.includes(id) !== ids.includes(id))
            apply({ type: 'expand', id, expanded: ids.includes(id) });
}
function popstate() {
    generation++;
    paginationFocus = false;
    unsubscribe();
    driver.dispose();
    driver = createLocalDriver(patternId, { caseId, seed: scenario!.seed, initialState: ready(new URL(location.href)) });
    state.value = driver.getState();
    unsubscribe = driver.subscribe(next => state.value = next);
    if (patternId === 'service-layout')
        void nextTick(() => document.getElementById('example-main-heading')?.focus());
}
window.addEventListener('popstate', popstate);
// MainMenu's native mobile Modal teleports to body, outside the presentation root.
document.addEventListener('click', navigate);
onUnmounted(() => { disposed = true; generation++; window.removeEventListener('popstate', popstate); document.removeEventListener('click', navigate); unsubscribe(); unsubscribeBridge(); driver.dispose(); bridge.dispose(); });
</script>
<template>
<KrdsProvider>
<PatternPresentation :presentation="presentation" :identity="identity" :href-for-page="hrefForPage" @field="(field,value)=>apply({type:'field',field,value})" @error-link="field=>apply({type:'error-link',field})" @submit="apply({type:'submit'})" @reset="apply({type:'reset'})" @retry="apply({type:'retry'})" @query="value=>apply({type:'query',value})" @search="apply({type:'search'})" @filter="category=>apply({type:'filter',category:category as Category})" @consent="(field,value)=>apply({type:'consent',field,value})" @review="apply({type:'review'})" @confirm="apply({type:'confirm'})" @close="apply({type:'close'})" @mobile="open=>apply({type:'mobile',open})" @expanded="expanded" @layout-search="apply({type:'navigate',id:'search'})"/>
</KrdsProvider>
</template>
