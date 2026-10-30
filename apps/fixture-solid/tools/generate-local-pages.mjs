import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fullCatalogScenarios, fullCatalogStoryCases } from '@unofficial-krds/test-contracts';

// Independently authored documents make frozen native destinations inspectable.
// These are local navigation mocks, with no external service or router interception.
const destinations = new Set(['/local/notice', '/local/application', '/local/apply']);
function collect(value) {
  if (typeof value === 'string' && value.startsWith('/local/')) {
    const pathname = new URL(value, 'http://localhost').pathname;
    if (!pathname.split('/').includes('..')) destinations.add(pathname);
  } else if (Array.isArray(value)) {
    value.forEach(collect);
  } else if (value && typeof value === 'object') {
    Object.values(value).forEach(collect);
  }
}
collect(fullCatalogScenarios);
collect(fullCatalogStoryCases);
const escape = value => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
for (const pathname of [...destinations].sort()) {
  const label = escape(pathname);
  const html = `<!doctype html>
<html lang="ko"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>독립 로컬 목적지 ${label}</title></head>
<body><main><h1>독립 로컬 탐색 예제</h1><p>실제 링크를 통해 이 로컬 문서로 이동했습니다.</p><p data-krds-host="destination">목적지: ${label}</p><p>외부 서비스에 연결하지 않는 비공식 독립 예제입니다.</p><a href="/local/home">로컬 예제 홈</a></main></body></html>\n`;
  for (const publicRoot of ['../public', '../../storybook-solid/public']) {
    const file = join(import.meta.dirname, publicRoot, pathname, 'index.html');
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, html);
  }
}
process.stdout.write(`Wrote ${destinations.size} native local destination documents to both public roots.\n`);
