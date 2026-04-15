<script lang="ts">
  import { page } from '$app/stores';
  import { softwareProjects } from '$data/portfolioData';
  import {
    ArrowLeft, ExternalLink, Github, Zap, LayoutGrid, QrCode, Flame,
    Package, MapPin, Smartphone, BarChart3, Shield, WifiOff, RefreshCw,
    CheckCircle2, Users
  } from 'lucide-svelte';
  import type { Component } from 'svelte';

  const project = softwareProjects.find(p => p.slug === $page.params.slug);
  const otherProjects = softwareProjects.filter(p => p.slug !== $page.params.slug).slice(0, 2);

  interface Feature { icon: any; title: string; description: string }

  const iconMap: Record<string, any> = {
    floor: LayoutGrid, layout: LayoutGrid, table: LayoutGrid,
    qr: QrCode, scan: QrCode, order: QrCode,
    kitchen: Flame, display: Flame, kds: Flame,
    inventory: Package, stock: Package, delivery: Package,
    location: MapPin, branch: MapPin, multi: MapPin,
    pwa: Smartphone, mobile: Smartphone, install: Smartphone,
    report: BarChart3, analytic: BarChart3, kpi: BarChart3,
    role: Shield, auth: Shield, pin: Shield,
    offline: WifiOff, sync: RefreshCw
  };

  function pickIcon(title: string): any {
    const lower = title.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lower.includes(key)) return icon;
    }
    return Zap;
  }

  function parseFeatures(text: string): Feature[] {
    const features: Feature[] = [];
    for (const line of text.split('\n')) {
      const match = line.match(/^- \*\*(.+?)\*\*\s*[—–-]+\s*(.+)$/);
      if (match) features.push({ icon: pickIcon(match[1]), title: match[1], description: match[2] });
    }
    return features;
  }

  function renderProse(text: string): string {
    return text
      .replace(/\*\*Features:\*\*[\s\S]*?(?=\n\n\*\*|\n\n[A-Z]|$)/, '')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>')
      .replace(/$/, '</p>')
      .replace(/<p><\/p>/g, '');
  }

  function getStatusLabel(status: string) {
    return status === 'production' ? 'LIVE' : status === 'built' ? 'DONE' : 'WIP';
  }

  const features = project?.longDescription ? parseFeatures(project.longDescription) : [];
</script>

<svelte:head>
  <title>{project?.title ?? 'Project'} — Arjo Magno</title>
  <meta name="description" content={project?.description} />
</svelte:head>

