import { afterEach, expect, test } from 'vitest';
import { createRoot } from 'react-dom/client';
import { act } from 'react';
import { Tooltip } from '../src/index';
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
function mount() { const host = document.createElement('div'); document.body.append(host); const root = createRoot(host, { onUncaughtError: () => {} }); cleanup.push(() => { act(() => root.unmount()); host.remove(); }); return { host, root }; }

// KRDS component_08_05 L1145-1156: every trigger needs its own functional name, not just the ⓘ glyph.
test('Tooltip rejects a default description trigger without a trigger label', async () => {
  for (const triggerLabel of [undefined, '', '   ']) {
    const { host, root } = mount();
    await expect(act(async () => root.render(<Tooltip text="신청 도움말을 엽니다" triggerLabel={triggerLabel} triggerId="help-trigger" textId="help-tooltip"/>))).rejects.toBeInstanceOf(TypeError);
    expect(host.querySelector('button')).toBeNull();
  }
});

test('Tooltip names the default description trigger by its trigger label', async () => {
  const { host, root } = mount();
  await act(async () => root.render(<Tooltip text="신청 도움말을 엽니다" triggerLabel="신청 도움말" triggerId="help-trigger" textId="help-tooltip"/>));
  expect(host.querySelector('button')!.getAttribute('aria-label')).toBe('신청 도움말');
});
