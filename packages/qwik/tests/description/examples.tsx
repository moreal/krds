import { component$ } from '@builder.io/qwik';
import { AccessibleMedia } from '../../src/components/accessible-media';
/** Local-only fixture: no API, CDN or external assets. */
export const AccessibleMediaDescription = component$(() => <AccessibleMedia media={{ kind: 'audio', src: 'a.wav', type: 'audio/wav' }} title="로컬 예제 미디어" transcript={{ content: '안녕하세요 대본 본문입니다' }}/>);
