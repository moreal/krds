import { Show, onMount, onCleanup } from 'solid-js';
import type { TTSContract } from '@unofficial-krds/contracts';
import { owned } from '../../internal/catalog';

export type TTSProps = TTSContract;
export function TTS(props: TTSProps) {
  const request = (action: 'play' | 'pause' | 'resume' | 'stop') => props.onRequest({ action, summary: props.summary, locale: props.locale });
  const playName = () => `${props.label} ${props.state === 'paused' || props.state === 'error' ? '다시 재생' : '재생'}`;
  onMount(()=>onCleanup(() => { if (props.state === 'playing' || props.state === 'paused') request('stop'); }));
  return <div {...owned('tts', 'root', props.state)} data-krds-size={props.size ?? 'small'}>
    <button type="button" {...owned('tts', 'play')} aria-label={playName()} disabled={props.state === 'unsupported' || props.state === 'playing'} onClick={() => request(props.state === 'paused' ? 'resume' : 'play')}><Show when={!props.iconOnly} fallback={<span aria-hidden="true">▶</span>}><span {...owned('tts', 'label')}>{playName()}</span></Show></button>
    <Show when={props.state === 'playing' || props.state === 'paused'}>
      <button type="button" {...owned('tts', 'pause')} aria-label={`${props.label} 일시정지`} disabled={props.state === 'paused'} onClick={() => request('pause')}><Show when={!props.iconOnly} fallback={<span aria-hidden="true">Ⅱ</span>}>{props.label} 일시정지</Show></button>
      <button type="button" {...owned('tts', 'stop')} aria-label={`${props.label} 중지`} onClick={() => request('stop')}><Show when={!props.iconOnly} fallback={<span aria-hidden="true">■</span>}>{props.label} 중지</Show></button>
    </Show>
    <span {...owned('tts', 'status')}>{props.state === 'unsupported' ? '음성 읽기를 지원하지 않습니다.' : props.state === 'error' ? '읽기에 실패했습니다. 다시 시도하세요.' : props.state === 'playing' ? '읽는 중' : props.state === 'paused' ? '일시정지' : ''}</span>
  </div>;
}
