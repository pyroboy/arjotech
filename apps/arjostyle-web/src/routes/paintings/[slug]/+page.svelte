<script lang="ts">
  import RevealOnScroll from '$lib/components/ui/RevealOnScroll.svelte';
  import { formatCurrency } from '$lib/utils/formatters';
  import { ArrowLeft } from 'lucide-svelte';

  let { data } = $props();
  let painting = $derived(data.painting);
</script>

<svelte:head>
  <title>{painting.title} — Arjo Magno</title>
  <meta name="description" content="{painting.title} — {painting.medium}, {painting.dimensions}. {painting.description ?? 'Original painting by Arjo Magno.'}" />
  <meta property="og:title" content="{painting.title} — Arjo Magno" />
  <meta property="og:image" content={painting.imageUrl} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://arjostyle.ink/paintings/{painting.slug}" />
</svelte:head>

<div class="min-h-screen bg-surface-900 text-zinc-100">
  <div class="max-w-5xl mx-auto px-6 py-12">
    <RevealOnScroll>
      <a href="/paintings" class="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-8 transition-colors">
        <ArrowLeft class="w-4 h-4" /> Back to Paintings
      </a>
    </RevealOnScroll>

    <div class="grid md:grid-cols-2 gap-12 items-start">
      <RevealOnScroll>
        <img
          src={painting.imageUrl}
          alt={painting.title}
          loading="lazy"
          class="w-full rounded-2xl object-cover"
        />
      </RevealOnScroll>

      <RevealOnScroll delay={100}>
        <div class="sticky top-24">
          <h1 class="text-3xl font-display font-bold text-white mb-2">{painting.title}</h1>
          <p class="text-zinc-400 text-sm mb-6">{painting.medium} · {painting.dimensions} · {painting.year}</p>

          {#if painting.description}
            <p class="text-zinc-300 leading-relaxed mb-8">{painting.description}</p>
          {/if}

          {#if painting.status === 'available' && painting.price}
            <div class="mb-6">
              <p class="text-zinc-500 text-xs uppercase tracking-wider mb-1">Price</p>
              <p class="text-3xl font-bold text-ink-400">{formatCurrency(painting.price)}</p>
            </div>
            <a href="/contact" class="block w-full text-center px-6 py-3 bg-ink-500 text-white rounded-full font-semibold hover:bg-ink-400 transition-colors">
              Inquire to Purchase
            </a>
          {:else if painting.status === 'nfs'}
            <p class="text-zinc-500 text-sm italic">This piece is not for sale.</p>
          {:else if painting.status === 'sold'}
            <p class="text-zinc-500 text-sm italic">This piece has been sold.</p>
            <a href="/contact" class="mt-4 block w-full text-center px-6 py-3 border border-zinc-700 text-zinc-300 rounded-full text-sm hover:bg-zinc-800 transition-colors">
              Commission a Similar Piece
            </a>
          {:else}
            <p class="text-blue-400 text-sm italic mb-4">This piece is commissioned.</p>
          {/if}
        </div>
      </RevealOnScroll>
    </div>
  </div>
</div>
