<script setup lang="ts">
import type { SkipLinkContract } from '@unofficial-krds/contracts';
import { focusDestination } from '../catalog-state';
const p = defineProps<SkipLinkContract>();
if (p.links.length > 3)
    throw new RangeError('No more than three skip links');
function activate(e: MouseEvent, id: string) { e.preventDefault(); focusDestination(id); }
</script>
<template>
<nav aria-label="바로가기" data-krds-part="root" :data-krds-visibility="visibility??'focus-revealed'" data-krds-component="skip-link" data-krds-state="">
<ul data-krds-part="list" data-krds-component="skip-link" data-krds-state="">
<li v-for="link in links" :key="link.id">
<a data-krds-part="link" :href="`#${link.targetId}`" @click="activate($event,link.targetId)" data-krds-component="skip-link" data-krds-state="">{{link.label}}</a>
</li>
</ul>
</nav>
</template>
