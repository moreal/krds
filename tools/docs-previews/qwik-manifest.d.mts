export function hashCode(text: string, hash?: number): string;
export function normalizeClientManifest<T extends { manifestHash?: string; platform?: Record<string, unknown>; assets?: Record<string, unknown> }>(manifest: T): T;
export function instanceId(componentId: string, exampleId: string): string;
