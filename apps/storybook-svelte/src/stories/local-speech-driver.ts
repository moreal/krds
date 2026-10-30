/** Cancellable local mock; does not synthesize speech or contact a service. */
export class LocalSpeechDriver {
  private operation?: AbortController;
  private status: 'idle'|'playing'|'paused' = 'idle';
  private phase: 'idle'|'playing'|'paused'|'stopped'|'disposed' = 'idle';
  private completion = Promise.resolve();
  private content = {summary:'',locale:''};
  constructor(private changed: () => void) {}
  get active() { return !!this.operation && !this.operation.signal.aborted; }
  get state() { return this.status; }
  get lifecycle() { return this.phase; }
  get input() { return {...this.content}; }
  get signal() { return this.operation?.signal; }
  get settled() { return this.completion; }
  play(summary:string,locale:string) {
    this.operation?.abort('replaced');
    const operation = new AbortController();
    this.operation = operation;
    this.content = {summary,locale};
    this.status = this.phase = 'playing';
    this.completion = new Promise<void>(resolve => operation.signal.addEventListener('abort', () => {
      if (this.operation === operation) {
        this.status = 'idle';
        this.phase = operation.signal.reason === 'disposed' ? 'disposed' : 'stopped';
        this.changed();
      }
      resolve();
    }, {once:true}));
    this.changed();
  }
  pause() { if(this.active && this.status==='playing'){this.status=this.phase='paused';this.changed();} }
  resume() { if(this.active && this.status==='paused'){this.status=this.phase='playing';this.changed();} }
  stop() { this.operation?.abort('stopped'); }
  dispose() {
    if(this.active) this.operation!.abort('disposed');
    else {this.status='idle';this.phase='disposed';this.changed();}
  }
}
