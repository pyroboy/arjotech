<script lang="ts">
  import { softwareProjects } from '$lib/data/portfolioData';
  import { Code2, Database, Globe } from 'lucide-svelte';

  const projectIcons = [Code2, Globe, Database];

  const techStack = [
    { name: 'SvelteKit', icon: Code2 },
    { name: 'Rust / Tauri', icon: Code2 },
    { name: 'TypeScript', icon: Code2 },
    { name: 'Claude API', icon: Code2 },
    { name: 'Groq / LLMs', icon: Code2 },
    { name: 'Neon', icon: Database },
    { name: 'RxDB', icon: Database },
    { name: 'SpacetimeDB', icon: Database },
    { name: 'Cloudflare', icon: Globe },
    { name: 'DuckDB', icon: Database },
    { name: 'Three.js', icon: Globe },
    { name: 'Tailwind', icon: Code2 }
  ];

  function getStatusBadgeColor(status: 'production' | 'built' | 'prototype'): string {
    switch (status) {
      case 'production':
        return 'brutal-tag-tech';
      case 'built':
        return 'brutal-tag';
      case 'prototype':
        return 'brutal-tag-ink';
      default:
        return 'brutal-tag';
    }
  }

  function getStatusLabel(status: 'production' | 'built' | 'prototype'): string {
    switch (status) {
      case 'production':
        return 'LIVE';
      case 'built':
        return 'DONE';
      case 'prototype':
        return 'WIP';
      default:
        return status.toUpperCase();
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
<section class="bg-dark px-6 py-20 border-b border-border">
  <div class="max-w-6xl mx-auto">
    <div class="mb-20">
      <p class="text-tech text-[10px] font-mono tracking-[0.5em] uppercase mb-3">Full-Stack Developer & AI Engineer</p>
      <h1 class="font-display text-5xl md:text-7xl font-bold text-white tracking-wide mb-6">SOFTWARE I'VE BUILT</h1>
      <p class="text-zinc-400 text-lg max-w-2xl leading-relaxed">
        LLM-powered conversational agents, AI orchestration harnesses, complex SaaS, POS systems, real-time dashboards — shipped and running in production. I build on the most modern stack available: Svelte 5, Rust/Tauri, Neon, RxDB, SpacetimeDB, Claude API, Groq, Cloudflare. Everything end-to-end: model integration, database schema, API routes, UI design, and deployment.
      </p>
    </div>
  </div>
</section>

<!-- Projects grid -->
<section class="bg-dark px-6 py-12">
  <div class="max-w-6xl mx-auto">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-20">
      {#each softwareProjects as project, i}
        {@const Icon = projectIcons[i % projectIcons.length]}
        <a
          href="/software/{project.slug}"
          class="group block bg-elevated border border-border overflow-hidden hover:border-tech transition-all duration-150"
        >
          <!-- Image placeholder -->
          <div class="aspect-video relative overflow-hidden bg-dark">
            <div
              class="absolute inset-0 opacity-10"
              style="background-image: linear-gradient(rgba(6,182,212,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(6,182,212,0.4) 1px, transparent 1px); background-size: 28px 28px;"
            ></div>
            <div class="absolute inset-0 flex items-center justify-center">
              <div class="text-center">
                <div class="w-14 h-14 border border-border flex items-center justify-center mx-auto mb-2 group-hover:border-tech transition-colors">
                  <Icon class="w-7 h-7 text-tech" />
                </div>
                <p class="text-[10px] font-mono text-tech tracking-widest">{project.techStack[0]}</p>
              </div>
            </div>
            <!-- Status badge -->
            <div class="absolute top-3 left-3">
              <span class="text-[10px] font-mono px-2 py-1 border {getStatusBadgeColor(project.status)}">
                {getStatusLabel(project.status)}
              </span>
            </div>
            {#if project.featured}
              <div class="absolute top-3 right-3">
                <span class="text-[10px] font-bold text-ink bg-ink/10 border border-ink px-2 py-1">
                  FEATURED
                </span>
              </div>
            {/if}
          </div>

          <!-- Card content -->
          <div class="p-6">
            <!-- Project title -->
            <h2 class="text-xl font-semibold text-white mb-3 group-hover:text-tech transition-colors">
              {project.title}
            </h2>

            <!-- Description -->
            <p class="text-zinc-500 text-sm leading-relaxed mb-6">{project.description}</p>

            <!-- Tech stack badges -->
            <div class="flex flex-wrap gap-2">
              {#each project.techStack.slice(0, 4) as tech}
                <span class="text-[10px] font-mono px-2 py-0.5 bg-dark border border-border text-zinc-400 uppercase tracking-wide group-hover:border-tech/30 transition-colors">
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

<!-- Tech stack section -->
<section class="bg-elevated px-6 py-20 border-y border-border">
  <div class="max-w-6xl mx-auto">
    <div class="mb-16">
      <h2 class="font-display text-4xl font-bold text-white mb-4">TECHNOLOGIES I WORK WITH</h2>
      <p class="text-zinc-400 text-lg max-w-2xl">
        Modern full-stack development, AI/LLM integration, and systems programming. I pick the most capable tool for each layer — from Rust for performance-critical backends to Claude and Groq for intelligent agent behavior.
      </p>
    </div>

    <div class="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
      {#each techStack as tech}
        <div class="bg-dark border border-border p-6 flex flex-col items-center gap-3 hover:border-tech/30 transition-colors">
          <div class="w-10 h-10 border border-border flex items-center justify-center">
            <tech.icon class="w-5 h-5 text-tech" />
          </div>
          <p class="text-sm font-medium text-white text-center">{tech.name}</p>
        </div>
      {/each}
    </div>
  </div>
</section>

<!-- CTA section -->
<section class="bg-dark px-6 py-20">
  <div class="max-w-4xl mx-auto">
    <div class="bg-elevated border border-border p-12 md:p-16 text-center">
      <p class="text-tech text-[10px] font-mono tracking-[0.5em] uppercase mb-4">LET'S BUILD</p>
      <h2 class="font-display text-4xl md:text-5xl font-bold text-white mb-6">HAVE A PROJECT IN MIND?</h2>
      <p class="text-zinc-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
        Whether you need a booking platform, POS system, or custom web app, let's talk about your
        project and build something great together.
      </p>
      <a
        href="/contact"
        class="inline-flex items-center gap-2 bg-tech text-dark px-8 py-4 font-bold text-base hover:bg-tech-600 transition-all duration-150"
      >
        GET IN TOUCH →
      </a>
    </div>
    
    <!-- Dev Resources -->
    <div class="mt-8 pt-6 border-t border-border">
      <p class="text-[10px] text-zinc-600 font-mono uppercase tracking-widest mb-2">Internal Resources</p>
      <div class="flex flex-wrap gap-4 justify-center">
        <a href="/dev/hire-me.html" class="text-xs text-zinc-500 hover:text-tech transition-colors">💼 Hire Me Page</a>
        <a href="/dev/tattoo-tide-pricing.html" class="text-xs text-zinc-500 hover:text-tech transition-colors">🎨 Tattoo Tide Pricing</a>
        <a href="/dev/flash-sheets.html" class="text-xs text-zinc-500 hover:text-tech transition-colors">🖼️ Flash Sheets</a>
        <a href="/dev/bmc-integration.html" class="text-xs text-zinc-500 hover:text-tech transition-colors">☕ BMC Setup</a>
        <a href="/dev/wtfpos-outreach-email.txt" class="text-xs text-zinc-500 hover:text-tech transition-colors">📧 WTFPOS Email</a>
      </div>
    </div>
  </div>
</section>
