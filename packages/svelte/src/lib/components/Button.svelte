<script lang="ts">
import { context } from './context.js';
const provider = context();
import type { ButtonProps } from './types.js';
let { children, element = $bindable(null), dir = provider.direction, type = 'button', disabled = false, variant = 'primary', size = 'medium', ...rest }: ButtonProps = $props();
</script>
<button {dir} bind:this={element} {...rest} {type} {disabled} data-krds-component="button" data-krds-part="root" data-krds-state={disabled?'disabled':''} data-krds-variant={variant} data-krds-size={size}><span data-krds-component="button" data-krds-part="label" data-krds-state="">{@render children?.()}</span></button>
