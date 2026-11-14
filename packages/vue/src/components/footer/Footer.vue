<script setup lang="ts">
import type { FooterContract } from '@unofficial-krds/contracts';
import Identifier from '../identifier/Identifier.vue';
defineProps<FooterContract>();
</script>
<template>
<footer data-krds-part="root" data-krds-component="footer" data-krds-state="">
<img data-krds-part="logo" :src="serviceLogo.src" :alt="serviceLogo.alt" data-krds-component="footer" data-krds-state=""/>
<address data-krds-part="contacts" data-krds-component="footer" data-krds-state="">
<p v-for="contact in contacts" :key="contact.label">{{contact.label}}: <a v-if="contact.href" :href="contact.href">{{contact.text}}</a><template v-else>{{contact.text}}</template></p>
</address>
<nav data-krds-part="utilities" aria-label="서비스 관련 링크" data-krds-component="footer" data-krds-state="">
<a v-for="link in utilityLinks" :key="link.href" :href="link.href" :target="link.target" :rel="link.target==='_blank'?[link.rel,'noopener noreferrer'].filter(Boolean).join(' '):link.rel">{{link.label}}<span v-if="link.target==='_blank'"> (새 창)</span></a>
</nav>
<nav data-krds-part="policies" aria-label="정책" data-krds-component="footer" data-krds-state="">
<a data-krds-part="privacy-link" :href="privacyPolicy.href" :target="privacyPolicy.target" :rel="privacyPolicy.target==='_blank'?[privacyPolicy.rel,'noopener noreferrer'].filter(Boolean).join(' '):privacyPolicy.rel" data-krds-component="footer" data-krds-state="">{{privacyPolicy.label}}<span v-if="privacyPolicy.target==='_blank'"> (새 창)</span></a>
<a v-for="link in policyLinks" :key="link.href" :href="link.href" :target="link.target" :rel="link.target==='_blank'?[link.rel,'noopener noreferrer'].filter(Boolean).join(' '):link.rel">{{link.label}}<span v-if="link.target==='_blank'"> (새 창)</span></a>
</nav>
<p data-krds-part="copyright" data-krds-component="footer" data-krds-state="">{{copyrightText}}</p>
<Identifier v-if="institution" v-bind="institution"/>
</footer>
</template>
