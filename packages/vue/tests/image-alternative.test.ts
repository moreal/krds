import { afterEach, expect, test } from 'vitest';
import { createApp, h, nextTick, ref } from 'vue';
import { Image } from '../src/index';
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
const src = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
function mount(props: () => Record<string, unknown>) {
  const host = document.createElement('div'); document.body.append(host); const errors: unknown[] = [];
  const app = createApp({ render: () => h(Image, props()) }); app.config.errorHandler = error => { errors.push(error); }; app.config.warnHandler = () => {}; app.mount(host);
  cleanup.push(() => { app.unmount(); host.remove(); }); return { host, errors };
}

test('Image rejects a meaningful image without alternative text and accepts a decorative one (KRDS component_04_08 L1067)', async () => {
  for (const alt of ['', '   ']) {
    const { errors } = mount(() => ({ src, alt })); await nextTick();
    expect(errors).toHaveLength(1); expect(errors[0]).toBeInstanceOf(TypeError);
  }
  const decorative = mount(() => ({ src, alt: '', decorative: true })); await nextTick();
  expect(decorative.errors).toHaveLength(0); expect(decorative.host.querySelector('img')!.getAttribute('alt')).toBe('');
  const alt = ref('예제 그림'); const updated = mount(() => ({ src, alt: alt.value })); await nextTick();
  expect(updated.errors).toHaveLength(0);
  alt.value = ''; await nextTick();
  expect(updated.errors).toHaveLength(1); expect(updated.errors[0]).toBeInstanceOf(TypeError);
});
