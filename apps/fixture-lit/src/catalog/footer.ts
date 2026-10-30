import { LitElement, html } from 'lit';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { FixtureState } from '../support/fixture-state.js';
registerKrdsElements(customElements);
/** Native Footer story host: local data, native slots and observable local results. */
class FooterFixture extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new FixtureState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'footer')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        if (this.local.host.mounted === false || this.local.host.routeChange === true)
            return html `<main><p role="status" aria-label="Fixture health">ready</p><button data-krds-host="outside-action" id="route-fallback" type="button">다른 작업</button></main>`;
        return html `<div lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;min-block-size:100dvh;display:flex;flex-direction:column;padding:1rem;overflow-wrap:anywhere"><p role="status" aria-label="Fixture health">ready</p><h1>로컬 Footer 예제</h1><p>비공식 독립 로컬 예제</p><h2>컴포넌트 상태</h2>
      
<main style="flex:1">
      ${this.local.configurationError ? html`<p data-krds-host="configuration-error" role="alert">${this.local.configurationError}</p>` : ''}<button data-krds-host="outside-action" type="button">다른 작업</button><p role="status" data-krds-host="result" aria-label="로컬 작업 결과">${this.local.result}</p>
</main>      <krds-footer style="margin-block-start:auto"
        .institution=${s.institution}
        .contacts=${s.contacts}
        .copyrightText=${s.copyrightText}
        .policyLinks=${s.policyLinks}
        .privacyPolicy=${s.privacyPolicy}
        .serviceLogo=${s.serviceLogo}
        .utilityLinks=${s.utilityLinks}
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
      ></krds-footer>
    </div>`;
    }
}
if (!customElements.get('krds-footer-fixture'))
    customElements.define('krds-footer-fixture', FooterFixture);
