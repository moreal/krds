import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { CatalogStory } from '../catalog-story';
const meta = { id: 'krds-favicon', title: 'KRDS/favicon', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const StandardLocalHead: Story = { name: "standard-local-head", parameters: { __id: "krds-favicon--standard-local-head" }, render: () => <CatalogStory componentId="favicon" caseId="standard-local-head"/> };
export const ExtendedLocalHead: Story = { name: "extended-local-head", parameters: { __id: "krds-favicon--extended-local-head" }, render: () => <CatalogStory componentId="favicon" caseId="extended-local-head"/> };
export const LightDarkPreview: Story = { name: "light-dark-preview", parameters: { __id: "krds-favicon--light-dark-preview" }, render: () => <CatalogStory componentId="favicon" caseId="light-dark-preview"/> };
