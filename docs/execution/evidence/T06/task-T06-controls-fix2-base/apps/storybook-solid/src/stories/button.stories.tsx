import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { Button } from '@krds-native/solid';

const meta = {
  id: 'krds-button',
  title: 'KRDS/Button',
  component: Button,
  args: { children: '저장', variant: 'primary', size: 'medium' },
} satisfies Meta<typeof Button>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Tertiary: Story = { args: { variant: 'tertiary' } };
export const Text: Story = { args: { variant: 'text', children: '자세히 보기' } };
export const Icon: Story = { args: { variant: 'icon', 'aria-label': '닫기', children: <span aria-hidden="true">×</span> } };
export const Loading: Story = {
  args: { disabled: true, children: '저장 중' },
  parameters: { docs: { description: { story: '요청을 소유한 화면이 진행 중인 작업의 버튼을 비활성화합니다.' } } },
};
export const LocalAction: Story = {
  render: args => {
    const [count, setCount] = createSignal(0);
    return <div><Button {...args} onClick={() => setCount(value => value + 1)} /> <output aria-label="실행 횟수">{count()}</output></div>;
  },
};
