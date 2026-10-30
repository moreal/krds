import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Pilot from './Pilot.svelte';
const meta = { title: 'KRDS/Calendar', component: Pilot } satisfies Meta<typeof Pilot>;
export default meta;
type Story = StoryObj<typeof meta>;
export const SelectedRange: Story = { args: { kind: 'calendar', mode: 'range', value: { start: '2024-02-12', end: '2024-02-18' }, referenceDate: '2024-02-15', today: '2024-02-15' } };
