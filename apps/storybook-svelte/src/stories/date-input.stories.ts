import type { Meta, StoryObj } from '@storybook/svelte-vite';
import Pilot from './Pilot.svelte';
const meta = { title: 'KRDS/Date input', component: Pilot } satisfies Meta<typeof Pilot>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Invalid: Story = { args: { kind: 'date-input', invalid: true, errorMessage: 'YYYY-MM-DD 형식의 올바른 날짜를 입력하세요' } };
