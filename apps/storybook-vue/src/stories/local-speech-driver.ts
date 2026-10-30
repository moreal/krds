export type LocalSpeechState = 'idle' | 'playing' | 'paused';
export type LocalSpeechLifecycle = 'idle' | 'playing' | 'paused' | 'stopped' | 'disposed';
export interface LocalSpeechSnapshot {
  active: boolean;
  state: LocalSpeechState;
  lifecycle: LocalSpeechLifecycle;
  summary: string;
  locale: string;
}

/** Local non-network speech operation; its pending work is owned by a real abort signal. */
export class LocalSpeechDriver {
  private operation?: AbortController;
  private completion: Promise<void> = Promise.resolve();
  private state: LocalSpeechState = 'idle';
  private lifecycle: LocalSpeechLifecycle = 'idle';
  private summary = '';
  private locale = '';
  private listeners = new Set<(snapshot: LocalSpeechSnapshot) => void>();

  get snapshot(): LocalSpeechSnapshot {
    return {
      active: Boolean(this.operation && !this.operation.signal.aborted),
      state: this.state,
      lifecycle: this.lifecycle,
      summary: this.summary,
      locale: this.locale,
    };
  }

  get signal(): AbortSignal | undefined { return this.operation?.signal; }
  get settled(): Promise<void> { return this.completion; }

  subscribe(listener: (snapshot: LocalSpeechSnapshot) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    const snapshot = this.snapshot;
    for (const listener of this.listeners) listener(snapshot);
  }

  play(summary: string, locale: string): void {
    this.operation?.abort('replaced');
    const operation = new AbortController();
    this.operation = operation;
    this.summary = summary;
    this.locale = locale;
    this.state = 'playing';
    this.lifecycle = 'playing';
    this.completion = new Promise<void>(resolve => {
      operation.signal.addEventListener('abort', () => {
        if (this.operation === operation) {
          this.state = 'idle';
          this.lifecycle = operation.signal.reason === 'disposed' ? 'disposed' : 'stopped';
          this.notify();
        }
        resolve();
      }, { once: true });
    });
    this.notify();
  }

  pause(): void {
    if (!this.snapshot.active || this.state !== 'playing') return;
    this.state = 'paused';
    this.lifecycle = 'paused';
    this.notify();
  }

  resume(): void {
    if (!this.snapshot.active || this.state !== 'paused') return;
    this.state = 'playing';
    this.lifecycle = 'playing';
    this.notify();
  }

  stop(): void { this.operation?.abort('stopped'); }

  dispose(): void {
    if (this.operation && !this.operation.signal.aborted) this.operation.abort('disposed');
    else {
      this.state = 'idle';
      this.lifecycle = 'disposed';
      this.notify();
    }
  }
}
