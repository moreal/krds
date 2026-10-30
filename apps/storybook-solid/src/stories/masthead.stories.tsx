import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { CatalogStory } from '../catalog-story';
const meta = { id: 'krds-masthead', title: 'KRDS/masthead', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const DefaultSpecimen: Story = { name: "default-specimen", parameters: { __id: "krds-masthead--default-specimen" }, render: () => <CatalogStory componentId="masthead" caseId="default-specimen"/> };
export const NarrowZoom: Story = { name: "narrow-zoom", parameters: { __id: "krds-masthead--narrow-zoom" }, render: () => <CatalogStory componentId="masthead" caseId="narrow-zoom"/> };
export const PageOrder: Story = { name: "page-order", parameters: { __id: "krds-masthead--page-order" }, render: () => <CatalogStory componentId="masthead" caseId="page-order"/> };
