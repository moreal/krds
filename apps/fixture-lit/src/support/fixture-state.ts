import type { LitElement } from 'lit';
import type { FullCatalogStoryCase, FixtureBridge } from '@unofficial-krds/test-contracts';
import { createFixtureBridge } from '@unofficial-krds/test-contracts/driver';
import { LocalState } from './local-state.js';
function plain(value: any): any {
  if (value === undefined) return null;
  if (value instanceof File) return { name: value.name, size: value.size, type: value.type, lastModified: value.lastModified };
  if (Array.isArray(value)) return value.map(plain);
  if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([, child]) => typeof child !== 'function').map(([key, child]) => [key, plain(child)]));
  return value;
}
export class FixtureState extends LocalState {
  private bridge?: FixtureBridge;
  private unsubscribe?: () => void;
  private configured?: FullCatalogStoryCase;
  private configurationKey = '';
  private watched = new WeakMap<Element, Promise<unknown>>();
  configurationError = '';
  constructor(private elementHost: LitElement) { super(elementHost); }
  override configure(input: FullCatalogStoryCase) {
    super.configure(input);
    if (this.configured === input) return;
    this.configured = input;
    this.unsubscribe?.(); this.bridge?.dispose();
    this.bridge = createFixtureBridge('lit', plain(input.state));
    this.unsubscribe = this.bridge.subscribe(state => {
      if (state.__host && typeof state.__host === 'object') { const next = state.__host as Record<string, any>; if (next.panelOpen !== undefined && next.panelOpen !== this.host.panelOpen) this.panelOpen = !!next.panelOpen; if (next.activePanel !== undefined && next.activePanel !== this.host.activePanel) this.panelActive = next.activePanel; this.host = { ...this.host, ...next }; }
      const files = Array.isArray(state.files) ? state.files.map((record: any) => {
        const retained = this.state.files?.find((current: any) => current.id === record.id);
        const specimen = this.host.fileFixtures?.find((file: any) => file.id === (record.fileFixtureId ?? record.id)); return retained?.file instanceof File ? { ...record, file: retained.file } : { ...record, file: new File([specimen?.contents ?? record.file?.contents ?? record.contents ?? 'local file'], specimen?.name ?? record.file?.name ?? record.name ?? `${record.id}.txt`, { type: specimen?.type ?? record.file?.type ?? record.type ?? 'text/plain' }) };
      }) : undefined;
      if (state.message && typeof state.message === 'object' && 'text' in state.message) this.persistentText = String(state.message.text);
      this.state = { ...this.state, ...state, ...(files ? { files } : {}) };
      const key = JSON.stringify(this.host.testConfiguration ?? null);
      if (key !== this.configurationKey) { this.configurationKey = key; this.configurationError = ''; }
      if (this.host.testConfiguration) this.state = { ...this.state, ...this.host.testConfiguration };
      this.elementHost.requestUpdate();
    });
  }
  protected override publish() { void this.bridge?.setState(plain(this.state)); }
  override hostUpdated() {
    super.hostUpdated();
    for (const child of this.elementHost.querySelectorAll<LitElement>('*')) {
      if (!child.localName.startsWith('krds-') || !child.updateComplete || this.watched.get(child) === child.updateComplete) continue;
      const update = child.updateComplete; this.watched.set(child, update);
      void update.catch(error => { this.configurationError = String(error); this.elementHost.requestUpdate(); });
    }
  }
  override accept(name: string, detail: any) {
    this.bridge?.recordEvent(name.replace(/-([a-z])/g, (_, letter: string) => letter.toUpperCase()), plain(detail));
    super.accept(name, detail);
    void this.bridge?.setState(plain(this.state));
  }
  override hostDisconnected() { this.unsubscribe?.(); this.bridge?.dispose(); this.bridge = undefined; this.unsubscribe = undefined; super.hostDisconnected(); }
}
