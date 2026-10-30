import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { storyStateCases } from '@unofficial-krds/test-contracts/fixtures';
registerKrdsElements(customElements);
const meta = { title: 'KRDS/Calendar', render: (args: Record<string, unknown>) => html `<krds-calendar label="날짜 선택" .mode=${args.mode} .value=${args.value} .referenceDate=${args.referenceDate} .today=${args.today}></krds-calendar>` } satisfies Meta;
export default meta;
export const SelectedRange: StoryObj = { args: storyStateCases.find(story => story.componentId === 'calendar')!.state };
