<script lang="ts">
  import { onMount } from 'svelte';
  import { WorkspaceProbe } from '@unofficial-krds/svelte';
  import { createFixtureBridge } from '@unofficial-krds/test-contracts/driver';
  import type { FixtureBridge } from '@unofficial-krds/test-contracts';

  const componentId = decodeURIComponent(window.location.pathname.split('/')[2] ?? 'unknown');
  const caseId = new URLSearchParams(window.location.search).get('case') ?? 'default';
  const isProbe = componentId === '__probe' && caseId === 'native-state';
  let ready = $state(false);
  let probeState = $state<Record<string, unknown>>({ count: 0, label: 'Probe increment', disabled: false });
  let bridge: FixtureBridge | undefined;

  onMount(() => {
    bridge = createFixtureBridge('svelte', isProbe ? probeState : {});
    const unsubscribe = bridge.subscribe((next) => { probeState = next; });
    ready = true;
    return () => { unsubscribe(); bridge?.dispose(); };
  });

  function increment() {
    if (!bridge || probeState.disabled) return;
    const count = Number(probeState.count) + 1;
    void bridge.setState({ count });
    bridge.recordEvent('change', { value: count });
  }
</script>

<main>
  <h1>Svelte native fixture</h1>
  <WorkspaceProbe />
  {#if ready}<p role="status" aria-label="Fixture health">ready</p>{/if}
  {#if isProbe}
    <button type="button" disabled={Boolean(probeState.disabled)} onclick={increment}>{String(probeState.label)}</button>
    <p role="status" aria-label="Probe value">{String(probeState.count)}</p>
  {:else}
    <p role="note">Component not implemented: {componentId}/{caseId}</p>
  {/if}
</main>
