/** Test-only infrastructure stories; excluded from KRDS catalog coverage. */
import type { Meta, StoryObj } from '@storybook/angular';
import type { StoryStateCase } from '@unofficial-krds/test-contracts';
import { infrastructureStoryCases } from '@unofficial-krds/test-contracts/fixtures';
import { NativeStoryProbe } from './native-probe';
const state = (id: StoryStateCase['id']) => ({ ...infrastructureStoryCases.find(item => item.id === id)!.state });
const meta: Meta<NativeStoryProbe> = { title: 'Infrastructure/Native probe', component: NativeStoryProbe };
export default meta;
type Story = StoryObj<NativeStoryProbe>;
export const Default: Story = { args: state('infrastructure-native-probe--default') };
export const Loading: Story = { args: state('infrastructure-native-probe--loading') };
export const Error: Story = { args: state('infrastructure-native-probe--error') };
