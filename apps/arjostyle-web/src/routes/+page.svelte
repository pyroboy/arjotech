<script lang="ts">
  import BookingFlow from '$lib/components/booking/BookingFlow.svelte';
  import { bookingStore } from '$lib/stores/booking.svelte';
  import { imageUrls, softwareProjects, websiteProjects } from '$data/portfolioData';
  import { onMount } from 'svelte';
  import { Code2, Globe, Database, Zap, ArrowRight, Briefcase } from 'lucide-svelte';

  const projectIcons = [Code2, Globe, Database, Zap, Code2];
  let hoveredSide = $state<'tattoo' | 'software' | null>(null);
  let activeSide = $state<'tattoo' | 'software' | null>(null);
  let showBooking = $state(false);
  let imageLoaded = $state<Record<number, boolean>>({});

  onMount(() => { bookingStore.loadMappingsFromKV(); });

  function handleTap(side: 'tattoo' | 'software') {
    activeSide = activeSide === side ? null : side;
  }

  function markLoaded(index: number) {
    imageLoaded[index] = true;
  }

  function getStatusLabel(status: string) {
    return status === 'production' ? 'Live' : status === 'built' ? 'Completed' : 'In Progress';
  }

  const featuredProjects = softwareProjects.filter(p => p.featured);
</script>

<svelte:head>
  <title>Arjo Magno — Tattoo Artist & Software Developer</title>
  <meta name="description" content="Arjo Magno — tattoo artist and software developer based in the Philippines. Full-stack apps, offline-first architecture, Svelte 5." />
  <meta property="og:title" content="Arjo Magno — Tattoo Artist & Software Developer" />
  <meta property="og:description" content="Arjo Magno — tattoo artist and software developer based in the Philippines." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://arjostyle.com/" />
</svelte:head>

<h1 class="sr-only">Arjo Magno — Tattoo Artist & Software Developer</h1>

