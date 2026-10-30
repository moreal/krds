import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { DateInput } from '@unofficial-krds/angular/date-input';
const meta: Meta<DateInput> = { title: 'KRDS/Date input', decorators: [moduleMetadata({ imports: [DateInput] })],
    render: args => ({ props: args, template: `<krds-date-input [id]="id" [label]="label" [mode]="mode || 'single'" [value]="value" [referenceDate]="referenceDate" [invalid]="invalid" [error]="error" [disabled]="disabled" />` }), args: { id: 'story-date', label: '날짜', referenceDate: '2024-02-15' } };
export default meta;
type Story = StoryObj<DateInput>;
export const Invalid: Story = { args: { value: null, invalid: true, error: 'YYYY-MM-DD 형식의 올바른 날짜를 입력하세요' } };
export const Single: Story = { args: { value: '2024-02-29' } };
export const Range: Story = { args: { label: '방문 기간', mode: 'range', value: { start: '2024-02-12', end: '2024-02-18' } } };
export const Disabled: Story = { args: { value: '2024-02-29', disabled: true } };
