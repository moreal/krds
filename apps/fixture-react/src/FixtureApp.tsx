import { useEffect, useState } from 'react';
import type { FixtureBridge } from '@unofficial-krds/test-contracts';
import { createFixtureBridge } from '@unofficial-krds/test-contracts/driver';
import { NativeProbe } from './NativeProbe';
import { CatalogFixture, catalogScenario } from './CatalogFixture';
import { PilotFixture } from './PilotFixture';
import { PatternFixture } from './examples/PatternFixture';

interface FixtureRoute { componentId: string; caseId: string }
function currentRoute(): FixtureRoute {
  return { componentId: decodeURIComponent(location.pathname.split('/')[2] ?? ''), caseId: new URLSearchParams(location.search).get('case') ?? '' };
}
const initialState = { count: 0, label: 'Probe increment', disabled: false };

export function FixtureApp(route:Partial<FixtureRoute>={}) {
  const [locationKey,setLocationKey]=useState(()=>location.pathname+location.search);
  useEffect(()=>{const changed=()=>setLocationKey(location.pathname+location.search);window.addEventListener('popstate',changed);return()=>window.removeEventListener('popstate',changed);},[]);
  if(!route.componentId&&locationKey.startsWith('/examples/'))return <PatternFixture key={locationKey}/>;
  return <ComponentFixtureApp key={`${locationKey}:${route.componentId??''}:${route.caseId??''}`} {...route}/>;
}
function ComponentFixtureApp(route: Partial<FixtureRoute> = {}) {
  const { componentId, caseId } = { ...currentRoute(), ...route };
  const selected=catalogScenario(componentId,caseId);
  const seed=componentId==='__probe'?initialState:selected?{...selected.initialState,__host:{...selected.host}}:{};
  const [state, setState] = useState<Record<string, unknown>>(seed);
  const [bridge, setBridge] = useState<FixtureBridge>();
  useEffect(() => {
    const channel = createFixtureBridge('react', seed);
    const unsubscribe = channel.subscribe(setState);
    setBridge(channel);
    return () => { unsubscribe(); channel.dispose(); };
  }, [componentId, caseId]);
  return <div>
    <h1 data-krds-host="fixture-heading">React fixture</h1>
    
    {bridge && <div role="status" aria-label="Fixture health">ready</div>}
    {componentId === '__probe' && caseId === 'native-state'
      ? <NativeProbe count={Number(state.count)} label={String(state.label)} disabled={Boolean(state.disabled)}
          onChange={(value) => { bridge?.recordEvent('change', { value }); void bridge?.setState({ count: value }); }} />
      : catalogScenario(componentId,caseId) ? <CatalogFixture componentId={componentId} caseId={caseId} state={state} bridge={bridge} /> : <PilotFixture componentId={componentId} caseId={caseId} state={state} bridge={bridge} />}
  </div>;
}
