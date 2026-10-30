import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { NativeSelect } from '@unofficial-krds/angular/native-select';
const meta: Meta<NativeSelect> = { title: 'KRDS/Native select', decorators: [moduleMetadata({ imports: [NativeSelect] })],
    render: args => ({ props: args, template: `<krds-native-select [id]="id" [label]="label" [value]="value" [options]="options" [disabled]="disabled" [invalid]="invalid" [hint]="hint" [error]="error" />` }), args: { id: 'story-region', label: '지역', value: 'seoul', options: [{ value: 'seoul', label: '서울' }, { value: 'busan', label: '부산' }, { value: 'disabled', label: '선택 불가', disabled: true }] } };
export default meta;
type Story = StoryObj<NativeSelect>;
export const Controlled: Story = {};
export const Disabled: Story = { args: { disabled: true } };
export const Invalid: Story = { args: { invalid: true, hint: '거주 지역을 선택하세요.', error: '지역을 확인하세요.' } };
