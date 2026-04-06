<script lang="ts">
  import GradientBlob from '$lib/components/ui/GradientBlob.svelte';
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
        // WebGL not available — fallback gradient shows
      }

      // Staggered reveal timeline
      setTimeout(() => { subtitleVisible = true; }, 800);
      setTimeout(() => { ctaVisible = true; }, 1200);
      setTimeout(() => { scrollIndicatorVisible = true; }, 1500);
    } else {
      subtitleVisible = true;
      ctaVisible = true;
      scrollIndicatorVisible = true;
    }
  });
</script>

<section class="relative h-[100dvh] flex items-center justify-center overflow-hidden bg-surface-900">
  <!-- Background gradient blobs -->
  <GradientBlob color="bg-ink-500/15" size="w-[800px] h-[800px]" position="-top-40 -left-40" delay={0} />
  <GradientBlob color="bg-tech-500/10" size="w-[700px] h-[700px]" position="-bottom-40 -right-40" delay={5} />
  <GradientBlob color="bg-ink-500/5" size="w-[400px] h-[400px]" position="top-1/3 right-1/4" delay={10} />

  <!-- 3D Scene (lazy-loaded, browser-only) -->
  {#if mounted && HeroSceneComponent}
    <HeroSceneComponent />
  {/if}

  <!-- Content -->
  <div class="relative z-10 text-center px-6 max-w-4xl mx-auto">
    <!-- Name -->
    <TextReveal
      text="ARJO MAGNO"
      tag="h2"
      class="font-display text-6xl md:text-8xl lg:text-9xl font-bold text-white tracking-tight leading-none"
      delay={0.3}
      stagger={0.04}
    />

    <!-- Subtitles -->
    <div class="mt-6 space-y-2 transition-all duration-700 {subtitleVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}">
      <p class="text-xl md:text-2xl text-zinc-300 font-light">
        <span class="text-ink-400">Tattoo Artist</span>
        <span class="text-zinc-600 mx-3">&</span>
        <span class="text-tech-400">Software Developer</span>
      </p>
      <p class="text-sm md:text-base text-zinc-500 font-mono tracking-wider">
        Tagbilaran City, Bohol — Philippines
      </p>
    </div>

    <!-- CTAs -->
    <div class="mt-10 flex flex-wrap gap-4 justify-center transition-all duration-700 {ctaVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}">
      <a
        href="/tattoo"
        class="group relative px-8 py-3.5 bg-ink-500 text-white rounded-full font-semibold hover:bg-ink-400 transition-all duration-300 hover:shadow-lg hover:shadow-ink-500/25 hover:-translate-y-0.5 text-lg"
      >
        Explore Portfolio
        <span class="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
      </a>
      <a
        href="/software"
        class="group px-8 py-3.5 border border-zinc-700 text-zinc-300 rounded-full font-semibold hover:border-tech-500/50 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-tech-500/10 hover:-translate-y-0.5 text-lg"
      >
        View Projects
        <span class="inline-block ml-1 transition-transform duration-300 group-hover:translate-x-1">→</span>
      </a>
    </div>
  </div>

  <!-- Scroll indicator -->
  <div class="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 transition-all duration-500 {scrollIndicatorVisible ? 'opacity-100' : 'opacity-0'}">
    <div class="flex flex-col items-center gap-2">
      <span class="text-zinc-500 text-xs font-mono tracking-widest uppercase">Scroll</span>
      <div class="w-5 h-8 rounded-full border border-zinc-600 flex items-start justify-center p-1.5">
        <div class="w-1 h-2 bg-zinc-400 rounded-full animate-bounce"></div>
      </div>
    </div>
  </div>

  <!-- Bottom gradient fade into next section -->
  <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-surface-900 to-transparent z-10 pointer-events-none"></div>
</section>

<!-- Hidden accessible h1 -->
<h1 class="sr-only">Arjo Magno — Tattoo Artist & Software Developer</h1>
