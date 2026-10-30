import { LitElement, html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { LocalState } from '../support/local-state.js';
registerKrdsElements(customElements);
/** Native Textarea story host: local data, native slots and observable local results. */
class TextareaStory extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new LocalState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'textarea')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        return html `<main lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere"><h1>로컬 Textarea 예제</h1><p>비공식 독립 로컬 예제</p><h2>컴포넌트 상태</h2>
      
      <form @submit=${(event: SubmitEvent) => this.local.submit(event)} @reset=${(event: Event) => { if (this.local.host.cancelReset)
            event.preventDefault();
        else
            this.local.reset(); }}><krds-textarea
        .error=${s.invalid || s.status === 'error' ? this.local.host.errorText ?? '' : ''}
        .hint=${this.local.host.helpText ?? ''}
        .defaultValue=${s.defaultValue}
        .disabled=${s.disabled}
        .errorId=${s.errorId}
        .invalid=${s.invalid}
        .label=${s.label}
        .maxLength=${s.maxLength}
        .name=${s.name}
        .readOnly=${s.readOnly}
        .rows=${s.rows ?? 5}
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
      ></krds-textarea><button type="submit">제출</button><button type="reset">초기화</button></form>
      <p role="status" aria-label="로컬 작업 결과">${this.local.result}</p>
    </main>`;
    }
}
if (!customElements.get('krds-textarea-story'))
    customElements.define('krds-textarea-story', TextareaStory);
const meta = { id: 'krds-textarea', title: 'KRDS/Textarea', render: (args: {
        recipe: FullCatalogStoryCase;
    }) => html `<krds-textarea-story .recipe=${args.recipe}></krds-textarea-story>` } satisfies Meta<{
    recipe: FullCatalogStoryCase;
}>;
export default meta;
export const Default: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-textarea--default')! } };
export const Limited: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-textarea--limited')! } };
export const Invalid: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-textarea--invalid')! } };
export const Disabled: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-textarea--disabled')! } };
export const Readonly: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-textarea--readonly')! } };
export const LongValue: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-textarea--long-value')! } };
export const Ime: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-textarea--ime')! } };
export const FormReset: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-textarea--form-reset')! } };
