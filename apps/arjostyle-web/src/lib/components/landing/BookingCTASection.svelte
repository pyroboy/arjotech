<script lang="ts">
  import { scrollReveal } from '$lib/actions/scrollReveal';

  interface Props {
    onBook: () => void;
  }

  let { onBook }: Props = $props();
</script>

<section class="relative bg-elevated border-y border-border py-20 px-6 overflow-hidden">
  <!-- Hard edge geometric accents -->
  <div class="absolute top-0 left-0 w-48 h-1 bg-ink" aria-hidden="true"></div>
  <div class="absolute bottom-0 right-0 w-48 h-1 bg-tech" aria-hidden="true"></div>

  <div class="relative z-10 max-w-4xl mx-auto text-center" use:scrollReveal={{ y: 30 }}>
    <h3 class="font-display text-4xl md:text-6xl text-white tracking-wide mb-4">READY FOR YOUR NEXT TATTOO?</h3>
    <p class="text-zinc-500 mb-10 max-w-lg mx-auto text-sm leading-relaxed">Use the interactive 3D body placement tool to explore options, get an instant price estimate, and book your session online.</p>
    <button
      onclick={onBook}
<<<<<<< Updated upstream
      class="inline-flex items-center gap-2 bg-ink-500 text-white px-6 sm:px-10 py-3 sm:py-4 rounded-full font-semibold hover:bg-ink-400 transition-colors text-base sm:text-lg active:scale-95 shadow-lg shadow-ink-500/20 hover:shadow-ink-500/40"
=======
      class="inline-flex items-center gap-3 bg-red-500 text-white px-10 py-4 font-bold text-base hover:bg-red-600 transition-all duration-150 translate-y-0 hover:-translate-y-0.5"
>>>>>>> Stashed changes
    >
      BOOK A SESSION →
    </button>
  </div>
</section>
