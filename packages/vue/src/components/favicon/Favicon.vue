<script setup lang="ts">
import { onMounted, onUnmounted, watchEffect } from 'vue';
import type { FaviconContract } from '@unofficial-krds/contracts';
const p = defineProps<FaviconContract>();
let mounted = false;
const nodes: HTMLLinkElement[] = [];
function cleanup() {
    for (const node of nodes)
        node.remove();
    nodes.length = 0;
}
function update() {
    if (!mounted)
        return;
    cleanup();
    for (const [asset, media, rel] of [[p.light, p.dark ? '(prefers-color-scheme: light)' : undefined, 'icon'], [p.dark, '(prefers-color-scheme: dark)', 'icon'], [p.touchIcon, undefined, 'apple-touch-icon']] as const) {
        if (!asset)
            continue;
        const link = document.createElement('link');
        link.rel = rel;
        link.href = asset.href;
        link.type = asset.type;
        link.setAttribute('sizes', asset.sizes);
        if (media)
            link.media = media;
        link.dataset.krdsFavicon = '';
        nodes.push(link);
        document.head.append(link);
    }
}
watchEffect(() => { p.light; p.dark; p.touchIcon; update(); });
onMounted(() => { mounted = true; update(); });
onUnmounted(cleanup);
</script>
<template>
<!-- Head asset integration has no runtime body parts. -->
</template>
