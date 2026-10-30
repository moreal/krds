import type { Meta, StoryObj } from '@storybook/react-vite';
import { CatalogExample } from '../CatalogExample';
const meta = { id: 'krds-masthead', title: 'KRDS/Masthead', component: CatalogExample } satisfies Meta<typeof CatalogExample>;
export default meta;
type Story = StoryObj<typeof meta>;
export const DefaultSpecimen: Story = { args: {"componentId": "masthead", "initialState": {"governmentService": true}, "host": {"localOnly": true, "acceptChanges": true, "specimenLabel": "공식 정부서비스를 가정한 배너 UI 예시입니다. 실제 공식 정부서비스가 아닙니다.", "authorizedGovernmentHost": false}} };
export const NarrowZoom: Story = { args: {"componentId": "masthead", "initialState": {"governmentService": true}, "host": {"localOnly": true, "acceptChanges": true, "textZoomPercent": 200, "authorizedGovernmentHost": false, "specimenLabel": "공식 정부서비스를 가정한 배너 UI 예시입니다. 실제 공식 정부서비스가 아닙니다."}} };
export const PageOrder: Story = { args: {"componentId": "masthead", "initialState": {"governmentService": true}, "host": {"localOnly": true, "acceptChanges": true, "pageOrder": ["skip-link", "masthead", "header", "main-content"], "authorizedGovernmentHost": false, "specimenLabel": "공식 정부서비스를 가정한 배너 UI 예시입니다. 실제 공식 정부서비스가 아닙니다."}} };
