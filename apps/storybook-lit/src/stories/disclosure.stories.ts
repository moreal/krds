import { LitElement, html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { LocalState } from '../support/local-state.js';
registerKrdsElements(customElements);
/** Native Disclosure story host: local data, native slots and observable local results. */
class DisclosureStory extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new LocalState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'disclosure')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        return html `<main lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere"><h1>로컬 Disclosure 예제</h1><p>비공식 독립 로컬 예제</p><h2>컴포넌트 상태</h2>
      
      <krds-disclosure
        .content=${html`${s.content}${this.local.host.contentLink ? html`<a href=${this.local.host.contentLink.href}>${this.local.host.contentLink.label}</a>` : ''}`}
        .contentId=${s.contentId}
        
        .label=${s.label}
        .open=${s.open ?? s.disclosureOpen ?? s.defaultOpen ?? false}
        @value-change=${(event: CustomEvent) => this.local.accept('value-change', event.detail)}
        @checked-change=${(event: CustomEvent) => this.local.accept('checked-change', event.detail)}
        @open-change=${(event: CustomEvent) => { if (this.local.host.acceptChanges !== false) this.local.state = { ...this.local.state, disclosureOpen: event.detail.open }; this.local.accept('open-change', event.detail); }}
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
      ><p>추가 안내 본문입니다.</p><a href="/local/details">상세 안내</a></krds-disclosure>
      <p role="status" aria-label="로컬 작업 결과">${this.local.result}</p>
    </main>`;
    }
}
if (!customElements.get('krds-disclosure-story'))
    customElements.define('krds-disclosure-story', DisclosureStory);
const meta = { id: 'krds-disclosure', title: 'KRDS/Disclosure', render: (args: {
        recipe: FullCatalogStoryCase;
    }) => html `<krds-disclosure-story .recipe=${args.recipe}></krds-disclosure-story>` } satisfies Meta<{
    recipe: FullCatalogStoryCase;
}>;
export default meta;
export const Default: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-disclosure--default')! } };
export const InteractiveContent: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-disclosure--interactive-content')! } };
export const ControlledRejected: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-disclosure--controlled-rejected')! } };
export const Narrow: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-disclosure--narrow')! } };
