<script lang="ts">
  import StudioInfo from '$lib/components/landing/StudioInfo.svelte';
  import RevealOnScroll from '$lib/components/ui/RevealOnScroll.svelte';
</script>

<svelte:head>
  <title>The Studio — Arjo Magno</title>
  <meta name="description" content="ArjoStyle Tattoo Studio — located in Tagbilaran City, Bohol. View address, hours, safety standards, and what to expect during your visit." />
  <meta property="og:title" content="The Studio — Arjo Magno" />
  <meta property="og:description" content="ArjoStyle Tattoo Studio in Tagbilaran City, Bohol. Location, hours, and safety standards." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://arjostyle.ink/studio" />
</svelte:head>

<div class="min-h-screen bg-surface-900 pt-8">
  <!-- Page header -->
  <div class="max-w-7xl mx-auto px-6 pt-12 pb-4 text-center">
    <RevealOnScroll>
      <p class="text-ink-500 text-sm font-medium uppercase tracking-widest mb-3">Visit</p>
      <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-4">
        The Studio
      </h1>
      <p class="text-zinc-400 text-lg max-w-2xl mx-auto">
        A clean, private space designed for comfort and precision — in the heart of Tagbilaran City.
      </p>
    </RevealOnScroll>
  </div>

  <!-- Reuse existing StudioInfo component -->
  <StudioInfo />

  <!-- What to Expect section -->
  <section class="py-16 px-6 border-t border-zinc-800/50">
    <div class="max-w-4xl mx-auto">
      <RevealOnScroll>
        <h2 class="text-2xl font-display font-semibold text-white mb-8 text-center">What to Expect</h2>
      </RevealOnScroll>
      <div class="grid sm:grid-cols-2 md:grid-cols-4 gap-6">
        {#each [
          { step: '01', title: 'Arrive', desc: 'Check in at the studio. ID required for first-timers (must be 18+).' },
          { step: '02', title: 'Consult', desc: 'We review the design, placement, size, and final pricing together.' },
          { step: '03', title: 'Tattoo', desc: 'Session begins. Music on, relax — I work at your comfort level.' },
          { step: '04', title: 'Aftercare', desc: 'Bandaged and briefed. Written aftercare instructions provided.' }
        ] as item, i}
          <RevealOnScroll delay={i * 80}>
            <div class="text-center">
              <p class="text-4xl font-display font-bold text-ink-500/30 mb-2">{item.step}</p>
              <p class="font-semibold text-white mb-1">{item.title}</p>
              <p class="text-zinc-400 text-sm">{item.desc}</p>
            </div>
          </RevealOnScroll>
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="py-16 px-6 text-center">
    <RevealOnScroll>
      <a href="/book" class="px-8 py-3 bg-ink-500 text-white rounded-full font-semibold hover:bg-ink-400 transition-colors">
        Book Your Session
      </a>
    </RevealOnScroll>
  </section>
</div>
