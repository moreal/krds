import { LitElement, html } from 'lit';
import { createFixtureBridge } from '@unofficial-krds/test-contracts/driver';
import type { FixtureBridge } from '@unofficial-krds/test-contracts';
import { createLocalDriver, createPatternState, transition, searchResources, patternScenarios, fieldIds, demoIdentity, formCategories, resourceCategories, consentContent, layoutNavigation, layoutSections, type PatternId, type PatternState, type PatternAction, type PatternEffect, type LocalDriver, type Category, type LayoutId, type PatternFixtureCommand } from '@unofficial-krds/test-contracts/patterns';
import { registerPatternPresentation, type PatternPresentation } from '../../../../../packages/lit/examples/patterns/presentation.js';
import type { PatternContent } from '../../../../../packages/lit/examples/patterns/types.js';
export const patternContent: PatternContent = { fieldIds, demoIdentity, formCategories, resourceCategories, consentContent, layoutNavigation, layoutSections };
const ids: PatternId[] = ['form-errors', 'search-results', 'consent-confirmation', 'service-layout'];
function initial(url: URL, patternId: PatternId, caseId: string): PatternState {
    let state: PatternState = createPatternState(patternId, caseId);
    const scenario = patternScenarios.find(item => item.patternId === patternId && item.caseId === caseId)!;
    for (const action of scenario.initialActions)
        state = transition(state, action).state;
    if (state.patternId === 'search-results') {
        const query = url.searchParams.get('query') ?? state.query;
        const rawCategory = url.searchParams.get('category');
        const category = resourceCategories.some(item => item.value === rawCategory) ? rawCategory as Category : state.category;
        const rawPage = url.searchParams.get('page');
        const page = rawPage === null ? state.page : /^[1-9]\d*$/u.test(rawPage) && Number.isSafeInteger(Number(rawPage)) ? Number(rawPage) : 1;
        state = { ...state, query, appliedQuery: query, category, ...searchResources({ query, category, page }) };
    }
    if (state.patternId === 'service-layout') {
        const section = url.searchParams.get('section');
        if (section && Object.hasOwn(layoutSections, section))
            state = transition(state, { type: 'navigate', id: section as LayoutId }).state;
    }
    return state;
}
class PatternHost extends LitElement {
    static override properties = { state: { state: true } };
    declare state: PatternState;
    private driver?: LocalDriver<PatternId>;
    private bridge?: FixtureBridge;
    private unsubscribe?: () => void;
    private unsubscribeBridge?: () => void;
    private sequence = 0;
    private generation = 0;
    override createRenderRoot() { return this; }
    override connectedCallback() { super.connectedCallback(); this.start(); window.addEventListener('popstate', this.popstate); this.addEventListener('pattern-form-submit', this.recordSubmit); }
    private recordSubmit = (event: Event) => this.bridge?.recordEvent('pattern:form-submit', (event as CustomEvent).detail);
    private popstate = () => { this.stop(); this.start(); };
    private stop() { this.generation++; this.unsubscribe?.(); this.unsubscribeBridge?.(); this.driver?.dispose(); this.bridge?.dispose(); this.driver = undefined; this.bridge = undefined; }
    override disconnectedCallback() { this.stop(); window.removeEventListener('popstate', this.popstate); this.removeEventListener('pattern-form-submit', this.recordSubmit); super.disconnectedCallback(); }
    private start() {
        const url = new URL(location.href);
        const patternId = url.pathname.split('/')[2] as PatternId;
        const scenario = patternScenarios.find(item => item.patternId === patternId && item.caseId === url.searchParams.get('case')) ?? patternScenarios.find(item => item.patternId === patternId)!;
        this.sequence = 0;
        this.driver = createLocalDriver(patternId, { caseId: scenario.caseId, seed: scenario.seed, initialState: initial(url, patternId, scenario.caseId) });
        this.state = this.driver.getState();
        this.unsubscribe = this.driver.subscribe(state => { this.state = state; });
        this.bridge = createFixtureBridge('lit', { patternId, caseId: scenario.caseId });
        this.unsubscribeBridge = this.bridge.subscribe(patch => { const command = patch.__patternCommand as PatternFixtureCommand | undefined; if (!command || command.command !== 'settle' || !Number.isSafeInteger(command.sequence) || command.sequence <= this.sequence)
            return; this.sequence = command.sequence; this.effects(this.driver!.settle(command.ok === undefined ? {} : { ok: command.ok }).effects); this.syncUrl(); });
    }
    private effects(effects: PatternEffect[]) { const generation = this.generation; for (const effect of effects)
        if (effect.type === 'request')
            this.bridge?.recordEvent('pattern:request', { operation: effect.operation, requestId: effect.requestId, payload: effect.payload });
        else
            void this.updateComplete.then(async () => { if (generation !== this.generation || !this.isConnected)
                return; await this.querySelector<PatternPresentation>('krds-pattern-presentation')?.focusTarget(effect.targetId); }); }
    private action = (action: PatternAction) => { const previous = this.state; const result = this.driver!.dispatch(action); this.effects(result.effects); if (action.type === 'navigate' && previous.patternId === 'service-layout' && result.state.patternId === 'service-layout' && previous.currentId !== result.state.currentId)
        this.bridge?.recordEvent('pattern:route-change', { section: result.state.currentId }); if (['search', 'filter', 'page', 'navigate', 'retry'].includes(action.type))
        this.syncUrl(); };
    private syncUrl() { const next = this.url(); if (next.href !== location.href)
        history.pushState({}, '', next); }
    private url(page?: number, section?: LayoutId) { const url = new URL(location.href); const s = this.state; if (s.patternId === 'search-results') {
        url.searchParams.set('query', s.pendingPayload?.query ?? s.appliedQuery);
        url.searchParams.set('category', s.category);
        url.searchParams.set('page', String(page ?? s.page));
    } if (s.patternId === 'service-layout')
        url.searchParams.set('section', section ?? s.currentId); return url; }
    override render() { return html `<krds-pattern-presentation .state=${this.state} .content=${patternContent} .onAction=${this.action} .hrefForPage=${(page: number) => this.url(page).href} .hrefForSection=${(section: LayoutId) => this.url(undefined, section).href}></krds-pattern-presentation>`; }
}
export function mountPatternFixture(pathname: string, _caseId: string | null): boolean {
    if (!ids.some(id => pathname === `/examples/${id}`))
        return false;
    registerPatternPresentation(customElements);
    if (!customElements.get('krds-pattern-host'))
        customElements.define('krds-pattern-host', PatternHost);
    document.getElementById('app')!.replaceChildren(document.createElement('krds-pattern-host'));
    return true;
}
