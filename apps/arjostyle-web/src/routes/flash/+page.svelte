<script lang="ts">
  import RevealOnScroll from '$lib/components/ui/RevealOnScroll.svelte';
  import { formatCurrency } from '$lib/utils/formatters';
  import type { FlashDesign } from '$lib/data/flashData';

  let { data } = $props();
  let filter = $state<'all' | 'available' | 'claimed'>('all');

  const filtered = $derived(
    filter === 'all'
      ? data.flashDesigns
      : filter === 'available'
        ? data.flashDesigns.filter((f: FlashDesign) => f.available)
        : data.flashDesigns.filter((f: FlashDesign) => !f.available)
  );
</script>

<svelte:head>
  <title>Flash Designs — Arjo Magno</title>
  <meta name="description" content="Ready-to-book flash tattoo designs by Arjo Magno. Fixed price, no consultation needed — pick your design and book." />
  <meta property="og:title" content="Flash Designs — Arjo Magno" />
  <meta property="og:description" content="Ready-to-book flash tattoo designs. Fixed price, book instantly." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://arjostyle.ink/flash" />
</svelte:head>

<div class="min-h-screen bg-surface-900 text-zinc-100">
  <section class="pt-20 pb-12 px-6 text-center">
    <RevealOnScroll>
      <p class="text-ink-500 text-sm font-medium uppercase tracking-widest mb-3">Ready to Book</p>
      <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-4">Flash Designs</h1>
      <p class="text-zinc-400 text-lg max-w-xl mx-auto">
        Pre-drawn designs at a fixed price. No lengthy consultation — pick what you love and book it.
      </p>
    </RevealOnScroll>
  </section>

  {#if data.flashDesigns.length > 0}
    <div class="px-6 pb-8 flex gap-2 justify-center">
      {#each (['all', 'available', 'claimed'] as const) as f}
        <button
          onclick={() => (filter = f)}
          class="px-4 py-1.5 rounded-full text-sm border transition-colors {filter === f
            ? 'bg-ink-500/20 border-ink-500/50 text-ink-400'
            : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}"
        >
          {f === 'all' ? 'All' : f === 'available' ? 'Available' : 'Claimed'}
        </button>
      {/each}
    </div>
  {/if}

  <section class="px-6 pb-20">
    <div class="max-w-6xl mx-auto">
      {#if data.flashDesigns.length === 0}
        <RevealOnScroll>
          <div class="text-center py-24 text-zinc-500">
            <p class="text-5xl mb-4">⚡</p>
            <p class="text-lg font-medium text-zinc-400 mb-2">Flash drops coming soon</p>
            <p class="text-sm max-w-sm mx-auto">Designing the first collection. Follow on Instagram to be notified when flash drops go live.</p>
            <a href="https://instagram.com/arjostyle.ink" target="_blank" rel="noopener noreferrer"
               class="mt-6 inline-block px-6 py-2.5 border border-zinc-700 text-zinc-300 rounded-full text-sm hover:bg-zinc-800 transition-colors">
              @arjostyle.ink
            </a>
          </div>
        </RevealOnScroll>
      {:else}
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {#each filtered as design, i}
            <RevealOnScroll delay={i * 50}>
              <a href="/flash/{design.slug}"
                 class="group block rounded-xl overflow-hidden border transition-colors {design.available ? 'border-zinc-800 hover:border-ink-500/40' : 'border-zinc-800/50 opacity-60'} bg-zinc-900">
                <div class="aspect-square overflow-hidden bg-zinc-800 relative">
                  <img src={design.imageUrl} alt={design.title} loading="lazy"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  {#if !design.available}
                    <div class="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span class="text-white text-sm font-medium px-3 py-1 rounded-full bg-zinc-900/80">Claimed</span>
                    </div>
                  {/if}
                </div>
                <div class="p-4">
                  <h2 class="font-semibold text-white text-sm mb-1 group-hover:text-ink-400 transition-colors">{design.title}</h2>
                  <p class="text-xs text-zinc-500 mb-2">{design.style} · {design.size}</p>
                  <p class="text-ink-400 font-bold">{formatCurrency(design.price)}</p>
                </div>
              </a>
            </RevealOnScroll>
          {/each}
        </div>
      {/if}
    </div>
  </section>
</div>
