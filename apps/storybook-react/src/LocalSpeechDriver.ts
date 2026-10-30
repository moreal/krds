export interface LocalSpeechCommand {
    action: 'play' | 'pause' | 'resume' | 'stop';
    summary: string;
    locale: string;
}
/** Independent local mock: explicit commands own a cancellable playback session. */
export class LocalSpeechDriver {
    private controller: AbortController | null = null;
    private timer: ReturnType<typeof setInterval> | undefined;
    private accumulated = 0;
    private startedAt = 0;
    private text = '';
    private language = '';
    get summary() { return this.text; }
    get locale() { return this.language; }
    private playback: 'idle' | 'playing' | 'paused' | 'error' = 'idle';
    get active() { return this.controller !== null && !this.controller.signal.aborted; }
    get lifecycle() { return this.controller === null ? 'idle' : this.controller.signal.aborted ? 'disposed' : this.playback; }
    get positionMs() { return this.accumulated + (this.playback === 'playing' ? performance.now() - this.startedAt : 0); }
    get state() { return this.playback; }
    private clearTimer() {
        if (this.timer !== undefined) clearInterval(this.timer);
        this.timer = undefined;
    }
    private runClock() {
        this.startedAt = performance.now();
        this.timer = setInterval(() => {
            this.accumulated += performance.now() - this.startedAt;
            this.startedAt = performance.now();
        }, 100);
    }
    request(command: LocalSpeechCommand) {
        if (command.action === 'play') {
            this.dispose();
            this.controller = new AbortController();
            this.controller.signal.addEventListener('abort', () => this.clearTimer(), { once: true });
            this.text = command.summary;
            this.language = command.locale;
            this.playback = 'playing';
            this.runClock();
        } else if (command.action === 'pause' && this.playback === 'playing') {
            this.accumulated = this.positionMs;
            this.clearTimer();
            this.playback = 'paused';
        } else if (command.action === 'resume' && this.playback === 'paused' && this.active) {
            this.playback = 'playing';
            this.runClock();
        } else if (command.action === 'stop') {
            this.dispose();
        }
        return this.playback;
    }
    fail() {
        this.dispose();
        this.playback = 'error';
    }
    dispose() {
        if (this.controller && !this.controller.signal.aborted) this.controller.abort();
        this.clearTimer();
        this.accumulated = 0;
        this.playback = 'idle';
    }
}
