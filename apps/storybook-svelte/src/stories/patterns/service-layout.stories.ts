import type { Meta, StoryObj } from '@storybook/svelte-vite';
import { getPresentation } from '@unofficial-krds/test-contracts/patterns';
import PatternStory from './PatternStory.svelte';
const meta = { id: 'krds-pattern-service-layout', title: 'KRDS/Patterns/service-layout', component: PatternStory } satisfies Meta<typeof PatternStory>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: { state: getPresentation('service-layout', 'default').state } };
