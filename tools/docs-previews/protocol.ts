/** Browser-only protocol. Transport origin/source must also be checked by the receiver. */
export type FrameworkId = 'react' | 'solid' | 'svelte' | 'vue' | 'angular' | 'lit' | 'qwik' | 'solid-next';
export type PreviewIdentity = {
    version: 1;
    framework: FrameworkId;
    componentId: string;
    exampleId: string;
    token: string;
};
export type PreviewMessage = PreviewIdentity & ({
    type: 'ready';
} | {
    type: 'size';
    height: number;
} | {
    type: 'error';
    message: string;
} | {
    type: 'return-focus';
});
export type PreviewInit = PreviewIdentity & {
    type: 'init';
    presentation: {
        colorMode: 'light' | 'forced-colors';
        reducedMotion: boolean;
    };
};
const frameworks = ['react', 'solid', 'svelte', 'vue', 'angular', 'lit', 'qwik', 'solid-next'];
const identifier = /^[a-z][a-z0-9-]*$/;
function identity(v: Record<string, unknown>): boolean { return v.version === 1 && frameworks.includes(v.framework as string) && typeof v.componentId === 'string' && identifier.test(v.componentId) && v.componentId !== 'splash-screen' && typeof v.exampleId === 'string' && identifier.test(v.exampleId) && typeof v.token === 'string' && /^[A-Za-z0-9_-]{16,128}$/.test(v.token); }
export function parsePreviewMessage(value: unknown): PreviewMessage | null {
    if (!value || typeof value !== 'object' || Array.isArray(value))
        return null;
    const v = value as Record<string, unknown>;
    if (!identity(v))
        return null;
    const extra = v.type === 'size' ? ['height'] : v.type === 'error' ? ['message'] : [];
    if (!['ready', 'size', 'error', 'return-focus'].includes(v.type as string) || Object.keys(v).sort().join() !== ['version', 'framework', 'componentId', 'exampleId', 'token', 'type', ...extra].sort().join())
        return null;
    if (v.type === 'size' && (typeof v.height !== 'number' || !Number.isFinite(v.height) || v.height < 0))
        return null;
    if (v.type === 'error' && (typeof v.message !== 'string' || v.message.length > 2000))
        return null;
    return v as PreviewMessage;
}
export function matchesPreviewEvent(event: MessageEvent, origin: string, source: MessageEventSource | null, current: PreviewIdentity): PreviewMessage | null {
    if (event.origin !== origin || event.source !== source || !source)
        return null;
    const message = parsePreviewMessage(event.data);
    return message && (['version', 'framework', 'componentId', 'exampleId', 'token'] as const).every(k => message[k] === current[k]) ? message : null;
}
export function parsePreviewInit(value: unknown): PreviewInit | null {
    if (!value || typeof value !== 'object' || Array.isArray(value))
        return null;
    const v = value as Record<string, unknown>;
    if (!identity(v) || v.type !== 'init' || Object.keys(v).sort().join() !== ['version', 'framework', 'componentId', 'exampleId', 'token', 'type', 'presentation'].sort().join())
        return null;
    const p = v.presentation as Record<string, unknown>;
    if (!p || typeof p !== 'object' || Object.keys(p).sort().join() !== 'colorMode,reducedMotion' || !['light', 'forced-colors'].includes(p.colorMode as string) || typeof p.reducedMotion !== 'boolean')
        return null;
    return v as PreviewInit;
}
