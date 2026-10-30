import type { Meta, StoryObj } from '@storybook/react-vite';
import { Calendar } from '@unofficial-krds/react';
const meta = { title: 'KRDS/Calendar', component: Calendar, args: { label: '날짜 선택', referenceDate: '2024-02-15' } } satisfies Meta<typeof Calendar>;
export default meta;
type Story = StoryObj<typeof meta>;
export const SelectedRange: Story = { args: { mode: 'range', defaultValue: { start: '2024-02-12', end: '2024-02-18' }, today: '2024-02-15' } };
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const English: Story = { args: { locale: 'en-US', today: '2024-02-15' } };
