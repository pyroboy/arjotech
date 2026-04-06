<script lang="ts">
  import RevealOnScroll from '$lib/components/ui/RevealOnScroll.svelte';
  import type { DesignProject } from '$lib/data/designData';

  let { data } = $props();

  const CATEGORY_LABELS: Record<DesignProject['category'], string> = {
    logo: 'Logo Design',
    menu: 'Menu Design',
    brand: 'Brand Identity',
    signage: 'Signage',
    other: 'Other'
  };

  let filter = $state<DesignProject['category'] | 'all'>('all');
  const filtered = $derived(
    filter === 'all' ? data.designProjects : data.designProjects.filter((p: DesignProject) => p.category === filter)
  );
</script>

<svelte:head>
  <title>Design Work — Arjo Magno</title>
  <meta name="description" content="Graphic design portfolio — logos, menu design, brand identity, and signage by Arjo Magno." />
  <meta property="og:title" content="Design Work — Arjo Magno" />
  <meta property="og:description" content="Logos, menus, brand identities, and more." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://arjostyle.ink/design" />
</svelte:head>

<div class="min-h-screen bg-surface-900 text-zinc-100">
  <section class="pt-20 pb-12 px-6 text-center">
    <RevealOnScroll>
      <p class="text-ink-500 text-sm font-medium uppercase tracking-widest mb-3">Visual Communication</p>
      <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-4">Design Work</h1>
      <p class="text-zinc-400 text-lg max-w-xl mx-auto">
        Logos, menus, brand identities, and signage. Clean, purposeful design that works.
        <a href="/pricing#design" class="text-ink-400 hover:underline ml-1">View pricing →</a>
      </p>
    </RevealOnScroll>
  </section>

  {#if data.designProjects.length > 0}
    <div class="px-6 pb-8 flex flex-wrap gap-2 justify-center">
      {#each (['all', 'logo', 'menu', 'brand', 'signage'] as const) as f}
        <button
          onclick={() => (filter = f)}
          class="px-4 py-1.5 rounded-full text-sm border transition-colors {filter === f
            ? 'bg-ink-500/20 border-ink-500/50 text-ink-400'
            : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}"
        >
          {f === 'all' ? 'All' : CATEGORY_LABELS[f]}
        </button>
      {/each}
    </div>
  {/if}

  <section class="px-6 pb-20">
    <div class="max-w-6xl mx-auto">
      {#if data.designProjects.length === 0}
        <RevealOnScroll>
          <div class="text-center py-24 text-zinc-500">
            <p class="text-5xl mb-4">🎨</p>
            <p class="text-lg font-medium text-zinc-400 mb-2">Portfolio coming soon</p>
            <p class="text-sm">Compiling past projects. Check back soon or <a href="/contact" class="text-ink-400 hover:underline">reach out</a> for a quote.</p>
          </div>
        </RevealOnScroll>
      {:else}
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each filtered as project, i}
            <RevealOnScroll delay={i * 60}>
              <div class="group rounded-xl overflow-hidden border border-zinc-800 bg-zinc-900">
                <div class="aspect-video overflow-hidden bg-zinc-800">
                  <img src={project.imageUrl} alt={project.title} loading="lazy"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                </div>
                <div class="p-4">
                  <div class="flex items-start justify-between gap-2 mb-1">
                    <h2 class="font-semibold text-white text-base">{project.title}</h2>
                    <span class="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500 shrink-0">{CATEGORY_LABELS[project.category]}</span>
                  </div>
                  <p class="text-xs text-zinc-500">{project.client} · {project.year}</p>
                  <p class="text-sm text-zinc-400 mt-2 line-clamp-2">{project.description}</p>
                </div>
              </div>
            </RevealOnScroll>
          {/each}
        </div>
      {/if}
    </div>
  </section>

  <section class="py-20 px-6 text-center border-t border-zinc-800/50">
    <RevealOnScroll>
      <h2 class="text-2xl font-display font-semibold text-white mb-3">Need Design Work?</h2>
      <p class="text-zinc-400 mb-8 max-w-md mx-auto">Logo, menu, brand identity — let's talk scope and pricing.</p>
      <a href="/contact" class="px-8 py-3 bg-ink-500 text-white rounded-full font-semibold hover:bg-ink-400 transition-colors">
        Get a Quote
      </a>
    </RevealOnScroll>
  </section>
</div>
