import { TestBed } from '@angular/core/testing';
import { expect, test } from 'vitest';
import { page } from 'vitest/browser';
import { AccessibleMedia } from '../src/lib/components/accessible-media/accessible-media';
import { Image } from '../src/lib/components/image/image';

const tick = () => new Promise(resolve => setTimeout(resolve, 50));

test('accessible media links audio and video to the transcript region via aria-describedby', async () => {
  for (const media of [{ kind: 'audio', src: 'a.wav', type: 'audio/wav' }, { kind: 'video', src: 'v.mp4', type: 'video/mp4' }] as const) {
    const fixture = TestBed.createComponent(AccessibleMedia);
    fixture.componentRef.setInput('media', media);
    fixture.componentRef.setInput('title', '안내');
    fixture.componentRef.setInput('transcript', { content: '대본 내용' });
    fixture.componentRef.setInput('captionTracks', media.kind === 'video' ? [{ src: 'c.vtt', lang: 'ko', label: '한국어' }] : []);
    fixture.detectChanges();
    const root: HTMLElement = fixture.nativeElement;
    const element = root.querySelector(media.kind)!;
    const id = element.getAttribute('aria-describedby');
    expect(id, media.kind).toBeTruthy();
    const transcript = root.querySelector('[data-krds-part="transcript"]')!;
    expect(transcript.id).toBe(id);
    expect(root.ownerDocument.getElementById(id!)).toBe(transcript);
    expect(transcript.hasAttribute('aria-label')).toBe(false);
    expect(transcript.textContent).toContain('대본 내용');
    // Computed accessible description is the transcript text, not the labelled region's name.
    await expect.element(page.elementLocator(element)).toHaveAccessibleDescription(/대본 내용/);
    if (media.kind === 'video') expect(root.querySelector('track[kind="captions"]')).not.toBeNull();
    fixture.destroy();
  }
});

test('accessible media transcript ids are unique per instance', () => {
  const ids = [0, 1].map(() => { const f = TestBed.createComponent(AccessibleMedia); f.detectChanges(); return f.nativeElement.querySelector('audio').getAttribute('aria-describedby'); });
  expect(ids[0]).not.toBe(ids[1]);
});

test('image failing src yields error state, keeps alt and reserved box', async () => {
  const fixture = TestBed.createComponent(Image);
  fixture.componentRef.setInput('src', 'http://127.0.0.1:1/missing.png');
  fixture.componentRef.setInput('alt', '대체 설명');
  fixture.componentRef.setInput('width', 320);
  fixture.componentRef.setInput('height', 180);
  fixture.detectChanges();
  const root: HTMLElement = fixture.nativeElement;
  const img = root.querySelector('img')!;
  await tick(); fixture.detectChanges();
  expect(img.getAttribute('data-krds-state')).toBe('error');
  expect(root.querySelector('figure')!.getAttribute('data-krds-state'), 'the state lives on the image root only').toBeNull();
  expect(img.getAttribute('alt')).toBe('대체 설명');
  expect(img.getAttribute('width')).toBe('320');
  expect(img.getAttribute('height')).toBe('180');
  expect(root.querySelector('[data-krds-part="description"]')!.textContent).toContain('이미지를 불러올 수 없습니다.');
});

test('image successful load reports loaded state without error description', async () => {
  const fixture = TestBed.createComponent(Image);
  fixture.componentRef.setInput('src', 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
  fixture.componentRef.setInput('alt', 'ok');
  fixture.detectChanges();
  await tick(); fixture.detectChanges();
  const root: HTMLElement = fixture.nativeElement;
  expect(root.querySelector('img')!.getAttribute('data-krds-state')).toBe('loaded');
  expect(root.querySelector('[data-krds-part="description"]')).toBeNull();
});

test('image src change resets error state', async () => {
  const fixture = TestBed.createComponent(Image);
  fixture.componentRef.setInput('src', 'http://127.0.0.1:1/missing.png');
  fixture.componentRef.setInput('alt', 'x');
  fixture.detectChanges();
  await tick(); fixture.detectChanges();
  const root: HTMLElement = fixture.nativeElement;
  expect(root.querySelector('img')!.getAttribute('data-krds-state')).toBe('error');
  fixture.componentRef.setInput('src', 'data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==');
  fixture.detectChanges();
  await tick(); fixture.detectChanges();
  expect(root.querySelector('img')!.getAttribute('data-krds-state')).toBe('loaded');
  expect(root.querySelector('[data-krds-part="description"]')).toBeNull();
});
