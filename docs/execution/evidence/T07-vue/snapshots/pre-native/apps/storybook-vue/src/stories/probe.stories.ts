/** Local state-only infrastructure, excluded from KRDS catalog coverage. */
import type { Meta, StoryObj } from '@storybook/vue3-vite';
import type { StoryStateCase } from '@unofficial-krds/test-contracts';
import { infrastructureStoryCases, storyStateCases } from '@unofficial-krds/test-contracts/fixtures';
import { NativeProbe } from './NativeProbe';
const meta = { title: 'Infrastructure/Native probe', component: NativeProbe } satisfies Meta<typeof NativeProbe>;
export default meta;
type Story = StoryObj<typeof meta>;
function state(id: string): Story['args'] {
  const fixture: StoryStateCase | undefined = infrastructureStoryCases.find(item => item.id === id);
  if (!fixture) throw new globalThis.Error(`Missing infrastructure state: ${id}`);
  return fixture.state;
}
// Retain the canonical state catalog as metadata; missing canonical stories stay RED.
export const Default: Story = { args: state('infrastructure-native-probe--default'), parameters: { krds: { infrastructureOnly: true, canonicalStateCount: storyStateCases.length } } };
export const Loading: Story = { args: state('infrastructure-native-probe--loading') };
export const Error: Story = { args: state('infrastructure-native-probe--error') };
