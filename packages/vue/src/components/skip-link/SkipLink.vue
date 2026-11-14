<script setup lang="ts">
import type { SkipLinkContract } from '@unofficial-krds/contracts';
import { focusDestination } from '../catalog-state';
const p = defineProps<SkipLinkContract>();
if (p.links.length > 3)
    throw new RangeError('No more than three skip links');
function activate(e: MouseEvent, id: string) { e.preventDefault(); focusDestination(id); }
</script>
<template>
<nav data-krds-component="skip-link" data-krds-part="root" data-krds-state="" :data-krds-visibility="visibility??'focus-revealed'" aria-label="건너뛰기">
<ul data-krds-component="skip-link" data-krds-part="list" data-krds-state="">
<li v-for="link in links" :key="link.id" data-krds-component="skip-link" data-krds-part="item" data-krds-state="">
<a data-krds-component="skip-link" data-krds-part="link" data-krds-state="" :href="`#${link.targetId}`" @click="activate($event,link.targetId)">{{link.label}}</a>
</li>
</ul>
</nav>
</template>
