export type { FrameworkId, PreviewIdentity, PreviewMessage, PreviewInit } from './protocol';
import type { FrameworkId } from './protocol';
export interface SourceRange {
    start: number;
    end: number;
    sha256: string;
    startLine: number;
    endLine: number;
}
export interface SourceDefinition {
    path: string;
    language: string;
    role: 'example' | 'host' | 'data' | 'style' | 'asset';
    symbolOrBranch: string;
    ranges?: SourceRange[];
}
export interface DemoDefinition {
    framework: FrameworkId;
    componentId: string;
    exampleId: string;
    status: 'playable' | 'unavailable';
    acceptanceId?: string;
    classification?: 'interactive' | 'static';
    reason?: string;
    sources?: SourceDefinition[];
    minHeight?: number;
    layout?: 'inline' | 'overlay';
}
export interface Definitions {
    schemaVersion: 1;
    demos: DemoDefinition[];
}
export interface SourceBinding {
    componentId: string;
    exampleId: string;
    hostPath: string;
    sourcePath: string;
    entryUrl: string;
    symbolOrBranch: string;
    sha256: string;
    ranges?: SourceRange[];
}
export interface ArtifactManifest {
    schemaVersion: 1;
    framework: FrameworkId;
    identity: {
        package: string;
        version: string;
        renderer: string;
        compiler: string;
    };
    files: {
        path: string;
        sha256: string;
        size: number;
    }[];
    modules: {
        id: string;
        sha256: string;
        originals: {
            path: string;
            sha256: string;
        }[];
        package: string;
        version: string;
    }[];
    bindings: SourceBinding[];
}
export interface DemoIdentity {
    framework: FrameworkId;
    componentId: string;
    exampleId: string;
    label: string;
    channel: 'stable' | 'preview';
    package: string;
    packageVersion: string;
}
/**
 * One published extract per `ranges[i]` (index-aligned): the exact bytes `[start, end)` of the
 * source file, served at `downloadUrl` (`/krds/demo-sources/<path>.excerpt-<start>-<end>.txt`).
 * Present exactly when `ranges` is present.
 */
export interface SourceExcerpt {
    startLine: number;
    endLine: number;
    /** Equals `ranges[i].sha256`, the SHA-256 of the excerpt bytes. */
    sha256: string;
    downloadUrl: string;
}
export interface RegistrySource extends SourceDefinition {
    /** SHA-256 of the full file, published at `downloadUrl` (`/krds/demo-sources/<path>.txt`). */
    sha256: string;
    downloadUrl: string;
    excerpts?: SourceExcerpt[];
}
export interface PlayableDemo extends DemoIdentity {
    status: 'playable';
    entryUrl: string;
    artifactSha256: string;
    minHeight: number;
    layout: 'inline' | 'overlay';
    sources: RegistrySource[];
    acceptanceId: string;
    classification: 'interactive' | 'static';
    /** Exact intentionally-404 references derived from demo-acceptance.json. */
    absentReferences?: string[];
}
export interface UnavailableDemo extends DemoIdentity {
    status: 'unavailable';
    reason: string;
    entryUrl?: never;
}
export type DemoRegistryEntry = PlayableDemo | UnavailableDemo;
export function validateDefinitions(definitions: Definitions, catalog: {
    items: {
        id: string;
    }[];
} | string[], options?: {
    complete?: boolean;
}): {
    complete: boolean;
    defaultCount: number;
    unavailableCount: number;
};
export function validateArtifact(manifest: ArtifactManifest, definitions: Definitions, options?: {
    root?: string;
    outputDir?: string;
}): ArtifactManifest;
export function sha256(bytes: Uint8Array | string): string;
export function safePath(path: string): string;
export function readContained(root: string, path: string): Buffer;
export function validateRanges(bytes: Buffer, ranges: SourceRange[] | undefined, path: string): void;
export interface AcceptanceInventory {
    items: {
        componentId: string;
        /** `failureSpecimen.src` (an `/local-assets/intentional-missing-*` path) is the only absent reference. */
        initialState?: Record<string, unknown> & { src?: string; failureSpecimen?: { src: string; alt?: string } };
    }[];
}
export function intentionalAbsentReferences(acceptance: AcceptanceInventory | undefined, framework: string): Map<string, string[]>;
export function loadAcceptance(root?: string): AcceptanceInventory;
export function validateRegistry(entries: DemoRegistryEntry[], definitions?: Definitions, options?: {
    acceptance?: AcceptanceInventory;
    /** Reads a published `/krds/demo-sources/...` URL; enables full-file and excerpt byte checks. */
    readSource?: (downloadUrl: string) => Buffer;
}): DemoRegistryEntry[];
