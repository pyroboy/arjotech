<script lang="ts">
  import BookingFlow from '$lib/components/booking/BookingFlow.svelte';
  import { bookingStore } from '$lib/stores/booking.svelte';
  import { imageUrls, softwareProjects } from '$data/portfolioData';
  import { onMount } from 'svelte';
  import { Code2, Globe, Database } from 'lucide-svelte';

  const projectIcons = [Code2, Globe, Database];
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
</script>

<svelte:head>
  <title>Arjo Magno — Tattoo Artist & Software Developer</title>
  <meta
    name="description"
    content="Arjo Magno — tattoo artist and software developer based in the Philippines. Book a tattoo session or explore software projects."
  />
  <meta property="og:title" content="Arjo Magno — Tattoo Artist & Software Developer" />
  <meta property="og:description" content="Arjo Magno — tattoo artist and software developer based in the Philippines. Book a tattoo session or explore software projects." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://arjostyle-web.pages.dev/" />
</svelte:head>

<h1 class="sr-only">Arjo Magno — Tattoo Artist & Software Developer</h1>

<!-- Hero split screen section -->
<div class="h-[calc(100dvh-64px)] flex flex-col md:flex-row overflow-hidden">
  <!-- Tattoo side -->
  <a
    href="/tattoo"
    class="relative flex-1 min-h-[50dvh] md:min-h-0 transition-all duration-700 ease-out overflow-hidden cursor-pointer group
      {hoveredSide === 'tattoo' || activeSide === 'tattoo'
      ? 'md:flex-[2]'
      : hoveredSide === 'software' || activeSide === 'software'
        ? 'md:flex-[0.6]'
        : 'flex-1'}"
    onmouseenter={() => (hoveredSide = 'tattoo')}
    onmouseleave={() => (hoveredSide = null)}
    ontouchend={(e) => { e.preventDefault(); handleTap('tattoo'); }}
  >
    <!-- Background image placeholder -->
    <div class="absolute inset-0 z-0">
      <img
        src={imageUrls[0]}
        alt=""
        aria-hidden="true"
        class="w-full h-full object-cover object-center opacity-20 transition-opacity duration-700 group-hover:opacity-30"
        loading="eager"
      />
    </div>

    <!-- Dark overlay with gradient -->
    <div class="absolute inset-0 bg-gradient-to-br from-surface-900 via-surface-900/90 to-orange-950/40 z-10"></div>

    <!-- Content -->
    <div class="relative z-20 flex flex-col items-center justify-center h-full px-8 text-center">
      <div
        class="transition-all duration-500 {hoveredSide === 'software' || activeSide === 'software'
          ? 'opacity-40 scale-95'
          : 'opacity-100'}"
      >
        <p class="text-ink-500/60 text-xs font-mono tracking-[0.5em] uppercase mb-4">Tattoo Art</p>
        <h2 class="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">
          Ink<span class="text-ink-500">.</span>
        </h2>
        <p class="text-zinc-400 max-w-sm text-sm md:text-base leading-relaxed">
          Custom tattoo designs crafted with precision. From fine line to full color — your vision, my
          art.
        </p>
        <div class="mt-8 flex items-center gap-2 text-ink-500 group-hover:gap-4 transition-all duration-300">
          <span class="text-sm font-medium">Explore Portfolio</span>
          <span class="text-lg">→</span>
        </div>
      </div>
    </div>

    <!-- Decorative line -->
    <div class="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-ink-500/20 to-transparent z-20 hidden md:block"></div>
    <div class="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink-500/20 to-transparent z-20 md:hidden"></div>
  </a>

  <!-- Software side -->
  <a
    href="/software"
    class="relative flex-1 min-h-[50dvh] md:min-h-0 transition-all duration-700 ease-out overflow-hidden cursor-pointer group
      {hoveredSide === 'software' || activeSide === 'software'
      ? 'md:flex-[2]'
      : hoveredSide === 'tattoo' || activeSide === 'tattoo'
        ? 'md:flex-[0.6]'
        : 'flex-1'}"
    onmouseenter={() => (hoveredSide = 'software')}
    onmouseleave={() => (hoveredSide = null)}
    ontouchend={(e) => { e.preventDefault(); handleTap('software'); }}
  >
    <!-- Background image placeholder -->
    <div class="absolute inset-0 z-0">
      <img
        src={imageUrls[7]}
        alt=""
        aria-hidden="true"
        class="w-full h-full object-cover object-center opacity-15 transition-opacity duration-700 group-hover:opacity-25 grayscale"
        loading="eager"
      />
    </div>

    <div class="absolute inset-0 bg-gradient-to-bl from-surface-900 via-surface-900/90 to-cyan-950/40 z-10"></div>

    <div class="relative z-20 flex flex-col items-center justify-center h-full px-8 text-center">
      <div
        class="transition-all duration-500 {hoveredSide === 'tattoo' || activeSide === 'tattoo'
          ? 'opacity-40 scale-95'
          : 'opacity-100'}"
      >
        <p class="text-tech-500/60 text-xs font-mono tracking-[0.5em] uppercase mb-4">Software Dev</p>
        <h2 class="text-4xl md:text-6xl font-bold text-white tracking-tight mb-4">
          Code<span class="text-tech-500">.</span>
        </h2>
        <p class="text-zinc-400 max-w-sm text-sm md:text-base leading-relaxed">
          Full-stack applications built for real businesses. SvelteKit, React, Cloudflare — shipping
          fast.
        </p>
        <div class="mt-8 flex items-center gap-2 text-tech-500 group-hover:gap-4 transition-all duration-300">
          <span class="text-sm font-medium">View Projects</span>
          <span class="text-lg">→</span>
        </div>
      </div>
    </div>
  </a>
