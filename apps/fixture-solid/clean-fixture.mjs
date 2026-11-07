import { readdirSync, rmSync, existsSync } from 'node:fs';
const allowed = new Set(['index.html', 'assets', 'local', 'local-assets', '_legal', 'docs-preview']);
if (existsSync('dist')) {
  for (const name of readdirSync('dist')) {
    if (!allowed.has(name)) throw new Error(`Unowned fixture output: ${name}`);
  }
  for (const name of ['index.html', 'assets', 'local', 'local-assets', '_legal']) rmSync(`dist/${name}`, { recursive: true, force: true });
}
