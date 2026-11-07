export interface DemoSourceExcerpt { startLine: number; endLine: number; sha256: string; downloadUrl: string; value: string }
export interface DemoSourceFile { path: string; language: string; sha256: string; downloadUrl: string; role: string; symbolOrBranch: string; value?: string; excerpts?: DemoSourceExcerpt[] }
export function excerptLabel(excerpt: { startLine: number; endLine: number }, symbolOrBranch: string): string {
 return `발췌 · 줄 ${excerpt.startLine}–${excerpt.endLine} · ${symbolOrBranch}`;
}
