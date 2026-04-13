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

<section class="bg-dark px-6 py-16">
  <div class="max-w-6xl mx-auto">
    <div class="flex items-end justify-between mb-8" use:scrollReveal={{ y: 20 }}>
      <div>
        <p class="text-ink text-[10px] font-mono tracking-[0.5em] uppercase mb-2">Recent Work</p>
        <h2 class="font-display text-3xl md:text-4xl text-white tracking-wide">FROM THE STUDIO</h2>
      </div>
      <a href="/tattoo" class="text-sm text-ink hover:text-ink-400 transition-colors flex items-center gap-1.5 font-medium font-mono tracking-wide">
        VIEW ALL <ArrowRight class="w-4 h-4" />
      </a>
    </div>
    <div class="grid grid-cols-3 md:grid-cols-6 gap-1" use:scrollReveal={{ y: 30, scale: 0.95, stagger: 0.06, children: true }}>
      {#each images.slice(0, 6) as src, i}
        <a href="/tattoo"
<<<<<<< Updated upstream
          class="relative aspect-square overflow-hidden rounded-lg bg-zinc-900 group {i === 0 ? 'md:col-span-2 md:row-span-2' : ''}">
=======
          class="relative aspect-square overflow-hidden bg-elevated group {i === 0 ? 'col-span-2 row-span-2' : ''}">
>>>>>>> Stashed changes
          {#if !imageLoaded[i]}
            <div class="absolute inset-0 bg-dark z-10">
              <div class="absolute inset-0 bg-elevated animate-pulse"></div>
            </div>
          {/if}
          <img {src} alt="Tattoo work {i + 1}"
            class="w-full h-full object-cover transition-all duration-300 group-hover:scale-105 {imageLoaded[i] ? 'opacity-100' : 'opacity-0'}"
            loading="lazy" onload={() => markLoaded(i)} />
          <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-150 z-20"></div>
        </a>
      {/each}
    </div>
  </div>
</section>
