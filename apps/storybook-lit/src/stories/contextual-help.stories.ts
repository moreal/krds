import { LitElement, html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { LocalState } from '../support/local-state.js';
registerKrdsElements(customElements);
/** Native ContextualHelp story host: local data, native slots and observable local results. */
class ContextualHelpStory extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new LocalState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'contextual-help')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        return html `<main lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere"><h1>로컬 ContextualHelp 예제</h1><p>비공식 독립 로컬 예제</p><h2>컴포넌트 상태</h2>
      
      ${this.local.host.removeTrigger ? '' : html `<krds-contextual-help
        .content=${html `<p>${s.content}</p>${this.local.host.relatedLink ? html `<a href=${this.local.host.relatedLink.href}>${this.local.host.relatedLink.label}</a>` : ''}`}
        .fallbackFocusId=${s.fallbackFocusId ?? this.local.host.fallbackFocusId}
        .defaultOpen=${s.defaultOpen}
        .open=${s.open}
        .placement=${s.placement ?? 'bottom-start'}
        .title=${s.title}
        .triggerLabel=${s.triggerLabel}
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
      ></krds-contextual-help>`}
      <button data-krds-host="outside-action" style=${this.local.host.removeTrigger ? '' : 'margin-block-start:28rem'} id=${this.local.host.fallbackFocusId ?? ''} type="button">${this.local.host.fallbackLabel ?? '다른 작업'}</button><p role="status" aria-label="로컬 작업 결과">${this.local.result}</p>
    </main>`;
    }
}
if (!customElements.get('krds-contextual-help-story'))
    customElements.define('krds-contextual-help-story', ContextualHelpStory);
const meta = { id: 'krds-contextual-help', title: 'KRDS/ContextualHelp', render: (args: {
        recipe: FullCatalogStoryCase;
    }) => html `<krds-contextual-help-story .recipe=${args.recipe}></krds-contextual-help-story>` } satisfies Meta<{
    recipe: FullCatalogStoryCase;
}>;
export default meta;
export const Information: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-contextual-help--information')! } };
export const Help: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-contextual-help--help')! } };
export const SixPlacements: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-contextual-help--six-placements')! } };
export const InteractiveLink: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-contextual-help--interactive-link')! } };
export const NarrowEdge: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-contextual-help--narrow-edge')! } };
export const RemovedTrigger: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-contextual-help--removed-trigger')! } };
export const ControlledRejected: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-contextual-help--controlled-rejected')! } };
