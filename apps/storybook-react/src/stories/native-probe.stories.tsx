/** Infrastructure states only; these do not contribute KRDS catalog coverage. */
import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import type { StoryStateCase } from '@unofficial-krds/test-contracts';
import { infrastructureStoryCases, storyStateCases } from '@unofficial-krds/test-contracts/fixtures';
type ProbeArgs = {
    count: number;
    label: string;
    disabled: boolean;
    errorMessage?: string;
};
function NativeStoryProbe({ count, label, disabled, errorMessage }: ProbeArgs) {
    const [value, setValue] = useState(count);
    return <main><h1>Native React infrastructure</h1>
    {errorMessage ? <div role="alert">{errorMessage}</div> : <>
      <button disabled={disabled} onClick={() => setValue(value + 1)}>{label}</button>
      <div role="status" aria-label="Probe value">{value}</div>
    </>}
  </main>;
}
function argsFor(id: string): ProbeArgs {
    const entry: StoryStateCase | undefined = infrastructureStoryCases.find((item) => item.id === id);
    if (!entry)
        throw new globalThis.Error(`Missing infrastructure state: ${id}`);
    return { count: 0, label: 'Probe increment', disabled: false, ...entry.state };
}
// The real component story states stay separate; absent implementations receive no canonical story IDs.
const meta = {
    title: 'Infrastructure/Native probe',
    component: NativeStoryProbe,
    parameters: { krds: { infrastructure: true, pendingCanonicalStates: storyStateCases.map(({ id }) => id) } },
} satisfies Meta<typeof NativeStoryProbe>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Default: Story = { args: argsFor('infrastructure-native-probe--default') };
export const Loading: Story = { args: argsFor('infrastructure-native-probe--loading') };
export const Error: Story = { args: argsFor('infrastructure-native-probe--error') };
