import { LitElement, html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { LocalState } from '../support/local-state.js';
registerKrdsElements(customElements);
/** Native FileUpload story host: local data, native slots and observable local results. */
class FileUploadStory extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new LocalState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'file-upload')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        return html `<main lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere"><h1>로컬 FileUpload 예제</h1><p>비공식 독립 로컬 예제</p><h2>컴포넌트 상태</h2><p data-krds-host="upload-receipt">${this.local.result}</p>
      
      <form @submit=${(event: SubmitEvent) => this.local.submit(event)} @reset=${(event: Event) => { if (this.local.host.cancelReset)
            event.preventDefault();
        else
            this.local.reset(); }}><krds-file-upload
        .accept=${s.accept}
        .files=${s.files}
        .label=${s.label}
        .maxBytes=${s.maxBytes}
        .maxFiles=${s.maxFiles}
        .multiple=${s.multiple}
        .name=${s.name}
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
        @files-rejected=${(event: CustomEvent) => this.local.accept('files-rejected', event.detail)}
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
      ></krds-file-upload><button type="submit">제출</button><button type="reset">초기화</button></form>
      <p role="status" aria-label="로컬 작업 결과">${this.local.result}</p>
    </main>`;
    }
}
if (!customElements.get('krds-file-upload-story'))
    customElements.define('krds-file-upload-story', FileUploadStory);
const meta = { id: 'krds-file-upload', title: 'KRDS/FileUpload', render: (args: {
        recipe: FullCatalogStoryCase;
    }) => html `<krds-file-upload-story .recipe=${args.recipe}></krds-file-upload-story>` } satisfies Meta<{
    recipe: FullCatalogStoryCase;
}>;
export default meta;
export const Single: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-file-upload--single')! } };
export const Multiple: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-file-upload--multiple')! } };
export const Button: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-file-upload--button')! } };
export const Dropzone: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-file-upload--dropzone')! } };
export const CancelReselect: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-file-upload--cancel-reselect')! } };
export const ConstraintsError: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-file-upload--constraints-error')! } };
export const SubmitMockProgress: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-file-upload--submit-mock-progress')! } };
export const FailureRetry: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-file-upload--failure-retry')! } };
export const FormReset: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-file-upload--form-reset')! } };
export const PickerDropRemoveSubmit: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-file-upload--picker-drop-remove-submit')! } };
export const ControlledAddRejected: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-file-upload--controlled-add-rejected')! } };
export const ControlledRemoveRejected: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-file-upload--controlled-remove-rejected')! } };
export const SingleReplacement: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-file-upload--single-replacement')! } };
export const ControlledResetRetained: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-file-upload--controlled-reset-retained')! } };
export const HostResetClear: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-file-upload--host-reset-clear')! } };
