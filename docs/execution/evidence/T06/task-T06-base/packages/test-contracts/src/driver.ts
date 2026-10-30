import type { FixtureBridge, FixtureCase, FixtureDriver, FixtureEvent, FrameworkId } from './types.js';
function snapshot<T>(value: T): T {
  const seen = new WeakSet<object>();
  function check(entry: unknown): void {
    if (entry === null || typeof entry === 'string' || typeof entry === 'boolean') return;
    if (typeof entry === 'number' && Number.isFinite(entry)) return;
    if (typeof entry !== 'object') throw new Error('Fixture data must be JSON serializable');
    if (seen.has(entry)) throw new Error('Fixture data must be JSON serializable (cycle)');
    if (!Array.isArray(entry) && Object.getPrototypeOf(entry) !== Object.prototype && Object.getPrototypeOf(entry) !== null) throw new Error('Fixture data must be plain JSON serializable values');
    seen.add(entry);
    for (const child of Object.values(entry)) check(child);
    seen.delete(entry);
  }
  check(value); return JSON.parse(JSON.stringify(value)) as T;
}
export function createFixtureBridge(framework: FrameworkId, initialState: Record<string, unknown> = {}): FixtureBridge {
  let state = snapshot(initialState); let disposed = false;
  const events: FixtureEvent[] = []; const listeners = new Set<(state: Record<string, unknown>) => void>();
  const active = () => { if (disposed) throw new Error('Fixture bridge disposed'); };
  const bridge: FixtureBridge = {
    protocol: 1, framework,
    async setState(next) {
      active(); state = {...state, ...snapshot(next)};
      for (const listener of listeners) listener(snapshot(state));
      await new Promise<void>(resolve => window.requestAnimationFrame(() => window.requestAnimationFrame(() => resolve())));
    },
    getState: () => snapshot(state), readEvents: () => snapshot(events),
    recordEvent(name, detail) { active(); events.push(snapshot({name, detail})); },
    subscribe(listener) { active(); listeners.add(listener); listener(snapshot(state)); return () => listeners.delete(listener); },
    dispose() { disposed = true; listeners.clear(); if (window.__KRDS_FIXTURE__ === bridge) delete window.__KRDS_FIXTURE__; },
  };
  window.__KRDS_FIXTURE__?.dispose(); window.__KRDS_FIXTURE__ = bridge; return bridge;
}
/** Structural Page interface keeps Playwright types out of the browser fixture bundle. */
export interface FixturePage {
  goto(url: string): Promise<unknown>;
  waitForFunction(fn: () => unknown): Promise<unknown>;
  evaluate<R, A>(fn: (arg: A) => R | Promise<R>, arg: A): Promise<R>;
}
export function createFixtureDriver(page: FixturePage, origin: string): FixtureDriver {
  return {
    async open(fixture: FixtureCase) {
      await page.goto(`${origin}/fixtures/${encodeURIComponent(fixture.componentId)}?case=${encodeURIComponent(fixture.caseId)}`);
      await page.waitForFunction(() => window.__KRDS_FIXTURE__?.protocol === 1);
      const framework = await page.evaluate(() => window.__KRDS_FIXTURE__?.framework, undefined);
      if (framework !== fixture.framework) throw new Error(`Native framework mismatch: expected ${fixture.framework}, got ${framework}`);
    },
    async setState(next) { await page.evaluate(async patch => { if (!window.__KRDS_FIXTURE__) throw new Error('Fixture bridge missing'); await window.__KRDS_FIXTURE__.setState(patch); }, snapshot(next)); },
    async readEvents() { return page.evaluate(() => window.__KRDS_FIXTURE__!.readEvents(), undefined); },
  };
}
