import type { Meta, StoryObj } from '@storybook/react-vite';
import { CatalogExample } from '../CatalogExample';
const meta = { id: 'krds-disclosure', title: 'KRDS/Disclosure', component: CatalogExample } satisfies Meta<typeof CatalogExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: {"componentId": "disclosure", "initialState": {"label": "신청 도움말", "contentId": "application-help", "defaultOpen": false, "content": "신청서를 작성하는 방법입니다."}, "host": {"localOnly": true, "acceptChanges": true, "contentLink": null}} };
export const InteractiveContent: Story = { args: {"componentId": "disclosure", "initialState": {"label": "신청 도움말", "contentId": "application-help", "defaultOpen": false, "content": "신청서를 작성하는 방법입니다."}, "host": {"localOnly": true, "acceptChanges": true, "contentLink": {"href": "/local/help", "label": "상세 도움말"}}} };
export const ControlledRejected: Story = { args: {"componentId": "disclosure", "initialState": {"label": "신청 도움말", "contentId": "application-help", "content": "신청서를 작성하는 방법입니다.", "open": false}, "host": {"localOnly": true, "acceptChanges": false, "contentLink": null}} };
export const Narrow: Story = { args: {"componentId": "disclosure", "initialState": {"label": "신청 도움말", "contentId": "application-help", "defaultOpen": false, "content": "신청서를 작성하는 방법입니다."}, "host": {"localOnly": true, "acceptChanges": true, "contentLink": null}} };
