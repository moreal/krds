import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { CatalogStory } from '../catalog-story';
const meta = { id: 'krds-disclosure', title: 'KRDS/disclosure', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { name: "default", parameters: { __id: "krds-disclosure--default" }, render: () => <CatalogStory componentId="disclosure" caseId="default"/> };
export const InteractiveContent: Story = { name: "interactive-content", parameters: { __id: "krds-disclosure--interactive-content" }, render: () => <CatalogStory componentId="disclosure" caseId="interactive-content"/> };
export const ControlledRejected: Story = { name: "controlled-rejected", parameters: { __id: "krds-disclosure--controlled-rejected" }, render: () => <CatalogStory componentId="disclosure" caseId="controlled-rejected"/> };
export const Narrow: Story = { name: "narrow", parameters: { __id: "krds-disclosure--narrow" }, render: () => <CatalogStory componentId="disclosure" caseId="narrow"/> };
