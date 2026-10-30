import { expect, test } from 'vitest';
import { createSignal } from 'solid-js';
import { render } from 'solid-js/web';
import { KrdsProvider, useKrdsEnvironment } from '../src/providers';

test('native context inherits reactively without wrapper DOM or document mutation', async () => {
  const host = document.createElement('div');
  document.body.append(host);
  const originalLanguage = document.documentElement.lang;
  const [locale, setLocale] = createSignal<'ko-KR' | 'en-US'>('en-US');
  let environment: ReturnType<typeof useKrdsEnvironment> | undefined;
  function Consumer() {
    environment = useKrdsEnvironment();
    return <span>{environment.locale()}:{environment.direction()}</span>;
  }
  const dispose = render(() => <KrdsProvider locale={locale()} direction="rtl"><KrdsProvider><Consumer /></KrdsProvider></KrdsProvider>, host);
  try {
    expect(host.innerHTML).toBe('<span>en-US:rtl</span>');
    expect(environment!.getDocument()).toBe(document);
    setLocale('ko-KR');
    expect(host.textContent).toBe('ko-KR:rtl');
    expect(document.documentElement.lang).toBe(originalLanguage);
  } finally { dispose(); host.remove(); }
});

test('native provider resolves an explicit owner document and optional defaults', () => {
  const host = document.createElement('div');
  const otherDocument = document.implementation.createHTMLDocument('secondary');
  let selected: Document | undefined;
  function Consumer() {
    const environment = useKrdsEnvironment();
    selected = environment.getDocument();
    return <span>{environment.locale()}:{environment.direction()}</span>;
  }
  const dispose = render(() => <KrdsProvider ownerDocument={otherDocument}><Consumer /></KrdsProvider>, host);
  try {
    expect(selected).toBe(otherDocument);
    expect(host.textContent).toBe('ko-KR:ltr');
  } finally { dispose(); }
});
