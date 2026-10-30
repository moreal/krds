import type { Meta, StoryObj } from 'storybook-framework-qwik';
import type { StoryStateCase } from '@krds-native/test-contracts';
import { infrastructureStoryCases, storyStateCases } from '@krds-native/test-contracts/fixtures';
import { NativeProbe, type NativeProbeProps } from './native-probe';

const argsFor = (id: string): NativeProbeProps => {
  const fixture: StoryStateCase | undefined = infrastructureStoryCases.find((item) => item.id === id);
  if (!fixture) throw new globalThis.Error(`Missing infrastructure state: ${id}`);
  return fixture.state;
};

const meta = {
  title: 'Infrastructure/Native probe', component: NativeProbe,
  parameters: { krds: { infrastructureOnly: true, canonicalCasesPending: storyStateCases.map((item) => item.id) } },
} satisfies Meta<NativeProbeProps>;
export default meta;
type Story = StoryObj<NativeProbeProps>;
export const Default: Story = { args: argsFor('infrastructure-native-probe--default') };
export const Loading: Story = { args: argsFor('infrastructure-native-probe--loading') };
export const Error: Story = { args: argsFor('infrastructure-native-probe--error') };
