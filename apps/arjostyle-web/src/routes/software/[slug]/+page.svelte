<script lang="ts">
  import { page } from '$app/stores';
  import { softwareProjects } from '$data/portfolioData';

  const project = softwareProjects.find(p => p.slug === $page.params.slug);
</script>

<svelte:head>
  <title>{project?.title ?? 'Project'} — Arjo Magno</title>
</svelte:head>

{#if project}
<div class="min-h-screen bg-surface-900 px-6 py-20">
  <div class="max-w-4xl mx-auto">
    <a href="/software" class="text-tech-400 text-sm font-mono hover:text-tech-300 flex items-center gap-2 mb-12">
      ← Back to projects
    </a>
    <p class="text-tech-400 font-mono text-sm tracking-widest uppercase mb-3">{project.tags.join(' · ')}</p>
    <h1 class="font-display text-5xl text-white mb-6">{project.title}</h1>
    <p class="text-zinc-300 text-xl leading-relaxed mb-10">{project.longDescription ?? project.description}</p>

    <div class="flex flex-wrap gap-3 mb-12">
      {#each project.techStack as tech}
        <span class="px-3 py-1.5 bg-tech-500/10 border border-tech-500/20 text-tech-400 rounded-lg text-sm font-mono">{tech}</span>
      {/each}
    </div>

    <div class="flex gap-4">
      {#if project.liveUrl}
        <a href={project.liveUrl} target="_blank" rel="noopener" class="px-6 py-3 bg-tech-500 text-white rounded-xl font-medium hover:bg-tech-400 transition-colors">
          View Live
        </a>
      {/if}
      {#if project.githubUrl}
        <a href={project.githubUrl} target="_blank" rel="noopener" class="px-6 py-3 border border-zinc-700 text-zinc-300 rounded-xl font-medium hover:border-zinc-500 transition-colors">
          GitHub
        </a>
      {/if}
    </div>

    {#if project.longDescription}
    <div class="mt-16 prose prose-invert max-w-none">
      <!-- Case study content rendered here -->
    </div>
    {/if}
  </div>
</div>
{:else}
<div class="min-h-screen bg-surface-900 flex items-center justify-center">
  <p class="text-zinc-400">Project not found.</p>
</div>
{/if}
