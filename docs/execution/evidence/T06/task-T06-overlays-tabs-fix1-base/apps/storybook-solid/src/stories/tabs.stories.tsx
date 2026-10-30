import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { Tabs } from '@krds-native/solid';

const items = [
  { value: 'first', label: '첫 번째', content: <p>첫 번째 정보입니다.</p> },
  { value: 'second', label: '두 번째', content: <p>두 번째 정보입니다.</p> },
];
const meta = {
  id: 'krds-tabs', title: 'KRDS/Tabs', component: Tabs,
  args: { label: '정보', items, activationMode: 'manual' },
} satisfies Meta<typeof Tabs>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Manual: Story = { args: { activationMode: 'manual' } };
export const Selected: Story = { args: { defaultValue: 'second' } };
export const Disabled: Story = { args: { items: [...items, { value: 'disabled', label: '비활성', content: <p>사용할 수 없는 정보입니다.</p>, disabled: true }] } };
export const Automatic: Story = { args: { activationMode: 'automatic' } };
export const Controlled: Story = { render: args => { const [value, setValue] = createSignal('first'); return <Tabs {...args} value={value()} onValueChange={detail => setValue(detail.value)} />; } };
