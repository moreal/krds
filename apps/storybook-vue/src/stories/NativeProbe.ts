/** Native Vue story-only infrastructure; no KRDS component coverage. */
import { defineComponent, h } from 'vue';
import { Button } from '@unofficial-krds/vue';
export const NativeProbe = defineComponent({
  name: 'NativeProbe',
  props: {
    count: { type: Number, default: 0 },
    label: { type: String, default: 'Probe increment' },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    errorMessage: { type: String, default: '' },
  },
  setup(props) {
    return () => h('main', [
      props.errorMessage
        ? h('div', { role: 'alert' }, props.errorMessage)
        : h('section', [
          h('button', { type: 'button', disabled: props.disabled }, props.label),
          h('div', { role: 'status', 'aria-label': 'Probe value' }, String(props.count)),
        ]),
      h('aside', { 'aria-label': 'Built public entry bootstrap' }, [h(Button, {}, () => 'Native Button')]),
    ]);
  },
});
