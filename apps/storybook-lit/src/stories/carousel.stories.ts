import { LitElement, html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { fullCatalogStoryCases, type FullCatalogStoryCase } from '@unofficial-krds/test-contracts';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { LocalState } from '../support/local-state.js';
registerKrdsElements(customElements);
/** Native Carousel story host: local data, native slots and observable local results. */
class CarouselStory extends LitElement {
    static override properties = { recipe: { attribute: false } };
    declare recipe: FullCatalogStoryCase;
    readonly local = new LocalState(this);
    constructor() { super(); this.recipe = fullCatalogStoryCases.find(story => story.componentId === 'carousel')!; }
    override createRenderRoot() { return this; }
    override render() {
        this.local.configure(this.recipe);
        const s = this.local.state;
        return html `<main lang=${this.local.language} @click=${(event: MouseEvent) => this.local.localLink(event)} style="max-inline-size:64rem;margin:auto;padding:1rem;overflow-wrap:anywhere"><h1>로컬 Carousel 예제</h1><p>비공식 독립 로컬 예제</p><h2>컴포넌트 상태</h2>
      
      <krds-carousel
        .autoplay=${s.autoplay}
        .defaultIndex=${s.defaultIndex}
        .index=${s.index}
        .intervalMs=${s.intervalMs ?? 6000}
        .items=${s.items}
        .layout=${s.layout ?? 'single'}
        .loop=${s.loop ?? true}
        .playing=${s.playing}
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
      ></krds-carousel>
      <p role="status" aria-label="로컬 작업 결과">${this.local.result}</p>
    </main>`;
    }
}
if (!customElements.get('krds-carousel-story'))
    customElements.define('krds-carousel-story', CarouselStory);
const meta = { id: 'krds-carousel', title: 'KRDS/Carousel', render: (args: {
        recipe: FullCatalogStoryCase;
    }) => html `<krds-carousel-story .recipe=${args.recipe}></krds-carousel-story>` } satisfies Meta<{
    recipe: FullCatalogStoryCase;
}>;
export default meta;
export const Single: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-carousel--single')! } };
export const Multiple: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-carousel--multiple')! } };
export const Manual: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-carousel--manual')! } };
export const Autoplay: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-carousel--autoplay')! } };
export const PausedOnFocus: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-carousel--paused-on-focus')! } };
export const SingleItem: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-carousel--single-item')! } };
export const NarrowFraction: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-carousel--narrow-fraction')! } };
export const ReducedMotion: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-carousel--reduced-motion')! } };
export const ControlledInhibition: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-carousel--controlled-inhibition')! } };
export const PlayWhileFocusedHovered: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-carousel--play-while-focused-hovered')! } };
export const ControlledStopRejected: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-carousel--controlled-stop-rejected')! } };
export const TimerRequestRejected: StoryObj = { args: { recipe: fullCatalogStoryCases.find(story => story.id === 'krds-carousel--timer-request-rejected')! } };
