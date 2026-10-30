import { render } from 'solid-js/web';
import { FixtureApp } from './fixture-app';
import { PatternFixture } from './examples/pattern-fixture';
import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/fonts.css';
import '@unofficial-krds/styles/all.css';
import './fixture.css';

const patternRoute = /^\/examples\/(form-errors|search-results|consent-confirmation|service-layout)$/.exec(window.location.pathname);
const route = /^\/fixtures\/([^/]+)$/.exec(window.location.pathname);
const componentId = route ? decodeURIComponent(route[1]) : 'unknown';
const caseId = new URLSearchParams(window.location.search).get('case') ?? 'default';
const dispose = render(() => patternRoute ? <PatternFixture patternId={patternRoute[1]} caseId={caseId}/> : <FixtureApp componentId={componentId} caseId={caseId} />, document.getElementById('app')!);
if (import.meta.hot) import.meta.hot.dispose(dispose);
window.addEventListener('pagehide', dispose, { once: true });
