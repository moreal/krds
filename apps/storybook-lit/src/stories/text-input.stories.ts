import { LitElement, html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { LocalState } from '../support/local-state.js';
registerKrdsElements(customElements);
/** Native TextInput story host: local data, native slots and observable local results. */
class TextInputStory extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new LocalState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'text-input')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        return html `<main lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere"><h1>로컬 TextInput 예제</h1><p>비공식 독립 로컬 예제</p><h2>컴포넌트 상태</h2>
      
      <form @submit=${(event: SubmitEvent) => this.local.submit(event)} @reset=${(event: Event) => { if (this.local.host.cancelReset)
            event.preventDefault();
        else
            this.local.reset(); }}><krds-text-input
        .error=${s.invalid || s.status === 'error' ? this.local.host.errorText ?? '' : ''}
        .hint=${this.local.host.helpText ?? ''}
        .autocomplete=${s.autocomplete}
        .defaultValue=${s.defaultValue}
        .errorId=${s.errorId}
        .iconAction=${s.iconAction ? { ...s.iconAction, onAction: () => { this.local.result = '입력 도움말을 열었습니다.'; this.requestUpdate(); } } : undefined}
        .label=${s.label}
        .name=${s.name}
        .readOnly=${s.readOnly}
        .size=${s.size ?? 'medium'}
        .status=${s.status}
        .type=${s.type ?? 'text'}
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
      ></krds-text-input>${this.local.host.samples?.map((sample: any, index: number) => html`<krds-text-input .label=${`${s.label} ${sample.disabled ? '비활성' : '읽기 전용'}`} .name=${`${s.name}-sample-${index}`} .disabled=${!!sample.disabled} .readOnly=${!!sample.readOnly} .value=${s.value ?? s.defaultValue ?? '예제 값'} .size=${s.size ?? 'medium'}></krds-text-input>`)}<button type="submit">제출</button><button type="reset">초기화</button></form>
      <p role="status" aria-label="로컬 작업 결과">${this.local.result}</p>
    </main>`;
    }
}
if (!customElements.get('krds-text-input-story'))
    customElements.define('krds-text-input-story', TextInputStory);
const meta = { id: 'krds-text-input', title: 'KRDS/TextInput', render: (args: {
        recipe: FullCatalogStoryCase;
    }) => html `<krds-text-input-story .recipe=${args.recipe}></krds-text-input-story>` } satisfies Meta<{
    recipe: FullCatalogStoryCase;
}>;
export default meta;
export const Default: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-text-input--default')! } };
export const Error: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-text-input--error')! } };
export const Success: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-text-input--success')! } };
export const Sizes: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-text-input--sizes')! } };
export const IconAction: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-text-input--icon-action')! } };
export const DisabledReadonly: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-text-input--disabled-readonly')! } };
export const Ime: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-text-input--ime')! } };
export const FormReset: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-text-input--form-reset')! } };
