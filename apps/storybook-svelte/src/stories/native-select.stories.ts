import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Pilot from './Pilot.svelte';
const meta = { title: 'KRDS/Native select', component: Pilot } satisfies Meta<typeof Pilot>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Controlled: Story = { args: { kind: 'native-select', value: 'seoul' } };
