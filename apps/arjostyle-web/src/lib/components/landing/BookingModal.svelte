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
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"
      onclick={() => (show = false)}
      onkeydown={(e) => { if (e.key === 'Escape') show = false; }}></div>
    <div class="relative z-10 w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90dvh] overflow-hidden sm:rounded-2xl bg-surface-900 sm:border sm:border-zinc-800 sm:shadow-[0_0_60px_rgba(255,255,255,0.1)] sm:mx-4">
      <button onclick={() => (show = false)}
        class="absolute right-4 top-4 z-[110] flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
        aria-label="Close">✕</button>
      <svelte:boundary onerror={(e) => console.error('BookingFlow error:', e)}>
        <BookingFlow onClose={() => (show = false)} />
        {#snippet failed(error: unknown)}
          <div class="flex flex-col items-center justify-center gap-4 p-12 text-center">
            <p class="text-red-400 text-lg font-semibold">Something went wrong</p>
            <p class="text-zinc-400 text-sm max-w-md">{error instanceof Error ? error.message : 'An unexpected error occurred.'}</p>
            <button onclick={() => (show = false)}
              class="mt-2 px-6 py-2 rounded-full bg-zinc-700 text-white hover:bg-zinc-600 transition-colors text-sm font-medium">Close</button>
          </div>
        {/snippet}
      </svelte:boundary>
    </div>
  </div>
{/if}
