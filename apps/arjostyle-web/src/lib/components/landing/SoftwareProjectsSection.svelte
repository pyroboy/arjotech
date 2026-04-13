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
    return status === 'production' ? 'LIVE' : status === 'built' ? 'DONE' : 'WIP';
  }
</script>

<section class="bg-dark px-6 py-16 border-b border-border">
  <div class="max-w-6xl mx-auto">
    <div class="flex items-end justify-between mb-8" use:scrollReveal={{ y: 20 }}>
      <div>
        <p class="text-tech text-[10px] font-mono tracking-[0.5em] uppercase mb-2">Recent Builds</p>
        <h2 class="font-display text-3xl md:text-4xl text-white tracking-wide">SOFTWARE PROJECTS</h2>
      </div>
      <a href="/software" class="text-sm text-tech hover:text-tech-400 transition-colors flex items-center gap-1.5 font-medium font-mono tracking-wide">
        VIEW ALL <ArrowRight class="w-4 h-4" />
      </a>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3" use:scrollReveal={{ y: 40, stagger: 0.12, children: true }}>
      {#each projects as project, i}
        {@const Icon = projectIcons[i % projectIcons.length]}
        <a href="/software/{project.slug}" use:tiltCard
          class="group block bg-elevated border border-border overflow-hidden hover:border-tech transition-all duration-150">
          <!-- Thumbnail -->
          <div class="aspect-video relative overflow-hidden bg-dark">
            {#if project.imageUrl}
              <img src={project.imageUrl} alt={project.title} class="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
            {:else}
              <div class="absolute inset-0 opacity-10"
                style="background-image:linear-gradient(rgba(6,182,212,0.4) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,0.4) 1px,transparent 1px);background-size:28px 28px"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <div class="w-12 h-12 bg-dark border border-border flex items-center justify-center mx-auto mb-2 group-hover:border-tech transition-colors">
                    <Icon class="w-6 h-6 text-tech" />
                  </div>
                  <p class="text-[10px] font-mono text-tech tracking-widest">{project.techStack[0]}</p>
                </div>
              </div>
            {/if}
            <div class="absolute top-3 left-3">
              <span class="text-[10px] font-mono px-2 py-1 border
                {project.status === 'production' ? 'bg-green-500/10 text-green-400 border-green-500/30'
                : project.status === 'prototype' ? 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30'
                : 'bg-elevated text-zinc-400 border-border'}">
                {getStatusLabel(project.status)}
              </span>
            </div>
          </div>
          <!-- Content -->
          <div class="p-5">
            <h3 class="text-base font-semibold text-white mb-2 group-hover:text-tech transition-colors">{project.title}</h3>
            <p class="text-zinc-500 text-sm leading-relaxed line-clamp-2 mb-4">{project.description}</p>
            <div class="flex flex-wrap gap-1.5">
              {#each project.techStack.slice(0, 3) as tech}
                <span class="text-[10px] font-mono px-2 py-0.5 bg-dark border border-border text-zinc-400 uppercase tracking-wide">{tech}</span>
              {/each}
              {#if project.techStack.length > 3}
                <span class="text-[10px] font-mono px-2 py-0.5 bg-dark border border-border text-zinc-600 uppercase tracking-wide">+{project.techStack.length - 3}</span>
              {/if}
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>
