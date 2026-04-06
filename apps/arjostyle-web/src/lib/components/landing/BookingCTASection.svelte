<script lang="ts">
  import GradientBlob from '$lib/components/ui/GradientBlob.svelte';
  import { magnetic } from '$lib/actions/magneticButton';
  import { scrollReveal } from '$lib/actions/scrollReveal';

  interface Props {
    onBook: () => void;
  }

  let { onBook }: Props = $props();
</script>

<section class="relative bg-surface-800 border-y border-zinc-800/50 py-20 px-6 overflow-hidden">
  <GradientBlob color="bg-ink-500/10" size="w-[500px] h-[500px]" position="top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />

  <div class="relative z-10 max-w-4xl mx-auto text-center" use:scrollReveal={{ y: 30 }}>
    <h3 class="text-2xl md:text-4xl font-display font-bold text-white mb-4">Ready for your next tattoo?</h3>
    <p class="text-zinc-400 mb-10 max-w-lg mx-auto leading-relaxed">Use the interactive 3D body placement tool to explore options, get an instant price estimate, and book your session online.</p>
    <button
      use:magnetic
      onclick={onBook}
      class="inline-flex items-center gap-2 bg-ink-500 text-white px-10 py-4 rounded-full font-semibold hover:bg-ink-400 transition-colors text-lg active:scale-95 shadow-lg shadow-ink-500/20 hover:shadow-ink-500/40"
    >
      Book a Session →
    </button>
  </div>
</section>
