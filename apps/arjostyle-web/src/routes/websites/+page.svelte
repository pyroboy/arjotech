<script lang="ts">
  import { websiteProjects } from '$lib/data/portfolioData';
  import { Globe, ExternalLink } from 'lucide-svelte';

  function getStatusBadgeColor(status: 'production' | 'built' | 'prototype'): string {
    switch (status) {
      case 'production': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'built':      return 'bg-tech-500/10 text-tech-400 border-tech-500/20';
      case 'prototype':  return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      default:           return 'bg-zinc-800 text-zinc-400 border-zinc-700';
    }
  }

  function getStatusLabel(status: string) {
    return status === 'production' ? 'Live' : status === 'built' ? 'Completed' : 'In Progress';
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
<section class="bg-surface-900 px-6 py-20">
  <div class="max-w-6xl mx-auto">
    <div class="mb-20">
      <p class="text-emerald-500/80 font-mono text-sm tracking-widest uppercase mb-3">Client Work</p>
      <h1 class="font-display text-5xl md:text-6xl font-bold text-white mb-6">Websites Built</h1>
      <p class="text-zinc-400 text-lg max-w-2xl leading-relaxed">
        Real websites for real organizations — designed, developed, and delivered. Full-stack builds
        with CMS, auth, and everything the client needs to run it themselves.
      </p>
    </div>
  </div>
</section>

<!-- Projects grid -->
<section class="bg-surface-900 px-6 pb-20">
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
      {#each websiteProjects as project}
        <a
          href="/websites/{project.slug}"
          class="group block bg-surface-800 border border-zinc-800/50 rounded-xl overflow-hidden hover:border-emerald-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-emerald-500/5"
        >
          <!-- Thumbnail -->
          <div class="aspect-video relative overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800">
            {#if project.imageUrl}
              <img src={project.imageUrl} alt={project.title} class="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            {:else}
              <div
                class="absolute inset-0 opacity-20"
                style="background-image: linear-gradient(rgba(52,211,153,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.4) 1px, transparent 1px); background-size: 28px 28px;"
              ></div>
              <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-transparent to-teal-500/5"></div>
              <div class="absolute inset-0 flex items-center justify-center">
                <div class="text-center">
                  <div class="w-14 h-14 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto mb-2 group-hover:bg-emerald-500/30 transition-colors">
                    <Globe class="w-7 h-7 text-emerald-400" />
                  </div>
                  <p class="text-xs font-mono text-emerald-500/50 tracking-widest">{project.techStack[0]}</p>
                </div>
              </div>
            {/if}

            <div class="absolute top-3 left-3">
              <span class="text-xs font-mono px-2.5 py-1 rounded-full border {getStatusBadgeColor(project.status)}">
                {getStatusLabel(project.status)}
              </span>
            </div>
            {#if project.featured}
              <div class="absolute top-3 right-3">
                <span class="text-xs font-semibold text-ink-500 bg-ink-500/10 border border-ink-500/20 px-2 py-1 rounded-full">
                  Featured
                </span>
              </div>
            {/if}
          </div>

          <!-- Card content -->
          <div class="p-6">
            <p class="text-xs font-mono text-emerald-500/60 tracking-widest uppercase mb-1">{project.client}</p>
            <h2 class="text-xl font-semibold text-white mb-1 group-hover:text-emerald-400 transition-colors">
              {project.title}
            </h2>
            <p class="text-zinc-500 text-xs mb-3">{project.location} · {project.year}</p>
            <p class="text-zinc-400 text-sm leading-relaxed mb-6">{project.description}</p>

            <div class="flex flex-wrap gap-2">
              {#each project.techStack.slice(0, 4) as tech}
                <span class="text-xs px-2.5 py-1 bg-zinc-800/50 text-zinc-300 rounded-md border border-zinc-700/50 group-hover:border-emerald-500/30 transition-colors">
                  {tech}
                </span>
              {/each}
              {#if project.techStack.length > 4}
                <span class="text-xs px-2.5 py-1 bg-zinc-800/50 text-zinc-400 rounded-md border border-zinc-700/50">
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
<section class="bg-surface-900 px-6 py-20 border-t border-zinc-800/50">
  <div class="max-w-4xl mx-auto">
    <div class="bg-gradient-to-br from-emerald-500/10 to-teal-500/5 border border-emerald-500/20 rounded-2xl p-12 md:p-16 text-center">
      <p class="text-emerald-500 font-mono text-sm tracking-widest uppercase mb-4">Need a website?</p>
      <h2 class="font-display text-4xl md:text-5xl font-bold text-white mb-6">Let's build yours</h2>
      <p class="text-zinc-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
        Whether it's a church, a small business, or a personal brand — I'll design and build it so
        your team can manage it without touching code.
      </p>
      <a
        href="/contact"
        class="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-emerald-400 transition-colors text-lg"
      >
        Get in Touch →
      </a>
    </div>
  </div>
</section>
