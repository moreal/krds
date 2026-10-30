import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { storyStateCases } from '@unofficial-krds/test-contracts/fixtures';
registerKrdsElements(customElements);
const meta = { id: 'krds-native-select', title: 'KRDS/NativeSelect', render: (args: Record<string, unknown>) => html `<krds-native-select label="지역" .value=${args.value} .options=${args.options}></krds-native-select>` } satisfies Meta;
export default meta;
export const Controlled: StoryObj = { args: storyStateCases.find(story => story.componentId === 'native-select')!.state };
