import { serveProduction, root, runSelected } from '../../../../tools/testing/support.mjs';
import { join } from 'node:path';
import { readFile } from 'node:fs/promises';
const server = await serveProduction(join(root, 'apps/fixture-angular/dist'), { fixture: true });
const consumer = JSON.parse(await readFile(join(root, '.superpowers/sdd/PLAN/t07a-angular-logs/outside-consumer.json'), 'utf8'));
const consumerServer = await serveProduction(join(consumer.directory, 'dist/browser'));
try {
  const result = await runSelected(['workspace', '@unofficial-krds/fixture-angular', 'exec', 'playwright', 'test', '--config', 'playwright.native.config.ts', ...process.argv.slice(2)], { env: { KRDS_ANGULAR_ORIGIN: server.origin, KRDS_ANGULAR_CONSUMER_ORIGIN: consumerServer.origin }, log: join(root, '.superpowers/sdd/PLAN/t07a-angular-logs/native-command.log') });
  process.exitCode = result.code;
} finally { await server.close(); await consumerServer.close(); }
