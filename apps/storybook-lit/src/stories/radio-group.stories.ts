import { LitElement, html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { LocalState } from '../support/local-state.js';
registerKrdsElements(customElements);
/** Native RadioGroup story host: local data, native slots and observable local results. */
class RadioGroupStory extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new LocalState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'radio-group')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        return html `<main lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere"><h1>로컬 RadioGroup 예제</h1><p>비공식 독립 로컬 예제</p><h2>컴포넌트 상태</h2>
      
      <form @submit=${(event: SubmitEvent) => this.local.submit(event)} @reset=${(event: Event) => { if (this.local.host.cancelReset)
            event.preventDefault();
        else
            this.local.reset(); }}><krds-radio-group
        .appearance=${s.appearance ?? 'default'}
        .defaultValue=${s.defaultValue}
        .label=${s.label}
        .name=${s.name}
        .options=${s.options}
        .required=${s.required}
        .size=${s.size ?? 'medium'}
        .value=${s.value}
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
      ></krds-radio-group><button type="submit">제출</button><button type="reset">초기화</button></form>
      <p role="status" aria-label="로컬 작업 결과">${this.local.result}</p>
    </main>`;
    }
}
if (!customElements.get('krds-radio-group-story'))
    customElements.define('krds-radio-group-story', RadioGroupStory);
const meta = { id: 'krds-radio-group', title: 'KRDS/RadioGroup', render: (args: {
        recipe: FullCatalogStoryCase;
    }) => html `<krds-radio-group-story .recipe=${args.recipe}></krds-radio-group-story>` } satisfies Meta<{
    recipe: FullCatalogStoryCase;
}>;
export default meta;
export const Default: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-radio-group--default')! } };
export const Chip: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-radio-group--chip')! } };
export const MediumLarge: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-radio-group--medium-large')! } };
export const UnselectedRequired: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-radio-group--unselected-required')! } };
export const DisabledOption: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-radio-group--disabled-option')! } };
export const FormReset: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-radio-group--form-reset')! } };
export const Controlled: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-radio-group--controlled')! } };
export const AllRadioSequentialAccess: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-radio-group--all-radio-sequential-access')! } };
export const ControlledNull: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-radio-group--controlled-null')! } };
export const ControlledClearRejected: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-radio-group--controlled-clear-rejected')! } };
export const EmptyStringOption: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-radio-group--empty-string-option')! } };
