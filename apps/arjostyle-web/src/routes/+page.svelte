<script lang="ts">
  import BookingFlow from '$lib/components/booking/BookingFlow.svelte';
  let hoveredSide = $state<'tattoo' | 'software' | null>(null);
  let showBooking = $state(false);
</script>

<svelte:head>
  <title>Arjo Magno — Tattoo Artist & Software Developer</title>
  <meta
    name="description"
    content="Arjo Magno — tattoo artist and software developer based in the Philippines. Book a tattoo session or explore software projects."
  />
</svelte:head>

<!-- Hero split screen section -->
<div class="h-[calc(100vh-64px)] flex overflow-hidden">
  <!-- Tattoo side -->
  <a
    href="/tattoo"
    class="relative flex-1 transition-all duration-700 ease-out overflow-hidden cursor-pointer group
      {hoveredSide === 'tattoo'
      ? 'flex-[2]'
      : hoveredSide === 'software'
        ? 'flex-[0.6]'
        : 'flex-1'}"
    onmouseenter={() => (hoveredSide = 'tattoo')}
    onmouseleave={() => (hoveredSide = null)}
  >
    <!-- Dark overlay with gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-surface-900 via-surface-900/90 to-orange-950/40 z-10"></div>

    <!-- Content -->
    <div class="relative z-20 flex flex-col items-center justify-center h-full px-8 text-center">
      <div
        class="transition-all duration-500 {hoveredSide === 'software'
          ? 'opacity-40 scale-95'
          : 'opacity-100'}"
      >
        <p class="text-ink-500/60 text-xs font-mono tracking-[0.5em] uppercase mb-4">Tattoo Art</p>
        <h2 class="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">
          Ink<span class="text-ink-500">.</span>
        </h2>
        <p class="text-zinc-400 max-w-sm text-sm md:text-base leading-relaxed">
          Custom tattoo designs crafted with precision. From fine line to full color — your vision, my
          art.
        </p>
        <div class="mt-8 flex items-center gap-2 text-ink-500 group-hover:gap-4 transition-all duration-300">
          <span class="text-sm font-medium">Explore Portfolio</span>
          <span class="text-lg">→</span>
        </div>
      </div>
    </div>

    <!-- Decorative line -->
    <div class="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-ink-500/20 to-transparent z-20"></div>
  </a>

  <!-- Software side -->
  <a
    href="/software"
    class="relative flex-1 transition-all duration-700 ease-out overflow-hidden cursor-pointer group
      {hoveredSide === 'software'
      ? 'flex-[2]'
      : hoveredSide === 'tattoo'
        ? 'flex-[0.6]'
        : 'flex-1'}"
    onmouseenter={() => (hoveredSide = 'software')}
    onmouseleave={() => (hoveredSide = null)}
  >
    <div class="absolute inset-0 bg-gradient-to-bl from-surface-900 via-surface-900/90 to-cyan-950/40 z-10"></div>

    <div class="relative z-20 flex flex-col items-center justify-center h-full px-8 text-center">
      <div
        class="transition-all duration-500 {hoveredSide === 'tattoo'
          ? 'opacity-40 scale-95'
          : 'opacity-100'}"
      >
        <p class="text-tech-500/60 text-xs font-mono tracking-[0.5em] uppercase mb-4">Software Dev</p>
        <h2 class="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">
          Code<span class="text-tech-500">.</span>
        </h2>
        <p class="text-zinc-400 max-w-sm text-sm md:text-base leading-relaxed">
          Full-stack applications built for real businesses. SvelteKit, React, Cloudflare — shipping
          fast.
        </p>
        <div class="mt-8 flex items-center gap-2 text-tech-500 group-hover:gap-4 transition-all duration-300">
          <span class="text-sm font-medium">View Projects</span>
          <span class="text-lg">→</span>
        </div>
      </div>
    </div>
  </a>
</div>

<!-- CTA Strip below the fold -->
<section class="bg-surface-800 border-y border-zinc-800/50 py-16 px-6">
  <div class="max-w-4xl mx-auto text-center">
    <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">Ready for your next tattoo?</h3>
    <p class="text-zinc-400 mb-8 max-w-lg mx-auto">
      Use the interactive 3D body placement tool to explore options, get an instant price estimate,
      and book your session online.
    </p>
    <button
      onclick={() => (showBooking = true)}
      class="inline-flex items-center gap-2 bg-ink-500 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-ink-400 transition-colors text-lg active:scale-95"
    >
      Book a Session →
    </button>
  </div>
</section>

<!-- Booking Modal Overlay -->
{#if showBooking}
  <div class="fixed inset-0 z-[100] flex items-center justify-center">
    <!-- Backdrop -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="absolute inset-0 bg-black/80 backdrop-blur-sm"
      onclick={() => (showBooking = false)}
      onkeydown={(e) => { if (e.key === 'Escape') showBooking = false; }}
    ></div>
    <!-- Modal Content -->
    <div class="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-surface-900 border border-zinc-800 shadow-[0_0_60px_rgba(255,255,255,0.1)] mx-4">
      <button
        onclick={() => (showBooking = false)}
        class="absolute right-4 top-4 z-[110] flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
        aria-label="Close"
      >
        ✕
      </button>
      <BookingFlow onClose={() => (showBooking = false)} />
    </div>
  </div>
{/if}
