import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Pilot from './Pilot.svelte';
const meta = { title: 'KRDS/Modal', component: Pilot } satisfies Meta<typeof Pilot>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Open: Story = { args: { kind: 'modal', open: true } };
