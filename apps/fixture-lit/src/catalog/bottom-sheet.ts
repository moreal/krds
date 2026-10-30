import { LitElement, html } from 'lit';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { FixtureState } from '../support/fixture-state.js';
registerKrdsElements(customElements);
/** Native BottomSheet story host: local data, native slots and observable local results. */
class BottomSheetFixture extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new FixtureState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'bottom-sheet')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        if (this.local.host.mounted === false || this.local.host.routeChange === true)
            return html `<main><p role="status" aria-label="Fixture health">ready</p><button data-krds-host="outside-action" id="route-fallback" type="button">다른 작업</button></main>`;
        return html `<main lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere"><p role="status" aria-label="Fixture health">ready</p><h1>로컬 BottomSheet 예제</h1><p>비공식 독립 로컬 예제</p><h2>컴포넌트 상태</h2>
      
      <button id=${this.local.host.openerId ?? 'sheet-opener'} type="button" @click=${() => { this.local.state = { ...this.local.state, sheetOpen: true }; this.requestUpdate(); }}>지역 선택 열기</button><output data-krds-host="committed-selection">${this.local.host.selection ?? '서울'}</output><krds-bottom-sheet
        .open=${s.sheetOpen ?? s.open ?? s.defaultOpen ?? false}
        .returnFocusId=${this.local.host.openerId ?? 'sheet-opener'}
        .description=${s.description}
        .dismissOnOutside=${s.dismissOnOutside}
        .title=${s.title}
        .body=${html`<fieldset><legend>지역 선택</legend>${[{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }, { value: 'jeju', label: '제주' }].map(region => html`<label><input type="radio" name="local-region" value=${region.value} .checked=${(s.selectionDraft ?? this.local.host.selection ?? 'seoul') === region.value} @change=${() => { this.local.state = { ...this.local.state, selectionDraft: region.value }; this.requestUpdate(); }}>${region.label}</label>`)}</fieldset><button type="button" @click=${() => { this.local.host.selection = s.selectionDraft ?? this.local.host.selection; this.local.state = { ...this.local.state, sheetOpen: false }; this.requestUpdate(); }}>적용</button>`}
        @icon-action=${(event: CustomEvent) => this.local.accept('icon-action', event.detail)}
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
      ${this.local.configurationError ? html`<p data-krds-host="configuration-error" role="alert">${this.local.configurationError}</p>` : ''}<button data-krds-host="outside-action" type="button">다른 작업</button><p role="status" data-krds-host="result" aria-label="로컬 작업 결과">${this.local.result}</p>
    </main>`;
    }
}
if (!customElements.get('krds-bottom-sheet-fixture'))
    customElements.define('krds-bottom-sheet-fixture', BottomSheetFixture);
