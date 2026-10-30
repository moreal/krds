/** Test infrastructure only: no KRDS component coverage. */
import { defineComponent, h, onUnmounted, shallowRef } from 'vue';
import { WorkspaceProbe } from '@unofficial-krds/vue';
import { createFixtureBridge } from '@unofficial-krds/test-contracts/driver';

export const FixtureApp = defineComponent({
  name: 'FixtureApp',
  setup() {
    const url = new URL(window.location.href);
    const componentId = decodeURIComponent(url.pathname.split('/')[2] ?? '');
    const caseId = url.searchParams.get('case') ?? '';
    const isProbe = componentId === '__probe' && caseId === 'native-state';
    const bridge = createFixtureBridge('vue', isProbe ? { count: 0, label: 'Probe increment', disabled: false } : {});
    const state = shallowRef<Record<string, unknown>>(bridge.getState());
    const unsubscribe = bridge.subscribe(next => { state.value = next; });
    onUnmounted(() => { unsubscribe(); bridge.dispose(); });
    function increment() {
      const count = Number(state.value.count) + 1;
      void bridge.setState({ count });
      bridge.recordEvent('change', { value: count });
    }
    return () => h('main', [
      h('div', { role: 'status', 'aria-label': 'Fixture health' }, 'ready'),
      isProbe
        ? h('section', { 'aria-label': 'Test infrastructure probe' }, [
          h('button', { type: 'button', disabled: Boolean(state.value.disabled), onClick: increment }, String(state.value.label)),
          h('div', { role: 'status', 'aria-label': 'Probe value' }, String(state.value.count)),
        ])
        : h('p', { role: 'note' }, `Component not implemented: ${componentId}/${caseId}`),
      h('aside', { 'aria-label': 'Built public entry bootstrap' }, [h(WorkspaceProbe)]),
    ]);
  },
});
