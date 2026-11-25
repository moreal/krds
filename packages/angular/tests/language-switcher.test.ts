import { TestBed } from '@angular/core/testing';
import { expect, test } from 'vitest';
import { LanguageSwitcher } from '../src/lib/components/language-switcher/language-switcher';

const ko = { locale: 'ko', nativeLabel: '한국어', translatedLabel: '한국어', href: '/local/ko' };
const en = { locale: 'en', nativeLabel: 'English', translatedLabel: '영어', href: '/local/en' };
const ja = { locale: 'ja', nativeLabel: '日本語', translatedLabel: '일본어', href: '/local/ja' };
function mount(currentLocale: string, options: unknown[]) {
  const fixture = TestBed.createComponent(LanguageSwitcher);
  fixture.componentRef.setInput('currentLocale', currentLocale);
  fixture.componentRef.setInput('options', options);
  fixture.detectChanges();
  return fixture.nativeElement as HTMLElement;
}
const links = (host: Element) => [...host.querySelectorAll('a')].map(link => [link.textContent, link.lang]);

// KRDS component_10_01 L934–935: a Korean page links to 'English' and an English page links to '한국어'.
test('two languages show only the other language as a link', () => {
  expect(links(mount('ko', [ko, en]))).toEqual([['English', 'en']]);
  expect(links(mount('en', [ko, en]))).toEqual([['한국어', 'ko']]);
});

// KRDS component_10_01 L920–921: the dropdown trigger shows a globe to the left of its label.
test('the dropdown trigger leads with a decorative globe', () => {
  const trigger = mount('ko', [ko, en, ja]).querySelector('[data-krds-part="trigger"]')!;
  const globe = trigger.firstElementChild as HTMLElement;
  expect(globe.dataset).toMatchObject({ krdsComponent: 'language-switcher', krdsPart: 'globe' });
  expect(globe.getAttribute('aria-hidden')).toBe('true');
  expect(trigger.textContent).toBe('언어: 한국어');
});
