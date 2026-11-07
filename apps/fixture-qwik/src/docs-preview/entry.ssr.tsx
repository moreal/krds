// Build-time only: selects the native component$ for an explicit identity and prerenders it with the actual client manifest.
import { renderToString } from '@builder.io/qwik/server';
import { manifest } from '@qwik-client-manifest';
import { examples } from './examples';
import { PreviewHost } from './host';
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
  return renderToString(<>
    <head>
      <meta charSet="utf-8"/>
      <meta name="viewport" content="width=device-width,initial-scale=1"/>
      <title>{`Qwik KRDS ${componentId} 예제`}</title>
      {styles.map(key => <link key={key} rel="stylesheet" href={`${base}${key}`}/>)}
    </head>
    <body><PreviewHost componentId={componentId} exampleId={exampleId}><Example/></PreviewHost></body>
  </>, { manifest, base: `${base}build/`, containerTagName: 'html', containerAttributes: { lang: 'ko' } });
}
