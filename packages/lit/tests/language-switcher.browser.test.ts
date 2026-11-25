import { afterEach, expect, test } from 'vitest';
import { registerKrdsElements } from '../src/index';
registerKrdsElements(customElements);
const cleanup: (() => void)[] = [];
afterEach(() => { for (const callback of cleanup.splice(0)) callback(); });
type Host = HTMLElement & { updateComplete: Promise<unknown>; currentLocale: string; options: unknown };
const ko = { locale: 'ko', nativeLabel: '한국어', translatedLabel: '한국어', href: '/local/ko' };
const en = { locale: 'en', nativeLabel: 'English', translatedLabel: '영어', href: '/local/en' };
const ja = { locale: 'ja', nativeLabel: '日本語', translatedLabel: '일본어', href: '/local/ja' };
async function mount(currentLocale: string, options: unknown[]) {
  const host = document.createElement('krds-language-switcher') as Host;
  host.currentLocale = currentLocale; host.options = options;
  document.body.append(host); cleanup.push(() => host.remove());
  await host.updateComplete;
  return host.shadowRoot!;
}
const links = (root: ShadowRoot) => [...root.querySelectorAll('a')].map(link => [link.textContent, link.lang]);

// KRDS component_10_01 L934–935: a Korean page links to 'English' and an English page links to '한국어'.
test('two languages show only the other language as a link', async () => {
  expect(links(await mount('ko', [ko, en]))).toEqual([['English', 'en']]);
  expect(links(await mount('en', [ko, en]))).toEqual([['한국어', 'ko']]);
});

// KRDS component_10_01 L920–921: the dropdown trigger shows a globe to the left of its label, drawn in the Shadow DOM.
test('the dropdown trigger leads with a decorative globe', async () => {
  const trigger = (await mount('ko', [ko, en, ja])).querySelector<HTMLElement>('[data-krds-part="trigger"]')!;
  const globe = trigger.firstElementChild as HTMLElement;
  expect(globe.dataset).toMatchObject({ krdsComponent: 'language-switcher', krdsPart: 'globe' });
  expect(globe.getAttribute('aria-hidden')).toBe('true');
  expect(trigger.textContent).toBe('언어: 한국어');
  expect(getComputedStyle(globe, '::before').borderTopStyle).toBe('solid');
});
