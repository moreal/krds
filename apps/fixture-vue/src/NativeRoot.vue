<script setup lang="ts">
import { fullCatalogStoryCases } from '@unofficial-krds/test-contracts';
import VuePilots from './VuePilots.vue';
import CatalogFixture from './CatalogFixture.vue';
import PatternHost from './examples/PatternHost.vue';
const url = new URL(window.location.href);
const componentId = decodeURIComponent(url.pathname.split('/')[2] ?? '');
const caseId = url.searchParams.get('case') ?? '';
const catalog = fullCatalogStoryCases.some(item => item.componentId === componentId);
</script>
<template>
<PatternHost v-if="url.pathname.startsWith('/examples/')"/>
<CatalogFixture v-else-if="catalog" :component-id="componentId" :case-id="caseId"/>
<VuePilots v-else/>
</template>
