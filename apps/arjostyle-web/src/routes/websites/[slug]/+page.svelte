<script lang="ts">
  import { page } from '$app/stores';
  import { websiteProjects } from '$lib/data/portfolioData';
  import {
    Globe, ExternalLink, MapPin, Calendar, ArrowLeft,
    BookOpen, Video, Heart, Image, Users, Bell, Mail, Church
  } from 'lucide-svelte';

  const slug = $derived($page.params.slug);
  const project = $derived(websiteProjects.find(p => p.slug === slug));
  const otherProjects = $derived(websiteProjects.filter(p => p.slug !== slug).slice(0, 3));

  interface Feature { icon: any; title: string; description: string; }

  const iconMap: Record<string, any> = {
    sermon: BookOpen, sermons: BookOpen,
    event: Calendar, events: Calendar,
    live: Video, stream: Video,
    giving: Heart, offer: Heart,
    gallery: Image,
    pastor: Users, leadership: Users, staff: Users,
    prayer: Heart, prayers: Heart,
    news: Bell, announcement: Bell,
    admin: Globe, cms: Globe,
    contact: Mail, map: MapPin,
    church: Church, churches: Church,
    member: Users, directory: Users,
  };

  function pickIcon(title: string): any {
    const lower = title.toLowerCase();
    for (const [key, icon] of Object.entries(iconMap)) {
      if (lower.includes(key)) return icon;
    }
    return Globe;
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
      .replace(/^- .+$/gm, '')
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      .replace(/`(.+?)`/g, '<code>$1</code>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/^/, '<p>').replace(/$/, '</p>')
      .replace(/<p>\s*<\/p>/g, '');
  }
</script>

<svelte:head>
  {#if project}
    <title>{project.title} — Websites — Arjo Magno</title>
    <meta name="description" content={project.description} />
  {:else}
    <title>Project Not Found — Arjo Magno</title>
  {/if}
</svelte:head>

{#if !project}
  <div class="min-h-screen bg-surface-900 flex items-center justify-center px-6">
    <div class="text-center">
      <p class="text-6xl mb-6">🌐</p>
      <h1 class="text-3xl font-bold text-white mb-4">Project not found</h1>
      <a href="/websites" class="text-emerald-400 hover:text-emerald-300 transition-colors">← Back to Websites</a>
    </div>
  </div>
{:else}
  {@const features = project.longDescription ? parseFeatures(project.longDescription) : []}

  <!-- Hero -->
  <section class="relative bg-surface-900 overflow-hidden">
    <!-- Grid texture -->
    <div class="absolute inset-0 opacity-[0.04]"
      style="background-image: linear-gradient(rgba(52,211,153,1) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,1) 1px, transparent 1px); background-size: 40px 40px;">
    </div>
    <div class="absolute inset-0 bg-gradient-to-b from-emerald-900/20 via-transparent to-surface-900"></div>

    <div class="relative max-w-6xl mx-auto px-6 py-24">
      <a href="/websites" class="inline-flex items-center gap-2 text-zinc-500 hover:text-emerald-400 transition-colors text-sm mb-10 group">
        <ArrowLeft class="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        All Websites
      </a>

      <div class="flex flex-wrap gap-2 mb-6">
        {#each project.tags as tag}
          <span class="text-xs font-mono px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">{tag}</span>
        {/each}
        <span class="text-xs font-mono px-3 py-1 rounded-full
          {project.status === 'production' ? 'bg-green-500/10 text-green-400 border border-green-500/20'
          : project.status === 'built' ? 'bg-tech-500/10 text-tech-400 border border-tech-500/20'
          : 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20'}">
          {project.status === 'production' ? 'Live' : project.status === 'built' ? 'Completed' : 'In Progress'}
        </span>
      </div>

      <h1 class="font-display text-5xl md:text-7xl font-bold text-white mb-4 leading-tight">
        {project.title}
      </h1>

      <div class="flex flex-wrap items-center gap-4 text-zinc-400 text-sm mb-6">
        <span class="flex items-center gap-1.5"><Users class="w-4 h-4" />{project.client}</span>
        <span class="flex items-center gap-1.5"><MapPin class="w-4 h-4" />{project.location}</span>
        <span class="flex items-center gap-1.5"><Calendar class="w-4 h-4" />{project.year}</span>
      </div>

      <p class="text-zinc-300 text-xl max-w-2xl leading-relaxed mb-10">{project.description}</p>

      <!-- Tech stack bar -->
      <div class="flex flex-wrap gap-2 mb-10">
        {#each project.techStack as tech}
          <span class="text-sm px-3 py-1.5 bg-zinc-800/80 text-zinc-300 rounded-lg border border-zinc-700/50 font-mono">{tech}</span>
        {/each}
      </div>

      <!-- Action buttons -->
      <div class="flex flex-wrap gap-4">
        {#if project.liveUrl}
          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center gap-2 bg-emerald-500 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-400 transition-colors">
            <Globe class="w-4 h-4" /> Visit Site <ExternalLink class="w-3.5 h-3.5 opacity-70" />
          </a>
        {/if}
        {#if project.githubUrl}
          <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
            class="inline-flex items-center gap-2 bg-zinc-800 text-zinc-300 px-6 py-3 rounded-full font-semibold hover:bg-zinc-700 hover:text-white transition-colors border border-zinc-700">
            GitHub →
          </a>
        {/if}
      </div>
    </div>
  </section>

  <!-- Feature Cards -->
  {#if features.length > 0}
    <section class="bg-surface-800 px-6 py-20">
      <div class="max-w-6xl mx-auto">
        <p class="text-emerald-500/80 font-mono text-sm tracking-widest uppercase mb-3">What was built</p>
        <h2 class="font-display text-3xl md:text-4xl font-bold text-white mb-12">Features</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {#each features as feature}
            <div class="bg-surface-900 border border-zinc-800/50 rounded-xl p-6 hover:border-emerald-500/20 transition-colors">
              <div class="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
                <feature.icon class="w-5 h-5 text-emerald-400" />
              </div>
              <h3 class="font-semibold text-white mb-2">{feature.title}</h3>
              <p class="text-zinc-400 text-sm leading-relaxed">{feature.description}</p>
            </div>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  <!-- Case study body -->
  {#if project.longDescription}
    <section class="bg-surface-900 px-6 py-20">
      <div class="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12">
        <!-- Prose -->
        <div class="lg:col-span-2">
          <p class="text-emerald-500/80 font-mono text-sm tracking-widest uppercase mb-3">About this project</p>
          <h2 class="font-display text-3xl font-bold text-white mb-8">Background</h2>
          <div class="prose-content text-zinc-300 leading-relaxed space-y-4 [&_strong]:text-white [&_strong]:font-semibold [&_code]:bg-zinc-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-tech-400 [&_code]:text-sm">
            {@html renderProse(project.longDescription)}
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-6">
          <!-- Client info card -->
          <div class="bg-surface-800 border border-zinc-800/50 rounded-xl p-6">
            <h3 class="text-white font-semibold mb-4 text-sm uppercase tracking-widest font-mono">Client</h3>
            <div class="space-y-3 text-sm text-zinc-400">
              <div class="flex items-start gap-2">
                <Users class="w-4 h-4 text-emerald-500/60 mt-0.5 shrink-0" />
                <span>{project.client}</span>
              </div>
              <div class="flex items-start gap-2">
                <MapPin class="w-4 h-4 text-emerald-500/60 mt-0.5 shrink-0" />
                <span>{project.location}</span>
              </div>
              <div class="flex items-start gap-2">
                <Calendar class="w-4 h-4 text-emerald-500/60 mt-0.5 shrink-0" />
                <span>Built {project.year}</span>
              </div>
            </div>
          </div>

          <!-- Stack card -->
          <div class="bg-surface-800 border border-zinc-800/50 rounded-xl p-6">
            <h3 class="text-white font-semibold mb-4 text-sm uppercase tracking-widest font-mono">Tech Stack</h3>
            <div class="flex flex-wrap gap-2">
              {#each project.techStack as tech}
                <span class="text-xs px-2.5 py-1 bg-zinc-900 text-zinc-300 rounded-md border border-zinc-700/50 font-mono">{tech}</span>
              {/each}
            </div>
          </div>

          <!-- Tags card -->
          {#if project.tags.length > 0}
            <div class="bg-surface-800 border border-zinc-800/50 rounded-xl p-6">
              <h3 class="text-white font-semibold mb-4 text-sm uppercase tracking-widest font-mono">Type</h3>
              <div class="flex flex-wrap gap-2">
                {#each project.tags as tag}
                  <span class="text-xs px-2.5 py-1 bg-emerald-500/10 text-emerald-400 rounded-full border border-emerald-500/20">{tag}</span>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </section>
  {/if}

  <!-- Other projects -->
  {#if otherProjects.length > 0}
    <section class="bg-surface-800 px-6 py-20 border-t border-zinc-800/50">
      <div class="max-w-6xl mx-auto">
        <h2 class="font-display text-2xl font-bold text-white mb-8">More Websites</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          {#each otherProjects as other}
            <a href="/websites/{other.slug}"
              class="group block bg-surface-900 border border-zinc-800/50 rounded-xl p-6 hover:border-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5">
              <p class="text-xs font-mono text-emerald-500/60 tracking-widest uppercase mb-1">{other.client}</p>
              <h3 class="font-semibold text-white mb-2 group-hover:text-emerald-400 transition-colors">{other.title}</h3>
              <p class="text-zinc-400 text-sm leading-relaxed line-clamp-2">{other.description}</p>
            </a>
          {/each}
        </div>
      </div>
    </section>
  {/if}

  <!-- CTA footer -->
  <section class="bg-surface-900 px-6 py-20 border-t border-zinc-800/50">
    <div class="max-w-4xl mx-auto text-center">
      <p class="text-emerald-500 font-mono text-sm tracking-widest uppercase mb-4">Let's work together</p>
      <h2 class="font-display text-4xl font-bold text-white mb-6">Need a website like this?</h2>
      <p class="text-zinc-400 text-lg mb-10 max-w-lg mx-auto">
        I design and build websites for organizations, businesses, and communities. Fully managed by
        your team after handoff.
      </p>
      <div class="flex flex-wrap gap-4 justify-center">
        <a href="/contact"
          class="inline-flex items-center gap-2 bg-emerald-500 text-white px-8 py-4 rounded-full font-semibold hover:bg-emerald-400 transition-colors text-lg">
          Get in Touch →
        </a>
        <a href="/software"
          class="inline-flex items-center gap-2 bg-zinc-800 text-zinc-300 px-8 py-4 rounded-full font-semibold hover:bg-zinc-700 hover:text-white transition-colors text-lg border border-zinc-700">
          See My Apps
        </a>
      </div>
    </div>
  </section>
{/if}
