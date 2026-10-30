import { LitElement, html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { LocalState } from '../support/local-state.js';
registerKrdsElements(customElements);
/** Native TabBar story host: local data, native slots and observable local results. */
class TabBarStory extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new LocalState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'tab-bar')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        return html `<main lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere"><h1>로컬 TabBar 예제</h1><p>비공식 독립 로컬 예제</p><h2>컴포넌트 상태</h2>
      
      <krds-tab-bar
        .currentId=${s.currentId}
        .items=${s.items}
        .menuAction=${s.menuAction ? { ...s.menuAction, onRequest: () => { this.local.state = { ...this.local.state, menuOpen: true }; this.local.result = '전체 메뉴를 열었습니다.'; this.requestUpdate(); } } : undefined}
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
      ></krds-tab-bar><section style="min-block-size:140vh;padding-block-end:8rem"><h2>페이지 본문</h2><p>하단 메뉴 위에서도 모든 본문 작업을 사용할 수 있습니다.</p><button data-krds-host="last-content-action" type="button" style="margin-block-start:100vh">마지막 본문 작업</button></section><krds-modal .open=${!!s.menuOpen} .title=${'전체 메뉴'} .body=${html`<krds-main-menu .items=${s.items} .embedded=${true} label="전체 메뉴"></krds-main-menu>`} @open-change=${(event: CustomEvent) => { this.local.state = { ...this.local.state, menuOpen: event.detail.open }; this.requestUpdate(); }}></krds-modal>
      <p role="status" aria-label="로컬 작업 결과">${this.local.result}</p>
    </main>`;
    }
}
if (!customElements.get('krds-tab-bar-story'))
    customElements.define('krds-tab-bar-story', TabBarStory);
const meta = { id: 'krds-tab-bar', title: 'KRDS/TabBar', render: (args: {
        recipe: FullCatalogStoryCase;
    }) => html `<krds-tab-bar-story .recipe=${args.recipe}></krds-tab-bar-story>` } satisfies Meta<{
    recipe: FullCatalogStoryCase;
}>;
export default meta;
export const ThreeItems: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-tab-bar--three-items')! } };
export const FiveItems: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-tab-bar--five-items')! } };
export const WithBadge: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-tab-bar--with-badge')! } };
export const AllMenu: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-tab-bar--all-menu')! } };
export const LongTranslatedLabel: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-tab-bar--long-translated-label')! } };
export const ScrollPage: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-tab-bar--scroll-page')! } };
