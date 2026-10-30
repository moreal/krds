<script lang="ts">
// Infrastructure only; no KRDS component coverage.
let { count = 0, label = 'Probe increment', disabled = false, loading = false, errorMessage = '' }: {
    count?: number;
    label?: string;
    disabled?: boolean;
    loading?: boolean;
    errorMessage?: string;
} = $props();
</script>

{#if errorMessage}
  <p role="alert">{errorMessage}</p>
{:else}
  <button type="button" disabled={disabled || loading} onclick={() => { count += 1; }}>{label}</button>
  <p role="status" aria-label="Probe value">{count}</p>
{/if}
