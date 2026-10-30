import { createSignal, onCleanup, onMount } from 'solid-js';
import { createStore, reconcile } from 'solid-js/store';
import { createFixtureBridge } from '@unofficial-krds/test-contracts/driver';
import { CatalogView, catalogSeed } from './catalog-view';
function plain(value: any): any { if (value instanceof File)
    return { name: value.name, size: value.size, type: value.type, lastModified: value.lastModified }; if (Array.isArray(value))
    return value.map(plain); if (value && typeof value === 'object')
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, plain(entry)])); return value; }
export function FullCatalogFixture(props: {
    componentId: string;
    caseId: string;
}) {
    const seed = catalogSeed(props.componentId, props.caseId);
    const handles = new Map<string, File>();
    for (const record of seed.files ?? [])
        handles.set(record.id, record.file);
    const [nativeFiles, setNativeFiles] = createSignal(seed.files ?? []);
    const bridge = createFixtureBridge('solid', plain(seed));
    const originalSetState=bridge.setState.bind(bridge);
    bridge.setState=async next=>{const host=next.__host as Record<string,any>|undefined;await originalSetState({...next,...(host?.routeChange?{__routeRemoved:true}:{})});};
    const [store, setStore] = createStore(bridge.getState() as Record<string, any>);
    const state = () => props.componentId === 'file-upload' ? { ...store, files: nativeFiles() } : store;
    const [ready, setReady] = createSignal(false);
    const unsubscribe = bridge.subscribe(next => { if (props.componentId === 'file-upload') {
        const records = (next.files as any[] ?? []).map(record => ({ ...record, file: handles.get(record.id) })).filter(record => record.file);
        setNativeFiles(records);
    } setStore(reconcile(next)); });
    onMount(() => setReady(true));
    onCleanup(() => { unsubscribe(); bridge.dispose(); handles.clear(); });
    const patch = (next: Record<string, any>) => { if (props.componentId === 'file-upload' && next.files)
        for (const record of next.files)
            if (record.file instanceof File)
                handles.set(record.id, record.file); void bridge.setState(plain(next)); };
    const emit = (name: string, detail: any, next?: Record<string, any>) => { bridge.recordEvent(name, plain(detail)); const host = state().__host ?? {}; if (next && !state().rejectChanges && host.acceptChanges !== false && !(name === 'openChange' && detail.open === false && host.acceptClose === false))
        patch(next); };
    return <><div role="status" aria-label="Fixture health">{ready() ? 'ready' : 'mounting'}</div><CatalogView componentId={props.componentId} state={state} emit={emit} patch={patch}/></>;
}
