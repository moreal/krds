<script setup lang="ts">
import type { FooterContract } from '@unofficial-krds/contracts';
import Identifier from '../identifier/Identifier.vue';
defineProps<FooterContract>();
</script>
<template>
<footer data-krds-part="root" data-krds-component="footer" data-krds-state="">
<img data-krds-part="logo" :src="serviceLogo.src" :alt="serviceLogo.alt" data-krds-component="footer" data-krds-state=""/>
<address data-krds-part="contacts" data-krds-component="footer" data-krds-state="">
<p v-for="contact in contacts" :key="contact.label">
<span>{{contact.label}} </span>
<a v-if="contact.href" :href="contact.href">{{contact.text}}</a>
<span v-else>{{contact.text}}</span>
</p>
</address>
<ul data-krds-part="utilities" data-krds-component="footer" data-krds-state="">
<li v-for="link in utilityLinks" :key="link.href">
<a :href="link.href" :target="link.target" :rel="link.target==='_blank'?[link.rel,'noopener noreferrer'].filter(Boolean).join(' '):link.rel">{{link.label}}<span v-if="link.target==='_blank'"> (새 창)</span>
</a>
</li>
</ul>
<a data-krds-part="privacy-link" :href="privacyPolicy.href" :target="privacyPolicy.target" :rel="privacyPolicy.target==='_blank'?[privacyPolicy.rel,'noopener noreferrer'].filter(Boolean).join(' '):privacyPolicy.rel" data-krds-component="footer" data-krds-state="">
<strong>{{privacyPolicy.label}}</strong>
<span v-if="privacyPolicy.target==='_blank'"> (새 창)</span>
</a>
<ul data-krds-part="policies" data-krds-component="footer" data-krds-state="">
<li v-for="link in policyLinks" :key="link.href">
<a :href="link.href" :target="link.target" :rel="link.target==='_blank'?[link.rel,'noopener noreferrer'].filter(Boolean).join(' '):link.rel">{{link.label}}<span v-if="link.target==='_blank'"> (새 창)</span>
</a>
</li>
</ul>
<p data-krds-part="copyright" data-krds-component="footer" data-krds-state="">{{copyrightText}}</p>
<Identifier v-if="institution" v-bind="institution"/>
</footer>
</template>
