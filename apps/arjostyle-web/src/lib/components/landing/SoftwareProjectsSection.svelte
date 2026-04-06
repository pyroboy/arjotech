<script lang="ts">
  import { Code2, Globe, Database, Zap, ArrowRight } from 'lucide-svelte';
  import { tiltCard } from '$lib/actions/tiltCard';
  import { scrollReveal } from '$lib/actions/scrollReveal';
  import type { SoftwareProject } from '$lib/data/portfolioData';

  interface Props {
    projects: SoftwareProject[];
  }

  let { projects }: Props = $props();

  const projectIcons = [Code2, Globe, Database, Zap, Code2];

  function getStatusLabel(status: string) {
    return status === 'production' ? 'Live' : status === 'built' ? 'Completed' : 'In Progress';
  }
</script>

<section class="bg-surface-800 px-6 py-16 border-b border-zinc-800/50">
  <div class="max-w-6xl mx-auto">
    <div class="flex items-end justify-between mb-8" use:scrollReveal={{ y: 20 }}>
      <div>
        <p class="text-tech-500/70 text-xs font-mono tracking-[0.5em] uppercase mb-2">Recent Builds</p>
        <h2 class="text-2xl md:text-3xl font-bold text-white">Software Projects</h2>
      </div>
      <a href="/software" class="text-sm text-tech-500 hover:text-tech-400 transition-colors flex items-center gap-1.5 font-medium">
        View all <ArrowRight class="w-4 h-4" />
      </a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" use:scrollReveal={{ y: 40, stagger: 0.12, children: true }}>
      {#each projects as project, i}
        {@const Icon = projectIcons[i % projectIcons.length]}
        <a href="/software/{project.slug}" use:tiltCard
          class="group block bg-surface-900 border border-zinc-800/50 rounded-xl overflow-hidden hover:border-tech-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-tech-500/5">
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
