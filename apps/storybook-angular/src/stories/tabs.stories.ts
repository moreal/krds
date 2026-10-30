import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { Tabs } from '@unofficial-krds/angular/tabs';
const meta: Meta<Tabs> = { title: 'KRDS/Tabs', decorators: [moduleMetadata({ imports: [Tabs] })],
    render: args => ({ props: args, template: `<krds-tabs [id]="id" [label]="label" [value]="value" [items]="items" [activationMode]="activationMode" [orientation]="orientation || 'horizontal'" />` }), args: { id: 'story-tabs', label: '주제', value: 'first', activationMode: 'manual', items: [{ value: 'first', label: '첫 번째', panel: '첫 번째 내용' }, { value: 'second', label: '두 번째', panel: '두 번째 내용' }, { value: 'third', label: '사용 불가', disabled: true, panel: '사용 불가 내용' }] } };
export default meta;
type Story = StoryObj<Tabs>;
export const Manual: Story = {};
export const Automatic: Story = { args: { activationMode: 'automatic' } };

export const Vertical: Story = { args: { orientation: 'vertical' } };