{#if project}

<!-- ── HERO ─────────────────────────────────────────────── -->
<section class="relative min-h-[72vh] flex items-end bg-dark overflow-hidden border-b border-border">

  {#if project.imageUrl}
    <div class="absolute inset-0">
      <img src={project.imageUrl} alt={project.title} class="w-full h-full object-cover object-top opacity-20" />
      <div class="absolute inset-0 bg-gradient-to-t from-dark via-dark/70 to-transparent"></div>
    </div>
  {:else}
    <div class="absolute inset-0 bg-dark">
      <!-- Grid lines -->
      <div class="absolute inset-0 opacity-[0.03] pointer-events-none"
        style="background-image:linear-gradient(rgba(6,182,212,1) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,1) 1px,transparent 1px);background-size:64px 64px">
      </div>
    </div>
  {/if}

  <div class="relative z-10 w-full max-w-6xl mx-auto px-6 pb-16 pt-36">
    <a href="/software" class="inline-flex items-center gap-2 text-zinc-500 hover:text-tech text-sm font-mono transition-colors mb-10">
      <ArrowLeft class="w-4 h-4" /> BACK TO PROJECTS
    </a>

    <div class="flex flex-wrap items-center gap-2 mb-6">
      {#each project.tags as tag}
        <span class="text-[10px] font-mono px-2 py-1 border border-tech/30 text-tech bg-tech/10 uppercase tracking-widest">{tag}</span>
      {/each}
      <span class="text-[10px] font-mono px-2 py-1 border border-green-500/30 text-green-400 bg-green-500/10 uppercase tracking-widest">
        {getStatusLabel(project.status)}
      </span>
    </div>

    <h1 class="font-display text-6xl md:text-7xl text-white mb-6 leading-tight tracking-wide">{project.title.toUpperCase()}</h1>
    <p class="text-zinc-300 text-xl md:text-2xl leading-relaxed max-w-3xl mb-10">{project.description}</p>

    <div class="flex flex-wrap gap-3">
      {#if project.liveUrl}
        <a href={project.liveUrl} target="_blank" rel="noopener"
          class="inline-flex items-center gap-2 px-7 py-3.5 bg-tech text-dark font-bold transition-all duration-150 hover:bg-tech-600 hover:-translate-y-0.5">
          <ExternalLink class="w-4 h-4" /> VIEW LIVE DEMO
        </a>
      {/if}
      {#if project.githubUrl}
        <a href={project.githubUrl} target="_blank" rel="noopener"
          class="inline-flex items-center gap-2 px-7 py-3.5 border border-border text-zinc-300 font-semibold transition-all duration-150 hover:border-zinc-500 hover:text-white hover:-translate-y-0.5">
          <Github class="w-4 h-4" /> VIEW SOURCE
        </a>
      {/if}
    </div>
  </div>
</section>

<!-- ── TECH STACK BAR ────────────────────────────────────── -->
<div class="bg-elevated border-y border-border px-6 py-5">
  <div class="max-w-6xl mx-auto flex flex-wrap items-center gap-3">
    <span class="text-zinc-600 text-[10px] font-mono uppercase tracking-widest mr-2">BUILT WITH</span>
    {#each project.techStack as tech}
      <span class="px-3 py-1.5 bg-dark border border-border text-zinc-300 text-sm font-mono hover:border-tech/40 hover:text-tech transition-colors cursor-default uppercase tracking-wide">
        {tech}
      </span>
    {/each}
  </div>
</div>

<!-- ── MAIN CONTENT ──────────────────────────────────────── -->
<div class="bg-dark px-6 py-20">
  <div class="max-w-6xl mx-auto">

    <!-- Feature cards -->
    {#if features.length > 0}
      <div class="mb-24">
        <p class="text-tech text-[10px] font-mono tracking-[0.5em] uppercase mb-3">WHAT IT DOES</p>
        <h2 class="font-display text-4xl text-white mb-12 tracking-wide">KEY FEATURES</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
          {#each features as feat}
            <div class="group bg-elevated border border-border p-6 hover:border-tech/30 transition-all duration-150">
              <div class="w-10 h-10 border border-border flex items-center justify-center mb-4 group-hover:border-tech/50 transition-colors">
                <svelte:component this={feat.icon} class="w-5 h-5 text-tech" />
              </div>
              <h3 class="text-white font-semibold mb-2">{feat.title}</h3>
              <p class="text-zinc-500 text-sm leading-relaxed">{feat.description}</p>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Case study + sidebar -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">

      <div class="lg:col-span-2">
        <p class="text-tech text-[10px] font-mono tracking-[0.5em] uppercase mb-3">CASE STUDY</p>
        <h2 class="font-display text-4xl text-white mb-8 tracking-wide">ABOUT THE PROJECT</h2>
        {#if project.longDescription}
          <div class="prose prose-invert max-w-none
            prose-p:text-zinc-300 prose-p:leading-relaxed
            prose-strong:text-white
            prose-code:text-tech prose-code:bg-tech/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-mono
            prose-li:text-zinc-300">
            {@html renderProse(project.longDescription)}
          </div>
        {/if}
      </div>

      <div class="space-y-3">
        <!-- Project details -->
        <div class="bg-elevated border border-border p-6">
          <h3 class="text-zinc-600 text-[10px] font-mono uppercase tracking-widest mb-5">PROJECT DETAILS</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-zinc-600 text-sm">Status</span>
              <span class="text-[10px] font-mono px-2 py-1 border border-green-500/30 text-green-400 uppercase">{getStatusLabel(project.status)}</span>
            </div>
            <div class="flex items-start justify-between gap-4">
              <span class="text-zinc-600 text-sm">Category</span>
              <span class="text-white text-sm text-right">{project.tags.join(', ')}</span>
            </div>
            <div class="flex items-start justify-between gap-4">
              <span class="text-zinc-600 text-sm">Stack</span>
              <span class="text-white text-sm">{project.techStack.length} technologies</span>
            </div>
          </div>
        </div>

        <!-- Architecture callout -->
        <div class="bg-elevated border border-tech/20 p-6">
          <div class="flex items-center gap-2 mb-3">
            <WifiOff class="w-4 h-4 text-tech" />
            <h3 class="text-tech text-[10px] font-mono uppercase tracking-widest">ARCHITECTURE HIGHLIGHT</h3>
          </div>
          <p class="text-zinc-300 text-sm leading-relaxed">
            Offline-first with <strong class="text-white">RxDB</strong> — works without internet, syncs via Server-Sent Events when back online.
          </p>
        </div>

        <!-- Numbers -->
        <div class="bg-elevated border border-border p-6">
          <h3 class="text-zinc-600 text-[10px] font-mono uppercase tracking-widest mb-5">BY THE NUMBERS</h3>
          <ul class="space-y-3">
            {#each (
              [
                [CheckCircle2, '117 Svelte components'],
                [Users, '5 role-based dashboards'],
                [MapPin, 'Multi-location support'],
                [Smartphone, 'PWA — iOS & Android']
              ] as const
            ) as [Icon, label] (Icon)}
              <li class="flex items-center gap-3">
                <svelte:component this={Icon} class="w-4 h-4 text-tech shrink-0" />
                <span class="text-zinc-300 text-sm">{label}</span>
              </li>
            {/each}
          </ul>
        </div>
      </div>
    </div>

    <!-- Video or screenshot placeholders -->
    {#if project.videoUrl}
      <div class="mb-24">
        <p class="text-tech text-[10px] font-mono tracking-[0.5em] uppercase mb-3">DEMO</p>
        <h2 class="font-display text-4xl text-white mb-8 tracking-wide">WATCH IT IN ACTION</h2>
        <div class="aspect-video overflow-hidden border border-border shadow-[8px_8px_0_var(--border)]">
          <iframe src={project.videoUrl} title="{project.title} demo" class="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>
        </div>
      </div>
    {:else}
      <div class="mb-24">
        <p class="text-tech text-[10px] font-mono tracking-[0.5em] uppercase mb-3">PREVIEW</p>
        <h2 class="font-display text-4xl text-white mb-8 tracking-wide">SCREENSHOTS</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {#each ['POS Transaction Screen', 'Owner KPI Dashboard', 'Kitchen Display System', 'Floor Plan Editor'] as label, i}
            <div class="aspect-video bg-elevated border border-border flex flex-col items-center justify-center gap-3 hover:border-tech/20 transition-colors">
              <div class="w-10 h-10 border border-border flex items-center justify-center">
                <svelte:component this={[LayoutGrid, BarChart3, Flame, LayoutGrid][i]} class="w-5 h-5 text-tech/40" />
              </div>
              <p class="text-zinc-500 text-sm font-medium">{label}</p>
              <p class="text-zinc-700 text-[10px] font-mono uppercase tracking-widest">screenshot coming soon</p>
            </div>
          {/each}
        </div>
      </div>
    {/if}

  </div>
</div>

<!-- ── OTHER PROJECTS ────────────────────────────────────── -->
{#if otherProjects.length > 0}
  <section class="bg-elevated border-t border-border px-6 py-20">
    <div class="max-w-6xl mx-auto">
      <p class="text-tech text-[10px] font-mono tracking-[0.5em] uppercase mb-3">MORE WORK</p>
      <h2 class="font-display text-4xl text-white mb-10 tracking-wide">OTHER PROJECTS</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        {#each otherProjects as other}
          <a href="/software/{other.slug}"
            class="group bg-dark border border-border p-6 hover:border-tech transition-all duration-150 block">
            <span class="text-[10px] font-mono px-2 py-1 border border-border text-zinc-500 inline-block mb-4 uppercase tracking-widest">
              {getStatusLabel(other.status)}
            </span>
            <h3 class="text-xl font-semibold text-white mb-2 group-hover:text-tech transition-colors">{other.title}</h3>
            <p class="text-zinc-500 text-sm leading-relaxed mb-5">{other.description}</p>
            <div class="flex flex-wrap gap-2">
              {#each other.techStack.slice(0, 3) as tech}
                <span class="text-[10px] font-mono px-2 py-0.5 bg-elevated border border-border text-zinc-400 uppercase tracking-wide">{tech}</span>
              {/each}
              {#if other.techStack.length > 3}
                <span class="text-[10px] font-mono px-2 py-0.5 text-zinc-600 uppercase tracking-wide">+{other.techStack.length - 3}</span>
              {/if}
            </div>
          </a>
        {/each}
      </div>
    </div>
  </section>
{/if}

<!-- ── BOTTOM CTA ────────────────────────────────────────── -->
<section class="bg-dark border-t border-border px-6 py-20">
  <div class="max-w-4xl mx-auto text-center">
    <p class="text-tech text-[10px] font-mono tracking-[0.5em] uppercase mb-4">LET'S WORK TOGETHER</p>
    <h2 class="font-display text-4xl md:text-5xl text-white mb-6 tracking-wide">HAVE A PROJECT IN MIND?</h2>
    <p class="text-zinc-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
      Looking to build something real — from prototype to production.
    </p>
    <a href="/contact"
      class="inline-flex items-center gap-2 bg-tech text-dark px-8 py-4 font-bold transition-all duration-150 hover:bg-tech-600 hover:-translate-y-0.5 text-base">
      GET IN TOUCH →
    </a>
  </div>
</section>

{:else}
<div class="min-h-screen bg-dark flex items-center justify-center border-b border-border">
  <p class="text-zinc-500 font-mono">PROJECT NOT FOUND.</p>
</div>
{/if}
