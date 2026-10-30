import { render } from '@lit-labs/ssr';
import { html } from 'lit';
import { writeFile, mkdir } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { presentationCases, fieldIds, demoIdentity, formCategories, resourceCategories, consentContent, layoutNavigation, layoutSections } from '@unofficial-krds/test-contracts/patterns';
import { root } from '../../../tools/testing/support.mjs';
const { registerPatternPresentation } = await import(pathToFileURL('/private/tmp/krds-t11-lit-ssr/packages/lit/examples/patterns/presentation.js'));
registerPatternPresentation(customElements);
const content = { fieldIds, demoIdentity, formCategories, resourceCategories, consentContent, layoutNavigation, layoutSections };
const results = [];
for (const entry of presentationCases) {
    try {
        const markup = [...render(html `<krds-pattern-presentation .state=${entry.state} .content=${content}></krds-pattern-presentation>`)].join('');
        const file = root + '/.superpowers/sdd/PLAN/t11-lit-logs/ssr/' + entry.id + '.html';
        await mkdir(root + '/.superpowers/sdd/PLAN/t11-lit-logs/ssr', { recursive: true });
        await writeFile(file, markup);
        results.push({ id: entry.id, rendered: true, bytes: Buffer.byteLength(markup), declarativeShadow: markup.includes('shadowroot'), limitation: 'Presentation is a light DOM LitElement in browser. This SSR renderer serializes a declarative shadow root; same-node service-flow hydration is not implemented or accepted.' });
    }
    catch (error) {
        results.push({ id: entry.id, rendered: false, error: String(error) });
    }
}
await writeFile(root + '/.superpowers/sdd/PLAN/t11-lit-logs/ssr/report.json', JSON.stringify(results, null, 2));
console.log(JSON.stringify(results, null, 2));

if(results.length!==16||results.some(result=>!result.rendered))process.exitCode=1;
