import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { Calendar } from '@unofficial-krds/angular/calendar';
const meta: Meta<Calendar> = { title: 'KRDS/Calendar', decorators: [moduleMetadata({ imports: [Calendar] })],
    render: args => ({ props: args, template: `<krds-calendar [id]="id" [label]="label" [mode]="mode || 'single'" [value]="value" [referenceDate]="referenceDate" [today]="today" [disabled]="disabled" />` }), args: { id: 'story-calendar', label: '날짜 선택', referenceDate: '2024-02-15', today: '2024-02-15' } };
export default meta;
type Story = StoryObj<Calendar>;
export const SelectedRange: Story = { args: { mode: 'range', value: { start: '2024-02-12', end: '2024-02-18' } } };
export const Single: Story = { args: { value: '2024-02-29' } };
export const Disabled: Story = { args: { value: '2024-02-29', disabled: true } };
