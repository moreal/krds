<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { TTSContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: TTSContract  = $props();
function request(action:'play'|'pause'|'resume'|'stop'){p.onRequest({action,summary:p.summary,locale:p.locale});}const playName=$derived(`${p.label} ${p.state==='paused'||p.state==='error'?'다시 재생':'재생'}`);
</script>
<div {...owned('tts','root',p.state)} data-krds-size={p.size??'small'}><button type="button" {...owned('tts','play')} aria-label={playName} disabled={p.state==='unsupported'||p.state==='playing'} onclick={()=>request(p.state==='paused'?'resume':'play')}>{#if p.iconOnly}<span aria-hidden="true">▶</span>{:else}<span {...owned('tts','label')}>{playName}</span>{/if}</button>{#if p.state==='playing'||p.state==='paused'}<button type="button" {...owned('tts','pause')} aria-label={`${p.label} 일시정지`} disabled={p.state==='paused'} onclick={()=>request('pause')}>{#if p.iconOnly}<span aria-hidden="true">Ⅱ</span>{:else}{p.label} 일시정지{/if}</button><button type="button" {...owned('tts','stop')} aria-label={`${p.label} 중지`} onclick={()=>request('stop')}>{#if p.iconOnly}<span aria-hidden="true">■</span>{:else}{p.label} 중지{/if}</button>{/if}<span {...owned('tts','status')} role="status">{p.state==='unsupported'?'음성 읽기를 지원하지 않습니다.':p.state==='error'?'읽기에 실패했습니다. 다시 시도하세요.':p.state==='playing'?'읽는 중':p.state==='paused'?'일시정지':''}</span></div>
