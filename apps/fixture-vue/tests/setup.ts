import '@testing-library/jest-dom/vitest';
import { afterEach } from 'vitest';
import { cleanup } from '@testing-library/vue';

afterEach(() => {
  cleanup();
  // A configuration-error render throws before Testing Library can register its
  // wrapper. Dispose that native Vue app as well, so later behavior tests have
  // neither orphan controls nor their document listeners.
  for (const container of document.querySelectorAll<HTMLElement>('[data-v-app]')) {
    const app = (container as HTMLElement & { __vue_app__?: { unmount(): void } }).__vue_app__;
    app?.unmount();
    container.remove();
  }
});
