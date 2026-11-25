import { afterEach, expect, test } from 'vitest';
import { render } from 'solid-js/web';
import type { JSX } from 'solid-js';
import { LanguageSwitcher } from '../src/components/language-switcher';

const cleanups: (() => void)[] = [];
afterEach(() => cleanups.splice(0).forEach(cleanup => cleanup()));
function mount(view: () => JSX.Element) {
  const host = document.createElement('div'); document.body.append(host);
  const dispose = render(view, host);
  cleanups.push(() => { dispose(); host.remove(); }); return host;
}
const ko = { locale: 'ko', nativeLabel: '한국어', translatedLabel: '한국어', href: '/local/ko' };
const en = { locale: 'en', nativeLabel: 'English', translatedLabel: '영어', href: '/local/en' };
const ja = { locale: 'ja', nativeLabel: '日本語', translatedLabel: '일본어', href: '/local/ja' };
const links = (host: Element) => [...host.querySelectorAll('a')].map(link => [link.textContent, link.lang]);

// KRDS component_10_01 L934–935: a Korean page links to 'English' and an English page links to '한국어'.
test('two languages show only the other language as a link', () => {
  expect(links(mount(() => <LanguageSwitcher currentLocale="ko" options={[ko, en]}/>))).toEqual([['English', 'en']]);
  expect(links(mount(() => <LanguageSwitcher currentLocale="en" options={[ko, en]}/>))).toEqual([['한국어', 'ko']]);
});

// KRDS component_10_01 L920–921: the dropdown trigger shows a globe to the left of its label.
test('the dropdown trigger leads with a decorative globe', () => {
  const trigger = mount(() => <LanguageSwitcher currentLocale="ko" options={[ko, en, ja]}/>).querySelector('[data-krds-part="trigger"]')!;
  const globe = trigger.firstElementChild as HTMLElement;
  expect(globe.dataset).toMatchObject({ krdsComponent: 'language-switcher', krdsPart: 'globe' });
  expect(globe.getAttribute('aria-hidden')).toBe('true');
  expect(trigger.textContent).toBe('언어: 한국어');
});
