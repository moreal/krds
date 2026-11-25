import { renderToString } from '@builder.io/qwik/server';
import { manifest } from '@qwik-client-manifest';
import { PaginationGuide, ResizeGuide, StepIndicatorGuide } from './examples';

const fixtures = { pagination: PaginationGuide, resize: ResizeGuide, 'step-indicator': StepIndicatorGuide };
/** Production SSR of one guide fixture into a paused container. */
export function render(id: keyof typeof fixtures) {
  const Fixture = fixtures[id];
  return renderToString(<><head><meta charSet="utf-8"/><title>{`Qwik guide ${id}`}</title></head><body><Fixture/></body></>, { manifest, base: '/build/', containerTagName: 'html', containerAttributes: { lang: 'ko' } });
}
