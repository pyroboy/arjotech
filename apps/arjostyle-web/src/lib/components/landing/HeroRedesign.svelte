<script lang="ts">
  import TextReveal from '$lib/components/ui/TextReveal.svelte';
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  let mounted = $state(false);
  let HeroSceneComponent = $state<typeof import('$lib/components/three/HeroScene.svelte').default | null>(null);
  let subtitleVisible = $state(false);
  let ctaVisible = $state(false);
  let scrollIndicatorVisible = $state(false);

  onMount(async () => {
    mounted = true;

    if (browser && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      try {
        const mod = await import('$lib/components/three/HeroScene.svelte');
        HeroSceneComponent = mod.default;
      } catch {
        // WebGL not available — fallback shows
      }

      // Staggered reveal timeline
      setTimeout(() => { subtitleVisible = true; }, 600);
      setTimeout(() => { ctaVisible = true; }, 900);
      setTimeout(() => { scrollIndicatorVisible = true; }, 1200);
    } else {
      subtitleVisible = true;
      ctaVisible = true;
      scrollIndicatorVisible = true;
    }
  });
</script>

<<<<<<< Updated upstream
<section class="relative h-[100dvh] flex items-center justify-center overflow-hidden bg-surface-900">
  <!-- Background gradient blobs -->
  <GradientBlob color="bg-ink-500/15" size="w-[400px] h-[400px] md:w-[800px] md:h-[800px]" position="-top-40 -left-40" delay={0} />
  <GradientBlob color="bg-tech-500/10" size="w-[350px] h-[350px] md:w-[700px] md:h-[700px]" position="-bottom-40 -right-40" delay={5} />
  <GradientBlob color="bg-ink-500/5" size="w-[400px] h-[400px]" position="top-1/3 right-1/4" delay={10} />
=======
<section class="relative h-[100dvh] flex items-center justify-center overflow-hidden bg-dark">
  <!-- Grid lines background -->
  <div class="absolute inset-0 opacity-[0.03]" aria-hidden="true">
    <div class="absolute inset-0" style="background-image: linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px); background-size: 80px 80px;"></div>
  </div>

  <!-- Hard edge accent lines -->
  <div class="absolute top-0 left-0 w-32 h-px bg-gradient-to-r from-ink to-transparent" aria-hidden="true"></div>
  <div class="absolute top-0 left-0 w-px h-32 bg-gradient-to-b from-ink to-transparent" aria-hidden="true"></div>
  <div class="absolute bottom-0 right-0 w-32 h-px bg-gradient-to-l from-tech to-transparent" aria-hidden="true"></div>
  <div class="absolute bottom-0 right-0 w-px h-32 bg-gradient-to-t from-tech to-transparent" aria-hidden="true"></div>
>>>>>>> Stashed changes

  <!-- 3D Scene (lazy-loaded, browser-only) -->
  {#if mounted && HeroSceneComponent}
    <HeroSceneComponent />
  {/if}

  <!-- Content -->
  <div class="relative z-10 text-center px-6 max-w-5xl mx-auto">
    <!-- Name — oversized brutalist typography -->
    <TextReveal
      text="ARJO MAGNO"
      tag="h2"
<<<<<<< Updated upstream
      class="font-display text-4xl sm:text-5xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight leading-none"
      delay={0.3}
      stagger={0.04}
    />

    <!-- Subtitles -->
    <div class="mt-6 space-y-2 transition-all duration-700 {subtitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}">
      <p class="text-sm md:text-xl text-zinc-300 font-light leading-relaxed">
        <span class="text-ink-400">Tattoo Artist</span>
        <span class="text-zinc-600 mx-3">·</span>
        <span class="text-tech-400">Full-Stack Developer</span>
        <span class="text-zinc-600 mx-3">·</span>
        <span class="text-purple-400">AI Engineer</span>
=======
      class="font-display text-display-lg md:text-display-xl lg:text-[14vw] font-bold text-white tracking-tight leading-none"
      delay={0}
      stagger={0.03}
    />

    <!-- Subtitles -->
    <div class="mt-8 space-y-3 transition-all duration-250 {subtitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}">
      <p class="text-base md:text-lg text-zinc-400 font-mono tracking-wider">
        <span class="text-ink">TATTOO ARTIST</span>
        <span class="text-zinc-700 mx-4">—</span>
        <span class="text-tech">FULL-STACK DEVELOPER</span>
        <span class="text-zinc-700 mx-4">—</span>
        <span class="text-purple-400">AI ENGINEER</span>
>>>>>>> Stashed changes
      </p>
      <p class="text-xs md:text-sm text-zinc-600 font-mono tracking-[0.2em]">
        TAGBILARAN CITY, BOHOL — PHILIPPINES
      </p>
    </div>

    <!-- CTAs -->
    <div class="mt-12 flex flex-wrap gap-3 justify-center transition-all duration-250 {ctaVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}">
      <a
        href="/tattoo"
        class="group inline-flex items-center gap-3 px-8 py-4 bg-white text-dark font-bold text-base hover:bg-ink transition-all duration-150"
      >
        EXPLORE PORTFOLIO
        <span class="transition-transform duration-150 group-hover:translate-x-1">→</span>
      </a>
      <a
        href="/software"
        class="group inline-flex items-center gap-3 px-8 py-4 border border-border text-zinc-300 font-semibold text-base hover:border-tech hover:text-white transition-all duration-150"
      >
        VIEW PROJECTS
        <span class="transition-transform duration-150 group-hover:translate-x-1">→</span>
      </a>
    </div>
  </div>

  <!-- Scroll indicator -->
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-all duration-500 {scrollIndicatorVisible ? 'opacity-100' : 'opacity-0'}">
    <div class="flex flex-col items-center gap-3">
      <span class="text-zinc-600 text-[10px] font-mono tracking-[0.3em] uppercase">Scroll</span>
      <div class="w-px h-12 bg-gradient-to-b from-zinc-600 to-transparent"></div>
    </div>
  </div>

  <!-- Bottom hard line -->
  <div class="absolute bottom-0 left-0 right-0 h-px bg-border"></div>
</section>

<!-- Hidden accessible h1 -->
<h1 class="sr-only">Arjo Magno — Full-Stack Developer, AI Engineer & Tattoo Artist</h1>
