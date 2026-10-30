import { render } from 'solid-js/web';
import { FixtureApp } from './fixture-app';

const route = /^\/fixtures\/([^/]+)$/.exec(window.location.pathname);
const componentId = route ? decodeURIComponent(route[1]) : 'unknown';
const caseId = new URLSearchParams(window.location.search).get('case') ?? 'default';
const dispose = render(() => <FixtureApp componentId={componentId} caseId={caseId} />, document.getElementById('app')!);
if (import.meta.hot) import.meta.hot.dispose(dispose);
window.addEventListener('pagehide', dispose, { once: true });
