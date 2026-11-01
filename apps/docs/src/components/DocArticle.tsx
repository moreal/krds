import type { DocPage } from '../content';
import { DocBlocks } from './DocBlocks';
export function DocArticle(props: { page: DocPage }) {
 return <article class="docs-article" lang={props.page.lang}><DocBlocks blocks={props.page.blocks} /></article>;
}
