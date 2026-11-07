import { renderToString } from '@builder.io/qwik/server';
import { manifest } from '@qwik-client-manifest';
import { AccessibleMediaDescription } from './examples';
export function render() {
  return renderToString(<><head><meta charSet="utf-8"/><title>Qwik accessible media</title></head><body><AccessibleMediaDescription/></body></>, { manifest, base: '/build/', containerTagName: 'html', containerAttributes: { lang: 'ko' } });
}
