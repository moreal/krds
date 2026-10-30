import { LitElement, html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { LocalState } from '../support/local-state.js';
registerKrdsElements(customElements);
/** Native Identifier story host: local data, native slots and observable local results. */
class IdentifierStory extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new LocalState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'identifier')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        return html `<div lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere"><h1>로컬 Identifier 예제</h1><p>비공식 독립 로컬 예제</p><h2>컴포넌트 상태</h2>
      
      <krds-footer .serviceLogo=${{ src: '/local-assets/service-logo.svg', alt: '독립 로컬 서비스' }} .privacyPolicy=${{ href: '/local/privacy', label: '개인정보 처리방침' }} .contacts=${[]} .utilityLinks=${[]} .policyLinks=${[]} .copyrightText=${'로컬 예제'} .institution=${s}></krds-footer>
      <p role="status" aria-label="로컬 작업 결과">${this.local.result}</p>
    </div>`;
    }
}
if (!customElements.get('krds-identifier-story'))
    customElements.define('krds-identifier-story', IdentifierStory);
const meta = { id: 'krds-identifier', title: 'KRDS/Identifier', render: (args: {
        recipe: FullCatalogStoryCase;
    }) => html `<krds-identifier-story .recipe=${args.recipe}></krds-identifier-story>` } satisfies Meta<{
    recipe: FullCatalogStoryCase;
}>;
export default meta;
export const Light: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-identifier--light')! } };
export const Dark: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-identifier--dark')! } };
export const FooterPlacement: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-identifier--footer-placement')! } };
