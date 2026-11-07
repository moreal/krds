import { bootstrapApplication } from '@angular/platform-browser';
import { PreviewApplication, selectedExample } from './app';
import { createPreviewHost } from '../../../../tools/docs-previews/host';

const root = document.querySelector<HTMLElement>('docs-preview')!;
if (!selectedExample()) {
  // Unknown or excluded identities are rejected before any renderer or transport starts.
  root.textContent = '지원하지 않는 예제입니다.';
  try { createPreviewHost({ framework: 'angular', root }).error('Unknown Angular component or example'); } catch { /* invalid identity: nothing to announce */ }
} else {
  const host = createPreviewHost({ framework: 'angular', root });
  bootstrapApplication(PreviewApplication)
    .then(app => {
      host.ready();
      window.addEventListener('pagehide', () => { app.destroy(); host.dispose(); }, { once: true });
    })
    .catch(error => host.error(String(error)));
}
