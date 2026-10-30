import { useEffect, useState } from 'react';
import { WorkspaceProbe } from '@krds-native/react';
import type { FixtureBridge } from '@krds-native/test-contracts';
import { createFixtureBridge } from '@krds-native/test-contracts/driver';
import { NativeProbe } from './NativeProbe';

interface FixtureRoute { componentId: string; caseId: string }
function currentRoute(): FixtureRoute {
  return { componentId: decodeURIComponent(location.pathname.split('/')[2] ?? ''), caseId: new URLSearchParams(location.search).get('case') ?? '' };
}
const initialState = { count: 0, label: 'Probe increment', disabled: false };

export function FixtureApp(route: Partial<FixtureRoute> = {}) {
  const { componentId, caseId } = { ...currentRoute(), ...route };
  const [state, setState] = useState<Record<string, unknown>>(initialState);
  const [bridge, setBridge] = useState<FixtureBridge>();
  useEffect(() => {
    const channel = createFixtureBridge('react', componentId === '__probe' ? initialState : {});
    const unsubscribe = channel.subscribe(setState);
    setBridge(channel);
    return () => { unsubscribe(); channel.dispose(); };
  }, [componentId, caseId]);
  return <main>
    <h1>React fixture</h1>
    <WorkspaceProbe />
    {bridge && <div role="status" aria-label="Fixture health">ready</div>}
    {componentId === '__probe' && caseId === 'native-state'
      ? <NativeProbe count={Number(state.count)} label={String(state.label)} disabled={Boolean(state.disabled)}
          onChange={(value) => { bridge?.recordEvent('change', { value }); void bridge?.setState({ count: value }); }} />
      : <p role="note">Component not implemented: {componentId}/{caseId}</p>}
  </main>;
}
