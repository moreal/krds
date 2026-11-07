import { component$, Slot, useSignal, useVisibleTask$ } from '@builder.io/qwik';
import { createPreviewHost } from '../../../../tools/docs-previews/host';

/** Native Qwik host (a neutral root so examples own their landmarks): the example is SSR content in a Slot; the shared helper only owns frame transport and the exit control. */
export const PreviewHost = component$<{ componentId: string; exampleId: string }>(props => {
  const root = useSignal<HTMLElement>();
  useVisibleTask$(({ cleanup }) => {
    const host = createPreviewHost({ framework: 'qwik', root: root.value!, componentId: props.componentId, exampleId: props.exampleId });
    host.ready();
    cleanup(() => host.dispose());
  }, { strategy: 'document-ready' });
  return <div id="preview-root" ref={root}><Slot/></div>;
});
