import type { Meta, StoryObj } from '@storybook/vue3-vite';
import CatalogStory from './CatalogStory.vue';
const meta = {id: 'krds-disclosure', title: 'KRDS/Catalog/Disclosure', component: CatalogStory, parameters:{layout:'fullscreen'}, args: {componentId: 'disclosure'}} satisfies Meta<typeof CatalogStory>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = {name: "default", args: {caseId: "default"}};
export const InteractiveContent: Story = {name: "interactive-content", args: {caseId: "interactive-content"}};
export const ControlledRejected: Story = {name: "controlled-rejected", args: {caseId: "controlled-rejected"}};
export const Narrow: Story = {name: "narrow", args: {caseId: "narrow"}};
