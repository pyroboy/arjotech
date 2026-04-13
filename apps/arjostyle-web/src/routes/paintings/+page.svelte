<script lang="ts">
  import RevealOnScroll from '$lib/components/ui/RevealOnScroll.svelte';
  import { formatCurrency } from '$lib/utils/formatters';
  import type { Painting } from '$lib/data/paintingsData';

  let { data } = $props();

  const STATUS_LABELS: Record<Painting['status'], string> = {
    available: 'Available',
    sold: 'Sold',
    commissioned: 'Commissioned',
    nfs: 'Not for Sale'
  };
  const STATUS_COLORS: Record<Painting['status'], string> = {
    available: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
    sold: 'bg-elevated text-zinc-500 border-border',
    commissioned: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    nfs: 'bg-elevated text-zinc-600 border-border'
  };

  let filter = $state<Painting['status'] | 'all'>('all');

  const filtered = $derived(
    filter === 'all' ? data.paintings : data.paintings.filter((p: Painting) => p.status === filter)
  );
</script>

<svelte:head>
  <title>Paintings — Arjo Magno</title>
  <meta name="description" content="Original acrylic and mixed media paintings by Arjo Magno. Available for purchase and commission." />
  <meta property="og:title" content="Paintings — Arjo Magno" />
  <meta property="og:description" content="Original paintings available for sale and commission." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://arjostyle.ink/paintings" />
</svelte:head>

<div class="min-h-screen bg-dark text-zinc-100">
  <!-- Hero -->
  <section class="pt-20 pb-12 px-6 text-center border-b border-border">
    <RevealOnScroll>
      <p class="text-ink text-[10px] font-mono uppercase tracking-[0.3em] mb-3">Original Works</p>
      <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-wide">
        PAINTINGS
      </h1>
      <p class="text-zinc-500 text-lg max-w-xl mx-auto font-mono text-sm">
        Acrylic and mixed media originals. Available for purchase or commission.
        <a href="/pricing#paintings" class="text-ink hover:underline ml-1">View pricing →</a>
      </p>
    </RevealOnScroll>
  </section>

  <!-- Filter -->
  {#if data.paintings.length > 0}
    <div class="px-6 pb-8 pt-8 flex flex-wrap gap-1 justify-center border-b border-border">
      {#each (['all', 'available', 'commissioned', 'sold', 'nfs'] as const) as f}
        <button
          onclick={() => (filter = f)}
          class="px-4 py-2 text-sm font-mono transition-all duration-150 {filter === f
            ? 'bg-white text-dark font-bold'
            : 'bg-elevated text-zinc-500 border border-border hover:border-border-light hover:text-white'}"
        >
          {f === 'all' ? 'ALL' : STATUS_LABELS[f].toUpperCase()}
        </button>
      {/each}
    </div>
  {/if}

  <!-- Gallery -->
  <section class="px-6 pb-20">
    <div class="max-w-6xl mx-auto">
      {#if data.paintings.length === 0}
        <RevealOnScroll>
          <div class="text-center py-24 text-zinc-600">
            <p class="text-5xl mb-4">🖼</p>
            <p class="text-lg font-display text-zinc-400 mb-2 tracking-wide">GALLERY COMING SOON</p>
            <p class="text-sm max-w-sm mx-auto text-zinc-600">Photographing and cataloguing the inventory. Check back soon — or inquire about a commission now.</p>
          </div>
        </RevealOnScroll>
      {:else}
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-8">
          {#each filtered as painting, i}
            <RevealOnScroll delay={i * 60}>
              <a href="/paintings/{painting.slug}" class="group block bg-elevated border border-border hover:border-ink/30 transition-all duration-150">
                <div class="aspect-[4/3] overflow-hidden bg-dark">
                  <img
                    src={painting.imageUrl}
                    alt={painting.title}
                    loading="lazy"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <div class="p-4">
                  <div class="flex items-start justify-between gap-2 mb-1">
                    <h2 class="font-display text-white text-base group-hover:text-ink transition-colors tracking-wide">{painting.title.toUpperCase()}</h2>
                    <span class="text-[10px] font-mono px-2 py-0.5 border shrink-0 {STATUS_COLORS[painting.status]} uppercase tracking-widest">
                      {STATUS_LABELS[painting.status]}
                    </span>
                  </div>
                  <p class="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{painting.medium} — {painting.dimensions} — {painting.year}</p>
                  {#if painting.price && painting.status === 'available'}
                    <p class="text-ink font-display text-lg mt-2">{formatCurrency(painting.price)}</p>
                  {/if}
                </div>
              </a>
            </RevealOnScroll>
          {/each}
        </div>
      {/if}
    </div>
  </section>

  <!-- Commission CTA -->
  <section class="py-20 px-6 text-center border-t border-border">
    <RevealOnScroll>
      <h2 class="text-3xl font-display font-semibold text-white mb-3 tracking-wide">COMMISSION A PAINTING</h2>
      <p class="text-zinc-500 mb-8 max-w-md mx-auto text-sm font-mono">Have a vision? I paint custom pieces — any subject, size, and style. Inquire to get started.</p>
      <a href="/contact" class="px-8 py-3 bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all duration-150">
        INQUIRE NOW
      </a>
    </RevealOnScroll>
  </section>
</div>
