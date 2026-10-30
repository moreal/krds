import type { Meta, StoryObj } from '@storybook/svelte-vite';
import CatalogStory from './CatalogStory.svelte';
const meta = {id: 'krds-masthead', title: 'KRDS/Catalog/Masthead', component: CatalogStory, args: {componentId: 'masthead'}} satisfies Meta<typeof CatalogStory>;
export default meta;
type Story = StoryObj<typeof meta>;
export const DefaultSpecimen: Story = {name: "default-specimen", args: {caseId: "default-specimen"}};
export const NarrowZoom: Story = {name: "narrow-zoom", args: {caseId: "narrow-zoom"}};
export const PageOrder: Story = {name: "page-order", args: {caseId: "page-order"}};
