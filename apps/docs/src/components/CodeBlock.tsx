import { createSignal, onMount, For, Show } from 'solid-js';
import { Button } from '@unofficial-krds/solid/button';
import type { CodeToken } from '../content';
/** Code sample with copy action. `lines` carries build-time highlight tokens whose colors are CSS variables mapped in content.css; without them the text renders plain. */
export function CodeBlock(props: { value: string; language: string; lines?: CodeToken[][] }) {
 const [ready,setReady]=createSignal(false); const [status,setStatus]=createSignal('');
 onMount(()=>setReady(true));
 async function copy() { try { await navigator.clipboard.writeText(props.value); setStatus('코드를 복사했습니다.'); } catch { setStatus('코드를 복사할 수 없습니다. 코드 영역에서 직접 선택해 주세요.'); } }
 return <div class="docs-code" data-language={props.language || undefined}><div class="docs-code-actions"><Button size="small" variant="tertiary" disabled={!ready()} onClick={copy}>코드 복사</Button><span role="status">{status()}</span></div><pre tabIndex={0} aria-label={`${props.language || 'text'} 코드`}><code><Show when={props.lines} fallback={props.value}>{lines=><For each={lines()}>{(line,index)=><>{index()>0?'\n':''}<For each={line}>{token=><Show when={token.c} fallback={token.t}>{color=><span style={{color:color()}}>{token.t}</span>}</Show>}</For></>}</For>}</Show></code></pre></div>;
}
