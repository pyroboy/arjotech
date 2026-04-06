<script lang="ts">
  import RevealOnScroll from '$lib/components/ui/RevealOnScroll.svelte';
  import { Instagram, Facebook } from 'lucide-svelte';
</script>

<svelte:head>
  <title>About — Arjo Magno</title>
  <meta name="description" content="Arjo Magno — full-stack developer, AI engineer, tattoo artist, and painter from Tagbilaran City, Bohol. Building LLM-powered agents, complex web apps, and permanent art." />
  <meta property="og:title" content="About — Arjo Magno" />
  <meta property="og:description" content="Full-stack developer, AI engineer, tattoo artist, and painter from Tagbilaran City, Bohol." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://arjostyle.ink/about" />
</svelte:head>

<div class="min-h-screen bg-surface-900 text-zinc-100">
  <!-- Hero -->
  <section class="pt-20 pb-16 px-6">
    <div class="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
      <RevealOnScroll>
        <div>
          <p class="text-ink-500 text-sm font-medium uppercase tracking-widest mb-3">The Artist</p>
          <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-6 leading-tight">
            Arjo Magno
          </h1>
          <p class="text-zinc-300 text-lg leading-relaxed mb-6">
            Full-stack developer, AI engineer, and visual artist based in Tagbilaran City, Bohol. I design and build complete production systems — from LLM-powered conversational agents to complex SaaS — on the most modern stack available: Svelte 5, Neon, RxDB, SpacetimeDB, Cloudflare. I also create permanent art rooted in Filipino culture, personal stories, and clean design. If I can't find it in a library, I draw it myself.
          </p>
          <div class="flex gap-4">
            <a href="https://instagram.com/arjostyle.ink" target="_blank" rel="noopener noreferrer"
               class="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
              <Instagram class="w-4 h-4" /> @arjostyle.ink
            </a>
            <a href="https://facebook.com/arjostyle.ink" target="_blank" rel="noopener noreferrer"
               class="flex items-center gap-2 text-zinc-400 hover:text-white transition-colors text-sm">
              <Facebook class="w-4 h-4" /> arjostyle.ink
            </a>
          </div>
        </div>
      </RevealOnScroll>
      <RevealOnScroll delay={150}>
        <!-- Placeholder for artist photo — add via /admin/assets (category: studio) -->
        <div class="aspect-[4/5] rounded-2xl bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-600 text-sm">
          Artist photo coming soon
        </div>
      </RevealOnScroll>
    </div>
  </section>

  <!-- Story -->
  <section class="py-16 px-6 border-t border-zinc-800/50">
    <div class="max-w-3xl mx-auto">
      <RevealOnScroll>
        <h2 class="text-2xl font-display font-semibold text-white mb-6">My Story</h2>
      </RevealOnScroll>
      <div class="space-y-5 text-zinc-300 leading-relaxed">
        <RevealOnScroll delay={80}>
          <p>
            I started tattooing because I wanted to create art that lives beyond a frame — something permanent and personal.
            Every tattoo tells a story, and I take that seriously. My style leans toward blackwork, geometric, and minimalist designs
            but I love the challenge of adapting to what each client needs.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={120}>
          <p>
            Based at the D.A. Tirol Building in Tagbilaran City, ArjoStyle Studio is a space I built to be comfortable,
            private, and professional. I operate strictly by appointment to give every client my full focus.
          </p>
        </RevealOnScroll>
        <RevealOnScroll delay={160}>
          <p>
            On the software side, I build anything that runs in a browser or talks to a model — a restaurant POS running live in a BBQ chain, an AI chatbot handling client DMs via the Groq and Claude APIs, a multi-tenant SaaS for ID generation, and <span class="text-white">claw-agent</span>: a Rust/Tauri AI orchestration harness with multi-agent teams, mission planning, session management, and health monitoring. Complex full-stack apps, LLM pipelines, conversational agents, real-time systems — same principles as tattooing: clean lines, nothing wasted, built to last.
          </p>
        </RevealOnScroll>
      </div>
    </div>
  </section>

  <!-- What I Do -->
  <section class="py-16 px-6 border-t border-zinc-800/50">
    <div class="max-w-4xl mx-auto">
      <RevealOnScroll>
        <h2 class="text-2xl font-display font-semibold text-white mb-10 text-center">What I Do</h2>
      </RevealOnScroll>
      <div class="grid sm:grid-cols-3 gap-6">
        {#each [
          { title: 'Tattooing', href: '/tattoo', desc: 'Blackwork, geometric, minimalist, florals, Japanese, and custom designs. Appointment-only at ATS, Tagbilaran.' },
          { title: 'Painting', href: '/paintings', desc: 'Original acrylic and mixed media works on canvas. Available for sale and commission.' },
          { title: 'Software & AI', href: '/software', desc: 'Full-stack apps, AI agents, LLM integrations, chatbots, and orchestration harnesses. Building things that think and work.' }
        ] as item, i}
          <RevealOnScroll delay={i * 80}>
            <a href={item.href} class="block glass-panel rounded-xl p-6 border border-zinc-800 hover:border-ink-500/40 transition-colors group">
              <h3 class="font-semibold text-white mb-2 group-hover:text-ink-400 transition-colors">{item.title}</h3>
              <p class="text-zinc-400 text-sm leading-relaxed">{item.desc}</p>
            </a>
          </RevealOnScroll>
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="py-20 px-6 text-center">
    <RevealOnScroll>
      <h2 class="text-2xl font-display font-semibold text-white mb-4">Let's Create Something</h2>
      <p class="text-zinc-400 mb-8">Book a consultation or reach out with questions.</p>
      <div class="flex flex-wrap gap-4 justify-center">
        <a href="/book" class="px-8 py-3 bg-ink-500 text-white rounded-full font-semibold hover:bg-ink-400 transition-colors">
          Book a Tattoo
        </a>
        <a href="/contact" class="px-8 py-3 border border-zinc-700 text-zinc-300 rounded-full hover:bg-zinc-800 transition-colors">
          Contact
        </a>
      </div>
    </RevealOnScroll>
  </section>
</div>
