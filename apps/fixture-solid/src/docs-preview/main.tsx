import { render } from 'solid-js/web';
import { onMount } from 'solid-js';
import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/fonts.css';
import '@unofficial-krds/styles/all.css';
import './preview.css';
import { createPreviewHost } from '../../../../tools/docs-previews/host';
import { examples } from './examples';

const root = document.getElementById('preview-root')!;
const query = new URLSearchParams(location.search);
const component = query.get('component')!;
const host = createPreviewHost({framework:'solid',root});
const Example = examples[component as keyof typeof examples];
if (!Example || query.get('example') !== 'default') { root.textContent='지원하지 않는 예제입니다.'; host.error('Unknown Solid example'); } else {
 const dispose = render(() => { onMount(() => host.ready()); return <div><Example/><output id="preview-route" aria-live="polite"/></div>; }, root);
 const navigate = () => { const output=document.getElementById('preview-route'); if(output) output.textContent=location.hash ? `로컬 경로: ${location.hash.slice(1)}` : ''; };
 window.addEventListener('hashchange',navigate);
 window.addEventListener('pagehide',()=>{window.removeEventListener('hashchange',navigate);dispose();host.dispose();},{once:true});
}
