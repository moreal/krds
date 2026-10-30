import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Pilot from './Pilot.svelte';
const meta = { title: 'KRDS/Button', component: Pilot } satisfies Meta<typeof Pilot>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Disabled: Story = { args: { kind: 'button', disabled: true } };
export const Sizes: Story = { args: { kind: 'sizes' } };
