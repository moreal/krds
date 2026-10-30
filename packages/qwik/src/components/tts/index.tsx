import { component$, useVisibleTask$ } from '@builder.io/qwik';
import type { TTSContract } from '@unofficial-krds/contracts';
import { owned, type NativeContract } from '../../internal/catalog';
export type TTSProps = NativeContract<TTSContract>;
export const TTS = component$<TTSProps>((props) => {
  // The host owns the speech engine; teardown only requests that host to stop.
  useVisibleTask$(({ cleanup }) => {
    cleanup(() => {
      if (props.state === 'playing' || props.state === 'paused')
        void props.onRequest$({ action: 'stop', summary: props.summary, locale: props.locale });
    });
  }, { strategy: 'document-ready' });
  const playLabel = props.state === 'paused' || props.state === 'error' ? `${props.label} 다시 재생` : `${props.label} 재생`;
  const pauseLabel = `${props.label} 일시정지`, stopLabel = `${props.label} 중지`;
  return <div {...owned('tts', 'root', props.state)} data-krds-size={props.size ?? 'small'}>
    <button type="button" {...owned('tts', 'play')} aria-label={playLabel} disabled={props.state === 'unsupported' || props.state === 'playing'} onClick$={() => props.onRequest$({ action: props.state === 'paused' ? 'resume' : 'play', summary: props.summary, locale: props.locale })}>
      <svg aria-hidden="true" focusable="false" width="1em" height="1em" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 5 6 9H3v6h3l5 4V5Z"/><path d="M15 8a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/></svg>
      {!props.iconOnly && <span {...owned('tts', 'label')}>{playLabel}</span>}
    </button>
    {(props.state === 'playing' || props.state === 'paused') && <>
      <button type="button" {...owned('tts', 'pause')} aria-label={pauseLabel} disabled={props.state === 'paused'} onClick$={() => props.onRequest$({ action: 'pause', summary: props.summary, locale: props.locale })}>
        <svg aria-hidden="true" focusable="false" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor"><path d="M5 4h5v16H5zm9 0h5v16h-5z"/></svg>
        {!props.iconOnly && <span {...owned('tts', 'label')}>{pauseLabel}</span>}
      </button>
      <button type="button" {...owned('tts', 'stop')} aria-label={stopLabel} onClick$={() => props.onRequest$({ action: 'stop', summary: props.summary, locale: props.locale })}>
        <svg aria-hidden="true" focusable="false" width="1em" height="1em" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v16H4z"/></svg>
        {!props.iconOnly && <span {...owned('tts', 'label')}>{stopLabel}</span>}
      </button>
    </>}
    <span {...owned('tts', 'status')}>{props.state === 'unsupported' ? '음성 읽기를 지원하지 않습니다.' : props.state === 'error' ? '읽기에 실패했습니다. 다시 시도하세요.' : props.state === 'playing' ? '읽는 중' : props.state === 'paused' ? '일시정지' : ''}</span>
  </div>;
});
