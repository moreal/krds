<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue';
import { LanguageSwitcher } from '@unofficial-krds/vue';
const hash=ref(location.hash);
const sync=()=>{hash.value=location.hash;};
onMounted(()=>addEventListener('hashchange',sync));
onUnmounted(()=>removeEventListener('hashchange',sync));
const locale=computed(()=>hash.value==='#local-en'?'en':'ko');
</script>
<template><div><LanguageSwitcher :current-locale="locale" :options="[{locale:'ko',nativeLabel:'한국어',translatedLabel:'한국어',href:'#local-ko'},{locale:'en',nativeLabel:'English',translatedLabel:'영어',href:'#local-en'}]"/><p :lang="locale">{{locale==='ko'?'한국어 예제':'English example'}}</p></div></template>
