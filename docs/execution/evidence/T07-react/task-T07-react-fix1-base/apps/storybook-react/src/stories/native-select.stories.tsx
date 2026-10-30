import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { NativeSelect } from '@unofficial-krds/react';
const meta = { title: 'KRDS/Native select', component: NativeSelect, args: { label: '지역', options: [{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }] } } satisfies Meta<typeof NativeSelect>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Controlled: Story = { render: args => { const [value, setValue] = useState('seoul'); return <NativeSelect {...args} value={value} onValueChange={detail => setValue(detail.value)} />; } };
export const Invalid: Story = { args: { invalid: true, error: '지역을 선택하세요', hint: '방문할 지역' } };
export const Disabled: Story = { args: { disabled: true } };
