const entities: Record<string,string> = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: '\u00a0', copy: '©', reg: '®', ndash: '–', mdash: '—', hellip: '…' };
/** Markdown text entities are decoded once; code spans/fences retain literal source. */
export const decodeEntities = (value: string): string => value.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (raw: string, entity: string) => entity[0] === '#' ? String.fromCodePoint(Number.parseInt(entity.slice(entity[1]!.toLowerCase() === 'x' ? 2 : 1), entity[1]!.toLowerCase() === 'x' ? 16 : 10)) : entities[entity] ?? raw);
/** One base-once helper for build content and the Solid shell. Canonical routes include /krds/. */
export function docUrl(href: string, sourcePath = 'index.md'): string {
 const value=decodeEntities(href);
 if(/^(https?:|mailto:|tel:)/i.test(value)||value.startsWith('//')||value.startsWith('#'))return value;
 if(/^[a-z][a-z\d+.-]*:/i.test(value))throw new Error(`Unsupported URL: ${value}`);
 const match=value.match(/^([^?#]*)([\s\S]*)$/)!;let path=match[1]!;const suffix=match[2]!;
 // Special-scheme browser URLs treat backslashes as path separators.
 path=path.replaceAll('\\','/');
 if(!path)path=sourcePath.replace(/\.md$/,'.html');
 else if(path==='/krds'||path.startsWith('/krds/'))path=path.slice(5)||'/';
 else if(!path.startsWith('/'))path=sourcePath.slice(0,sourcePath.lastIndexOf('/')+1)+path;
 // Resolve percent-encoded dot segments before adding the deployment base.
 // URL.pathname preserves reserved encodings such as %2F and %3F.
 path=new URL('https://krds.invalid/'+path.replace(/^\/+/, '')).pathname;
 const segments: string[]=[];for(const part of path.split('/')){if(part==='..')segments.pop();else if(part&&part!=='.')segments.push(part);}
 path='/'+segments.join('/')+(path.endsWith('/')&&segments.length?'/':'');
 if(path.endsWith('.md'))path=path.slice(0,-3)+'.html';else if(!path.endsWith('/')&&!/\.[^/]*$/.test(path))path+='.html';
 return '/krds'+path+suffix;
}
