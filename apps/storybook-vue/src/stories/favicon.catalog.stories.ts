import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CatalogStory from './CatalogStory.vue';
const meta = {id: 'krds-favicon', title: 'KRDS/Catalog/Favicon', component: CatalogStory, parameters:{layout:'fullscreen'}, args: {componentId: 'favicon'}} satisfies Meta<typeof CatalogStory>;
export default meta;
type Story = StoryObj<typeof meta>;
export const StandardLocalHead: Story = {name: "standard-local-head", args: {caseId: "standard-local-head"}};
export const ExtendedLocalHead: Story = {name: "extended-local-head", args: {caseId: "extended-local-head"}};
export const LightDarkPreview: Story = {name: "light-dark-preview", args: {caseId: "light-dark-preview"}};
