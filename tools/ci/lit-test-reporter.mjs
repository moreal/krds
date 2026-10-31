// Node's enqueue/dequeue events expose file/subtest progress even while a test is stalled.
export default async function* litTestReporter(source) {
  for await (const {type, data} of source) {
    const location = [data.file, data.line, data.column].filter(value => value !== undefined).join(':');
    const prefix = `${new Date().toISOString()} [lit-node pid=${process.pid}]`;
    const label = `${data.name ?? ''}${location ? ` (${location})` : ''}`;
    if (type === 'test:enqueue') yield `${prefix} QUEUED ${label}\n`;
    else if (type === 'test:dequeue' || type === 'test:start') yield `${prefix} START ${label}\n`;
    else if (type === 'test:pass' || type === 'test:fail') yield `${prefix} ${type === 'test:pass' ? 'PASS' : 'FAIL'} ${label} durationMs=${data.details?.duration_ms ?? '?'}${data.details?.error ? ` ${data.details.error.stack ?? data.details.error.message}` : ''}\n`;
    else if (type === 'test:stdout' || type === 'test:stderr') yield `${prefix} ${type.slice(5)} ${data.message}`;
    else if (type === 'test:diagnostic') yield `${prefix} diagnostic ${data.message}\n`;
    else if (type === 'test:summary') yield `${prefix} summary ${JSON.stringify(data)}\n`;
  }
}
