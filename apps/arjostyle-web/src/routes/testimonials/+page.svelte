<script lang="ts">
  import RevealOnScroll from '$lib/components/ui/RevealOnScroll.svelte';
  import { Star } from 'lucide-svelte';

  let { data } = $props();

  const sourceLabel: Record<string, string> = {
    google: 'Google Review',
    instagram: 'Instagram',
    facebook: 'Facebook',
    direct: 'Direct'
  };
</script>

<svelte:head>
  <title>Client Testimonials — Arjo Magno</title>
  <meta name="description" content="Read what ArjoStyle tattoo clients say. Real reviews from real people — booking experience, finished pieces, and aftercare." />
  <meta property="og:title" content="Client Testimonials — Arjo Magno" />
  <meta property="og:description" content="Real reviews from ArjoStyle tattoo clients." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://arjostyle.ink/testimonials" />
</svelte:head>

<div class="min-h-screen bg-surface-900 text-zinc-100">
  <!-- Hero -->
  <section class="pt-20 pb-12 px-6 text-center">
    <RevealOnScroll>
      <p class="text-ink-500 text-sm font-medium uppercase tracking-widest mb-3">Social Proof</p>
      <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-4">
        Client <span class="text-ink-500">Stories</span>
      </h1>
      <p class="text-zinc-400 text-lg max-w-2xl mx-auto">
        Real reviews from people who trusted me with permanent ink on their skin.
      </p>
    </RevealOnScroll>
  </section>

  <!-- Content -->
  <section class="py-12 px-6">
    <div class="max-w-5xl mx-auto">
      {#if data.testimonials.length === 0}
        <RevealOnScroll>
          <div class="text-center py-24 text-zinc-500">
            <p class="text-5xl mb-4">⭐</p>
            <p class="text-lg font-medium text-zinc-400 mb-2">Testimonials coming soon</p>
            <p class="text-sm">Check back after launch — collecting reviews from recent clients.</p>
            <a href="/book" class="mt-8 inline-block px-6 py-2.5 bg-ink-500 text-white rounded-full text-sm font-semibold hover:bg-ink-400 transition-colors">
              Be the First
            </a>
          </div>
        </RevealOnScroll>
      {:else}
        <div class="grid md:grid-cols-2 gap-6">
          {#each data.testimonials as t, i}
            <RevealOnScroll delay={i * 60}>
              <div class="glass-panel rounded-xl p-6 border border-zinc-800 flex flex-col gap-4">
                <!-- Stars -->
                <div class="flex gap-0.5">
                  {#each Array(5) as _, s}
                    <Star class="w-4 h-4 {s < t.rating ? 'text-ink-500 fill-ink-500' : 'text-zinc-700'}" />
                  {/each}
                </div>
                <!-- Quote -->
                <blockquote class="text-zinc-300 text-sm leading-relaxed">"{t.quote}"</blockquote>
                <!-- Photo if available -->
                {#if t.tattooImageUrl}
                  <img
                    src={t.tattooImageUrl}
                    alt="Tattoo by Arjo"
                    loading="lazy"
                    class="w-full rounded-lg object-cover aspect-video"
                  />
                {/if}
                <!-- Client -->
                <div class="flex items-center justify-between mt-auto pt-2 border-t border-zinc-800">
                  <div>
                    <p class="text-sm font-medium text-zinc-200">{t.clientName}</p>
                    {#if t.clientHandle}
                      <p class="text-xs text-zinc-500">{t.clientHandle}</p>
                    {/if}
                  </div>
                  <div class="text-right">
                    <span class="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-500">{sourceLabel[t.source]}</span>
                    {#if t.tattooStyle}
                      <p class="text-xs text-zinc-600 mt-1">{t.tattooStyle}</p>
                    {/if}
                  </div>
                </div>
              </div>
            </RevealOnScroll>
          {/each}
        </div>
      {/if}
    </div>
  </section>

  <!-- CTA -->
  <section class="py-20 px-6 text-center border-t border-zinc-800/50">
    <RevealOnScroll>
      <h2 class="text-2xl font-display font-semibold text-white mb-4">Your Turn</h2>
      <p class="text-zinc-400 mb-8">Ready to add your story to this wall?</p>
      <a href="/book" class="px-8 py-3 bg-ink-500 text-white rounded-full font-semibold hover:bg-ink-400 transition-colors">
        Book a Session
      </a>
    </RevealOnScroll>
  </section>
</div>