<!-- ── HERO SPLIT SCREEN ─────────────────────────────────── -->
<div class="h-[calc(100dvh-64px)] flex flex-col md:flex-row overflow-hidden">

  <!-- Tattoo side -->
  <a href="/tattoo"
    class="relative flex-1 min-h-[50dvh] md:min-h-0 transition-all duration-700 ease-out overflow-hidden cursor-pointer group
      {hoveredSide === 'tattoo' || activeSide === 'tattoo' ? 'md:flex-[2]'
      : hoveredSide === 'software' || activeSide === 'software' ? 'md:flex-[0.6]'
      : 'flex-1'}"
    onmouseenter={() => (hoveredSide = 'tattoo')}
    onmouseleave={() => (hoveredSide = null)}
    ontouchend={(e) => { e.preventDefault(); handleTap('tattoo'); }}
  >
    <div class="absolute inset-0 z-0">
      <img src={imageUrls[0]} alt="" aria-hidden="true"
        class="w-full h-full object-cover object-center opacity-20 transition-opacity duration-700 group-hover:opacity-30" loading="eager" />
    </div>
    <div class="absolute inset-0 bg-gradient-to-br from-surface-900 via-surface-900/90 to-orange-950/40 z-10"></div>
    <div class="relative z-20 flex flex-col items-center justify-center h-full px-8 text-center">
      <div class="transition-all duration-500 {hoveredSide === 'software' || activeSide === 'software' ? 'opacity-40 scale-95' : 'opacity-100'}">
        <p class="text-ink-500/60 text-xs font-mono tracking-[0.5em] uppercase mb-4">Tattoo Art</p>
        <h2 class="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">Ink<span class="text-ink-500">.</span></h2>
        <p class="text-zinc-400 max-w-sm text-sm md:text-base leading-relaxed">Custom tattoo designs crafted with precision. From fine line to full color — your vision, my art.</p>
        <div class="mt-8 flex items-center gap-2 text-ink-500 group-hover:gap-4 transition-all duration-300">
          <span class="text-sm font-medium">Explore Portfolio</span>
          <span class="text-lg">→</span>
        </div>
      </div>
    </div>
    <div class="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-ink-500/20 to-transparent z-20 hidden md:block"></div>
    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink-500/20 to-transparent z-20 md:hidden"></div>
  </a>

  <!-- Software side -->
  <a href="/software"
    class="relative flex-1 min-h-[50dvh] md:min-h-0 transition-all duration-700 ease-out overflow-hidden cursor-pointer group
      {hoveredSide === 'software' || activeSide === 'software' ? 'md:flex-[2]'
      : hoveredSide === 'tattoo' || activeSide === 'tattoo' ? 'md:flex-[0.6]'
      : 'flex-1'}"
    onmouseenter={() => (hoveredSide = 'software')}
    onmouseleave={() => (hoveredSide = null)}
    ontouchend={(e) => { e.preventDefault(); handleTap('software'); }}
  >
    <div class="absolute inset-0 z-0">
      <img src={imageUrls[7]} alt="" aria-hidden="true"
        class="w-full h-full object-cover object-center opacity-15 transition-opacity duration-700 group-hover:opacity-25 grayscale" loading="eager" />
    </div>
    <div class="absolute inset-0 bg-gradient-to-bl from-surface-900 via-surface-900/90 to-cyan-950/40 z-10"></div>
    <div class="relative z-20 flex flex-col items-center justify-center h-full px-8 text-center">
      <div class="transition-all duration-500 {hoveredSide === 'tattoo' || activeSide === 'tattoo' ? 'opacity-40 scale-95' : 'opacity-100'}">
        <!-- Open to work badge -->
        <div class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tech-500/10 border border-tech-500/30 text-tech-400 text-xs font-mono mb-5">
          <span class="w-1.5 h-1.5 rounded-full bg-tech-400 animate-pulse"></span>
          Open to opportunities
        </div>
        <p class="text-tech-500/60 text-xs font-mono tracking-[0.5em] uppercase mb-4">Software Dev</p>
        <h2 class="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">Code<span class="text-tech-500">.</span></h2>
        <p class="text-zinc-400 max-w-sm text-sm md:text-base leading-relaxed">Full-stack applications built for real businesses. Svelte 5, offline-first, Cloudflare — shipping fast.</p>
        <div class="mt-8 flex items-center gap-2 text-tech-500 group-hover:gap-4 transition-all duration-300">
          <span class="text-sm font-medium">View Projects</span>
          <span class="text-lg">→</span>
        </div>
      </div>
    </div>
  </a>
</div>

