<script lang="ts">
  import { websiteProjects } from '$lib/data/portfolioData';
  import { Globe, ExternalLink } from 'lucide-svelte';

  function getStatusBadgeColor(status: 'production' | 'built' | 'prototype'): string {
    switch (status) {
      case 'production': return 'bg-green-500/10 text-green-400 border-green-500/30';
      case 'built':      return 'bg-tech-500/10 text-tech-400 border-tech-500/30';
      case 'prototype':  return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30';
      default:           return 'bg-elevated text-zinc-400 border-border';
    }
  }

  function getStatusLabel(status: string) {
    return status === 'production' ? 'LIVE' : status === 'built' ? 'DONE' : 'WIP';
  }
</script>

<svelte:head>
  <title>Websites Built — Arjo Magno</title>
  <meta name="description" content="Client websites designed and built by Arjo Magno. SvelteKit, Supabase, and Tailwind — built for real organizations." />
  <meta property="og:title" content="Websites Built — Arjo Magno" />
  <meta property="og:description" content="Client websites designed and built by Arjo Magno." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://arjostyle.com/websites" />
</svelte:head>

<!-- Hero -->
<section class="bg-dark px-6 py-20 border-b border-border">
  <div class="max-w-6xl mx-auto">
    <div class="mb-20">
      <p class="text-emerald-500 text-[10px] font-mono tracking-[0.5em] uppercase mb-3">Client Work</p>
      <h1 class="font-display text-5xl md:text-6xl font-bold text-white mb-6 tracking-wide">WEBSITES BUILT</h1>
      <p class="text-zinc-400 text-lg max-w-2xl leading-relaxed">
        Real websites for real organizations — designed, developed, and delivered. Full-stack builds
        with CMS, auth, and everything the client needs to run it themselves.
      </p>
    </div>
  </div>
</section>

<!-- Projects grid -->
<section class="bg-dark px-6 pb-20">
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-20">
      {#each websiteProjects as project}
        <a
          href="/websites/{project.slug}"
          class="group block bg-elevated border border-border overflow-hidden hover:border-emerald-500/30 transition-all duration-150"
        >
          <!-- Thumbnail -->
          <div class="aspect-video relative overflow-hidden bg-dark">
            {#if project.imageUrl}
              <img src={project.imageUrl} alt={project.title} class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            {:else}
              <div
                class="absolute inset-0 opacity-10"
                style="background-image: linear-gradient(rgba(52,211,153,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.4) 1px, transparent 1px); background-size: 28px 28px;"
              ></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <div class="w-14 h-14 border border-border flex items-center justify-center mx-auto mb-2 group-hover:border-emerald-500/30 transition-colors">
                    <Globe class="w-7 h-7 text-emerald-500" />
                  </div>
                  <p class="text-[10px] font-mono text-emerald-500 tracking-widest">{project.techStack[0]}</p>
                </div>
              </div>
            {/if}

            <div class="absolute top-3 left-3">
              <span class="text-[10px] font-mono px-2 py-1 border {getStatusBadgeColor(project.status)} uppercase tracking-widest">
                {getStatusLabel(project.status)}
              </span>
            </div>
            {#if project.featured}
              <div class="absolute top-3 right-3">
                <span class="text-[10px] font-bold text-ink bg-ink/10 border border-ink px-2 py-1 uppercase tracking-widest">
                  Featured
                </span>
              </div>
            {/if}
          </div>

          <!-- Card content -->
          <div class="p-6">
            <p class="text-[10px] font-mono text-emerald-500/60 tracking-widest uppercase mb-1">{project.client}</p>
            <h2 class="text-lg font-display text-white mb-1 group-hover:text-emerald-400 transition-colors tracking-wide">
              {project.title.toUpperCase()}
            </h2>
            <p class="text-zinc-600 text-xs font-mono mb-3">{project.location} — {project.year}</p>
            <p class="text-zinc-500 text-sm leading-relaxed mb-6">{project.description}</p>

            <div class="flex flex-wrap gap-2">
              {#each project.techStack.slice(0, 4) as tech}
                <span class="text-[10px] font-mono px-2 py-0.5 bg-dark border border-border text-zinc-400 uppercase tracking-wide group-hover:border-emerald-500/30 transition-colors">
                  {tech}
                </span>
              {/each}
              {#if project.techStack.length > 4}
                <span class="text-[10px] font-mono px-2 py-0.5 bg-dark border border-border text-zinc-600 uppercase tracking-wide">
                  +{project.techStack.length - 4}
                </span>
              {/if}
            </div>
          </div>
        </a>
      {/each}
    </div>
  </div>
</section>

<!-- CTA -->
<section class="bg-dark px-6 py-20 border-t border-border">
  <div class="max-w-4xl mx-auto">
    <div class="bg-elevated border border-emerald-500/20 p-12 md:p-16 text-center">
      <p class="text-emerald-500 text-[10px] font-mono tracking-[0.5em] uppercase mb-4">NEED A WEBSITE?</p>
      <h2 class="font-display text-4xl md:text-5xl font-bold text-white mb-6 tracking-wide">LET'S BUILD YOURS</h2>
      <p class="text-zinc-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
        Whether it's a church, a small business, or a personal brand — I'll design and build it so
        your team can manage it without touching code.
      </p>
      <a
        href="/contact"
        class="inline-flex items-center gap-2 bg-emerald-500 text-dark px-8 py-4 font-bold text-base hover:bg-emerald-600 transition-all duration-150"
      >
        GET IN TOUCH →
      </a>
    </div>
  </div>
</section>
