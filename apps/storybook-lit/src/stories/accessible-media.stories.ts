import { LitElement, html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { LocalState } from '../support/local-state.js';
registerKrdsElements(customElements);
/** Native AccessibleMedia story host: local data, native slots and observable local results. */
class AccessibleMediaStory extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new LocalState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'accessible-media')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        return html `<main lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere"><h1>로컬 AccessibleMedia 예제</h1><p>비공식 독립 로컬 예제</p><h2>컴포넌트 상태</h2>${this.recipe.caseId === 'sign-language' ? html `<p role="note">수어 영상의 정확성 및 권리 검토가 완료되지 않았습니다. 이 상태는 완료 증거로 인정하지 않습니다.</p>` : ''}
      
      <krds-accessible-media
        .autoplay=${s.autoplay}
        .captionTracks=${s.captionTracks}
        .controls=${s.controls ?? true}
        .descriptionTrack=${s.descriptionTrack}
        .media=${s.media}
        .signLanguageSource=${undefined}
        .title=${s.title}
        .transcript=${s.transcript}
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
      ></krds-accessible-media>
      <p role="status" aria-label="로컬 작업 결과">${this.local.result}</p>
    </main>`;
    }
}
if (!customElements.get('krds-accessible-media-story'))
    customElements.define('krds-accessible-media-story', AccessibleMediaStory);
const meta = { id: 'krds-accessible-media', title: 'KRDS/AccessibleMedia', render: (args: {
        recipe: FullCatalogStoryCase;
    }) => html `<krds-accessible-media-story .recipe=${args.recipe}></krds-accessible-media-story>` } satisfies Meta<{
    recipe: FullCatalogStoryCase;
}>;
export default meta;
export const Audio: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-accessible-media--audio')! } };
export const SilentVideo: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-accessible-media--silent-video')! } };
export const MultimediaCaptions: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-accessible-media--multimedia-captions')! } };
export const Description: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-accessible-media--description')! } };
export const Transcript: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-accessible-media--transcript')! } };
export const SignLanguage: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-accessible-media--sign-language')! } };
export const LoadError: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-accessible-media--load-error')! } };
