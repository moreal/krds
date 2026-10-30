import {SourceFileContracts}from './source-file-contracts';
import {SourceContracts}from './source-contracts';
import {PatternRoute,patternRouteForUrl}from './examples/pattern-route';
export {patternRouteForUrl};
import { CatalogProduction } from './catalog-production';
import { renderToString } from '@builder.io/qwik/server';
import { Button, Calendar, DateInput, NativeSelect, Tabs } from '@unofficial-krds/qwik';
import { manifest } from '@qwik-client-manifest';
import Root from './root';
import Resume from './resume';
import Examples from './examples';
import Fix1 from './fix1';
export async function render(options: {
    resume?: boolean;
    sourceContract?:string;
    sourceFileContract?:string;
    examples?: boolean;
    configuration?: string;
    fix1?: boolean;
    catalog?: {componentId:string;caseId:string};
    pattern?:{patternId:string;caseId?:string;search?:string};
} = {}) {
    return renderToString(<><head><meta charSet="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/><title>Qwik native production fixture</title></head><body>{options.configuration === 'date-range-null' ? <DateInput mode="range" defaultValue={null} label="Invalid configuration"/> :
            options.configuration === 'calendar-range-null' ? <Calendar mode="range" defaultValue={null} label="Invalid configuration"/> :
                options.configuration === 'date-partial-range' ? <DateInput mode="range" defaultValue={{ start: '2024-02-29', end: null }} label="Invalid configuration"/> :
                    options.configuration === 'calendar-reference' ? <Calendar label="Invalid configuration" referenceDate="2023-02-29"/> :
                        options.configuration === 'select-duplicate' ? <NativeSelect label="Invalid configuration" options={[{ value: 'x', label: 'One' }, { value: 'x', label: 'Two' }]}/> :
                            options.configuration === 'tabs-value' ? <Tabs label="Invalid configuration" value="missing" items={[{ value: 'first', label: 'First', content: 'First' }]}/> :
                                options.configuration === 'button-variant' ? <Button variant={'invalid' as never}>Invalid configuration</Button> :
                                    options.sourceFileContract ? <SourceFileContracts caseId={options.sourceFileContract}/> : options.sourceContract ? <SourceContracts caseId={options.sourceContract}/> : options.pattern ? <PatternRoute {...options.pattern}/> : options.catalog ? <CatalogProduction componentId={options.catalog.componentId} caseId={options.catalog.caseId}/> : options.fix1 ? <Fix1 /> : options.examples ? <Examples /> : options.resume ? <Resume /> : <Root />}</body></>, { manifest, base: '/build/', containerTagName: 'html', containerAttributes: { lang: 'ko' } });
}
export default render;
