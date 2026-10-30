import { LitElement, html } from 'lit';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { FixtureState } from '../support/fixture-state.js';
registerKrdsElements(customElements);
/** Native BackButton story host: local data, native slots and observable local results. */
class BackButtonFixture extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new FixtureState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'back-button')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        if (this.local.host.mounted === false || this.local.host.routeChange === true)
            return html `<main><p role="status" aria-label="Fixture health">ready</p><button data-krds-host="outside-action" id="route-fallback" type="button">다른 작업</button></main>`;
        return html `<main lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere"><p role="status" aria-label="Fixture health">ready</p><h1>로컬 BackButton 예제</h1><p>비공식 독립 로컬 예제</p><h2>컴포넌트 상태</h2><dialog data-krds-host="back-confirmation" aria-labelledby="back-confirm-title" aria-describedby="back-confirm-description" @cancel=${(event: Event) => { event.preventDefault(); this.local.answerBack(false); }}><h2 id="back-confirm-title">작성 중인 내용이 있습니다</h2><p id="back-confirm-description">이전 화면으로 이동하면 입력 내용이 사라질 수 있습니다.</p><button type="button" @click=${() => this.local.answerBack(false)}>취소</button><button type="button" @click=${() => this.local.answerBack(true)}>확인</button></dialog><label>보존할 신청 내용<input data-krds-host="dirty-input"></label><p data-krds-host="route">${this.local.route}</p><button type="button" @click=${() => this.local.browserBack()}>브라우저 뒤로가기 모의</button>
      
      <krds-back-button
        .canGoBack=${s.canGoBack}
        .dirty=${s.dirty}
        .fallbackHref=${s.fallbackHref}
        .label=${s.label}
        .requestConfirmation=${() => this.local.confirmBack()}
        @icon-action=${(event: CustomEvent) => this.local.accept('icon-action', event.detail)}
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
      ></krds-back-button>
      ${this.local.configurationError ? html`<p data-krds-host="configuration-error" role="alert">${this.local.configurationError}</p>` : ''}<button data-krds-host="outside-action" type="button">다른 작업</button><p role="status" data-krds-host="result" aria-label="로컬 작업 결과">${this.local.result}</p>
    </main>`;
    }
}
if (!customElements.get('krds-back-button-fixture'))
    customElements.define('krds-back-button-fixture', BackButtonFixture);
