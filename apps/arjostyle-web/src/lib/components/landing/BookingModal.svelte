<script lang="ts">
  import BookingFlow from '$lib/components/booking/BookingFlow.svelte';

  interface Props {
    show: boolean;
  }

  let { show = $bindable(false) }: Props = $props();
</script>

{#if show}
  <div class="fixed inset-0 z-[100] flex items-center justify-center">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="absolute inset-0 bg-dark/95"
      onclick={() => (show = false)}
      onkeydown={(e) => { if (e.key === 'Escape') show = false; }}></div>
    <div class="relative z-10 w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90dvh] overflow-y-auto overscroll-behavior-contain sm:overflow-hidden sm:border sm:border-border bg-dark shadow-[8px_8px_0_var(--border)] sm:mx-4">
      <button onclick={() => (show = false)}
        class="absolute right-4 top-4 z-[110] flex h-10 w-10 items-center justify-center bg-elevated border border-border text-zinc-400 hover:bg-dark hover:text-white transition-colors"
        aria-label="Close">✕</button>
      <svelte:boundary onerror={(e) => console.error('BookingFlow error:', e)}>
        <BookingFlow onClose={() => (show = false)} />
        {#snippet failed(error: unknown)}
          <div class="flex flex-col items-center justify-center gap-4 p-12 text-center">
            <p class="text-red-500 text-lg font-display tracking-wide">SOMETHING WENT WRONG</p>
            <p class="text-zinc-500 text-sm max-w-md">{error instanceof Error ? error.message : 'An unexpected error occurred.'}</p>
            <button onclick={() => (show = false)}
              class="mt-2 px-6 py-3 bg-elevated border border-border text-white hover:bg-dark transition-colors text-sm font-medium">CLOSE</button>
          </div>
        {/snippet}
      </svelte:boundary>
    </div>
  </div>
{/if}