<!-- ── ABOUT STRIP ────────────────────────────────────────── -->
<section class="bg-surface-900 border-b border-zinc-800/50 px-6 py-14">
  <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8">
    <!-- Avatar placeholder -->
    <div class="shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-tech-500/20 to-cyan-500/10 border border-tech-500/20 flex items-center justify-center">
      <span class="font-display text-2xl text-tech-400 font-bold">A</span>
    </div>
    <div class="flex-1 text-center md:text-left">
      <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
        <h2 class="text-white font-semibold text-lg">Arturo Jose Magno</h2>
        <span class="text-xs font-mono px-2.5 py-1 rounded-full bg-tech-500/10 border border-tech-500/20 text-tech-400">Full-stack Developer</span>
        <span class="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400">Philippines 🇵🇭</span>
      </div>
      <p class="text-zinc-400 leading-relaxed max-w-2xl">
        I build full-stack web apps end-to-end — from database schema to deployed product. Specializing in <span class="text-white">Svelte 5</span>, offline-first architecture with <span class="text-white">RxDB</span>, and edge deployments on <span class="text-white">Cloudflare</span>. Currently building 5 production apps across POS, property management, workforce ops, and SaaS.
      </p>
      <div class="flex flex-wrap justify-center md:justify-start gap-2 mt-4">
        {#each ['Svelte 5', 'SvelteKit', 'TypeScript', 'RxDB', 'Neon', 'Cloudflare', 'Three.js'] as skill}
          <span class="text-xs px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-lg font-mono">{skill}</span>
        {/each}
      </div>
    </div>
    <a href="/contact"
      class="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-tech-500 hover:bg-tech-400 text-white rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-tech-500/20">
      <Briefcase class="w-4 h-4" />
      Hire Me
    </a>
  </div>
</section>

<!-- ── METRICS STRIP ─────────────────────────────────────── -->
<section class="bg-surface-800 border-b border-zinc-800/50 px-6 py-10">
  <div class="max-w-5xl mx-auto">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-800/60 rounded-xl overflow-hidden">
      <div class="flex flex-col items-center gap-2 px-6 py-8 bg-surface-800">
        <span class="text-xs font-mono tracking-[0.4em] text-ink-500/60 uppercase mb-1">Ink</span>
        <span class="text-4xl font-bold text-white tabular-nums">200<span class="text-ink-500">+</span></span>
        <span class="text-xs text-zinc-500 tracking-widest uppercase font-medium">Tattoos Inked</span>
      </div>
      <div class="flex flex-col items-center gap-2 px-6 py-8 bg-surface-800">
        <span class="text-xs font-mono tracking-[0.4em] text-ink-500/60 uppercase mb-1">Ink</span>
        <span class="text-4xl font-bold text-white tabular-nums">4.9<span class="text-ink-500 text-2xl">★</span></span>
        <span class="text-xs text-zinc-500 tracking-widest uppercase font-medium">Client Rating</span>
      </div>
      <div class="flex flex-col items-center gap-2 px-6 py-8 bg-surface-800">
        <span class="text-xs font-mono tracking-[0.4em] text-tech-500/60 uppercase mb-1">Code</span>
        <span class="text-4xl font-bold text-white tabular-nums">5<span class="text-tech-500">+</span></span>
        <span class="text-xs text-zinc-500 tracking-widest uppercase font-medium">Apps Built</span>
      </div>
      <div class="flex flex-col items-center gap-2 px-6 py-8 bg-surface-800">
        <span class="text-xs font-mono tracking-[0.4em] text-tech-500/60 uppercase mb-1">Code</span>
        <span class="text-4xl font-bold text-white tabular-nums">117<span class="text-tech-500 text-2xl"> ⚡</span></span>
        <span class="text-xs text-zinc-500 tracking-widest uppercase font-medium">Components Shipped</span>
      </div>
    </div>
  </div>
</section>

<!-- ── SOFTWARE PROJECTS ─────────────────────────────────── -->
<section class="bg-surface-800 px-6 py-16 border-b border-zinc-800/50">
  <div class="max-w-6xl mx-auto">
    <div class="flex items-end justify-between mb-8">
      <div>
        <p class="text-tech-500/70 text-xs font-mono tracking-[0.5em] uppercase mb-2">Recent Builds</p>
        <h2 class="text-2xl md:text-3xl font-bold text-white">Software Projects</h2>
      </div>
      <a href="/software" class="text-sm text-tech-500 hover:text-tech-400 transition-colors flex items-center gap-1.5 font-medium">
        View all <ArrowRight class="w-4 h-4" />
      </a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {#each featuredProjects as project, i}
        {@const Icon = projectIcons[i % projectIcons.length]}
        <a href="/software/{project.slug}"
          class="group block bg-surface-900 border border-zinc-800/50 rounded-xl overflow-hidden hover:border-tech-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-tech-500/5">
          <!-- Thumbnail -->
          <div class="aspect-video relative overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800">
            {#if project.imageUrl}
              <img src={project.imageUrl} alt={project.title} class="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
            {:else}
              <div class="absolute inset-0 opacity-20"
                style="background-image:linear-gradient(rgba(56,189,248,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(56,189,248,0.4) 1px,transparent 1px);background-size:28px 28px"></div>
              <div class="absolute inset-0 bg-gradient-to-br from-tech-500/10 via-transparent to-cyan-500/5"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <div class="w-12 h-12 rounded-xl bg-tech-500/20 border border-tech-500/30 flex items-center justify-center mx-auto mb-2 group-hover:bg-tech-500/30 transition-colors">
                    <Icon class="w-6 h-6 text-tech-400" />
                  </div>
                  <p class="text-xs font-mono text-tech-500/50 tracking-widest">{project.techStack[0]}</p>
                </div>
              </div>
            {/if}
            <div class="absolute top-3 left-3">
              <span class="text-xs font-mono px-2.5 py-1 rounded-full border
                {project.status === 'production' ? 'bg-green-500/10 text-green-400 border-green-500/20'
                : project.status === 'prototype' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20'
                : 'bg-tech-500/10 text-tech-400 border-tech-500/20'}">
                {getStatusLabel(project.status)}
              </span>
            </div>
          </div>
          <!-- Content -->
          <div class="p-5">
            <h3 class="text-base font-semibold text-white mb-2 group-hover:text-tech-400 transition-colors">{project.title}</h3>
            <p class="text-zinc-400 text-sm leading-relaxed line-clamp-2 mb-4">{project.description}</p>
            <div class="flex flex-wrap gap-1.5">
              {#each project.techStack.slice(0, 3) as tech}
                <span class="text-xs px-2 py-0.5 bg-zinc-800/60 text-zinc-300 rounded border border-zinc-700/50">{tech}</span>
              {/each}
              {#if project.techStack.length > 3}
                <span class="text-xs px-2 py-0.5 bg-zinc-800/60 text-zinc-500 rounded border border-zinc-700/50">+{project.techStack.length - 3}</span>
              {/if}
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>

<!-- ── WEBSITES BUILT ─────────────────────────────────────── -->
{#if websiteProjects.filter(p => p.featured).length > 0}
<section class="bg-surface-800 px-6 py-16 border-t border-zinc-800/50">
  <div class="max-w-6xl mx-auto">
    <div class="flex items-end justify-between mb-10">
      <div>
        <p class="text-emerald-500/70 text-xs font-mono tracking-[0.5em] uppercase mb-2">Client Work</p>
        <h2 class="text-2xl md:text-3xl font-bold text-white">Websites Built</h2>
      </div>
      <a href="/websites" class="text-sm text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-medium">
        View all <ArrowRight class="w-4 h-4" />
      </a>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {#each websiteProjects.filter(p => p.featured) as project}
        <a href="/websites/{project.slug}"
          class="group block bg-surface-900 border border-zinc-800/50 rounded-xl overflow-hidden hover:border-emerald-500/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/5">
          <!-- Thumbnail -->
          <div class="aspect-video relative overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800">
            {#if project.imageUrl}
              <img src={project.imageUrl} alt={project.title} class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            {:else}
              <div class="absolute inset-0 opacity-20"
                style="background-image: linear-gradient(rgba(52,211,153,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.4) 1px, transparent 1px); background-size: 28px 28px;">
              </div>
              <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/5"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <Globe class="w-10 h-10 text-emerald-400/40 group-hover:text-emerald-400/70 transition-colors" />
              </div>
            {/if}
            <div class="absolute top-3 left-3">
              <span class="text-xs font-mono px-2.5 py-1 rounded-full border bg-green-500/10 text-green-400 border-green-500/20">
                {project.status === 'production' ? 'Live' : 'Built'}
              </span>
            </div>
          </div>
          <div class="p-5">
            <p class="text-xs font-mono text-emerald-500/60 tracking-widest uppercase mb-1">{project.client}</p>
            <h3 class="font-semibold text-white mb-1 group-hover:text-emerald-400 transition-colors">{project.title}</h3>
            <p class="text-zinc-500 text-xs mb-3">{project.location} · {project.year}</p>
            <p class="text-zinc-400 text-sm leading-relaxed line-clamp-2 mb-4">{project.description}</p>
            <div class="flex flex-wrap gap-1.5">
              {#each project.techStack.slice(0, 3) as tech}
                <span class="text-xs px-2 py-0.5 bg-zinc-800/60 text-zinc-400 rounded border border-zinc-700/50">{tech}</span>
              {/each}
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>
{/if}

<!-- ── TATTOO PORTFOLIO PREVIEW ───────────────────────────── -->
<section class="bg-surface-900 px-6 py-16">
  <div class="max-w-6xl mx-auto">
    <div class="flex items-end justify-between mb-8">
      <div>
        <p class="text-ink-500/70 text-xs font-mono tracking-[0.5em] uppercase mb-2">Recent Work</p>
        <h2 class="text-2xl md:text-3xl font-bold text-white">From the Studio</h2>
      </div>
      <a href="/tattoo" class="text-sm text-ink-500 hover:text-ink-400 transition-colors flex items-center gap-1.5 font-medium">
        View all <ArrowRight class="w-4 h-4" />
      </a>
    </div>
    <div class="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-2">
      {#each imageUrls.slice(0, 6) as src, i}
        <a href="/tattoo"
          class="relative aspect-square overflow-hidden rounded-lg bg-zinc-900 group {i === 0 ? 'col-span-2 row-span-2' : ''}">
          {#if !imageLoaded[i]}
            <div class="absolute inset-0 bg-zinc-800 animate-pulse rounded-lg z-10">
              <div class="absolute inset-0 bg-gradient-to-br from-zinc-700/30 to-transparent"></div>
            </div>
          {/if}
          <img {src} alt="Tattoo work {i + 1}"
            class="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-90 {imageLoaded[i] ? 'opacity-100' : 'opacity-0'}"
            loading="lazy" onload={() => markLoaded(i)} />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg z-20"></div>
        </a>
      {/each}
    </div>
  </div>
</section>

<!-- ── BOOK A SESSION CTA ─────────────────────────────────── -->
<section class="bg-surface-800 border-y border-zinc-800/50 py-16 px-6">
  <div class="max-w-4xl mx-auto text-center">
    <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">Ready for your next tattoo?</h3>
    <p class="text-zinc-400 mb-8 max-w-lg mx-auto">Use the interactive 3D body placement tool to explore options, get an instant price estimate, and book your session online.</p>
    <button onclick={() => (showBooking = true)}
      class="inline-flex items-center gap-2 bg-ink-500 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-ink-400 transition-colors text-lg active:scale-95">
      Book a Session →
    </button>
  </div>
</section>

<!-- ── BOOKING MODAL ──────────────────────────────────────── -->
{#if showBooking}
  <div class="fixed inset-0 z-[100] flex items-center justify-center">
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"
      onclick={() => (showBooking = false)}
      onkeydown={(e) => { if (e.key === 'Escape') showBooking = false; }}></div>
    <div class="relative z-10 w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90dvh] overflow-hidden sm:rounded-2xl bg-surface-900 sm:border sm:border-zinc-800 sm:shadow-[0_0_60px_rgba(255,255,255,0.1)] sm:mx-4">
      <button onclick={() => (showBooking = false)}
        class="absolute right-4 top-4 z-[110] flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
        aria-label="Close">✕</button>
      <svelte:boundary onerror={(e) => console.error('BookingFlow error:', e)}>
        <BookingFlow onClose={() => (showBooking = false)} />
        {#snippet failed(error: unknown)}
          <div class="flex flex-col items-center justify-center gap-4 p-12 text-center">
            <p class="text-red-400 text-lg font-semibold">Something went wrong</p>
            <p class="text-zinc-400 text-sm max-w-md">{error instanceof Error ? error.message : 'An unexpected error occurred.'}</p>
            <button onclick={() => (showBooking = false)}
              class="mt-2 px-6 py-2 rounded-full bg-zinc-700 text-white hover:bg-zinc-600 transition-colors text-sm font-medium">Close</button>
          </div>
        {/snippet}
      </svelte:boundary>
    </div>
  </div>
{/if}
