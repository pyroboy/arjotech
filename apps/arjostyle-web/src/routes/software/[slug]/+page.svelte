<script lang="ts">
  import { page } from '$app/stores';
  import { softwareProjects } from '$data/portfolioData';
  import {
    ArrowLeft, ExternalLink, Github, Zap, LayoutGrid, QrCode, Flame,
    Package, MapPin, Smartphone, BarChart3, Shield, WifiOff, RefreshCw,
    CheckCircle2, Users
  } from 'lucide-svelte';

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
    return status === 'production' ? 'Live' : status === 'built' ? 'Completed' : 'In Progress';
  }

  const features = project?.longDescription ? parseFeatures(project.longDescription) : [];
</script>

<svelte:head>
  <title>{project?.title ?? 'Project'} — Arjo Magno</title>
  <meta name="description" content={project?.description} />
</svelte:head>

{#if project}

<!-- ── HERO ─────────────────────────────────────────────── -->
<section class="relative min-h-[72vh] flex items-end bg-surface-900 overflow-hidden">

  {#if project.imageUrl}
    <div class="absolute inset-0">
      <img src={project.imageUrl} alt={project.title} class="w-full h-full object-cover object-top opacity-25" />
      <div class="absolute inset-0 bg-gradient-to-t from-surface-900 via-surface-900/70 to-transparent"></div>
    </div>
  {:else}
    <div class="absolute inset-0 bg-gradient-to-br from-tech-900/30 via-surface-900 to-surface-900">
      <div class="absolute top-16 right-24 w-[500px] h-[500px] bg-tech-500/8 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400/4 rounded-full blur-2xl pointer-events-none"></div>
    </div>
    <!-- subtle grid -->
    <div class="absolute inset-0 opacity-[0.025] pointer-events-none"
      style="background-image:linear-gradient(rgba(6,182,212,1) 1px,transparent 1px),linear-gradient(90deg,rgba(6,182,212,1) 1px,transparent 1px);background-size:64px 64px">
    </div>
  {/if}

  <div class="relative z-10 w-full max-w-6xl mx-auto px-6 pb-16 pt-36">
    <a href="/software" class="inline-flex items-center gap-2 text-zinc-500 hover:text-tech-400 text-sm font-mono transition-colors mb-10">
      <ArrowLeft class="w-4 h-4" /> Back to projects
    </a>

    <div class="flex flex-wrap items-center gap-3 mb-6">
      {#each project.tags as tag}
        <span class="text-xs font-mono px-3 py-1 rounded-full border border-tech-500/30 text-tech-400 bg-tech-500/10">{tag}</span>
      {/each}
      <span class="text-xs font-mono px-3 py-1 rounded-full border border-green-500/30 text-green-400 bg-green-500/10">
        {getStatusLabel(project.status)}
      </span>
    </div>

    <h1 class="font-display text-6xl md:text-7xl text-white mb-6 leading-tight">{project.title}</h1>
    <p class="text-zinc-300 text-xl md:text-2xl leading-relaxed max-w-3xl mb-10">{project.description}</p>

    <div class="flex flex-wrap gap-4">
      {#if project.liveUrl}
        <a href={project.liveUrl} target="_blank" rel="noopener"
          class="inline-flex items-center gap-2 px-7 py-3.5 bg-tech-500 hover:bg-tech-400 text-white rounded-xl font-semibold transition-all hover:-translate-y-0.5 shadow-lg shadow-tech-500/20">
          <ExternalLink class="w-4 h-4" /> View Live Demo
        </a>
      {/if}
      {#if project.githubUrl}
        <a href={project.githubUrl} target="_blank" rel="noopener"
          class="inline-flex items-center gap-2 px-7 py-3.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white rounded-xl font-semibold transition-all hover:-translate-y-0.5">
          <Github class="w-4 h-4" /> View Source
        </a>
      {/if}
    </div>
  </div>
</section>

<!-- ── TECH STACK BAR ────────────────────────────────────── -->
<div class="bg-surface-800 border-y border-zinc-800/50 px-6 py-5">
  <div class="max-w-6xl mx-auto flex flex-wrap items-center gap-3">
    <span class="text-zinc-500 text-xs font-mono uppercase tracking-widest mr-2">Built with</span>
    {#each project.techStack as tech}
      <span class="px-3 py-1.5 bg-surface-900 border border-zinc-700/50 text-zinc-300 rounded-lg text-sm font-mono hover:border-tech-500/40 hover:text-tech-400 transition-colors cursor-default">
        {tech}
      </span>
    {/each}
  </div>
</div>

<!-- ── MAIN CONTENT ──────────────────────────────────────── -->
<div class="bg-surface-900 px-6 py-20">
  <div class="max-w-6xl mx-auto">

    <!-- Feature cards -->
    {#if features.length > 0}
      <div class="mb-24">
        <p class="text-tech-500/80 font-mono text-sm tracking-widest uppercase mb-3">What it does</p>
        <h2 class="font-display text-4xl text-white mb-12">Key Features</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {#each features as feat}
            <div class="group bg-surface-800 border border-zinc-800/50 rounded-xl p-6 hover:border-tech-500/30 transition-all duration-300 hover:-translate-y-1">
              <div class="w-10 h-10 rounded-lg bg-tech-500/10 border border-tech-500/20 flex items-center justify-center mb-4 group-hover:bg-tech-500/20 transition-colors">
                <svelte:component this={feat.icon} class="w-5 h-5 text-tech-400" />
              </div>
              <h3 class="text-white font-semibold mb-2">{feat.title}</h3>
              <p class="text-zinc-400 text-sm leading-relaxed">{feat.description}</p>
            </div>
          {/each}
        </div>
      </div>
    {/if}

    <!-- Case study + sidebar -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-24">

      <div class="lg:col-span-2">
        <p class="text-tech-500/80 font-mono text-sm tracking-widest uppercase mb-3">Case Study</p>
        <h2 class="font-display text-4xl text-white mb-8">About the project</h2>
        {#if project.longDescription}
          <div class="prose prose-invert max-w-none
            prose-p:text-zinc-300 prose-p:leading-relaxed
            prose-strong:text-white
            prose-code:text-tech-400 prose-code:bg-tech-500/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono
            prose-li:text-zinc-300">
            {@html renderProse(project.longDescription)}
          </div>
        {/if}
      </div>

      <div class="space-y-5">
        <!-- Project details -->
        <div class="bg-surface-800 border border-zinc-800/50 rounded-xl p-6">
          <h3 class="text-zinc-400 text-xs font-mono uppercase tracking-widest mb-5">Project Details</h3>
          <div class="space-y-4">
            <div class="flex items-center justify-between">
              <span class="text-zinc-500 text-sm">Status</span>
              <span class="text-xs font-mono px-2.5 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400">{getStatusLabel(project.status)}</span>
            </div>
            <div class="flex items-start justify-between gap-4">
              <span class="text-zinc-500 text-sm">Category</span>
              <span class="text-white text-sm text-right">{project.tags.join(', ')}</span>
            </div>
            <div class="flex items-start justify-between gap-4">
              <span class="text-zinc-500 text-sm">Stack</span>
              <span class="text-white text-sm">{project.techStack.length} technologies</span>
            </div>
          </div>
        </div>

        <!-- Architecture callout -->
        <div class="bg-gradient-to-br from-tech-500/10 to-cyan-500/5 border border-tech-500/20 rounded-xl p-6">
          <div class="flex items-center gap-2 mb-3">
            <WifiOff class="w-4 h-4 text-tech-400" />
            <h3 class="text-tech-400 text-xs font-mono uppercase tracking-widest">Architecture highlight</h3>
          </div>
          <p class="text-zinc-300 text-sm leading-relaxed">
            Offline-first with <strong class="text-white">RxDB</strong> — works without internet, syncs via Server-Sent Events when back online.
          </p>
        </div>

        <!-- Numbers -->
        <div class="bg-surface-800 border border-zinc-800/50 rounded-xl p-6">
          <h3 class="text-zinc-400 text-xs font-mono uppercase tracking-widest mb-5">By the Numbers</h3>
          <ul class="space-y-3">
            {#each [
              [CheckCircle2, '117 Svelte components'],
              [Users, '5 role-based dashboards'],
              [MapPin, 'Multi-location support'],
              [Smartphone, 'PWA — iOS & Android']
            ] as [Icon, label]}
              <li class="flex items-center gap-3">
                <svelte:component this={Icon} class="w-4 h-4 text-tech-500 shrink-0" />
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
        <p class="text-tech-500/80 font-mono text-sm tracking-widest uppercase mb-3">Demo</p>
        <h2 class="font-display text-4xl text-white mb-8">Watch it in action</h2>
        <div class="aspect-video rounded-2xl overflow-hidden border border-zinc-800 shadow-2xl">
          <iframe src={project.videoUrl} title="{project.title} demo" class="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowfullscreen></iframe>
        </div>
      </div>
    {:else}
      <div class="mb-24">
        <p class="text-tech-500/80 font-mono text-sm tracking-widest uppercase mb-3">Preview</p>
        <h2 class="font-display text-4xl text-white mb-8">Screenshots</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {#each ['POS Transaction Screen', 'Owner KPI Dashboard', 'Kitchen Display System', 'Floor Plan Editor'] as label, i}
            <div class="aspect-video bg-surface-800 border border-zinc-800/50 rounded-xl flex flex-col items-center justify-center gap-3 hover:border-tech-500/20 transition-colors">
              <div class="w-10 h-10 rounded-lg bg-tech-500/10 border border-tech-500/20 flex items-center justify-center">
                <svelte:component this={[LayoutGrid, BarChart3, Flame, LayoutGrid][i]} class="w-5 h-5 text-tech-500/40" />
              </div>
              <p class="text-zinc-500 text-sm font-medium">{label}</p>
              <p class="text-zinc-700 text-xs font-mono">screenshot coming soon</p>
            </div>
          {/each}
        </div>
      </div>
    {/if}

  </div>
</div>

<!-- ── OTHER PROJECTS ────────────────────────────────────── -->
{#if otherProjects.length > 0}
  <section class="bg-surface-800 border-t border-zinc-800/50 px-6 py-20">
    <div class="max-w-6xl mx-auto">
      <p class="text-tech-500/80 font-mono text-sm tracking-widest uppercase mb-3">More work</p>
      <h2 class="font-display text-4xl text-white mb-10">Other Projects</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        {#each otherProjects as other}
          <a href="/software/{other.slug}"
            class="group bg-surface-900 border border-zinc-800/50 rounded-xl p-6 hover:border-tech-500/30 transition-all duration-300 hover:-translate-y-1 block">
            <span class="text-xs font-mono px-2.5 py-1 rounded-full border border-zinc-700 text-zinc-500 inline-block mb-4">
              {getStatusLabel(other.status)}
            </span>
            <h3 class="text-xl font-semibold text-white mb-2 group-hover:text-tech-400 transition-colors">{other.title}</h3>
            <p class="text-zinc-400 text-sm leading-relaxed mb-5">{other.description}</p>
            <div class="flex flex-wrap gap-2">
              {#each other.techStack.slice(0, 3) as tech}
                <span class="text-xs px-2 py-1 bg-zinc-800/50 text-zinc-400 rounded border border-zinc-700/50">{tech}</span>
              {/each}
              {#if other.techStack.length > 3}
                <span class="text-xs px-2 py-1 text-zinc-600">+{other.techStack.length - 3}</span>
              {/if}
            </div>
          </a>
        {/each}
      </div>
    </div>
  </section>
{/if}

<!-- ── BOTTOM CTA ────────────────────────────────────────── -->
<section class="bg-surface-900 border-t border-zinc-800/50 px-6 py-20">
  <div class="max-w-4xl mx-auto text-center">
    <p class="text-tech-500 font-mono text-sm tracking-widest uppercase mb-4">Let's work together</p>
    <h2 class="font-display text-4xl md:text-5xl text-white mb-6">Have a project in mind?</h2>
    <p class="text-zinc-400 text-lg mb-10 max-w-lg mx-auto leading-relaxed">
      Looking to build something real — from prototype to production.
    </p>
    <a href="/contact"
      class="inline-flex items-center gap-2 bg-tech-500 hover:bg-tech-400 text-white px-8 py-4 rounded-full font-semibold transition-all hover:-translate-y-0.5 shadow-lg shadow-tech-500/20 text-lg">
      Get in Touch →
    </a>
  </div>
</section>

{:else}
<div class="min-h-screen bg-surface-900 flex items-center justify-center">
  <p class="text-zinc-400 font-mono">Project not found.</p>
</div>
{/if}
