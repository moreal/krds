import type { Meta, StoryObj } from '@storybook/svelte-vite';
import type { StoryStateCase } from '@unofficial-krds/test-contracts';
import { infrastructureStoryCases, storyStateCases } from '@unofficial-krds/test-contracts/fixtures';
import NativeProbe from './NativeProbe.svelte';
const meta = { title: 'Infrastructure/Native probe', component: NativeProbe, excludeStories: ['canonicalPilotStates'] } satisfies Meta<typeof NativeProbe>;
export default meta;
type Story = StoryObj<typeof meta>;
function state(id: string): Story['args'] {
    const fixture: StoryStateCase | undefined = infrastructureStoryCases.find((item) => item.id === id);
    if (!fixture)
        throw new globalThis.Error(`Missing infrastructure story state: ${id}`);
    return fixture.state;
}
// Canonical states remain separate until the owning KRDS implementation tasks supply their stories.
export const canonicalPilotStates: readonly StoryStateCase[] = storyStateCases;
export const Default: Story = { args: state('infrastructure-native-probe--default') };
export const Loading: Story = { args: state('infrastructure-native-probe--loading') };
export const Error: Story = { args: state('infrastructure-native-probe--error') };
