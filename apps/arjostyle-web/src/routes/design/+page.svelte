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

<div class="min-h-screen bg-dark text-zinc-100">
  <section class="pt-20 pb-12 px-6 text-center border-b border-border">
    <RevealOnScroll>
      <p class="text-ink text-[10px] font-mono uppercase tracking-[0.3em] mb-3">Visual Communication</p>
      <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-wide">DESIGN WORK</h1>
      <p class="text-zinc-500 text-lg max-w-xl mx-auto font-mono text-sm">
        Logos, menus, brand identities, and signage. Clean, purposeful design that works.
        <a href="/pricing#design" class="text-ink hover:underline ml-1">View pricing →</a>
      </p>
    </RevealOnScroll>
  </section>

  {#if data.designProjects.length > 0}
    <div class="px-6 pb-8 pt-8 flex flex-wrap gap-1 justify-center border-b border-border">
      {#each (['all', 'logo', 'menu', 'brand', 'signage'] as const) as f}
        <button
          onclick={() => (filter = f)}
          class="px-4 py-2 text-sm font-mono transition-all duration-150 {filter === f
            ? 'bg-white text-dark font-bold'
            : 'bg-elevated text-zinc-500 border border-border hover:border-border-light hover:text-white'}"
        >
          {f === 'all' ? 'ALL' : CATEGORY_LABELS[f].toUpperCase()}
        </button>
      {/each}
    </div>
  {/if}

  <section class="px-6 pb-20">
    <div class="max-w-6xl mx-auto">
      {#if data.designProjects.length === 0}
        <RevealOnScroll>
          <div class="text-center py-24 text-zinc-600">
            <p class="text-5xl mb-4">🎨</p>
            <p class="text-lg font-display text-zinc-400 mb-2 tracking-wide">PORTFOLIO COMING SOON</p>
            <p class="text-sm font-mono">Compiling past projects. Check back soon or <a href="/contact" class="text-ink hover:underline">reach out</a> for a quote.</p>
          </div>
        </RevealOnScroll>
      {:else}
        <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-2 mt-8">
          {#each filtered as project, i}
            <RevealOnScroll delay={i * 60}>
              <div class="group bg-elevated border border-border overflow-hidden hover:border-ink/30 transition-all duration-150">
                <div class="aspect-video overflow-hidden bg-dark">
                  <img src={project.imageUrl} alt={project.title} loading="lazy"
                    class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
                <div class="p-4">
                  <div class="flex items-start justify-between gap-2 mb-1">
                    <h2 class="font-display text-white text-base group-hover:text-ink transition-colors tracking-wide">{project.title.toUpperCase()}</h2>
                    <span class="text-[10px] font-mono px-2 py-0.5 border border-border text-zinc-600 shrink-0 uppercase tracking-widest">{CATEGORY_LABELS[project.category]}</span>
                  </div>
                  <p class="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{project.client} — {project.year}</p>
                  <p class="text-sm text-zinc-500 mt-2 line-clamp-2 font-mono">{project.description}</p>
                </div>
              </div>
            </RevealOnScroll>
          {/each}
        </div>
      {/if}
    </div>
  </section>

  <section class="py-20 px-6 text-center border-t border-border">
    <RevealOnScroll>
      <h2 class="text-3xl font-display font-semibold text-white mb-3 tracking-wide">NEED DESIGN WORK?</h2>
      <p class="text-zinc-500 mb-8 max-w-md mx-auto font-mono text-sm">Logo, menu, brand identity — let's talk scope and pricing.</p>
      <a href="/contact" class="px-8 py-3 bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all duration-150">
        GET A QUOTE
      </a>
    </RevealOnScroll>
  </section>
</div>
