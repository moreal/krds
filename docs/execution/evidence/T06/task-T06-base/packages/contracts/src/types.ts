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
}
