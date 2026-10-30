<script lang="ts">
import type { Snippet } from 'svelte';
import { untrack, tick, onMount, onDestroy } from 'svelte';
import type { TTSContract } from '@unofficial-krds/contracts';
import { owned, control, resetField, ignoredKey } from './catalog-state.svelte.js';
let p: TTSContract  = $props();
function request(action:'play'|'pause'|'resume'|'stop'){p.onRequest({action,summary:p.summary,locale:p.locale});}
</script>
<div {...owned('tts','root',p.state)} data-krds-size={p.size??'small'}><button type="button" {...owned('tts','play',p.state)} disabled={p.state==='playing'||p.state==='unsupported'} onclick={()=>request(p.state==='paused'?'resume':'play')}>{['paused','error'].includes(p.state)?`${p.label} 다시 재생`:`${p.label} 재생`}</button><button type="button" {...owned('tts','pause',p.state==='playing'?'playing':'paused')} disabled={p.state!=='playing'} onclick={()=>request('pause')}>{p.label} 일시정지</button><button type="button" {...owned('tts','stop',p.state==='playing'?'playing':'idle')} disabled={!['playing','paused'].includes(p.state)} onclick={()=>request('stop')}>{p.label} 중지</button><span {...owned('tts','status',p.state)}>{p.state==='unsupported'?'음성 읽기를 지원하지 않습니다.':p.state}</span></div>
