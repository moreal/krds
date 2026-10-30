import type { Meta, StoryObj } from '@storybook/react-vite';
import { Tabs } from '@unofficial-krds/react';
const meta = { title: 'KRDS/Tabs', component: Tabs, args: { label: '정보', items: [{ value: 'first', label: '첫 번째', panel: '첫 번째 내용' }, { value: 'second', label: '두 번째', panel: <button type="button">패널 작업</button> }, { value: 'third', label: '사용 불가', panel: '숨긴 내용', disabled: true }] } } satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Manual: Story = { args: { activationMode: 'manual' } };
export const Automatic: Story = { args: { activationMode: 'automatic' } };
