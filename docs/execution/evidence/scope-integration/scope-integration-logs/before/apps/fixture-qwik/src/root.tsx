import { component$, useStore, useVisibleTask$ } from '@builder.io/qwik';
import { createFixtureBridge } from '@krds-native/test-contracts/driver';
import { WorkspaceProbe } from '@krds-native/qwik';

/** Client-only T05 infrastructure. This does not exercise production SSR/resume. */
export default component$(() => {
  const state = useStore({ ready: false, probe: false, component: '', caseId: '', count: 0, label: 'Probe increment', disabled: false });
  useVisibleTask$(({ cleanup }) => {
    const component = decodeURIComponent(location.pathname.split('/')[2] ?? '');
    state.component = component;
    state.caseId = new URLSearchParams(location.search).get('case') ?? '';
    state.probe = component === '__probe';
    // Bridge and unsubscribe never enter serializable Qwik state or a captured event QRL.
    const bridge = createFixtureBridge('qwik', { count: 0, label: 'Probe increment', disabled: false });
    const unsubscribe = bridge.subscribe((next) => {
      state.count = Number(next.count ?? 0);
      state.label = String(next.label ?? 'Probe increment');
      state.disabled = Boolean(next.disabled);
    });
    state.ready = true;
    cleanup(() => { unsubscribe(); bridge.dispose(); });
  });
  return <main>
    <WorkspaceProbe />
    <div role="status" aria-label="Fixture health">{state.ready ? 'ready' : 'mounting'}</div>
    {state.probe ? <>
      <button disabled={state.disabled} onClick$={async () => {
        const bridge = window.__KRDS_FIXTURE__;
        if (!bridge) throw new Error('Fixture bridge is not mounted');
        const count = Number(bridge.getState().count ?? 0) + 1;
        bridge.recordEvent('change', { value: count });
        await bridge.setState({ count });
      }}>{state.label}</button>
      <div role="status" aria-label="Probe value">{state.count}</div>
    </> : <p role="note">Component not implemented: {state.component}/{state.caseId}</p>}
  </main>;
});
