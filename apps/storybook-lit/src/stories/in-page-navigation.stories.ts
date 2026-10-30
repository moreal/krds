import { LitElement, html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { LocalState } from '../support/local-state.js';
registerKrdsElements(customElements);
/** Native InPageNavigation story host: local data, native slots and observable local results. */
class InPageNavigationStory extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new LocalState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'in-page-navigation')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        return html `<main lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere"><h1>로컬 InPageNavigation 예제</h1><p>비공식 독립 로컬 예제</p><h2>컴포넌트 상태</h2>
      <style>@media(min-width:64rem){krds-in-page-navigation{float:inline-end;inline-size:15rem;margin-inline-start:2rem;position:sticky;inset-block-start:1rem}section[id]{inline-size:calc(100% - 17rem)}}@media(max-width:63.99rem){krds-in-page-navigation{display:block}}</style><krds-in-page-navigation
        .activeId=${s.activeId}
        .narrowMode=${s.narrowMode ?? 'inline'}
        .sections=${s.sections.filter((section: any) => section.id !== this.local.host.removeSectionId)}
        .title=${s.title}
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
      ></krds-in-page-navigation>${s.sections.filter((section: any) => section.id !== this.local.host.removeSectionId).map((section: any) => html`<section id=${section.id} tabindex="-1" style="min-block-size:70vh;padding-block:2rem;scroll-margin-block-start:4rem"><h2>${section.label}</h2><p>로컬 신청 안내 본문</p><a href="/local/item">본문 링크</a>${section.children?.map((child: any) => html`<section id=${child.id} tabindex="-1" style="min-block-size:50vh"><h3>${child.label}</h3><a href="/local/item">상세 본문 링크</a></section>`)}</section>`)}
      <p role="status" aria-label="로컬 작업 결과">${this.local.result}</p>
    </main>`;
    }
}
if (!customElements.get('krds-in-page-navigation-story'))
    customElements.define('krds-in-page-navigation-story', InPageNavigationStory);
const meta = { id: 'krds-in-page-navigation', title: 'KRDS/InPageNavigation', render: (args: {
        recipe: FullCatalogStoryCase;
    }) => html `<krds-in-page-navigation-story .recipe=${args.recipe}></krds-in-page-navigation-story>` } satisfies Meta<{
    recipe: FullCatalogStoryCase;
}>;
export default meta;
export const DesktopSide: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-in-page-navigation--desktop-side')! } };
export const MobileInline: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-in-page-navigation--mobile-inline')! } };
export const MobileDisclosure: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-in-page-navigation--mobile-disclosure')! } };
export const ThreeLevelOutline: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-in-page-navigation--three-level-outline')! } };
export const StickyOffset: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-in-page-navigation--sticky-offset')! } };
export const RemovedSection: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-in-page-navigation--removed-section')! } };
