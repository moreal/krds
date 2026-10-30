import type { FrameworkId } from '@unofficial-krds/contracts';
export type { FrameworkId } from '@unofficial-krds/contracts';
export interface FixtureCase { componentId: string; caseId: string; framework: FrameworkId; }
export interface FixtureEvent { name: string; detail: unknown; }
export interface FixtureDriver {
  open(fixture: FixtureCase): Promise<void>;
  setState(next: Record<string, unknown>): Promise<void>;
  readEvents(): Promise<ReadonlyArray<FixtureEvent>>;
}
export interface FixtureBridge {
  readonly protocol: 1;
  readonly framework: FrameworkId;
  setState(next: Record<string, unknown>): Promise<void>;
  getState(): Record<string, unknown>;
  readEvents(): FixtureEvent[];
  recordEvent(name: string, detail: unknown): void;
  subscribe(listener: (state: Record<string, unknown>) => void): () => void;
  dispose(): void;
}
declare global { interface Window { __KRDS_FIXTURE__?: FixtureBridge; } }
