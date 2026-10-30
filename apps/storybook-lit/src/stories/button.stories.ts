import { html } from 'lit';
import type { Meta, StoryObj } from '@storybook/web-components-vite';
import { registerKrdsElements } from '@unofficial-krds/lit';
import { storyStateCases } from '@unofficial-krds/test-contracts/fixtures';
registerKrdsElements(customElements);
const meta = { title: 'KRDS/Button', render: (args: {
        disabled: boolean;
        label: string;
    }) => html `<krds-button .disabled=${args.disabled}>${args.label}</krds-button>` } satisfies Meta<{
    disabled: boolean;
    label: string;
}>;
export default meta;
export const Disabled: StoryObj = { args: storyStateCases.find(story => story.componentId === 'button')!.state };
