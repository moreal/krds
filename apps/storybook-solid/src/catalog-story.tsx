import { createStore, reconcile } from 'solid-js/store';
import { CatalogView, catalogSeed } from './catalog-view';
/** Every story owns plain local state. No fixture bridge, network or auth driver. */
export function CatalogStory(props: {
    componentId: string;
    caseId: string;
}) {
    const [store, setStore] = createStore(catalogSeed(props.componentId, props.caseId));
    const state = () => store;
    const patch = (next: Record<string, any>) => setStore(reconcile({ ...store, ...next }));
    const emit = (_name: string, detail: any, next?: Record<string, any>) => { const host = state().__host ?? {}; if (next && !state().rejectChanges && host.acceptChanges !== false && !(_name === 'openChange' && detail.open === false && host.acceptClose === false))
        patch(next); };
    return <CatalogView componentId={props.componentId} state={state} emit={emit} patch={patch}/>;
}
