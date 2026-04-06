<script lang="ts">
  import { softwareProjects } from '$lib/data/portfolioData';
  import { Code2, Database, Globe } from 'lucide-svelte';

  const projectIcons = [Code2, Globe, Database];

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
  <title>Software — Arjo Magno, Full-Stack Developer</title>
  <meta name="description" content="Complex web apps, AI chatbots, booking platforms, POS systems, and SaaS — built on the most modern stack: Svelte 5, Neon, RxDB, SpacetimeDB, Cloudflare." />
  <meta property="og:title" content="Software — Arjo Magno, Full-Stack Developer" />
  <meta property="og:description" content="Complex web apps, AI chatbots, booking platforms, POS systems, and SaaS — built on the most modern stack: Svelte 5, Neon, RxDB, SpacetimeDB, Cloudflare." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://arjostyle-web.pages.dev/software" />
</svelte:head>

<!-- Hero section -->
<section class="bg-surface-900 px-6 py-20">
  <div class="max-w-6xl mx-auto">
    <div class="mb-20">
      <p class="text-tech-500/80 font-mono text-sm tracking-widest uppercase mb-3">Full-Stack Developer</p>
      <h1 class="font-display text-5xl md:text-6xl font-bold text-white mb-6">Software I've Built</h1>
      <p class="text-zinc-400 text-lg max-w-2xl leading-relaxed">
        Complex web apps, AI chatbots, booking platforms, POS systems, SaaS — shipped and running in production. I build on the most modern stack available: Svelte 5, SvelteKit, Neon, RxDB, SpacetimeDB, Cloudflare. Everything end-to-end: database schema, API routes, UI design, and deployment.
      </p>
    </div>
  </div>
</section>

<!-- Projects grid -->
<section class="bg-surface-900 px-6 py-12">
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
      {#each softwareProjects as project, i}
        {@const Icon = projectIcons[i % projectIcons.length]}
        <a
          href="/software/{project.slug}"
          class="group block bg-surface-800 border border-zinc-800/50 rounded-xl overflow-hidden hover:border-tech-500/30 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-tech-500/5"
        >
          <!-- Image placeholder -->
          <div class="aspect-video relative overflow-hidden bg-gradient-to-br from-zinc-900 to-zinc-800">
            <div
              class="absolute inset-0 opacity-20"
              style="background-image: linear-gradient(rgba(56,189,248,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.4) 1px, transparent 1px); background-size: 28px 28px;"
            ></div>
            <div class="absolute inset-0 bg-gradient-to-br from-tech-500/10 via-transparent to-cyan-500/5"></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <div class="w-14 h-14 rounded-xl bg-tech-500/20 border border-tech-500/30 flex items-center justify-center mx-auto mb-2 group-hover:bg-tech-500/30 transition-colors">
                  <Icon class="w-7 h-7 text-tech-400" />
                </div>
                <p class="text-xs font-mono text-tech-500/50 tracking-widest">{project.techStack[0]}</p>
              </div>
            </div>
            <!-- Status badge -->
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
            <tech.icon class="w-5 h-5 text-tech-500" />
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
    
    <!-- Dev Resources (temporary access) -->
    <div class="mt-8 pt-6 border-t border-zinc-800/50">
      <p class="text-xs text-zinc-600 mb-2">Internal Resources</p>
      <div class="flex flex-wrap gap-3 justify-center">
        <a href="/dev/hire-me.html" class="text-xs text-zinc-500 hover:text-tech-400 transition-colors">💼 Hire Me Page</a>
        <a href="/dev/tattoo-tide-pricing.html" class="text-xs text-zinc-500 hover:text-tech-400 transition-colors">🎨 Tattoo Tide Pricing</a>
        <a href="/dev/flash-sheets.html" class="text-xs text-zinc-500 hover:text-tech-400 transition-colors">🖼️ Flash Sheets</a>
        <a href="/dev/bmc-integration.html" class="text-xs text-zinc-500 hover:text-tech-400 transition-colors">☕ BMC Setup</a>
        <a href="/dev/wtfpos-outreach-email.txt" class="text-xs text-zinc-500 hover:text-tech-400 transition-colors">📧 WTFPOS Email</a>
      </div>
    </div>
  </div>
</section>
