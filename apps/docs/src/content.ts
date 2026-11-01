/** Serializable build-only Markdown output; route/hrefs include /krds/ exactly once. */
export type DocInline =
 | { type: 'text' | 'code'; value: string }
 | { type: 'break' }
 | { type: 'link'; href: string; title?: string; target?: string; rel?: string; children: DocInline[] }
 | { type: 'strong' | 'em' | 'del' | 'kbd' | 'sub' | 'sup' | 'mark' | 'abbr'; title?: string; children: DocInline[] };
export type DocBlock =
 | { type: 'heading'; level: number; id: string; children: DocInline[] }
 | { type: 'paragraph'; children: DocInline[] }
 | { type: 'code'; value: string; language: string }
 | { type: 'list'; ordered: boolean; start: number; items: { id: string; blocks: DocBlock[] }[] }
 | { type: 'table'; caption: string; headers: DocInline[][]; rows: DocInline[][][]; align: ('left' | 'center' | 'right' | null)[] }
 | { type: 'quote'; blocks: DocBlock[] }
 | { type: 'rule' | 'home' };
export interface DocHeading { id: string; title: string; level: number; }
export interface NavigationItem { id: string; label: string; href: string; children?: NavigationItem[]; }
export interface DocPage {
 sourcePath: string | null; outputPath: string; route: string; title: string; lang: 'ko-KR' | 'en';
 blocks: DocBlock[]; headings: DocHeading[]; breadcrumbs: NavigationItem[]; currentId: string;
 previous?: NavigationItem; next?: NavigationItem;
}
export interface SearchRecord { id: string; href: string; title: string; heading: string; text: string; lang: DocPage['lang']; }
