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
    available: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    sold: 'bg-zinc-500/15 text-zinc-400 border-zinc-500/30',
    commissioned: 'bg-blue-500/15 text-blue-400 border-blue-500/30',
    nfs: 'bg-zinc-500/15 text-zinc-500 border-zinc-700'
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

<div class="min-h-screen bg-surface-900 text-zinc-100">
  <!-- Hero -->
  <section class="pt-20 pb-12 px-6 text-center">
    <RevealOnScroll>
      <p class="text-ink-500 text-sm font-medium uppercase tracking-widest mb-3">Original Works</p>
      <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-4">
        Paintings
      </h1>
      <p class="text-zinc-400 text-lg max-w-xl mx-auto">
        Acrylic and mixed media originals. Available for purchase or commission.
        <a href="/pricing#paintings" class="text-ink-400 hover:underline ml-1">View pricing →</a>
      </p>
    </RevealOnScroll>
  </section>

  <!-- Filter -->
  {#if data.paintings.length > 0}
    <div class="px-6 pb-8 flex flex-wrap gap-2 justify-center">
      {#each (['all', 'available', 'commissioned', 'sold', 'nfs'] as const) as f}
        <button
          onclick={() => (filter = f)}
          class="px-4 py-1.5 rounded-full text-sm border transition-colors {filter === f
            ? 'bg-ink-500/20 border-ink-500/50 text-ink-400'
            : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}"
        >
          {f === 'all' ? 'All' : STATUS_LABELS[f]}
        </button>
      {/each}
    </div>
  {/if}

  <!-- Gallery -->
  <section class="px-6 pb-20">
    <div class="max-w-6xl mx-auto">
      {#if data.paintings.length === 0}
        <RevealOnScroll>
          <div class="text-center py-24 text-zinc-500">
            <p class="text-5xl mb-4">🖼</p>
            <p class="text-lg font-medium text-zinc-400 mb-2">Gallery coming soon</p>
            <p class="text-sm max-w-sm mx-auto">Photographing and cataloguing the inventory. Check back soon — or inquire about a commission now.</p>
          </div>
        </RevealOnScroll>
      {:else}
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each filtered as painting, i}
            <RevealOnScroll delay={i * 60}>
              <a href="/paintings/{painting.slug}" class="group block rounded-xl overflow-hidden border border-zinc-800 hover:border-ink-500/40 transition-colors bg-zinc-900">
                <div class="aspect-[4/3] overflow-hidden bg-zinc-800">
                  <img
                    src={painting.imageUrl}
                    alt={painting.title}
                    loading="lazy"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div class="p-4">
                  <div class="flex items-start justify-between gap-2 mb-1">
                    <h2 class="font-semibold text-white text-base group-hover:text-ink-400 transition-colors">{painting.title}</h2>
                    <span class="text-xs px-2 py-0.5 rounded-full border shrink-0 {STATUS_COLORS[painting.status]}">
                      {STATUS_LABELS[painting.status]}
                    </span>
                  </div>
                  <p class="text-xs text-zinc-500">{painting.medium} · {painting.dimensions} · {painting.year}</p>
                  {#if painting.price && painting.status === 'available'}
                    <p class="text-ink-400 font-semibold mt-2">{formatCurrency(painting.price)}</p>
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
  <section class="py-20 px-6 text-center border-t border-zinc-800/50">
    <RevealOnScroll>
      <h2 class="text-2xl font-display font-semibold text-white mb-3">Commission a Painting</h2>
      <p class="text-zinc-400 mb-8 max-w-md mx-auto">Have a vision? I paint custom pieces — any subject, size, and style. Inquire to get started.</p>
      <a href="/contact" class="px-8 py-3 bg-ink-500 text-white rounded-full font-semibold hover:bg-ink-400 transition-colors">
        Inquire Now
      </a>
    </RevealOnScroll>
  </section>
</div>
