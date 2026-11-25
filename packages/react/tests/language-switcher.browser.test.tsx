import { afterEach, expect, test } from 'vitest';
import { cdp } from 'vitest/browser';
import { createRoot } from 'react-dom/client';
import { act, type ReactNode } from 'react';
import { LanguageSwitcher } from '../src/index';
import '@unofficial-krds/styles/all.css';
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;
const cleanup: (() => unknown)[] = [];
afterEach(async () => { for (const callback of cleanup.splice(0)) await callback(); });
async function mount(view: ReactNode) { const host = document.createElement('div'); document.body.append(host); const root = createRoot(host); await act(async () => root.render(view)); cleanup.push(() => { act(() => root.unmount()); host.remove(); }); return host; }
const ko = { locale: 'ko', nativeLabel: '한국어', translatedLabel: '한국어', href: '/local/ko' };
const en = { locale: 'en', nativeLabel: 'English', translatedLabel: '영어', href: '/local/en' };
const ja = { locale: 'ja', nativeLabel: '日本語', translatedLabel: '일본어', href: '/local/ja' };
const links = (host: Element) => [...host.querySelectorAll('a')].map(link => [link.textContent, link.lang]);

// KRDS component_10_01 L934–935: a Korean page links to 'English' and an English page links to '한국어'.
test('two languages show only the other language as a link', async () => {
  expect(links(await mount(<LanguageSwitcher currentLocale="ko" options={[ko, en]}/>))).toEqual([['English', 'en']]);
  expect(links(await mount(<LanguageSwitcher currentLocale="en" options={[ko, en]}/>))).toEqual([['한국어', 'ko']]);
});

// KRDS component_10_01 L920–921: the dropdown trigger shows a globe to the left of its label.
test('the dropdown trigger leads with a decorative globe that the shared CSS draws, also in forced colors', async () => {
  const host = await mount(<LanguageSwitcher currentLocale="ko" options={[ko, en, ja]}/>);
  const trigger = host.querySelector<HTMLButtonElement>('[data-krds-part="trigger"]')!;
  const globe = trigger.firstElementChild as HTMLElement;
  expect(globe.dataset).toMatchObject({ krdsComponent: 'language-switcher', krdsPart: 'globe' });
  expect(globe.getAttribute('aria-hidden')).toBe('true');
  expect(trigger.textContent).toBe('언어: 한국어');
  const drawn = () => { const ring = getComputedStyle(globe, '::before'), meridian = getComputedStyle(globe, '::after'); const box = globe.getBoundingClientRect(); return { square: box.width > 0 && box.width === box.height, ring: [ring.borderTopStyle, ring.borderTopColor, ring.backgroundImage.startsWith('linear-gradient')], meridian: [meridian.borderTopStyle, meridian.borderTopColor] }; };
  const color = getComputedStyle(trigger).color;
  expect(drawn()).toEqual({ square: true, ring: ['solid', color, true], meridian: ['solid', color] });
  const session = cdp();
  await session.send('Emulation.setEmulatedMedia', { features: [{ name: 'forced-colors', value: 'active' }] });
  cleanup.push(() => session.send('Emulation.setEmulatedMedia', { features: [] }));
  expect(matchMedia('(forced-colors: active)').matches).toBe(true);
  const forced = getComputedStyle(trigger).color;
  expect(drawn()).toEqual({ square: true, ring: ['solid', forced, true], meridian: ['solid', forced] });
});
