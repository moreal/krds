import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { NativeSelect } from '@krds-native/solid';

const options = [{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }, { value: 'unavailable', label: '선택할 수 없는 지역', disabled: true }];
const meta = {
  id: 'krds-native-select',
  title: 'KRDS/NativeSelect',
  component: NativeSelect,
  args: { options, label: '지역', name: 'region', size: 'medium' },
} satisfies Meta<typeof NativeSelect>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = { args: { defaultValue: 'seoul' } };
export const Controlled: Story = {
  args: { value: 'seoul', options: [{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }] },
  render: args => {
    const [value, setValue] = createSignal(args.value ?? 'seoul');
    return <NativeSelect {...args} value={value()} onValueChange={details => setValue(details.value)} />;
  },
};
export const RejectedChange: Story = { args: { value: 'seoul', hint: '현재 지역은 서울로 고정되어 있습니다.' } };
export const Selected: Story = { args: { defaultValue: 'busan' } };
export const Disabled: Story = { args: { disabled: true, defaultValue: 'seoul' } };
export const Invalid: Story = { args: { options: [{ value: '', label: '지역 선택' }, ...options], defaultValue: '', required: true, invalid: true, hint: '거주 중인 지역을 선택하세요.', error: '지역을 선택하세요.' } };
export const FormReset: Story = {
  args: { defaultValue: 'seoul' },
  render: args => <form><NativeSelect {...args} /><button type="reset">초기화</button></form>,
};
