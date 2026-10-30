import { moduleMetadata, type Meta, type StoryObj } from '@storybook/angular';
import { Modal } from '@unofficial-krds/angular/modal';
const meta: Meta<Modal> = { title: 'KRDS/Modal', decorators: [moduleMetadata({ imports: [Modal] })],
    render: args => ({ props: args, template: `<krds-modal [id]="id" [title]="title" [description]="description" [open]="open"><p>선택한 내용을 확인하세요.</p></krds-modal>` }), args: { id: 'story-modal', title: '확인', description: '선택한 내용을 확인하세요.', open: true } };
export default meta;
type Story = StoryObj<Modal>;
export const Open: Story = {};
