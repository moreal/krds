import type { FixtureBridge } from '@unofficial-krds/test-contracts';
import scenarios from '../../../catalog/full-catalog-scenarios.json';
import { CatalogExample } from './CatalogExample';
export function catalogScenario(componentId: string, caseId: string) {
    return scenarios.cases.find(item => item.componentId === componentId && item.caseId === caseId);
}
function transport(value: unknown): unknown {
    if (value instanceof File)
        return { name: value.name, type: value.type, size: value.size, lastModified: value.lastModified };
    if (Array.isArray(value))
        return value.map(transport);
    if (value && typeof value === 'object')
        return Object.fromEntries(Object.entries(value).filter(([, v]) => v !== undefined).map(([key, v]) => [key, transport(v)]));
    return value;
}
export function CatalogFixture({ componentId, caseId, state, bridge }: {
    componentId: string;
    caseId: string;
    state: Record<string, unknown>;
    bridge?: FixtureBridge;
}) {
    const selected = catalogScenario(componentId, caseId);
    if (!selected)
        return <p role="note">Component not implemented: {componentId}/{caseId}</p>;
    return <CatalogExample key={`${componentId}/${caseId}`} componentId={componentId} initialState={selected.initialState} host={selected.host} state={state} onEvent={(name, detail) => bridge?.recordEvent(name, transport(detail))} onCommit={patch => { void bridge?.setState(transport(patch) as Record<string, unknown>); }}/>;
}
