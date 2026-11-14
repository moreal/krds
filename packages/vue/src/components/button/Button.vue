<script setup lang="ts">
import { useKrds } from '../context';
const context = useKrds();
import { useAttrs, useSlots, watchEffect } from 'vue';
import { oneOf } from '../control';
const props = withDefaults(defineProps<{
    type?: 'button' | 'submit' | 'reset';
    disabled?: boolean;
    variant?: 'primary' | 'secondary' | 'tertiary' | 'text' | 'icon';
    size?: 'xsmall' | 'small' | 'medium' | 'large' | 'xlarge';
    name?: string;
    value?: string;
    form?: string;
}>(), { type: 'button', disabled: false, variant: 'primary', size: 'medium' });
const attrs = useAttrs(); const slots = useSlots();
if (!slots.default && !attrs['aria-label'] && !attrs['aria-labelledby']) throw new TypeError('Button needs an accessible name.');
watchEffect(() => { oneOf(props.type, ['button','submit','reset'], 'button type'); oneOf(props.variant, ['primary','secondary','tertiary','text','icon'], 'button variant'); oneOf(props.size, ['xsmall','small','medium','large','xlarge'], 'button size'); });
</script>
<template>
<button data-krds-component="button" data-krds-part="root" :dir="context.direction.value" :data-krds-state="disabled?'disabled':''" :data-krds-variant="variant" :data-krds-size="size" :type="type" :disabled="disabled" :name="name" :value="value" :form="form">
<span data-krds-component="button" data-krds-part="label" data-krds-state="">
<slot />
</span>
<span v-if="$slots.icon" data-krds-component="button" data-krds-part="icon" data-krds-state="" aria-hidden="true">
<slot name="icon" />
</span>
</button>
</template>
