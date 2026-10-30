import { LitElement, html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { LocalState } from '../support/local-state.js';
registerKrdsElements(customElements);
/** Native Pagination story host: local data, native slots and observable local results. */
class PaginationStory extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new LocalState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'pagination')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        return html `<main lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere"><h1>로컬 Pagination 예제</h1><p>비공식 독립 로컬 예제</p><h2>컴포넌트 상태</h2>
      
      ${s.loadMore ? html`<ol data-krds-host="results">${(this.local.host.localItems ?? []).slice(0, s.loadMore.shown).map((item: number) => html`<li id=${`result-${item}`} tabindex="-1" data-krds-host=${`result-${item}` === s.loadMore.firstNewItemId ? 'first-added-result' : 'result-item'}>결과 ${item}</li>`)}</ol>` : ''}
      ${s.loadMore ? html`<output data-krds-host="shown-count">${s.loadMore.shown}</output>` : ''}
      <krds-pagination
        .defaultPage=${s.defaultPage}
        .hrefForPage=${(page: number) => String(s.hrefTemplate ?? '/local/results?page={page}').replace('{page}', String(page))}
        .loadMore=${s.loadMore ? { ...s.loadMore, onLoadMore: () => this.local.loadMore() } : undefined}
        .page=${s.page}
        .pageCount=${s.pageCount}
        .variant=${s.variant}
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
      ></krds-pagination>
      <p role="status" aria-label="로컬 작업 결과">${this.local.result}</p>
    </main>`;
    }
}
if (!customElements.get('krds-pagination-story'))
    customElements.define('krds-pagination-story', PaginationStory);
const meta = { id: 'krds-pagination', title: 'KRDS/Pagination', render: (args: {
        recipe: FullCatalogStoryCase;
    }) => html `<krds-pagination-story .recipe=${args.recipe}></krds-pagination-story>` } satisfies Meta<{
    recipe: FullCatalogStoryCase;
}>;
export default meta;
export const NumberLinks: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-pagination--number-links')! } };
export const DirectPage: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-pagination--direct-page')! } };
export const LoadMore: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-pagination--load-more')! } };
export const FirstLastBoundary: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-pagination--first-last-boundary')! } };
export const NarrowSevenItems: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-pagination--narrow-seven-items')! } };
export const LoadFailure: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-pagination--load-failure')! } };
