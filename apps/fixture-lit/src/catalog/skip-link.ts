import { LitElement, html } from 'lit';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { FixtureState } from '../support/fixture-state.js';
registerKrdsElements(customElements);
/** Native SkipLink story host: local data, native slots and observable local results. */
class SkipLinkFixture extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new FixtureState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'skip-link')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        if (this.local.host.mounted === false || this.local.host.routeChange === true)
            return html `<main><p role="status" aria-label="Fixture health">ready</p><button data-krds-host="outside-action" id="route-fallback" type="button">다른 작업</button></main>`;
        return html `<main lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere"><p role="status" aria-label="Fixture health">ready</p><h1>로컬 SkipLink 예제</h1><p>비공식 독립 로컬 예제</p><h2>컴포넌트 상태</h2>
      <krds-skip-link @configuration-error=${(event: CustomEvent) => { this.local.configurationError = event.detail.message; this.requestUpdate(); }}
        .links=${s.links}
        .visibility=${s.visibility ?? 'focus-revealed'}
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
      ></krds-skip-link>      ${this.local.host.removeTarget ? '' : s.links.map((link: any) => html`<section id=${link.targetId} tabindex="-1"><h2>${link.label}</h2><a href="/local/item">본문 링크</a></section>`)}

      ${this.local.configurationError ? html`<p data-krds-host="configuration-error" role="alert">${this.local.configurationError}</p>` : ''}<button data-krds-host="outside-action" type="button">다른 작업</button><p role="status" data-krds-host="result" aria-label="로컬 작업 결과">${this.local.result}</p>
    </main>`;
    }
}
if (!customElements.get('krds-skip-link-fixture'))
    customElements.define('krds-skip-link-fixture', SkipLinkFixture);
