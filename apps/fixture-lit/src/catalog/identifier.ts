import { LitElement, html } from 'lit';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { FixtureState } from '../support/fixture-state.js';
registerKrdsElements(customElements);
/** Native Identifier story host: local data, native slots and observable local results. */
class IdentifierFixture extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new FixtureState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'identifier')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        if (this.local.host.mounted === false || this.local.host.routeChange === true)
            return html `<main><p role="status" aria-label="Fixture health">ready</p><button data-krds-host="outside-action" id="route-fallback" type="button">다른 작업</button></main>`;
        return html `<div lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere"><p role="status" aria-label="Fixture health">ready</p><h1>로컬 Identifier 예제</h1><p>비공식 독립 로컬 예제</p><h2>컴포넌트 상태</h2>
      
      <krds-footer .serviceLogo=${{ src: '/local-assets/service-logo.svg', alt: '독립 로컬 서비스' }} .privacyPolicy=${{ href: '/local/privacy', label: '개인정보 처리방침' }} .contacts=${[]} .utilityLinks=${[]} .policyLinks=${[]} .copyrightText=${'로컬 예제'} .institution=${s}></krds-footer>
      ${this.local.configurationError ? html`<p data-krds-host="configuration-error" role="alert">${this.local.configurationError}</p>` : ''}<button data-krds-host="outside-action" type="button">다른 작업</button><p role="status" data-krds-host="result" aria-label="로컬 작업 결과">${this.local.result}</p>
    </div>`;
    }
}
if (!customElements.get('krds-identifier-fixture'))
    customElements.define('krds-identifier-fixture', IdentifierFixture);
