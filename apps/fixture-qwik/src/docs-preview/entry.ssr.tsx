// Build-time only: selects the native component$ for an explicit identity and prerenders it with the actual client manifest.
import { renderToString } from '@builder.io/qwik/server';
import { manifest } from '@qwik-client-manifest';
import { examples } from './examples';
import { PreviewHost } from './host';
import { instanceId } from '../../../../tools/docs-previews/qwik-manifest.mjs';
import '@unofficial-krds/styles/reset.css';
import '@unofficial-krds/styles/fonts.css';
import '@unofficial-krds/styles/base.css';
import '@unofficial-krds/styles/all.css';
import './preview.css';

const base = '/krds/previews/qwik/';

export async function render(componentId: string, exampleId: string) {
  if (!Object.hasOwn(examples, componentId) || exampleId !== 'default') throw new Error(`Unknown preview identity ${componentId}/${exampleId}`);
  const Example = examples[componentId];
  const styles = Object.entries(manifest.assets ?? {}).filter(([, asset]) => asset.name?.endsWith('.css')).map(([key]) => key);
  // Qwik assigns a fresh random `q:instance` on every render and ignores a supplied one; it names
  // the container and its inline function table (`qFuncs_<id>`). The prerendered document must
  // not change between builds, so the random token is swapped for an id derived from the preview
  // identity. Qwik writes the generated value back into this object, which is how it is found.
  const containerAttributes: Record<string, string> = { lang: 'ko' };
  const result = await renderToString(<>
    <head>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1"/>
      <title>{`Qwik KRDS ${componentId} 예제`}</title>
      {styles.map(key => <link key={key} rel="stylesheet" href={`${base}${key}`}/>)}
    </head>
    <body><PreviewHost componentId={componentId} exampleId={exampleId}><Example/></PreviewHost></body>
  </>, { manifest, base: `${base}build/`, containerTagName: 'html', containerAttributes });
  const generated = containerAttributes['q:instance'];
  const stable = instanceId(componentId, exampleId);
  if (!generated || generated.length < 8 || !/^[0-9a-z]+$/.test(generated)) throw new Error(`Unexpected q:instance ${JSON.stringify(generated)} for ${componentId}/${exampleId}`);
  if (!result.html.includes(`q:instance="${generated}"`) || result.html.includes(stable)) throw new Error(`Cannot pin q:instance for ${componentId}/${exampleId}`);
  return { ...result, html: result.html.replaceAll(generated, stable) };
}
