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
      title: 'FINE LINE',
      description: 'Delicate, precise linework. Perfect for minimalist designs and detailed portraits.'
    },
    {
      icon: Palette,
      title: 'BLACKWORK',
      description: 'Bold, solid black pieces. Traditional designs with maximum impact and longevity.'
    },
    {
      icon: Sparkles,
      title: 'COLOR REALISM',
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
<section class="relative bg-dark px-6 py-20 overflow-hidden border-b border-border">
  <!-- Background image collage placeholder -->
  <div class="absolute inset-0 z-0 grid grid-cols-3 gap-0 opacity-[0.05]" aria-hidden="true">
    {#each [imageUrls[0], imageUrls[2], imageUrls[4], imageUrls[6], imageUrls[8], imageUrls[10]] as src}
      <img {src} alt="" class="w-full h-full object-cover" loading="eager" />
    {/each}
  </div>
  <!-- Fade overlay -->
  <div class="absolute inset-0 z-[1] bg-gradient-to-b from-dark/60 via-dark/80 to-dark"></div>

  <div class="relative z-10 max-w-6xl mx-auto">
    <div class="mb-20">
      <p class="text-ink text-[10px] font-mono tracking-[0.5em] uppercase mb-3">INK & ART</p>
      <h1 class="font-display text-5xl md:text-7xl font-bold text-white tracking-wide mb-6">TATTOO PORTFOLIO</h1>
      <p class="text-zinc-400 text-lg max-w-2xl leading-relaxed">
        Custom designs for every story. Each piece is a collaboration between artist and canvas —
        permanent art crafted with intention and precision.
      </p>
    </div>
  </div>
</section>

<!-- Metrics Strip -->
<section class="bg-elevated border-b border-border px-6 py-10">
  <div class="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
    <div class="flex flex-col items-center gap-1">
      <span class="text-4xl font-display text-white">200+</span>
      <span class="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">Tattoos Done</span>
    </div>
    <div class="flex flex-col items-center gap-1">
      <span class="text-4xl font-display text-white">5+</span>
      <span class="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">Years Experience</span>
    </div>
    <div class="flex flex-col items-center gap-1">
      <span class="text-4xl font-display text-white">4.9<span class="text-ink text-2xl">★</span></span>
      <span class="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">Client Rating</span>
    </div>
    <div class="flex flex-col items-center gap-1">
      <span class="text-4xl font-display text-white">100%</span>
      <span class="text-[10px] font-mono text-zinc-500 tracking-widest uppercase">Custom Designs</span>
    </div>
  </div>
</section>

<!-- Portfolio Gallery -->
<Portfolio onOpenBookingModal={() => (showBooking = true)} />

<!-- Specialties section -->
<section class="bg-elevated px-6 py-20 border-b border-border">
  <div class="max-w-6xl mx-auto">
    <div class="mb-16">
      <h2 class="font-display text-4xl font-bold text-white mb-4 tracking-wide">SPECIALTIES</h2>
      <p class="text-zinc-400 text-lg max-w-2xl">
        Whether you're looking for delicate fine lines, bold blackwork, or vibrant color realism, I
        bring technical skill and artistic vision to every piece.
      </p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-2">
      {#each specialties as specialty}
        {@const Icon = specialty.icon}
        <div class="bg-dark border border-border p-8 hover:border-ink/30 transition-all duration-150">
          <div class="flex items-center gap-4 mb-4">
            <div class="w-12 h-12 border border-ink/30 flex items-center justify-center">
              <Icon class="w-6 h-6 text-ink" />
            </div>
            <h3 class="text-xl font-display text-white tracking-wide">{specialty.title}</h3>
          </div>
          <p class="text-zinc-400 leading-relaxed text-sm">{specialty.description}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- CTA section -->
<section class="bg-dark px-6 py-20">
  <div class="max-w-4xl mx-auto">
    <div class="bg-elevated border border-ink/20 p-12 md:p-16 text-center">
      <p class="text-ink text-[10px] font-mono tracking-[0.5em] uppercase mb-4">READY TO CREATE?</p>
      <h2 class="font-display text-4xl md:text-5xl font-bold text-white mb-6 tracking-wide">LET'S MAKE SOMETHING PERMANENT.</h2>
      <p class="text-zinc-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
        Book a consultation and I'll design something that's uniquely yours. Use the 3D body
        placement tool to explore options and get instant pricing.
      </p>
      <button
        onclick={() => (showBooking = true)}
        class="inline-flex items-center gap-2 bg-red-500 text-white px-8 py-4 font-bold text-base hover:bg-red-600 transition-all duration-150"
      >
        BOOK A SESSION →
      </button>
    </div>
  </div>
</section>

{#if showBooking}
  <div class="fixed inset-0 z-[100] flex items-center justify-center">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="absolute inset-0 bg-dark/95" onclick={() => (showBooking = false)} onkeydown={(e) => { if (e.key === 'Escape') showBooking = false; }}></div>
    <div class="relative z-10 w-full h-full sm:h-auto sm:max-w-5xl sm:max-h-[90vh] overflow-hidden bg-dark border border-border sm:shadow-[8px_8px_0_var(--border)] sm:mx-4">
      <button onclick={() => (showBooking = false)} class="absolute right-4 top-4 z-[110] flex h-10 w-10 items-center justify-center bg-elevated border border-border text-zinc-400 hover:bg-dark hover:text-white transition-colors" aria-label="Close">✕</button>
      <BookingFlow onClose={() => (showBooking = false)} />
    </div>
  </div>
{/if}
