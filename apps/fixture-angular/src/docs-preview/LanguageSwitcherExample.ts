import { Component, signal } from '@angular/core';
import { LanguageSwitcher } from '@unofficial-krds/angular/language-switcher';
import { localRoute } from './preview-data';

@Component({
  selector: 'docs-language-switcher-example',
  standalone: true,
  imports: [LanguageSwitcher],
  template: `
    <krds-language-switcher [currentLocale]="locale()" [options]="options" (localeRequest)="locale.set($event.locale)" />
    <p [lang]="locale()">{{ locale() === 'ko' ? '한국어 예제' : 'English example' }}</p>`,
})
export class LanguageSwitcherExample {
  readonly locale = signal('ko');
  readonly options = [
    { locale: 'ko', nativeLabel: '한국어', translatedLabel: '한국어', href: localRoute('ko') },
    { locale: 'en', nativeLabel: 'English', translatedLabel: '영어', href: localRoute('en') },
  ];
}
