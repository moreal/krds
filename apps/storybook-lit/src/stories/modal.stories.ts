import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { storyStateCases } from '@unofficial-krds/test-contracts/fixtures';
registerKrdsElements(customElements);
const meta = { title: 'KRDS/Modal', render: (args: Record<string, unknown>) => html `<krds-modal .open=${args.open} .title=${args.title} .body=${html `<p>내용을 확인하세요.</p>`}></krds-modal>` } satisfies Meta;
export default meta;
export const Open: StoryObj = { args: storyStateCases.find(story => story.componentId === 'modal')!.state };
