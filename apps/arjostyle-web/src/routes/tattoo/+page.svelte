<script lang="ts">
  import { PenLine, Palette, Sparkles } from 'lucide-svelte';
  import BookingFlow from '$lib/components/booking/BookingFlow.svelte';
  let showBooking = $state(false);

  const specialties = [
    {
      icon: PenLine,
      title: 'Fine Line',
      description: 'Delicate, precise linework. Perfect for minimalist designs and detailed portraits.'
    },
    {
      icon: Palette,
      title: 'Blackwork',
      description: 'Bold, solid black pieces. Traditional designs with maximum impact and longevity.'
    },
    {
      icon: Sparkles,
      title: 'Color Realism',
      description: 'Photorealistic color work. Brings your vision to life with vibrant, true-to-life colors.'
    }
  ];

  // Gallery placeholder cards
  const galleryCards = Array.from({ length: 8 }, (_, i) => ({
    id: i + 1,
    gradient: ['from-ink-500/10 to-orange-500/5', 'from-pink-500/10 to-red-500/5', 'from-red-500/10 to-amber-500/5', 'from-orange-500/10 to-yellow-500/5', 'from-amber-500/10 to-orange-500/5', 'from-rose-500/10 to-pink-500/5', 'from-pink-500/10 to-rose-500/5', 'from-red-500/10 to-orange-500/5'][i % 8]
  }));
</script>

<svelte:head>
  <title>Tattoo Portfolio — Arjo Magno</title>
  <meta name="description" content="Custom tattoo designs. Fine line, blackwork, and color realism." />
</svelte:head>

<!-- Hero section -->
<section class="bg-surface-900 px-6 py-20">
  <div class="max-w-6xl mx-auto">
    <div class="mb-20">
      <p class="text-ink-500/80 font-mono text-sm tracking-widest uppercase mb-3">Ink & Art</p>
      <h1 class="font-display text-5xl md:text-6xl font-bold text-white mb-6">Tattoo Portfolio</h1>
      <p class="text-zinc-400 text-lg max-w-2xl leading-relaxed">
        Custom designs for every story. Each piece is a collaboration between artist and canvas —
        permanent art crafted with intention and precision.
      </p>
    </div>
  </div>
</section>

<!-- Gallery grid -->
<section class="bg-surface-900 px-6 py-12">
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
      {#each galleryCards as card}
        <div
          class={`aspect-square bg-gradient-to-br ${card.gradient} rounded-xl overflow-hidden border border-zinc-800/50 hover:border-ink-500/30 transition-all duration-300 hover:scale-[1.02] flex items-center justify-center relative group cursor-pointer`}
        >
          <!-- Subtle pattern overlay -->
          <div class="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(249,115,22,0.1),transparent_70%)]"></div>

          <!-- Coming Soon overlay -->
          <div class="relative z-10 text-center">
            <p class="text-zinc-400 font-mono text-sm tracking-wider">Coming Soon</p>
          </div>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- Specialties section -->
<section class="bg-surface-800 px-6 py-20">
  <div class="max-w-6xl mx-auto">
    <div class="mb-16">
      <h2 class="font-display text-4xl font-bold text-white mb-4">Specialties</h2>
      <p class="text-zinc-400 text-lg max-w-2xl">
        Whether you're looking for delicate fine lines, bold blackwork, or vibrant color realism, I
        bring technical skill and artistic vision to every piece.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
      {#each specialties as specialty}
        <div class="bg-surface-900 border border-zinc-800/50 rounded-xl p-8 hover:border-ink-500/30 transition-all duration-300">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-lg bg-ink-500/10 border border-ink-500/20 flex items-center justify-center">
              <svelte:component this={specialty.icon} class="w-6 h-6 text-ink-500" />
            </div>
            <h3 class="text-xl font-semibold text-white">{specialty.title}</h3>
          </div>
          <p class="text-zinc-400 leading-relaxed">{specialty.description}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- CTA section -->
<section class="bg-surface-900 px-6 py-20">
  <div class="max-w-4xl mx-auto">
    <div class="bg-gradient-to-br from-ink-500/10 to-orange-500/5 border border-ink-500/20 rounded-2xl p-12 md:p-16 text-center">
      <p class="text-ink-500 font-mono text-sm tracking-widest uppercase mb-4">Ready to create?</p>
      <h2 class="font-display text-4xl md:text-5xl font-bold text-white mb-6">Let's make something permanent.</h2>
      <p class="text-zinc-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
        Book a consultation and we'll design something that's uniquely yours. Use our 3D body
        placement tool to explore options and get instant pricing.
      </p>
      <button
        onclick={() => (showBooking = true)}
        class="inline-flex items-center gap-2 bg-ink-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-ink-400 transition-colors text-lg active:scale-95"
      >
        Book a Session →
      </button>
    </div>
  </div>
</section>

{#if showBooking}
  <div class="fixed inset-0 z-[100] flex items-center justify-center">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm" onclick={() => (showBooking = false)} onkeydown={(e) => { if (e.key === 'Escape') showBooking = false; }}></div>
    <div class="relative z-10 w-full max-w-4xl max-h-[90vh] overflow-hidden rounded-2xl bg-surface-900 border border-zinc-800 shadow-[0_0_60px_rgba(255,255,255,0.1)] mx-4">
      <button onclick={() => (showBooking = false)} class="absolute right-4 top-4 z-[110] flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors" aria-label="Close">✕</button>
      <BookingFlow onClose={() => (showBooking = false)} />
    </div>
  </div>
{/if}
