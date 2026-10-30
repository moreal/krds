import type { Meta, StoryObj } from 'storybook-solidjs-vite';
import type { StoryStateCase } from '@krds-native/test-contracts';
import { infrastructureStoryCases, storyStateCases } from '@krds-native/test-contracts/fixtures';
import { NativeProbe } from './native-probe';

const meta = { title: 'Infrastructure/Native probe', component: NativeProbe } satisfies Meta<typeof NativeProbe>;
export default meta;
type Story = StoryObj<typeof meta>;

function localArgs(id: string) {
  const fixture: StoryStateCase | undefined = infrastructureStoryCases.find(state => state.id === `infrastructure-native-probe--${id}`);
  if (!fixture) throw new globalThis.Error(`Missing infrastructure state: ${id}`);
  return fixture.state;
}

// Canonical states remain distinct from infrastructure and have no fabricated stories.
void storyStateCases;
export const Default: Story = { args: localArgs('default') };
export const Loading: Story = { args: localArgs('loading') };
export const Error: Story = { args: localArgs('error') };
