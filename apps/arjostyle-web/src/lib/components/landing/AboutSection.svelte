<script lang="ts">
  import { Briefcase } from 'lucide-svelte';
  import { scrollReveal } from '$lib/actions/scrollReveal';
</script>

<section class="bg-dark border-b border-border px-6 py-16">
  <div class="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start gap-8" use:scrollReveal={{ y: 30, duration: 0.8 }}>
    <!-- Avatar -->
    <div class="shrink-0 w-20 h-20 bg-elevated border border-border flex items-center justify-center">
      <span class="font-display text-3xl text-tech font-bold">A</span>
    </div>
    <div class="flex-1 text-center md:text-left">
<<<<<<< Updated upstream
      <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-3">
        <h2 class="text-white font-semibold text-lg">Arturo Jose Magno</h2>
        <span class="text-xs font-mono px-2.5 py-1 rounded-full bg-tech-500/10 border border-tech-500/20 text-tech-400">Full-Stack Developer</span>
        <span class="text-xs font-mono px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400">AI Engineer</span>
        <span class="text-xs font-mono px-2.5 py-1 rounded-full bg-zinc-800 border border-zinc-700 text-zinc-400">Bohol, Philippines</span>
=======
      <div class="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
        <h2 class="text-white font-display text-2xl tracking-wide">ARTURO JOSE MAGNO</h2>
>>>>>>> Stashed changes
      </div>
      <div class="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-4">
        <span class="text-[10px] font-mono px-2 py-1 border border-tech text-tech tracking-widest uppercase">Full-Stack Developer</span>
        <span class="text-[10px] font-mono px-2 py-1 border border-purple-500 text-purple-400 tracking-widest uppercase">AI Engineer</span>
        <span class="text-[10px] font-mono px-2 py-1 border border-border text-zinc-500 tracking-widest uppercase">Philippines</span>
      </div>
      <p class="text-zinc-400 leading-relaxed max-w-2xl text-sm">
        Full-stack developer and AI engineer with a designer's eye. I build production systems end-to-end — from database schema to deployed pixel — and I can draw and paint what I can't find in a library. I build on the most modern stack: <span class="text-white font-medium">Svelte 5</span>, <span class="text-white font-medium">Neon</span>, <span class="text-white font-medium">RxDB</span>, <span class="text-white font-medium">SpacetimeDB</span>, edge-first on <span class="text-white font-medium">Cloudflare</span>. From LLM-powered conversational agents and AI orchestration harnesses to complex SaaS, POS systems, and real-time dashboards — if it runs in a browser or talks to a model, I ship it.
      </p>
      <div class="flex flex-wrap justify-center md:justify-start gap-2 mt-5" use:scrollReveal={{ y: 15, stagger: 0.05, children: true, delay: 0.2 }}>
        {#each ['Svelte 5', 'SvelteKit', 'TypeScript', 'Rust/Tauri', 'RxDB', 'Neon', 'SpacetimeDB', 'Cloudflare', 'Claude API', 'Groq', 'AI Agents'] as skill}
          <span class="text-[10px] font-mono px-2 py-1 bg-elevated border border-border text-zinc-400 tracking-wide uppercase">{skill}</span>
        {/each}
      </div>
    </div>
    <a href="/contact"
      class="shrink-0 inline-flex items-center gap-2 px-5 py-3 bg-tech hover:bg-tech-600 text-dark font-bold text-sm transition-all duration-150 translate-y-0 hover:-translate-y-0.5">
      <Briefcase class="w-4 h-4" />
      HIRE ME
    </a>
  </div>
</section>
