import { LitElement, html } from 'lit';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { FixtureState } from '../support/fixture-state.js';
registerKrdsElements(customElements);
/** Native TutorialPanel story host: local data, native slots and observable local results. */
class TutorialPanelFixture extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new FixtureState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'tutorial-panel')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        if (this.local.host.mounted === false || this.local.host.routeChange === true)
            return html `<main><p role="status" aria-label="Fixture health">ready</p><button data-krds-host="outside-action" id="route-fallback" type="button">다른 작업</button></main>`;
        return html `<main lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere"><p role="status" aria-label="Fixture health">ready</p><h1>로컬 TutorialPanel 예제</h1><p>비공식 독립 로컬 예제</p><h2>컴포넌트 상태</h2>
      
      <krds-tutorial-panel
        .coordinatedStop=${this.local.stopCoordinating}
        .activePanel=${this.local.panelActive}
        .activeStepId=${s.activeStepId}
        .activeTaskId=${s.activeTaskId}
        .defaultActivePanel=${undefined}
        .defaultOpen=${undefined}
        .defaultRunning=${undefined}
        .fallbackFocusId=${s.fallbackFocusId}
        .open=${this.local.panelOpen}
        .running=${this.local.running}
        .startActionId=${s.startActionId}
        .tasks=${s.tasks}
        @icon-action=${(event: CustomEvent) => this.local.accept('icon-action', event.detail)}
        @value-change=${(event: CustomEvent) => this.local.accept('value-change', event.detail)}
        @checked-change=${(event: CustomEvent) => this.local.accept('checked-change', event.detail)}
        @open-change=${(event: CustomEvent) => this.local.linkedPanel(event.detail.open)}
        @expanded-change=${(event: CustomEvent) => this.local.accept('expanded-change', event.detail)}
        @mobile-open-change=${(event: CustomEvent) => this.local.accept('mobile-open-change', event.detail)}
        @page-change=${(event: CustomEvent) => this.local.accept('page-change', event.detail)}
        @index-change=${(event: CustomEvent) => this.local.accept('index-change', event.detail)}
        @playing-change=${(event: CustomEvent) => this.local.accept('playing-change', event.detail)}
        @topic-change=${(event: CustomEvent) => this.local.accept('topic-change', event.detail)}
        @start=${(event: CustomEvent) => this.local.accept('start', event.detail)}
        @task-change=${(event: CustomEvent) => this.local.accept('task-change', event.detail)}
        @step-change=${(event: CustomEvent) => this.local.accept('step-change', event.detail)}
        @active-panel-change=${(event: CustomEvent) => this.local.linkedTab(event.detail.value)}
        @running-change=${(event: CustomEvent) => this.local.accept('running-change', event.detail)}
        @query-change=${(event: CustomEvent) => this.local.accept('query-change', event.detail)}
        @files-change=${(event: CustomEvent) => this.local.accept('files-change', event.detail)}
        @selection-change=${(event: CustomEvent) => this.local.accept('selection-change', event.detail)}
        @sort-change=${(event: CustomEvent) => this.local.accept('sort-change', event.detail)}
        @remove=${(event: CustomEvent) => this.local.accept('remove', event.detail)}
        @clear=${(event: CustomEvent) => this.local.accept('clear', event.detail)}
        @dismiss=${(event: CustomEvent) => this.local.accept('dismiss', event.detail)}
        @action=${(event: CustomEvent) => this.local.accept('action', event.detail)}
        @request=${(event: CustomEvent) => this.local.accept('request', event.detail)}
        @back-request=${(event: CustomEvent) => this.local.accept('back-request', event.detail)}
        @locale-request=${(event: CustomEvent) => this.local.accept('locale-request', event.detail)}
        @stop=${(event: CustomEvent) => this.local.accept('stop', event.detail)}
        @return-request=${(event: CustomEvent) => this.local.accept('return-request', event.detail)}
      ><div slot="tour-targets" style=${this.local.host.targetOffscreen ? 'padding-block-start:120vh' : ''}><label for="applicant-name">신청인 이름</label>${this.local.host.targetRemoved ? '' : html`<input id="applicant-name" name="applicant" .value=${this.local.host.targetInputs?.['applicant-name'] ?? ''} @input=${() => { this.local.verifiedTarget = false; }}>`}<div id="applicant-name-after"></div><button id="save-application" type="button" @click=${() => { this.local.verifiedTarget = this.local.host.targetActionVerified === true; this.local.result = this.local.verifiedTarget ? '신청 저장 완료' : '입력 및 로컬 저장 확인이 필요합니다'; this.requestUpdate(); }}>신청 저장</button><div id="save-application-after"></div><label><input type="checkbox" .checked=${this.local.host.targetActionVerified === true} @change=${(event: Event) => { this.local.host.targetActionVerified = (event.target as HTMLInputElement).checked; }}>로컬 저장 확인 허용</label></div></krds-tutorial-panel><krds-coach-mark .linked=${true} .open=${this.local.running} .steps=${(s.tasks.find((task: { id: string }) => task.id === s.activeTaskId) ?? s.tasks[0])?.steps ?? []} .boundaries=${[{ targetId: 'applicant-name', insertionBoundaryId: 'applicant-name-after' }, { targetId: 'save-application', insertionBoundaryId: 'save-application-after' }]} .stepId=${s.activeStepId ?? this.local.coachStepId} .startActionId=${s.startActionId} .fallbackFocusId=${s.fallbackFocusId ?? ''} .onTargetAction=${() => this.local.verifiedTarget && this.local.result === '신청 저장 완료'} @step-change=${(event: CustomEvent) => this.local.accept('step-change', event.detail)} @stop=${(event: CustomEvent) => this.local.accept('stop', event.detail)} @return-request=${(event: CustomEvent) => this.local.accept('return-request', event.detail)}></krds-coach-mark>
      ${this.local.configurationError ? html`<p data-krds-host="configuration-error" role="alert">${this.local.configurationError}</p>` : ''}<button data-krds-host="outside-action" type="button">다른 작업</button><p role="status" data-krds-host="result" aria-label="로컬 작업 결과">${this.local.result}</p>
    </main>`;
    }
}
if (!customElements.get('krds-tutorial-panel-fixture'))
    customElements.define('krds-tutorial-panel-fixture', TutorialPanelFixture);