</div>

<!-- Metrics Strip -->
<section class="bg-surface-800 border-b border-zinc-800/50 px-6 py-10">
  <div class="max-w-5xl mx-auto">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-zinc-800/60 rounded-xl overflow-hidden">
      <!-- Tattoo metrics -->
      <div class="flex flex-col items-center gap-2 px-6 py-8 bg-surface-800 group">
        <span class="text-xs font-mono tracking-[0.4em] text-ink-500/60 uppercase mb-1">Ink</span>
        <span class="text-4xl font-bold text-white tabular-nums">200<span class="text-ink-500">+</span></span>
        <span class="text-xs text-zinc-500 tracking-widest uppercase font-medium">Tattoos Inked</span>
      </div>
      <div class="flex flex-col items-center gap-2 px-6 py-8 bg-surface-800 group">
        <span class="text-xs font-mono tracking-[0.4em] text-ink-500/60 uppercase mb-1">Ink</span>
        <span class="text-4xl font-bold text-white tabular-nums">4.9<span class="text-ink-500 text-2xl">★</span></span>
        <span class="text-xs text-zinc-500 tracking-widest uppercase font-medium">Client Rating</span>
      </div>
      <!-- Software metrics -->
      <div class="flex flex-col items-center gap-2 px-6 py-8 bg-surface-800 group">
        <span class="text-xs font-mono tracking-[0.4em] text-tech-500/60 uppercase mb-1">Code</span>
        <span class="text-4xl font-bold text-white tabular-nums">3<span class="text-tech-500">+</span></span>
        <span class="text-xs text-zinc-500 tracking-widest uppercase font-medium">Apps in Production</span>
      </div>
      <div class="flex flex-col items-center gap-2 px-6 py-8 bg-surface-800 group">
        <span class="text-xs font-mono tracking-[0.4em] text-tech-500/60 uppercase mb-1">Code</span>
        <span class="text-4xl font-bold text-white tabular-nums">5<span class="text-tech-500">+</span></span>
        <span class="text-xs text-zinc-500 tracking-widest uppercase font-medium">Years Dev Experience</span>
      </div>
    </div>
  </div>
</section>

