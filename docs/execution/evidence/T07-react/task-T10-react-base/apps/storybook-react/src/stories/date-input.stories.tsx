import type { Meta, StoryObj } from '@storybook/react-vite';
import { DateInput } from '@unofficial-krds/react';
const meta = { title: 'KRDS/Date input', component: DateInput, args: { label: '날짜', referenceDate: '2024-02-15' } } satisfies Meta<typeof DateInput>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Invalid: Story = { args: { invalid: true, error: 'YYYY-MM-DD 형식의 올바른 날짜를 입력하세요' } };
export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Range: Story = { args: { mode: 'range', defaultValue: { start: '2024-02-12', end: '2024-02-18' } } };
