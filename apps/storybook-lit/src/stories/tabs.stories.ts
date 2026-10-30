import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { storyStateCases } from '@unofficial-krds/test-contracts/fixtures';
registerKrdsElements(customElements);
const meta = { title: 'KRDS/Tabs', render: (args: Record<string, unknown>) => html `<krds-tabs label="작업" .value=${args.value} .activationMode=${args.activationMode} .items=${[{ value: 'first', label: '첫 번째', content: '첫 번째 내용' }, { value: 'second', label: '두 번째', content: '두 번째 내용' }]}></krds-tabs>` } satisfies Meta;
export default meta;
export const Manual: StoryObj = { args: storyStateCases.find(story => story.componentId === 'tabs')!.state };
