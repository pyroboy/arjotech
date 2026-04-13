<script lang="ts">
  import { Globe, ArrowRight } from 'lucide-svelte';
  import { tiltCard } from '$lib/actions/tiltCard';
  import { scrollReveal } from '$lib/actions/scrollReveal';
  import type { WebProject } from '$lib/data/portfolioData';

  interface Props {
    projects: WebProject[];
  }

  let { projects }: Props = $props();

  const featured = projects.filter(p => p.featured);
</script>

{#if featured.length > 0}
<section class="bg-dark px-6 py-16 border-b border-border">
  <div class="max-w-6xl mx-auto">
    <div class="flex items-end justify-between mb-10" use:scrollReveal={{ y: 20 }}>
      <div>
        <p class="text-emerald-500/70 text-[10px] font-mono tracking-[0.5em] uppercase mb-2">Client Work</p>
        <h2 class="font-display text-3xl md:text-4xl text-white tracking-wide">WEBSITES BUILT</h2>
      </div>
      <a href="/websites" class="text-sm text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-medium font-mono tracking-wide">
        VIEW ALL <ArrowRight class="w-4 h-4" />
      </a>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3" use:scrollReveal={{ y: 40, stagger: 0.12, children: true }}>
      {#each featured as project}
        <a href="/websites/{project.slug}" use:tiltCard
          class="group block bg-elevated border border-border overflow-hidden hover:border-emerald-500/50 transition-all duration-150">
          <div class="aspect-video relative overflow-hidden bg-dark">
            {#if project.imageUrl}
              <img src={project.imageUrl} alt={project.title} class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            {:else}
              <div class="absolute inset-0 opacity-10"
                style="background-image: linear-gradient(rgba(52,211,153,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.4) 1px, transparent 1px); background-size: 28px 28px;">
              </div>
              <div class="absolute inset-0 flex items-center justify-center">
                <Globe class="w-10 h-10 text-emerald-400/40 group-hover:text-emerald-400/70 transition-colors" />
              </div>
            {/if}
            <div class="absolute top-3 left-3">
              <span class="text-[10px] font-mono px-2 py-1 border bg-dark text-green-400 border-green-500/30">
                {project.status === 'production' ? 'LIVE' : 'BUILT'}
              </span>
            </div>
          </div>
          <div class="p-5">
            <p class="text-[10px] font-mono text-emerald-500/60 tracking-widest uppercase mb-1">{project.client}</p>
            <h3 class="font-display text-lg text-white mb-1 group-hover:text-emerald-400 transition-colors">{project.title.toUpperCase()}</h3>
            <p class="text-zinc-600 text-xs mb-3 font-mono">{project.location} — {project.year}</p>
            <p class="text-zinc-500 text-sm leading-relaxed line-clamp-2 mb-4">{project.description}</p>
            <div class="flex flex-wrap gap-1.5">
              {#each project.techStack.slice(0, 3) as tech}
                <span class="text-[10px] font-mono px-2 py-0.5 bg-dark border border-border text-zinc-400 uppercase tracking-wide">{tech}</span>
              {/each}
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>
{/if}
