import { docUrl } from './urls';

/** Public assets share the same deployment base as document routes. */
export const branding = {
  name: 'KRDS Native',
  alt: 'KRDS Native',
  wordmark: docUrl('/local-assets/branding/wordmark-black.svg'),
  favicon: docUrl('/local-assets/branding/favicon.svg'),
  faviconIco: docUrl('/local-assets/branding/favicon.ico'),
  favicon32: docUrl('/local-assets/branding/favicon-32.png'),
  appleTouchIcon: docUrl('/local-assets/branding/apple-touch-icon.png'),
  social: docUrl('/local-assets/branding/social.png'),
  socialAlt: '흰 배경의 검정 KRDS Native 워드마크',
};
