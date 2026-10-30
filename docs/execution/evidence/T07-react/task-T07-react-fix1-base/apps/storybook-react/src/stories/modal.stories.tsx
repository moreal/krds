import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button, Modal } from '@unofficial-krds/react';
const meta = { title: 'KRDS/Modal', component: Modal, args: { title: '확인', children: '선택 내용을 확인하세요.' } } satisfies Meta<typeof Modal>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Open: Story = { args: { defaultOpen: true } };
export const Trigger: Story = { args: { trigger: <Button>열기</Button>, description: '작업 결과를 확인합니다.' } };
