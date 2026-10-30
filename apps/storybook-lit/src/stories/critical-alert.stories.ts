import { LitElement, html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { LocalState } from '../support/local-state.js';
registerKrdsElements(customElements);
/** Native CriticalAlert story host: local data, native slots and observable local results. */
class CriticalAlertStory extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new LocalState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'critical-alert')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        return html `<div lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere"><p data-krds-host="specimen">비공식 독립 로컬 예제</p>
      
      <krds-critical-alert
        .details=${s.details}
        .label=${s.label}
        .message=${s.message}
        .urgency=${s.urgency}
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
      ></krds-critical-alert><main><h1>로컬 CriticalAlert 예제</h1><h2>컴포넌트 상태</h2>
      <p role="status" aria-label="로컬 작업 결과">${this.local.result}</p>
    </main></div>`;
    }
}
if (!customElements.get('krds-critical-alert-story'))
    customElements.define('krds-critical-alert-story', CriticalAlertStory);
const meta = { id: 'krds-critical-alert', title: 'KRDS/CriticalAlert', render: (args: {
        recipe: FullCatalogStoryCase;
    }) => html `<krds-critical-alert-story .recipe=${args.recipe}></krds-critical-alert-story>` } satisfies Meta<{
    recipe: FullCatalogStoryCase;
}>;
export default meta;
export const HighUrgency: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-critical-alert--high-urgency')! } };
export const MediumUrgency: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-critical-alert--medium-urgency')! } };
export const LowUrgency: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-critical-alert--low-urgency')! } };
export const Narrow: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-critical-alert--narrow')! } };
export const PagePlacement: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-critical-alert--page-placement')! } };
