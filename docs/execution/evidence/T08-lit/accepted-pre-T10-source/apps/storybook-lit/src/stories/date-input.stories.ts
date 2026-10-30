import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { storyStateCases } from '@unofficial-krds/test-contracts/fixtures';
registerKrdsElements(customElements);
const meta = { id: 'krds-date-input', title: 'KRDS/DateInput', render: (args: Record<string, unknown>) => html `<krds-date-input label="날짜" .value=${args.value} .invalid=${args.invalid} .error=${args.errorMessage}></krds-date-input>` } satisfies Meta;
export default meta;
export const Invalid: StoryObj = { args: storyStateCases.find(story => story.componentId === 'date-input')!.state };
