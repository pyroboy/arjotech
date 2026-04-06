<script lang="ts">
  import { Briefcase } from 'lucide-svelte';
  import { scrollReveal } from '$lib/actions/scrollReveal';
</script>

<section class="bg-surface-900 border-b border-zinc-800/50 px-6 py-14">
  <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8" use:scrollReveal={{ y: 30, duration: 0.8 }}>
    <!-- Avatar -->
    <div class="shrink-0 w-20 h-20 rounded-2xl bg-gradient-to-br from-tech-500/20 to-cyan-500/10 border border-tech-500/20 flex items-center justify-center">
      <span class="font-display text-2xl text-tech-400 font-bold">A</span>
    </div>
    <div class="flex-1 text-center md:text-left">
      <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
        <h2 class="text-white font-semibold text-lg">Arturo Jose Magno</h2>
        <span class="text-xs font-mono px-2.5 py-1 rounded-full bg-tech-500/10 border border-tech-500/20 text-tech-400">Full-stack Developer</span>
        <span class="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400">Philippines</span>
      </div>
      <p class="text-zinc-400 leading-relaxed max-w-2xl">
        I build full-stack web apps end-to-end — from database schema to deployed product. Specializing in <span class="text-white">Svelte 5</span>, offline-first architecture with <span class="text-white">RxDB</span>, and edge deployments on <span class="text-white">Cloudflare</span>. Currently building 5 production apps across POS, property management, workforce ops, and SaaS.
      </p>
      <div class="flex flex-wrap justify-center md:justify-start gap-2 mt-4" use:scrollReveal={{ y: 15, stagger: 0.05, children: true, delay: 0.2 }}>
        {#each ['Svelte 5', 'SvelteKit', 'TypeScript', 'RxDB', 'Neon', 'Cloudflare', 'Three.js'] as skill}
          <span class="text-xs px-2.5 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-lg font-mono">{skill}</span>
        {/each}
      </div>
    </div>
    <a href="/contact"
      class="shrink-0 inline-flex items-center gap-2 px-5 py-2.5 bg-tech-500 hover:bg-tech-400 text-white rounded-xl font-semibold text-sm transition-all hover:-translate-y-0.5 shadow-lg shadow-tech-500/20">
      <Briefcase class="w-4 h-4" />
      Hire Me
    </a>
  </div>
</section>
