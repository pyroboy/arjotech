<script lang="ts">
  import { PenLine, Palette, Sparkles } from 'lucide-svelte';
  import BookingFlow from '$lib/components/booking/BookingFlow.svelte';
  import Portfolio from '$lib/components/landing/Portfolio.svelte';
  import { bookingStore } from '$lib/stores/booking.svelte';
  import { imageUrls } from '$data/portfolioData';
  import { onMount } from 'svelte';
  let showBooking = $state(false);

  onMount(() => { bookingStore.loadMappingsFromKV(); });

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
</script>

<svelte:head>
  <title>Tattoo Portfolio — Arjo Magno</title>
  <meta name="description" content="Custom tattoo designs. Fine line, blackwork, and color realism." />
  <meta property="og:title" content="Tattoo Portfolio — Arjo Magno" />
  <meta property="og:description" content="Custom tattoo designs. Fine line, blackwork, and color realism." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://arjostyle-web.pages.dev/tattoo" />
</svelte:head>

<!-- Hero section -->
<section class="relative bg-surface-900 px-6 py-20 overflow-hidden">
  <!-- Background image collage placeholder -->
  <div class="absolute inset-0 z-0 grid grid-cols-3 gap-0 opacity-[0.08]" aria-hidden="true">
    {#each [imageUrls[0], imageUrls[2], imageUrls[4], imageUrls[6], imageUrls[8], imageUrls[10]] as src}
      <img {src} alt="" class="w-full h-full object-cover" loading="eager" />
    {/each}
  </div>
  <!-- Fade overlay -->
  <div class="absolute inset-0 z-[1] bg-gradient-to-b from-surface-900/60 via-surface-900/80 to-surface-900"></div>

  <div class="relative z-10 max-w-6xl mx-auto">
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

<!-- Metrics Strip -->
<section class="bg-surface-800 border-y border-zinc-800/50 px-6 py-10">
  <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
    <div class="flex flex-col items-center gap-1">
      <span class="text-4xl font-bold text-white">200+</span>
      <span class="text-sm text-zinc-400 tracking-wide uppercase font-medium">Tattoos Done</span>
    </div>
    <div class="flex flex-col items-center gap-1">
      <span class="text-4xl font-bold text-white">5+</span>
      <span class="text-sm text-zinc-400 tracking-wide uppercase font-medium">Years Experience</span>
    </div>
    <div class="flex flex-col items-center gap-1">
      <span class="text-4xl font-bold text-white">4.9<span class="text-ink-500 text-2xl">★</span></span>
      <span class="text-sm text-zinc-400 tracking-wide uppercase font-medium">Client Rating</span>
    </div>
    <div class="flex flex-col items-center gap-1">
      <span class="text-4xl font-bold text-white">100%</span>
      <span class="text-sm text-zinc-400 tracking-wide uppercase font-medium">Custom Designs</span>
    </div>
  </div>
</section>

<!-- Portfolio Gallery -->
<Portfolio onOpenBookingModal={() => (showBooking = true)} />

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
        {@const Icon = specialty.icon}
        <div class="bg-surface-900 border border-zinc-800/50 rounded-xl p-8 hover:border-ink-500/30 transition-all duration-300">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 rounded-lg bg-ink-500/10 border border-ink-500/20 flex items-center justify-center">
              <Icon class="w-6 h-6 text-ink-500" />
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
        Book a consultation and I'll design something that's uniquely yours. Use the 3D body
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
    <div class="relative z-10 w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90vh] overflow-hidden sm:rounded-2xl bg-surface-900 sm:border sm:border-zinc-800 sm:shadow-[0_0_60px_rgba(255,255,255,0.1)] sm:mx-4">
      <button onclick={() => (showBooking = false)} class="absolute right-4 top-4 z-[110] flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors" aria-label="Close">✕</button>
      <BookingFlow onClose={() => (showBooking = false)} />
    </div>
  </div>
{/if}
