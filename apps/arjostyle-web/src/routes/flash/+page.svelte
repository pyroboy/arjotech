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

<div class="min-h-screen bg-dark text-zinc-100">
  <section class="pt-20 pb-12 px-6 text-center border-b border-border">
    <RevealOnScroll>
      <p class="text-ink text-[10px] font-mono uppercase tracking-[0.3em] mb-3">Ready to Book</p>
      <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-wide">FLASH DESIGNS</h1>
      <p class="text-zinc-500 text-lg max-w-xl mx-auto font-mono text-sm">
        Pre-drawn designs at a fixed price. No lengthy consultation — pick what you love and book it.
      </p>
    </RevealOnScroll>
  </section>

  {#if data.flashDesigns.length > 0}
    <div class="px-6 pb-8 pt-8 flex gap-1 justify-center border-b border-border">
      {#each (['all', 'available', 'claimed'] as const) as f}
        <button
          onclick={() => (filter = f)}
          class="px-4 py-2 text-sm font-mono transition-all duration-150 {filter === f
            ? 'bg-white text-dark font-bold'
            : 'bg-elevated text-zinc-500 border border-border hover:border-border-light hover:text-white'}"
        >
          {f === 'all' ? 'ALL' : f === 'available' ? 'AVAILABLE' : 'CLAIMED'}
        </button>
      {/each}
    </div>
  {/if}

  <section class="px-6 pb-20">
    <div class="max-w-6xl mx-auto">
      {#if data.flashDesigns.length === 0}
        <RevealOnScroll>
          <div class="text-center py-24 text-zinc-600">
            <p class="text-5xl mb-4">⚡</p>
            <p class="text-lg font-display text-zinc-400 mb-2 tracking-wide">FLASH DROPS COMING SOON</p>
            <p class="text-sm max-w-sm mx-auto text-zinc-600">Designing the first collection. Follow on Instagram to be notified when flash drops go live.</p>
            <a href="https://instagram.com/arjostyle.ink" target="_blank" rel="noopener noreferrer"
               class="mt-6 inline-block px-6 py-3 border border-border text-zinc-400 text-sm font-mono hover:bg-elevated hover:border-border-light transition-colors">
              @arjostyle.ink
            </a>
          </div>
        </RevealOnScroll>
      {:else}
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 mt-8">
          {#each filtered as design, i}
            <RevealOnScroll delay={i * 50}>
              <a href="/flash/{design.slug}"
                 class="group block border transition-all duration-150 {design.available ? 'bg-elevated border-border hover:border-ink/30' : 'bg-dark border-border/50 opacity-60'}">
                <div class="aspect-square overflow-hidden bg-dark relative">
                  <img src={design.imageUrl} alt={design.title} loading="lazy"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                  {#if !design.available}
                    <div class="absolute inset-0 bg-dark/60 flex items-center justify-center">
                      <span class="text-white text-sm font-mono px-3 py-1 border border-white/20">CLAIMED</span>
                    </div>
                  {/if}
                </div>
                <div class="p-4">
                  <h2 class="font-display text-white text-sm mb-1 group-hover:text-ink transition-colors tracking-wide">{design.title.toUpperCase()}</h2>
                  <p class="text-[10px] font-mono text-zinc-600 mb-2 uppercase tracking-widest">{design.style} — {design.size}</p>
                  <p class="text-ink font-display text-lg">{formatCurrency(design.price)}</p>
                </div>
              </a>
            </RevealOnScroll>
          {/each}
        </div>
      {/if}
    </div>
  </section>
</div>
