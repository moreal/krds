import { html } from 'lit';
import type { TTSContract } from '@unofficial-krds/contracts';
import { KrdsElement } from '../base.js';
export class TTS extends KrdsElement {
    static override properties = { summary: { type: String }, state: { type: String }, size: { type: String }, iconOnly: { type: Boolean, attribute: 'icon-only' } };
    declare summary: string;
    declare state: TTSContract['state'];
    declare size: string;
    declare iconOnly: boolean;
    constructor() { super(); this.label = '음성 안내'; this.summary = ''; this.state = 'idle'; this.size = 'small'; this.iconOnly = false; }
    private request(action: 'play' | 'pause' | 'resume' | 'stop') { if (this.state === 'unsupported')
        return; this.emit('request', { action, summary: this.summary, locale: this.locale }); }
    override disconnectedCallback() { if (this.state === 'playing' || this.state === 'paused')
        this.emit('request', { action: 'stop', summary: this.summary, locale: this.locale }); this.emit('dispose', {}); super.disconnectedCallback(); }
    override render() { if (!this.summary || !this.label || !['idle', 'playing', 'paused', 'error', 'unsupported'].includes(this.state) || !['xsmall', 'small', 'medium'].includes(this.size))
        throw new TypeError('Invalid TTS configuration'); const unsupported = this.state === 'unsupported'; return html `<section data-krds-component="tts" data-krds-part="root" data-krds-state=${this.state} part="root" data-krds-size=${this.size} aria-label=${this.label}><button data-krds-component="tts" data-krds-part="play" data-krds-state=${this.state} part="play" type="button" ?disabled=${unsupported} aria-label=${this.state === 'paused' ? `${this.label} 다시 재생` : this.state === 'error' ? `${this.label} 다시 재생` : `${this.label} 재생`} @click=${() => this.request(this.state === 'paused' ? 'resume' : 'play')}>${this.iconOnly ? html`<svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20"><path d="M5 3L17 10 5 17Z" fill="currentColor"></path></svg>` : ''}<span data-krds-component="tts" data-krds-part="label" data-krds-state="" part="label" style=${this.iconOnly ? 'position:absolute;inline-size:1px;block-size:1px;overflow:hidden;clip-path:inset(50%);white-space:nowrap' : ''}>${this.state === 'paused' ? `${this.label} 다시 재생` : this.state === 'error' ? `${this.label} 다시 재생` : `${this.label} 재생`}</span></button><button data-krds-component="tts" data-krds-part="pause" data-krds-state=${this.state} part="pause" type="button" ?disabled=${this.state !== 'playing'} @click=${() => this.request('pause')} aria-label=${`${this.label} 일시정지`}>일시정지</button><button data-krds-component="tts" data-krds-part="stop" data-krds-state=${this.state} part="stop" type="button" ?disabled=${unsupported || this.state === 'idle'} @click=${() => this.request('stop')} aria-label=${`${this.label} 중지`}>중지</button><p data-krds-component="tts" data-krds-part="status" data-krds-state=${this.state} part="status" role="status">${({ idle: '듣기 준비', playing: '읽는 중', paused: '일시 정지됨', error: '읽기 실패. 다시 시도하세요', unsupported: '음성 읽기를 지원하지 않습니다' })[this.state]}</p></section>`; }
}
