import type { ReactiveController, LitElement } from 'lit';
/** One rendered host-owned generation, with pauseable remaining exposure. No internal queue. */
export class ExposureController implements ReactiveController {
    generation = 0;
    private key = '';
    private remaining = 0;
    private started = 0;
    private timer?: ReturnType<typeof setTimeout>;
    private consumed = false;
    private paused = false;
    private callback?: (generation: number) => void;
    constructor(private host: LitElement) { host.addController(this); }
    hostConnected() { this.host.ownerDocument.addEventListener('visibilitychange', this.visibility); }
    hostDisconnected() { this.host.ownerDocument.removeEventListener('visibilitychange', this.visibility); this.cancel(); this.key = ''; this.generation++; }
    private visibility = () => this.schedule();
    update(key: string, duration: number | null, paused: boolean, callback: (generation: number) => void) {
        if (duration !== null && (!Number.isFinite(duration) || duration <= 0))
            throw new RangeError('Exposure duration must be positive');
        if (key !== this.key) {
            this.cancel();
            this.key = key;
            this.generation++;
            this.remaining = duration ?? 0;
            this.consumed = duration === null || !key;
        }
        this.callback = callback;
        this.paused = paused;
        this.schedule();
    }
    private cancel() { if (this.timer !== undefined) {
        clearTimeout(this.timer);
        this.remaining = Math.max(0, this.remaining - (Date.now() - this.started));
        this.timer = undefined;
    } }
    private schedule() { this.cancel(); if (!this.host.isConnected || this.consumed || this.paused || this.host.ownerDocument.hidden || !this.key)
        return; const generation = this.generation; this.started = Date.now(); this.timer = setTimeout(() => { this.timer = undefined; if (generation !== this.generation || !this.host.isConnected || this.paused || this.host.ownerDocument.hidden || this.consumed)
        return; this.consumed = true; this.remaining = 0; this.callback?.(generation); }, this.remaining); }
}