<!-- Portfolio Photo Preview -->
<section class="bg-surface-900 px-6 py-16">
  <div class="max-w-6xl mx-auto">
    <div class="flex items-end justify-between mb-8">
      <div>
        <p class="text-ink-500/70 text-xs font-mono tracking-[0.5em] uppercase mb-2">Recent Work</p>
        <h2 class="text-2xl md:text-3xl font-bold text-white">From the Studio</h2>
      </div>
      <a href="/tattoo" class="text-sm text-ink-500 hover:text-ink-400 transition-colors flex items-center gap-1.5 font-medium">
        View all <span>→</span>
      </a>
    </div>
    <div class="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-2">
      {#each imageUrls.slice(0, 6) as src, i}
        <a
          href="/tattoo"
          class="relative aspect-square overflow-hidden rounded-lg bg-zinc-900 group
            {i === 0 ? 'col-span-2 row-span-2' : ''}"
        >
          <!-- Skeleton placeholder — shown while image loads -->
          {#if !imageLoaded[i]}
            <div class="absolute inset-0 bg-zinc-800 animate-pulse rounded-lg z-10">
              <div class="absolute inset-0 bg-gradient-to-br from-zinc-700/30 to-transparent"></div>
            </div>
          {/if}
          <img
            {src}
            alt="Tattoo work {i + 1}"
            class="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:opacity-90
              {imageLoaded[i] ? 'opacity-100' : 'opacity-0'}"
            loading="lazy"
            onload={() => markLoaded(i)}
          />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 rounded-lg z-20"></div>
        </a>
      {/each}
    </div>
  </div>
</section>

<!-- Software Projects Preview -->
<section class="bg-surface-800 px-6 py-16 border-t border-zinc-800/50">
  <div class="max-w-6xl mx-auto">
    <div class="flex items-end justify-between mb-8">
      <div>
        <p class="text-tech-500/70 text-xs font-mono tracking-[0.5em] uppercase mb-2">Recent Builds</p>
        <h2 class="text-2xl md:text-3xl font-bold text-white">Software Projects</h2>
      </div>
      <a href="/software" class="text-sm text-tech-500 hover:text-tech-400 transition-colors flex items-center gap-1.5 font-medium">
        View all <span>→</span>
      </a>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-5">
      {#each softwareProjects.filter(p => p.featured).slice(0, 3) as project, i}
        {@const Icon = projectIcons[i % projectIcons.length]}
        <a
          href="/software/{project.slug}"
          class="group block bg-surface-900 border border-zinc-800/50 rounded-xl overflow-hidden hover:border-tech-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-tech-500/5"
        >
          <!-- Image placeholder -->
          <div class="aspect-video relative overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800">
            <!-- Grid pattern overlay -->
            <div
              class="absolute inset-0 opacity-20"
              style="background-image: linear-gradient(rgba(56,189,248,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.4) 1px, transparent 1px); background-size: 28px 28px;"
            ></div>
            <!-- Subtle radial glow -->
            <div class="absolute inset-0 bg-gradient-to-br from-tech-500/10 via-transparent to-cyan-500/5"></div>
            <!-- Center icon -->
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <div class="w-12 h-12 rounded-xl bg-tech-500/20 border border-tech-500/30 flex items-center justify-center mx-auto mb-2 group-hover:bg-tech-500/30 transition-colors">
                  <Icon class="w-6 h-6 text-tech-400" />
                </div>
                <p class="text-xs font-mono text-tech-500/50 tracking-widest">{project.techStack[0]}</p>
              </div>
            </div>
            <!-- Status badge -->
            <div class="absolute top-3 left-3">
              <span class="text-xs font-mono px-2.5 py-1 rounded-full border
                {project.status === 'production' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-tech-500/10 text-tech-400 border-tech-500/20'}">
                {project.status === 'production' ? 'Live' : 'Completed'}
              </span>
            </div>
          </div>
          <!-- Card content -->
          <div class="p-5">
            <h3 class="text-base font-semibold text-white mb-2 group-hover:text-tech-400 transition-colors">
              {project.title}
            </h3>
            <p class="text-zinc-400 text-sm leading-relaxed line-clamp-2 mb-4">{project.description}</p>
            <div class="flex flex-wrap gap-1.5">
              {#each project.techStack.slice(0, 3) as tech}
                <span class="text-xs px-2 py-0.5 bg-zinc-800/60 text-zinc-300 rounded border border-zinc-700/50">
                  {tech}
                </span>
              {/each}
              {#if project.techStack.length > 3}
                <span class="text-xs px-2 py-0.5 bg-zinc-800/60 text-zinc-500 rounded border border-zinc-700/50">
                  +{project.techStack.length - 3}
                </span>
              {/if}
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>

<!-- CTA Strip below the fold -->
<section class="bg-surface-800 border-y border-zinc-800/50 py-16 px-6">
  <div class="max-w-4xl mx-auto text-center">
    <h3 class="text-2xl md:text-3xl font-bold text-white mb-4">Ready for your next tattoo?</h3>
    <p class="text-zinc-400 mb-8 max-w-lg mx-auto">
      Use the interactive 3D body placement tool to explore options, get an instant price estimate,
      and book your session online.
    </p>
    <button
      onclick={() => (showBooking = true)}
      class="inline-flex items-center gap-2 bg-ink-500 text-white px-8 py-3.5 rounded-full font-semibold hover:bg-ink-400 transition-colors text-lg active:scale-95"
    >
      Book a Session →
    </button>
  </div>
</section>

<!-- Booking Modal Overlay -->
{#if showBooking}
  <div class="fixed inset-0 z-[100] flex items-center justify-center">
    <!-- Backdrop -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="absolute inset-0 bg-black/80 backdrop-blur-sm"
      onclick={() => (showBooking = false)}
      onkeydown={(e) => { if (e.key === 'Escape') showBooking = false; }}
    ></div>
    <!-- Modal Content: full-screen on mobile, centered card on desktop -->
    <div class="relative z-10 w-full h-full sm:h-auto sm:max-w-4xl sm:max-h-[90dvh] overflow-hidden sm:rounded-2xl bg-surface-900 sm:border sm:border-zinc-800 sm:shadow-[0_0_60px_rgba(255,255,255,0.1)] sm:mx-4">
      <button
        onclick={() => (showBooking = false)}
        class="absolute right-4 top-4 z-[110] flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white transition-colors"
        aria-label="Close"
      >
        ✕
      </button>
      <svelte:boundary onerror={(e) => console.error('BookingFlow error:', e)}>
        <BookingFlow onClose={() => (showBooking = false)} />
        {#snippet failed(error)}
          <div class="flex flex-col items-center justify-center gap-4 p-12 text-center">
            <p class="text-red-400 text-lg font-semibold">Something went wrong</p>
            <p class="text-zinc-400 text-sm max-w-md">{error?.message ?? 'An unexpected error occurred while loading the booking flow.'}</p>
            <button
              onclick={() => (showBooking = false)}
              class="mt-2 px-6 py-2 rounded-full bg-zinc-700 text-white hover:bg-zinc-600 transition-colors text-sm font-medium"
            >
              Close
            </button>
          </div>
        {/snippet}
      </svelte:boundary>
    </div>
  </div>
{/if}
