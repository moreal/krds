import type { Meta, StoryObj } from '@storybook/svelte-vite';
import CatalogStory from './CatalogStory.svelte';
const meta = {id: 'krds-favicon', title: 'KRDS/Catalog/Favicon', component: CatalogStory, args: {componentId: 'favicon'}} satisfies Meta<typeof CatalogStory>;
export default meta;
type Story = StoryObj<typeof meta>;
export const StandardLocalHead: Story = {name: "standard-local-head", args: {caseId: "standard-local-head"}};
export const ExtendedLocalHead: Story = {name: "extended-local-head", args: {caseId: "extended-local-head"}};
export const LightDarkPreview: Story = {name: "light-dark-preview", args: {caseId: "light-dark-preview"}};
