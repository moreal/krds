import { createSignal, onMount } from 'solid-js';
import { Button } from '@unofficial-krds/solid/button';
export function CodeBlock(props: { value: string; language: string }) {
 const [ready,setReady]=createSignal(false); const [status,setStatus]=createSignal('');
 onMount(()=>setReady(true));
 async function copy() { try { await navigator.clipboard.writeText(props.value); setStatus('코드를 복사했습니다.'); } catch { setStatus('코드를 복사할 수 없습니다. 코드 영역에서 직접 선택해 주세요.'); } }
 return <div class="docs-code"><div class="docs-code-actions"><span>{props.language || 'text'}</span><Button size="small" variant="tertiary" disabled={!ready()} onClick={copy}>코드 복사</Button><span role="status">{status()}</span></div><pre tabIndex={0} aria-label={`${props.language || 'text'} 코드`}><code>{props.value}</code></pre></div>;
}
