import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/fonts.css';
import '@unofficial-krds/styles/base.css';
import '@unofficial-krds/styles/all.css';
import './preview.css';
import { createPreviewHost } from '../../../../tools/docs-previews/host';
import { examples, SecondaryButtonExample } from './examples';

const root = document.getElementById('preview-root')!;
const params = new URLSearchParams(location.search);
const componentId = params.get('component');
const Example = componentId === 'button' && params.get('example') === 'secondary' ? SecondaryButtonExample : componentId && Object.hasOwn(examples, componentId) ? examples[componentId as keyof typeof examples] : null;
const host = createPreviewHost({ framework: 'react', root });
function App() {
  useEffect(() => { host.ready(); return () => host.dispose(); }, []);
  return params.has('route') ? <section><h1>로컬 예제 목적지</h1><p role="status">{params.get('route')}</p><a href={location.pathname + '?component=' + componentId + '&example=default'}>예제로 돌아가기</a></section> : Example ? <Example /> : <p role="alert">지원하지 않는 예제입니다.</p>;
}
if (!Example || !['default', 'secondary'].includes(params.get('example') ?? '') || (params.get('example') === 'secondary' && componentId !== 'button')) {
  root.textContent = '지원하지 않는 예제입니다.';
  host.error('Unknown React component or example');
} else createRoot(root).render(<App />);
