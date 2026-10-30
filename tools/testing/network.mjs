export function allowedRequest(rawUrl, resourceType, origin, assets, method = 'GET') {
  const url = new URL(rawUrl);
  return ['GET','HEAD'].includes(method) && url.origin===origin && assets.has(decodeURIComponent(url.pathname)) && !['eventsource','websocket'].includes(resourceType);
}
export async function guardStoryNetwork(context, origin, assets) {
  const violations=[]; const requests=[];
  await context.exposeBinding('__krdsForbiddenTransport',(_source,entry)=>violations.push(entry));
  await context.addInitScript(() => {
    const forbid = kind => class {
      constructor(url) { void window.__krdsForbiddenTransport({kind,url:String(url)}); throw new Error(`Forbidden story transport: ${kind}`); }
    };
    window.WebSocket=forbid('websocket'); window.EventSource=forbid('eventsource');
    if (navigator.serviceWorker) Object.defineProperty(navigator.serviceWorker,'register',{value: async url => { await window.__krdsForbiddenTransport({kind:'serviceworker',url:String(url)}); throw new Error('Forbidden story service worker'); }});
  });
  await context.routeWebSocket('**/*', ws => { violations.push({kind:'websocket',url:ws.url()}); ws.close(); });
  await context.route('**/*',async route=>{
    const request=route.request(); const entry={url:request.url(),kind:request.resourceType()}; requests.push(entry);
    if (!allowedRequest(entry.url,entry.kind,origin,assets,request.method())) { violations.push(entry); await route.abort('blockedbyclient'); }
    else await route.continue();
  });
  return {violations,requests, assertClean() { if (violations.length) throw new Error(`Forbidden story requests: ${JSON.stringify(violations)}`); }};
}
