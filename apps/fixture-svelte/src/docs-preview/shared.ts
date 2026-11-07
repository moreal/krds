import logo from '../../public/local-assets/specimen-logo.svg?url';
import iconLight from '../../public/local-assets/specimen-icon-light.svg?url';
import iconDark from '../../public/local-assets/specimen-icon-dark.svg?url';
import audio from '../../public/local-assets/specimen-audio.wav?url';
// Intentionally a plain string, never an import: Vite must not deploy this file so the reference really 404s.
const landscape = `${import.meta.env.BASE_URL}local-assets/example-landscape.svg`; // served file copied by the build, never inlined
const missing = `${import.meta.env.BASE_URL}local-assets/intentional-missing-image.svg`;
export const assets = { logo, landscape, iconLight, iconDark, audio, missing };
/** In-frame destination: the preview host renders a deterministic route page for `?route=`. */
export function localRoute(path: string) { const url = new URL(location.href); url.searchParams.set('route', path); return url.pathname + url.search; }
/** In-frame variant of the current example: the same entry URL with one extra query parameter. */
export function localParam(name: string, value: string) { const url = new URL(location.href); url.searchParams.set(name, value); return url.pathname + url.search; }
