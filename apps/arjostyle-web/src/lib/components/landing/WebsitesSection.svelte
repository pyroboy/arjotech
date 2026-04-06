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
<section class="bg-surface-800 px-6 py-16 border-t border-zinc-800/50">
  <div class="max-w-6xl mx-auto">
    <div class="flex items-end justify-between mb-10" use:scrollReveal={{ y: 20 }}>
      <div>
        <p class="text-emerald-500/70 text-xs font-mono tracking-[0.5em] uppercase mb-2">Client Work</p>
        <h2 class="text-2xl md:text-3xl font-bold text-white">Websites Built</h2>
      </div>
      <a href="/websites" class="text-sm text-emerald-500 hover:text-emerald-400 transition-colors flex items-center gap-1.5 font-medium">
        View all <ArrowRight class="w-4 h-4" />
      </a>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" use:scrollReveal={{ y: 40, stagger: 0.12, children: true }}>
      {#each featured as project}
        <a href="/websites/{project.slug}" use:tiltCard
          class="group block bg-surface-900 border border-zinc-800/50 rounded-xl overflow-hidden hover:border-emerald-500/20 transition-all duration-300 hover:shadow-lg hover:shadow-emerald-500/5">
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
