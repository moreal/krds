<script lang="ts">
import { setContext, type Snippet } from 'svelte';
import { providerKey, type KrdsContext } from './context.js';
let { children, locale = 'ko-KR', direction = 'ltr', document: ownerDocument }: KrdsContext & {
    children: Snippet;
} = $props();
setContext(providerKey, { get locale() {
        return locale;
    }, get direction() {
        return direction;
    }, get document() {
        return ownerDocument;
    } });
</script>
{@render children()}
