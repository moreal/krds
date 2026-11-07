import { renderToString } from '@builder.io/qwik/server';
import { manifest } from '@qwik-client-manifest';
import { BottomSheetNestedDismissAnatomy, BottomSheetNestedModalAnatomy, BottomSheetStackingAnatomy, FileUploadAnatomy, TutorialNoStepAnatomy, TutorialOverviewAnatomy, TutorialPanelAnatomy, TutorialTaskViewAnatomy } from './examples';

const fixtures = { 'file-upload': FileUploadAnatomy, 'tutorial-panel': TutorialPanelAnatomy, 'tutorial-overview': TutorialOverviewAnatomy, 'tutorial-no-step': TutorialNoStepAnatomy, 'tutorial-task-view': TutorialTaskViewAnatomy, 'bottom-sheet-stacking': BottomSheetStackingAnatomy, 'bottom-sheet-nested-modal': BottomSheetNestedModalAnatomy, 'bottom-sheet-nested-dismiss': BottomSheetNestedDismissAnatomy };
/** Production SSR of one anatomy fixture into a paused container. */
export function render(id: keyof typeof fixtures) {
  const Fixture = fixtures[id];
  return renderToString(<><head><meta charSet="utf-8"/><title>{`Qwik anatomy ${id}`}</title></head><body><button type="button">Before</button><Fixture/></body></>, { manifest, base: '/build/', containerTagName: 'html', containerAttributes: { lang: 'ko' } });
}
