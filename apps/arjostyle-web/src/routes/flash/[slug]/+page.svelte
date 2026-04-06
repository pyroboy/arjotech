<script lang="ts">
  import RevealOnScroll from '$lib/components/ui/RevealOnScroll.svelte';
  import { formatCurrency } from '$lib/utils/formatters';
  import { ArrowLeft } from 'lucide-svelte';

  let { data } = $props();
  let design = $derived(data.design);
</script>

<svelte:head>
  <title>{design.title} Flash — Arjo Magno</title>
  <meta name="description" content="{design.title} — {design.style} flash design, {formatCurrency(design.price)}. Book this design at ArjoStyle." />
  <meta property="og:title" content="{design.title} Flash — Arjo Magno" />
  <meta property="og:image" content={design.imageUrl} />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://arjostyle.ink/flash/{design.slug}" />
</svelte:head>

<div class="min-h-screen bg-surface-900 text-zinc-100">
  <div class="max-w-4xl mx-auto px-6 py-12">
    <RevealOnScroll>
      <a href="/flash" class="inline-flex items-center gap-2 text-zinc-400 hover:text-white text-sm mb-8 transition-colors">
        <ArrowLeft class="w-4 h-4" /> Back to Flash
      </a>
    </RevealOnScroll>

    <div class="grid md:grid-cols-2 gap-12 items-start">
      <RevealOnScroll>
        <img src={design.imageUrl} alt={design.title} loading="lazy" class="w-full rounded-2xl" />
      </RevealOnScroll>

      <RevealOnScroll delay={100}>
        <div class="sticky top-24">
          <div class="flex items-center gap-3 mb-2">
            <h1 class="text-3xl font-display font-bold text-white">{design.title}</h1>
            {#if !design.available}
              <span class="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500">Claimed</span>
            {/if}
          </div>
          <p class="text-zinc-400 text-sm mb-6">{design.style} · {design.size}</p>

          {#if design.description}
            <p class="text-zinc-300 leading-relaxed mb-8">{design.description}</p>
          {/if}

          {#if design.tags.length > 0}
            <div class="flex flex-wrap gap-1.5 mb-8">
              {#each design.tags as tag}
                <span class="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500">{tag}</span>
              {/each}
            </div>
          {/if}

          <div class="mb-6">
            <p class="text-zinc-500 text-xs uppercase tracking-wider mb-1">Fixed Price</p>
            <p class="text-3xl font-bold text-ink-400">{formatCurrency(design.price)}</p>
          </div>

          {#if design.available}
            <a href="/book" class="block w-full text-center px-6 py-3 bg-ink-500 text-white rounded-full font-semibold hover:bg-ink-400 transition-colors">
              Book This Design
            </a>
            <p class="text-xs text-zinc-600 text-center mt-3">Mention "{design.title}" in your booking form</p>
          {:else}
            <div class="p-4 rounded-xl border border-zinc-800 text-center">
              <p class="text-zinc-400 text-sm">This design has been claimed.</p>
              <a href="/flash" class="mt-3 inline-block text-ink-400 hover:underline text-sm">Browse available designs →</a>
            </div>
          {/if}
        </div>
      </RevealOnScroll>
    </div>
  </div>
</div>
