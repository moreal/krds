// Local, deterministic data shared by the Angular docs examples. No network, API or remote asset.
/** An in-frame destination: the current preview URL (identity and token preserved) plus a local route. */
export function localRoute(path: string): string {
  const url = new URL(location.href);
  url.searchParams.set('route', path);
  return url.pathname + url.search;
}
/** Explicit preview URL for an asset the docs-preview build copies under its own base href. */
export function localAsset(name: string): string {
  return new URL('local-assets/' + name, document.baseURI).pathname;
}
/**
 * Native FormData of a form, shown as visible deterministic output.
 * Read from a button handler: the docs iframe sandbox has no allow-forms, so submit events never fire.
 */
export function formResult(form: HTMLFormElement): string {
  return JSON.stringify(Object.fromEntries([...new FormData(form)].map(([key, value]) => [key, typeof value === 'string' ? value : value.name])));
}
