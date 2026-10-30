import { LitElement, html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { LocalState } from '../support/local-state.js';
registerKrdsElements(customElements);
/** Native CoachMark story host: local data, native slots and observable local results. */
class CoachMarkStory extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new LocalState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'coach-mark')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        return html `<main lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere"><h1>로컬 CoachMark 예제</h1><p>비공식 독립 로컬 예제</p><h2>컴포넌트 상태</h2>
      
      ${this.local.host.linkedTutorial ? html`<krds-tutorial-panel .open=${this.local.panelOpen} .running=${this.local.running} .activePanel=${this.local.panelActive} .tasks=${[{ id: 'linked', title: '이용 방법', steps: s.steps }]} .activeTaskId=${'linked'} .activeStepId=${this.local.coachStepId} .startActionId=${s.startActionId} .fallbackFocusId=${s.fallbackFocusId ?? ''} .coordinatedStop=${this.local.stopCoordinating} @start=${(event: CustomEvent) => this.local.accept('start', event.detail)} @open-change=${(event: CustomEvent) => this.local.linkedPanel(event.detail.open)} @active-panel-change=${(event: CustomEvent) => this.local.linkedTab(event.detail.value)} @stop=${(event: CustomEvent) => this.local.accept('stop', event.detail)} @return-request=${(event: CustomEvent) => this.local.accept('return-request', event.detail)}><div slot="tour-targets" style=${this.local.host.targetOffscreen ? 'padding-block-start:120vh' : ''}><label for="applicant-name">신청인 이름</label>${this.local.host.targetRemoved ? '' : html`<input id="applicant-name" name="applicant" .value=${this.local.host.targetInputs?.['applicant-name'] ?? ''} @input=${() => { this.local.verifiedTarget = false; }}>`}<div id="applicant-name-after"></div><button id="save-application" type="button" @click=${() => { this.local.verifiedTarget = this.local.host.targetActionVerified === true; this.local.result = this.local.verifiedTarget ? '신청 저장 완료' : '입력 및 로컬 저장 확인이 필요합니다'; this.requestUpdate(); }}>신청 저장</button><div id="save-application-after"></div><label><input type="checkbox" .checked=${this.local.host.targetActionVerified === true} @change=${(event: Event) => { this.local.host.targetActionVerified = (event.target as HTMLInputElement).checked; }}>로컬 저장 확인 허용</label></div></krds-tutorial-panel>` : html`<button id=${s.startActionId} type="button" @click=${() => this.querySelector('krds-coach-mark')?.start()}>이용 방법 시작</button><div style=${this.local.host.targetOffscreen ? 'padding-block-start:120vh' : ''}><label for="applicant-name">신청인 이름</label>${this.local.host.targetRemoved ? '' : html`<input id="applicant-name" name="applicant" .value=${this.local.host.targetInputs?.['applicant-name'] ?? ''} @input=${() => { this.local.verifiedTarget = false; }}>`}<div id="applicant-name-after"></div><button id="save-application" type="button" @click=${() => { this.local.verifiedTarget = this.local.host.targetActionVerified === true; this.local.result = this.local.verifiedTarget ? '신청 저장 완료' : '입력 및 로컬 저장 확인이 필요합니다'; this.requestUpdate(); }}>신청 저장</button><div id="save-application-after"></div><label><input type="checkbox" .checked=${this.local.host.targetActionVerified === true} @change=${(event: Event) => { this.local.host.targetActionVerified = (event.target as HTMLInputElement).checked; }}>로컬 저장 확인 허용</label></div>`}<button id=${s.fallbackFocusId ?? 'coach-fallback'} type="button">다음 작업</button>
      <krds-coach-mark
        .open=${this.local.host.linkedTutorial ? this.local.running : s.open ?? s.coachOpen ?? s.defaultOpen ?? false}
        .stepId=${this.local.host.linkedTutorial ? this.local.coachStepId : s.stepId ?? s.coachStepId ?? s.defaultStepId ?? s.steps[0]?.id}
        .linked=${!!this.local.host.linkedTutorial}
        .boundaries=${s.boundaries}
        .defaultOpen=${undefined}
        .defaultStepId=${undefined}
        .fallbackFocusId=${s.fallbackFocusId}
        .onTargetAction=${() => this.local.verifiedTarget && this.local.result === '신청 저장 완료'}
        .startActionId=${s.startActionId}
        .steps=${s.steps}
        @value-change=${(event: CustomEvent) => this.local.accept('value-change', event.detail)}
        @checked-change=${(event: CustomEvent) => this.local.accept('checked-change', event.detail)}
        @open-change=${(event: CustomEvent) => { if (this.local.host.acceptChanges !== false && (event.detail.open || this.local.host.acceptStop !== false)) this.local.state = { ...this.local.state, coachOpen: event.detail.open }; this.local.accept('open-change', event.detail); }}
        @expanded-change=${(event: CustomEvent) => this.local.accept('expanded-change', event.detail)}
        @mobile-open-change=${(event: CustomEvent) => this.local.accept('mobile-open-change', event.detail)}
        @page-change=${(event: CustomEvent) => this.local.accept('page-change', event.detail)}
        @index-change=${(event: CustomEvent) => this.local.accept('index-change', event.detail)}
        @playing-change=${(event: CustomEvent) => this.local.accept('playing-change', event.detail)}
        @topic-change=${(event: CustomEvent) => this.local.accept('topic-change', event.detail)}
        @step-change=${(event: CustomEvent) => this.local.accept('step-change', event.detail)}
        @active-panel-change=${(event: CustomEvent) => this.local.accept('active-panel-change', event.detail)}
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
      ></krds-coach-mark>
      <p role="status" aria-label="로컬 작업 결과">${this.local.result}</p>
    </main>`;
    }
}
if (!customElements.get('krds-coach-mark-story'))
    customElements.define('krds-coach-mark-story', CoachMarkStory);
const meta = { id: 'krds-coach-mark', title: 'KRDS/CoachMark', render: (args: {
        recipe: FullCatalogStoryCase;
    }) => html `<krds-coach-mark-story .recipe=${args.recipe}></krds-coach-mark-story>` } satisfies Meta<{
    recipe: FullCatalogStoryCase;
}>;
export default meta;
export const Single: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-coach-mark--single')! } };
export const MultiStep: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-coach-mark--multi-step')! } };
export const ActionGated: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-coach-mark--action-gated')! } };
export const OffscreenTarget: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-coach-mark--offscreen-target')! } };
export const MissingTarget: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-coach-mark--missing-target')! } };
export const RouteChange: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-coach-mark--route-change')! } };
export const ReducedMotion: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-coach-mark--reduced-motion')! } };
export const TargetReadingOrder: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-coach-mark--target-reading-order')! } };
export const ActionNativeControl: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-coach-mark--action-native-control')! } };
export const StopHiddenPanel: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-coach-mark--stop-hidden-panel')! } };
export const StopHelpTab: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-coach-mark--stop-help-tab')! } };
export const StopFallbackRejected: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-coach-mark--stop-fallback-rejected')! } };
export const StopPartialNarrowHelp: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-coach-mark--stop-partial-narrow-help')! } };
