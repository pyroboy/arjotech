<script lang="ts">
  import { page } from '$app/stores';
  import { softwareProjects } from '$data/portfolioData';

  const project = softwareProjects.find(p => p.slug === $page.params.slug);

  function renderMarkdown(text: string): string {
    return text
      // Escape HTML first
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
      // Bold: **text**
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Inline code: `text`
      .replace(/`(.+?)`/g, '<code>$1</code>')
      // Bullet list items: lines starting with "- "
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      // Wrap consecutive <li> blocks in <ul>
      .replace(/(<li>.*<\/li>\n?)+/gs, (match) => `<ul>${match}</ul>`)
      // Double newlines → paragraphs (skip if already wrapped in block tags)
      .replace(/\n\n(?!<(?:ul|li))/g, '</p><p>')
      // Wrap in opening paragraph
      .replace(/^(?!<(?:ul|h))/, '<p>')
      // Close final paragraph
      .replace(/(?<!>)$/, '</p>')
      // Clean up empty paragraphs
      .replace(/<p><\/p>/g, '')
      .replace(/<p>(<ul>)/g, '$1')
      .replace(/(<\/ul>)<\/p>/g, '$1');
  }
</script>

<svelte:head>
  <title>{project?.title ?? 'Project'} — Arjo Magno</title>
</svelte:head>

{#if project}
<div class="min-h-screen bg-surface-900">

  {#if project.imageUrl}
    <div class="w-full h-72 md:h-96 overflow-hidden">
      <img src={project.imageUrl} alt={project.title} class="w-full h-full object-cover object-top" />
    </div>
  {/if}

  <div class="px-6 py-20">
    <div class="max-w-4xl mx-auto">
      <a href="/software" class="text-tech-400 text-sm font-mono hover:text-tech-300 flex items-center gap-2 mb-12">
        ← Back to projects
      </a>
      <p class="text-tech-400 font-mono text-sm tracking-widest uppercase mb-3">{project.tags.join(' · ')}</p>
      <h1 class="font-display text-5xl text-white mb-6">{project.title}</h1>
      <p class="text-zinc-300 text-xl leading-relaxed mb-10">{project.description}</p>

      <div class="flex flex-wrap gap-3 mb-12">
        {#each project.techStack as tech}
          <span class="px-3 py-1.5 bg-tech-500/10 border border-tech-500/20 text-tech-400 rounded-lg text-sm font-mono">{tech}</span>
        {/each}
      </div>

      <div class="flex gap-4 mb-16">
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
        <div class="prose prose-invert max-w-none prose-li:text-zinc-300 prose-strong:text-white prose-code:text-tech-400 prose-code:bg-tech-500/10 prose-code:px-1 prose-code:rounded">
          {@html renderMarkdown(project.longDescription)}
        </div>
      {/if}

      {#if project.videoUrl}
        <div class="mt-16">
          <h2 class="text-2xl font-semibold text-white mb-6">Demo</h2>
          <div class="aspect-video rounded-xl overflow-hidden border border-zinc-800">
            <iframe
              src={project.videoUrl}
              title="{project.title} demo"
              class="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen
            ></iframe>
          </div>
        </div>
      {/if}
    </div>
  </div>
</div>
{:else}
<div class="min-h-screen bg-surface-900 flex items-center justify-center">
  <p class="text-zinc-400">Project not found.</p>
</div>
{/if}
