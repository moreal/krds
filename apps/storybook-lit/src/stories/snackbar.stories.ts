import { LitElement, html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { LocalState } from '../support/local-state.js';
registerKrdsElements(customElements);
/** Native Snackbar story host: local data, native slots and observable local results. */
class SnackbarStory extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new LocalState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'snackbar')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        return html `<main lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere"><h1>로컬 Snackbar 예제</h1><p>비공식 독립 로컬 예제</p><h2>컴포넌트 상태</h2>
      <button id=${this.local.host.fallbackFocusId ?? 'snackbar-fallback'} type="button">다음 신청 작업</button>
      ${true ? html`<krds-tab-bar .items=${[{ id: 'home', label: '홈', href: '/local/home', icon: '⌂' }, { id: 'guide', label: '안내', href: '/local/guide', icon: '☰' }]} .currentId=${'home'}></krds-tab-bar>` : ''}<krds-snackbar .fallbackFocusId=${this.local.host.fallbackFocusId ?? 'snackbar-fallback'}
        .action=${s.action}
        .durationMs=${s.durationMs}
        .message=${s.message}
        @value-change=${(event: CustomEvent) => this.local.accept('value-change', event.detail)}
        @checked-change=${(event: CustomEvent) => this.local.accept('checked-change', event.detail)}
        @open-change=${(event: CustomEvent) => this.local.accept('open-change', event.detail)}
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
      ></krds-snackbar>
      <p role="status" aria-label="로컬 작업 결과">${this.local.result}</p>
    </main>`;
    }
}
if (!customElements.get('krds-snackbar-story'))
    customElements.define('krds-snackbar-story', SnackbarStory);
const meta = { id: 'krds-snackbar', title: 'KRDS/Snackbar', render: (args: {
        recipe: FullCatalogStoryCase;
    }) => html `<krds-snackbar-story .recipe=${args.recipe}></krds-snackbar-story>` } satisfies Meta<{
    recipe: FullCatalogStoryCase;
}>;
export default meta;
export const Message: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-snackbar--message')! } };
export const WithAction: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-snackbar--with-action')! } };
export const WithIcon: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-snackbar--with-icon')! } };
export const UndoLocal: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-snackbar--undo-local')! } };
export const ActionError: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-snackbar--action-error')! } };
export const CloseFocused: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-snackbar--close-focused')! } };
export const TimerCleanup: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-snackbar--timer-cleanup')! } };
export const Narrow: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-snackbar--narrow')! } };
export const NavigationLink: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-snackbar--navigation-link')! } };
export const SameIdErrorActionUpdate: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-snackbar--same-id-error-action-update')! } };
export const DismissalRejected: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-snackbar--dismissal-rejected')! } };
export const HostQueueReplacement: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-snackbar--host-queue-replacement')! } };
export const GenerationTimerPauses: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-snackbar--generation-timer-pauses')! } };
