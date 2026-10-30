import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import { CatalogStory } from '../catalog-story';
const meta = { id: 'krds-identifier', title: 'KRDS/identifier', parameters: { layout: 'padded' } } satisfies Meta;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = { name: "light", parameters: { __id: "krds-identifier--light" }, render: () => <CatalogStory componentId="identifier" caseId="light"/> };
export const Dark: Story = { name: "dark", parameters: { __id: "krds-identifier--dark" }, render: () => <CatalogStory componentId="identifier" caseId="dark"/> };
export const FooterPlacement: Story = { name: "footer-placement", parameters: { __id: "krds-identifier--footer-placement" }, render: () => <CatalogStory componentId="identifier" caseId="footer-placement"/> };
