import { renderToString } from '@builder.io/qwik/server';
import { manifest } from '@qwik-client-manifest';
import { AccordionDefault, AccordionLevelFive, TextListOrdered, TextListUnordered } from './examples';

const fixtures = { 'accordion-default': AccordionDefault, 'accordion-level-five': AccordionLevelFive, 'text-list-unordered': TextListUnordered, 'text-list-ordered': TextListOrdered };
export function render(id: keyof typeof fixtures) {
  const Fixture = fixtures[id];
  return renderToString(<><head><meta charSet="utf-8"/><title>{`Qwik semantics ${id}`}</title></head><body><Fixture/></body></>, { manifest, base: '/build/', containerTagName: 'html', containerAttributes: { lang: 'ko' } });
}
