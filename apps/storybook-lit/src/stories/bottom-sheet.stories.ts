import { LitElement, html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { LocalState } from '../support/local-state.js';
registerKrdsElements(customElements);
/** Native BottomSheet story host: local data, native slots and observable local results. */
class BottomSheetStory extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new LocalState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'bottom-sheet')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        return html `<main lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere"><h1>로컬 BottomSheet 예제</h1><p>비공식 독립 로컬 예제</p><h2>컴포넌트 상태</h2>
      
      <button id=${this.local.host.openerId ?? 'sheet-opener'} type="button" @click=${() => { this.local.state = { ...this.local.state, sheetOpen: true }; this.requestUpdate(); }}>지역 선택 열기</button><output data-krds-host="committed-selection">${this.local.host.selection ?? '서울'}</output><krds-bottom-sheet
        .open=${s.sheetOpen ?? s.open ?? s.defaultOpen ?? false}
        .returnFocusId=${this.local.host.openerId ?? 'sheet-opener'}
        .description=${s.description}
        .dismissOnOutside=${s.dismissOnOutside}
        .title=${s.title}
        .body=${html`<fieldset><legend>지역 선택</legend>${[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }, { value: 'jeju', label: '제주' }].map(region => html`<label><input type="radio" name="local-region" value=${region.value} .checked=${(s.selectionDraft ?? this.local.host.selection ?? 'seoul') === region.value} @change=${() => { this.local.state = { ...this.local.state, selectionDraft: region.value }; this.requestUpdate(); }}>${region.label}</label>`)}</fieldset><button type="button" @click=${() => { this.local.host.selection = s.selectionDraft ?? this.local.host.selection; this.local.state = { ...this.local.state, sheetOpen: false }; this.requestUpdate(); }}>적용</button>`}
        @value-change=${(event: CustomEvent) => this.local.accept('value-change', event.detail)}
        @checked-change=${(event: CustomEvent) => this.local.accept('checked-change', event.detail)}
        @open-change=${(event: CustomEvent) => { this.local.state = { ...this.local.state, sheetOpen: event.detail.open, ...(event.detail.open ? {} : { selectionDraft: this.local.host.selection }) }; this.local.accept('open-change', event.detail); }}
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
      ></krds-bottom-sheet>
      <p role="status" aria-label="로컬 작업 결과">${this.local.result}</p>
    </main>`;
    }
}
if (!customElements.get('krds-bottom-sheet-story'))
    customElements.define('krds-bottom-sheet-story', BottomSheetStory);
const meta = { id: 'krds-bottom-sheet', title: 'KRDS/BottomSheet', render: (args: {
        recipe: FullCatalogStoryCase;
    }) => html `<krds-bottom-sheet-story .recipe=${args.recipe}></krds-bottom-sheet-story>` } satisfies Meta<{
    recipe: FullCatalogStoryCase;
}>;
export default meta;
export const Modal: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-bottom-sheet--modal')! } };
export const ShortContent: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-bottom-sheet--short-content')! } };
export const SelectCancel: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-bottom-sheet--select-cancel')! } };
export const DragClose: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-bottom-sheet--drag-close')! } };
export const NarrowKeyboard: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-bottom-sheet--narrow-keyboard')! } };
export const RemovedOpener: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-bottom-sheet--removed-opener')! } };
export const ReducedMotion: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-bottom-sheet--reduced-motion')! } };
