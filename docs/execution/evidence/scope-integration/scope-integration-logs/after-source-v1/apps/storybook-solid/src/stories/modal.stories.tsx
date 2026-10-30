import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { createSignal } from 'solid-js';
import { Modal, type ModalProps } from '@unofficial-krds/solid';

function LocalModal(args: ModalProps) {
  const [open, setOpen] = createSignal(args.open ?? false);
  return <><button type="button" onClick={() => setOpen(true)}>열기</button><button id="story-modal-next-task" type="button">다음 작업</button><Modal {...args} open={open()} onOpenChange={detail => setOpen(detail.open)} returnFocusId="story-modal-next-task" actions={<button type="button" onClick={() => setOpen(false)}>확인</button>}>{args.children ?? <p>변경 내용을 확인한 후 계속하세요.</p>}</Modal></>;
}
const meta = {
  id: 'krds-modal', title: 'KRDS/Modal', component: Modal,
  args: { title: '확인', description: '이 작업의 내용을 확인하세요.', open: false },
  render: args => <LocalModal {...args} />,
} satisfies Meta<typeof Modal>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {};
export const Open: Story = { args: { open: true } };
export const Error: Story = { args: { open: true, children: <p role="alert">저장하지 못했습니다. 내용을 확인하세요.</p> } };
export const Loading: Story = { args: { open: true, children: <p role="status" aria-busy="true">처리 중입니다.</p> } };
