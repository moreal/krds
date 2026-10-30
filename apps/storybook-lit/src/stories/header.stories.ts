import { LitElement, html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { LocalState } from '../support/local-state.js';
registerKrdsElements(customElements);
/** Native Header story host: local data, native slots and observable local results. */
class HeaderStory extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new LocalState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'header')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        return html `<div lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere">
      
      <krds-skip-link .links=${[{ id: 'main', label: '본문 바로가기', targetId: 'header-main-content' }]}></krds-skip-link><krds-masthead .governmentService=${s.governmentService ?? false}></krds-masthead><krds-header
        .actionLayout=${s.actionLayout}
        .home=${s.home}
        .mainNavigation=${s.mainNavigation}
        .search=${{ ...(s.search ?? { label: '검색' }), onRequest: () => { this.local.result = '로컬 검색 요청'; this.requestUpdate(); } }}
        .sticky=${s.sticky}
        .utilityItems=${s.utilityItems}
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
      ></krds-header><main id="header-main-content" tabindex="-1" style="min-block-size:100vh"><h1>로컬 Header 예제</h1><p>비공식 독립 로컬 예제</p><h2>신청 안내</h2><a href="/local/application">신청 안내 보기</a></main>
      <p role="status" aria-label="로컬 작업 결과">${this.local.result}</p>
    </div>`;
    }
}
if (!customElements.get('krds-header-story'))
    customElements.define('krds-header-story', HeaderStory);
const meta = { id: 'krds-header', title: 'KRDS/Header', render: (args: {
        recipe: FullCatalogStoryCase;
    }) => html `<krds-header-story .recipe=${args.recipe}></krds-header-story>` } satisfies Meta<{
    recipe: FullCatalogStoryCase;
}>;
export default meta;
export const HorizontalActions: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-header--horizontal-actions')! } };
export const VerticalActions: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-header--vertical-actions')! } };
export const FiveUtilities: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-header--five-utilities')! } };
export const MobileMenu: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-header--mobile-menu')! } };
export const StickyLongPage: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-header--sticky-long-page')! } };
export const TranslatedLongLabels: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-header--translated-long-labels')! } };
