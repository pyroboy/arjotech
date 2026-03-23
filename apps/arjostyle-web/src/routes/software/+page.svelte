<script lang="ts">
  import { softwareProjects } from '$lib/data/portfolioData';
  import { Code2, Database, Globe } from 'lucide-svelte';

  const techStack = [
    { name: 'SvelteKit', icon: Code2 },
    { name: 'React', icon: Code2 },
    { name: 'TypeScript', icon: Code2 },
    { name: 'Cloudflare', icon: Globe },
    { name: 'PostgreSQL', icon: Database },
    { name: 'Tailwind', icon: Code2 }
  ];

  function getStatusBadgeColor(status: 'production' | 'built' | 'prototype'): string {
    switch (status) {
      case 'production':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'built':
        return 'bg-tech-500/10 text-tech-400 border-tech-500/20';
      case 'prototype':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:
        return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  }

  function getStatusLabel(status: 'production' | 'built' | 'prototype'): string {
    switch (status) {
      case 'production':
        return 'Live';
      case 'built':
        return 'Completed';
      case 'prototype':
        return 'In Progress';
      default:
        return status;
    }
  }
</script>

<svelte:head>
  <title>Software Projects — Arjo Magno</title>
  <meta name="description" content="Full-stack web applications built for real businesses. SvelteKit, React, Cloudflare." />
</svelte:head>

<!-- Hero section -->
<section class="bg-surface-900 px-6 py-20">
  <div class="max-w-6xl mx-auto">
    <div class="mb-20">
      <p class="text-tech-500/80 font-mono text-sm tracking-widest uppercase mb-3">Code & Build</p>
      <h1 class="font-display text-5xl md:text-6xl font-bold text-white mb-6">Software Projects</h1>
      <p class="text-zinc-400 text-lg max-w-2xl leading-relaxed">
        Full-stack applications built for real businesses. From POS systems to booking platforms —
        modern, scalable, and built to last.
      </p>
    </div>
  </div>
</section>

<!-- Projects grid -->
<section class="bg-surface-900 px-6 py-12">
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
      {#each softwareProjects as project}
        <a
          href="/software/{project.slug}"
          class="group block bg-surface-800 border border-zinc-800/50 rounded-xl p-6 hover:border-tech-500/30 transition-all duration-300 hover:-translate-y-1"
        >
          <!-- Header with status badge -->
          <div class="flex items-start justify-between mb-5">
            <span
              class="text-xs font-mono px-3 py-1 rounded-full border {getStatusBadgeColor(
                project.status
              )}"
            >
              {getStatusLabel(project.status)}
            </span>
            {#if project.featured}
              <span class="text-xs font-semibold text-ink-500 bg-ink-500/10 px-2 py-1 rounded">
                Featured
              </span>
            {/if}
          </div>

          <!-- Project title -->
          <h2 class="text-xl font-semibold text-white mb-3 group-hover:text-tech-400 transition-colors">
            {project.title}
          </h2>

          <!-- Description -->
          <p class="text-zinc-400 text-sm leading-relaxed mb-6">{project.description}</p>

          <!-- Tech stack badges -->
          <div class="flex flex-wrap gap-2">
            {#each project.techStack.slice(0, 4) as tech}
              <span class="text-xs px-2.5 py-1 bg-zinc-800/50 text-zinc-300 rounded-md border border-zinc-700/50 group-hover:border-tech-500/30 transition-colors">
                {tech}
              </span>
            {/each}
            {#if project.techStack.length > 4}
              <span class="text-xs px-2.5 py-1 bg-zinc-800/50 text-zinc-400 rounded-md border border-zinc-700/50">
                +{project.techStack.length - 4}
              </span>
            {/if}
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>

<!-- Tech stack section -->
<section class="bg-surface-800 px-6 py-20">
  <div class="max-w-6xl mx-auto">
    <div class="mb-16">
      <h2 class="font-display text-4xl font-bold text-white mb-4">Technologies I Work With</h2>
      <p class="text-zinc-400 text-lg max-w-2xl">
        I specialize in modern full-stack development with a focus on performance, user experience,
        and scalability.
      </p>
    </div>

    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {#each techStack as tech}
        <div class="bg-surface-900 border border-zinc-800/50 rounded-lg p-6 flex flex-col items-center gap-3 hover:border-tech-500/30 transition-colors">
          <div class="w-10 h-10 rounded-lg bg-tech-500/10 border border-tech-500/20 flex items-center justify-center">
            <svelte:component this={tech.icon} class="w-5 h-5 text-tech-500" />
          </div>
          <p class="text-sm font-medium text-white text-center">{tech.name}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- CTA section -->
<section class="bg-surface-900 px-6 py-20">
  <div class="max-w-4xl mx-auto">
    <div class="bg-gradient-to-br from-tech-500/10 to-cyan-500/5 border border-tech-500/20 rounded-2xl p-12 md:p-16 text-center">
      <p class="text-tech-500 font-mono text-sm tracking-widest uppercase mb-4">Let's build</p>
      <h2 class="font-display text-4xl md:text-5xl font-bold text-white mb-6">Have a project in mind?</h2>
      <p class="text-zinc-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
        Whether you need a booking platform, POS system, or custom web app, let's talk about your
        project and build something great together.
      </p>
      <a
        href="/contact"
        class="inline-flex items-center gap-2 bg-tech-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-tech-400 transition-colors text-lg"
      >
        Get in Touch →
      </a>
    </div>
  </div>
</section>
