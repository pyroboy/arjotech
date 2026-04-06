<script lang="ts">
  import { ArrowRight } from 'lucide-svelte';
  import { scrollReveal } from '$lib/actions/scrollReveal';

  interface Props {
    images: string[];
  }

  let { images }: Props = $props();

  let imageLoaded = $state<Record<number, boolean>>({});

  function markLoaded(index: number) {
    imageLoaded[index] = true;
  }
</script>

<section class="bg-surface-900 px-6 py-16">
  <div class="max-w-6xl mx-auto">
    <div class="flex items-end justify-between mb-8" use:scrollReveal={{ y: 20 }}>
      <div>
        <p class="text-ink-500/70 text-xs font-mono tracking-[0.5em] uppercase mb-2">Recent Work</p>
        <h2 class="text-2xl md:text-3xl font-bold text-white">From the Studio</h2>
      </div>
      <a href="/tattoo" class="text-sm text-ink-500 hover:text-ink-400 transition-colors flex items-center gap-1.5 font-medium">
        View all <ArrowRight class="w-4 h-4" />
      </a>
    </div>
    <div class="grid grid-cols-3 md:grid-cols-6 gap-1.5 md:gap-2" use:scrollReveal={{ y: 30, scale: 0.95, stagger: 0.06, children: true }}>
      {#each images.slice(0, 6) as src, i}
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
