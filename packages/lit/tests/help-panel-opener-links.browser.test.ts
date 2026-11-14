import { afterEach, expect, test } from 'vitest';
import { registerKrdsElements } from '../src/index';
registerKrdsElements(customElements);
const cleanup: (() => void)[] = [];
afterEach(() => { for (const c of cleanup.splice(0)) c(); });
type Host = HTMLElement & { updateComplete: Promise<unknown>; topics: unknown; defaultOpen: boolean; defaultSelectedTopicId: string | null };
async function mount(configure: (host: Host) => void) {
  const host = document.createElement('krds-help-panel') as Host; const requests: boolean[] = [];
  host.topics = [{ id: 'a', title: '신청 자격', content: '내용', relatedLinks: [{ href: 'https://example.invalid/guide', label: '안내 누리집' }] }];
  configure(host); host.addEventListener('open-change', event => requests.push((event as CustomEvent<{ open: boolean }>).detail.open));
  document.body.append(host); cleanup.push(() => host.remove()); await host.updateComplete;
  return { host, requests, opener: host.shadowRoot!.querySelector<HTMLButtonElement>('[part="opener"]')! };
}
test('HelpPanel opener only opens: pressing it while the panel is open requests nothing', async () => {
  const { host, requests, opener } = await mount(host => { host.defaultOpen = false; });
  opener.click(); await host.updateComplete; expect(opener.getAttribute('aria-expanded')).toBe('true');
  opener.click(); await host.updateComplete; expect(opener.getAttribute('aria-expanded')).toBe('true'); expect(requests).toEqual([true]);
  host.shadowRoot!.querySelector<HTMLButtonElement>('[part="close"]')!.click(); await host.updateComplete;
  expect(opener.getAttribute('aria-expanded')).toBe('false'); expect(requests).toEqual([true, false]);
});
test('HelpPanel related links open in a new window and say so', async () => {
  const { host } = await mount(host => { host.defaultSelectedTopicId = 'a'; });
  const link = host.shadowRoot!.querySelector<HTMLAnchorElement>('[part="related"] a')!;
  expect(link.target).toBe('_blank'); expect(link.rel).toBe('noopener noreferrer'); expect(link.textContent).toBe('안내 누리집 (새 창)');
});
