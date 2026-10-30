import { LitElement, html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { LocalState } from '../support/local-state.js';
registerKrdsElements(customElements);
/** Native Toast story host: local data, native slots and observable local results. */
class ToastStory extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new LocalState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'toast')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        return html `<main lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere"><h1>로컬 Toast 예제</h1><p>비공식 독립 로컬 예제</p><h2>컴포넌트 상태</h2>
      <section aria-label="처리 결과 확인"><h2>처리 결과 확인</h2><p id=${this.local.host.persistentResult?.id ?? 'saved-result'} tabindex="-1">${this.local.persistentText}</p>${this.local.host.persistentResult?.discoverableLabel ? html`<button type="button" @click=${() => this.querySelector<HTMLElement>('#' + CSS.escape(this.local.host.persistentResult.id))?.focus()}>${this.local.host.persistentResult.discoverableLabel}</button>` : ''}</section>
      <button type="button" @click=${() => { this.local.state = { ...this.local.state, message: structuredClone(this.local.host.actionMessage) }; this.local.persistentText = this.local.host.actionMessage?.text ?? ''; this.local.result = this.local.host.actionMessage?.text ?? ''; this.requestUpdate(); }}>신청 저장</button>${true ? html`<krds-tab-bar .items=${[{ id: 'home', label: '홈', href: '/local/home', icon: '⌂' }, { id: 'guide', label: '안내', href: '/local/guide', icon: '☰' }]} .currentId=${'home'}></krds-tab-bar>` : ''}<krds-toast
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
      ></krds-toast>
      <p role="status" aria-label="로컬 작업 결과">${this.local.result}</p>
    </main>`;
    }
}
if (!customElements.get('krds-toast-story'))
    customElements.define('krds-toast-story', ToastStory);
const meta = { id: 'krds-toast', title: 'KRDS/Toast', render: (args: {
        recipe: FullCatalogStoryCase;
    }) => html `<krds-toast-story .recipe=${args.recipe}></krds-toast-story>` } satisfies Meta<{
    recipe: FullCatalogStoryCase;
}>;
export default meta;
export const Information: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-toast--information')! } };
export const Warning: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-toast--warning')! } };
export const Duplicate: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-toast--duplicate')! } };
export const Queued: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-toast--queued')! } };
export const TimerCleanup: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-toast--timer-cleanup')! } };
export const Narrow: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-toast--narrow')! } };
export const ReducedMotion: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-toast--reduced-motion')! } };
export const SlowReadingPersistentResult: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-toast--slow-reading-persistent-result')! } };
export const SameIdContentUpdate: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-toast--same-id-content-update')! } };
export const HostReplacementRemoval: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-toast--host-replacement-removal')! } };
export const TimeoutRejected: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-toast--timeout-rejected')! } };
export const GenerationTimer: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-toast--generation-timer')! } };
