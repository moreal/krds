/** Semantic data only. Native adapter props and callback wiring extend these types. */
export type FrameworkId =
  | "solid" | "react" | "svelte" | "vue" | "lit"
  | "qwik" | "angular" | "solid-next";

export interface OpenChangeDetails { open: boolean; }
export interface ValueChangeDetails<T> { value: T; }
export interface SelectOption { value: string; label: string; disabled?: boolean; }
export interface DateParts { year: number; month: number; day: number; }
export interface DateRangeValue { start: string | null; end: string | null; }
export interface ComponentCoverage {
  componentId: string;
  framework: FrameworkId;
  status: "planned" | "in-progress" | "implemented" | "verified" | "blocked";
  specPath: string;
  evidencePaths: string[];
  verification?: StableNativeVerification;
}

/** Acceptance metadata is written only after actual controller-owned independent review. */
export type StableFrameworkId = Exclude<FrameworkId, 'solid-next'>;
export type NativeCheckKind = 'typecheck' | 'build' | 'visual' | 'shadow-dom' | 'lazy-first-event' | 'partial-apf' | 'cva-form-reset' | 'manual-accessibility' | 'local-assets-provenance';
export interface NativeCheckReport {
  kind: NativeCheckKind; componentId: string; framework: StableFrameworkId;
  status: 'passed'; executed: true; exitCode: 0;
  command: string; observations: readonly string[]; logPath: string;
}
export interface StableNativeVerification {
  componentId: string; framework: StableFrameworkId; nativeRenderer: StableFrameworkId;
  profile: 'stable'; status: 'accepted'; candidate: false; preview?: false;
  sourceSha256: string; specPath: string; docsPath: string; reviewPath: string;
  reviewAcceptance: {componentId: string; framework: StableFrameworkId; status: 'approved'; independent: true; reviewer: string; critical: 0; important: 0};
  nativeSourcePaths: readonly string[]; storySourcePaths: readonly string[];
  publicApi: PublicApiVerification;
  fileHashes: Readonly<Record<string, string>>;
  behavior: {caseIds: readonly string[]; reportPath: string; rawPath: string};
  stories: {storyIds: readonly string[]; reportPath: string; screenshotDirectory: string};
  checks: readonly {kind: NativeCheckKind; reportPath: string}[];
}

/** Published-shape availability inside an existing same-framework workspace; T14 is separate. */
export interface PublicApiVerification {
  packageName: string; exportName: string; packageJsonPath: string;
  entryPoint: string; importSpecifier: string;
  runtimeEntryPath: string; typesEntryPath: string;
  entrySourcePaths: readonly string[]; artifactPaths: readonly string[];
  consumerWorkspacePath: string; consumerSourcePaths: readonly string[]; reportPath: string;
}
export interface PublicApiConsumerReport extends Omit<PublicApiVerification, 'reportPath'> {
  kind: 'public-api-consumer'; componentId: string; framework: StableFrameworkId;
  status: 'passed'; executed: true; exitCode: 0; runtimeImported: true; typesCompiled: true;
  command: string; observations: readonly string[]; logPath: string;
}
