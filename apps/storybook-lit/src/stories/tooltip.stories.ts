import { LitElement, html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { LocalState } from '../support/local-state.js';
registerKrdsElements(customElements);
/** Native Tooltip story host: local data, native slots and observable local results. */
class TooltipStory extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new LocalState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'tooltip')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        return html `<main lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere"><h1>로컬 Tooltip 예제</h1><p>비공식 독립 로컬 예제</p><h2>컴포넌트 상태</h2>
      
      ${this.local.host.removeTrigger ? '' : html `<krds-tooltip
        .fallbackFocusId=${s.fallbackFocusId ?? this.local.host.fallbackFocusId}
        .defaultOpen=${s.defaultOpen}
        .open=${s.open}
        .placement=${s.placement ?? 'bottom-start'}
        .relationship=${s.relationship ?? 'description'}
        .text=${s.text}
        .textId=${s.textId}
        .touchToggle=${s.touchToggle}
        .triggerId=${s.triggerId}
        .triggerLabel=${s.triggerLabel}
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
      ></krds-tooltip>`}
      <button data-krds-host="outside-action" id=${this.local.host.fallbackFocusId ?? ''} type="button">${this.local.host.fallbackLabel ?? '다른 작업'}</button><p role="status" aria-label="로컬 작업 결과">${this.local.result}</p>
    </main>`;
    }
}
if (!customElements.get('krds-tooltip-story'))
    customElements.define('krds-tooltip-story', TooltipStory);
const meta = { id: 'krds-tooltip', title: 'KRDS/Tooltip', render: (args: {
        recipe: FullCatalogStoryCase;
    }) => html `<krds-tooltip-story .recipe=${args.recipe}></krds-tooltip-story>` } satisfies Meta<{
    recipe: FullCatalogStoryCase;
}>;
export default meta;
export const InformationIcon: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-tooltip--information-icon')! } };
export const IconButton: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-tooltip--icon-button')! } };
export const Vertical: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-tooltip--vertical')! } };
export const Box: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-tooltip--box')! } };
export const TouchToggle: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-tooltip--touch-toggle')! } };
export const EscapeSuppression: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-tooltip--escape-suppression')! } };
export const ViewportEdge: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-tooltip--viewport-edge')! } };
export const RelationshipDescription: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-tooltip--relationship-description')! } };
export const RelationshipLabelClosed: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-tooltip--relationship-label-closed')! } };
export const HoverEscapeReturn: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-tooltip--hover-escape-return')! } };
export const ControlledEscapeRejected: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-tooltip--controlled-escape-rejected')! } };
export const TriggerRemoved: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-tooltip--trigger-removed')! } };
export const ShadowRelationship: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-tooltip--shadow-relationship')! } };
