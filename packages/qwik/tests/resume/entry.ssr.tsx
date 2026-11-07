import { renderToString } from '@builder.io/qwik/server';
import { manifest } from '@qwik-client-manifest';
import { CarouselResume, ControlledFieldsResume, FieldsResume, HostDrivenResume, TooltipResume, MountedFieldResume, SnackbarInlineResume, ImageResume, ThrowingResume, ToastInlineResume, LatentMenuResume, LatentNavResume, LatentTextResume, TutorialPanelResume } from './examples';

const fixtures = { carousel: CarouselResume, 'tutorial-panel': TutorialPanelResume, image: ImageResume, fields: FieldsResume, 'controlled-fields': ControlledFieldsResume, 'latent-text': LatentTextResume, 'latent-nav': LatentNavResume, 'latent-menu': LatentMenuResume, 'host-driven': HostDrivenResume, throwing: ThrowingResume, 'toast-inline': ToastInlineResume, 'mounted-field': MountedFieldResume, 'snackbar-inline': SnackbarInlineResume, tooltip: TooltipResume };
/** Production SSR of one fixture into a paused container; the browser resumes it through qwikloader only. */
export function render(id: keyof typeof fixtures) {
  const Fixture = fixtures[id];
  return renderToString(<><head><meta charSet="utf-8"/><title>{`Qwik resume ${id}`}</title></head><body><Fixture/></body></>, { manifest, base: '/build/', containerTagName: 'html', containerAttributes: { lang: 'ko' } });
}
