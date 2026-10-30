import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CatalogStory from './CatalogStory.vue';
const meta = {id: 'krds-identifier', title: 'KRDS/Catalog/Identifier', component: CatalogStory, parameters:{layout:'fullscreen'}, args: {componentId: 'identifier'}} satisfies Meta<typeof CatalogStory>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Light: Story = {name: "light", args: {caseId: "light"}};
export const Dark: Story = {name: "dark", args: {caseId: "dark"}};
export const FooterPlacement: Story = {name: "footer-placement", args: {caseId: "footer-placement"}};
