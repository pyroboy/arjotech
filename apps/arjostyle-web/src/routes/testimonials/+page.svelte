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

<div class="min-h-screen bg-dark text-zinc-100">
  <!-- Hero -->
  <section class="pt-20 pb-12 px-6 text-center border-b border-border">
    <RevealOnScroll>
      <p class="text-ink text-[10px] font-mono uppercase tracking-[0.3em] mb-3">Social Proof</p>
      <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-wide">
        CLIENT <span class="text-ink">STORIES</span>
      </h1>
      <p class="text-zinc-500 text-lg max-w-2xl mx-auto font-mono text-sm">
        Real reviews from people who trusted me with permanent ink on their skin.
      </p>
    </RevealOnScroll>
  </section>

  <!-- Content -->
  <section class="py-12 px-6">
    <div class="max-w-5xl mx-auto">
      {#if data.testimonials.length === 0}
        <RevealOnScroll>
          <div class="text-center py-24 text-zinc-600">
            <p class="text-5xl mb-4">⭐</p>
            <p class="text-lg font-display text-zinc-400 mb-2 tracking-wide">TESTIMONIALS COMING SOON</p>
            <p class="text-sm font-mono">Check back after launch — collecting reviews from recent clients.</p>
            <a href="/book" class="mt-8 inline-block px-6 py-3 bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all duration-150">
              BE THE FIRST
            </a>
          </div>
        </RevealOnScroll>
      {:else}
        <div class="grid md:grid-cols-2 gap-2">
          {#each data.testimonials as t, i}
            <RevealOnScroll delay={i * 60}>
              <div class="bg-elevated border border-border p-6 flex flex-col gap-4">
                <!-- Stars -->
                <div class="flex gap-0.5">
                  {#each Array(5) as _, s}
                    <Star class="w-4 h-4 {s < t.rating ? 'text-ink fill-ink' : 'text-border-light'}" />
                  {/each}
                </div>
                <!-- Quote -->
                <blockquote class="text-zinc-400 text-sm leading-relaxed font-mono">"{t.quote}"</blockquote>
                <!-- Photo if available -->
                {#if t.tattooImageUrl}
                  <img
                    src={t.tattooImageUrl}
                    alt="Tattoo by Arjo"
                    loading="lazy"
                    class="w-full object-cover aspect-video"
                  />
                {/if}
                <!-- Client -->
                <div class="flex items-center justify-between mt-auto pt-3 border-t border-border">
                  <div>
                    <p class="text-sm font-display text-white tracking-wide">{t.clientName}</p>
                    {#if t.clientHandle}
                      <p class="text-[10px] font-mono text-zinc-600 uppercase tracking-widest">{t.clientHandle}</p>
                    {/if}
                  </div>
                  <div class="text-right">
                    <span class="text-[10px] font-mono px-2 py-0.5 border border-border text-zinc-600 uppercase tracking-widest">{sourceLabel[t.source]}</span>
                    {#if t.tattooStyle}
                      <p class="text-[10px] font-mono text-zinc-700 mt-1 uppercase tracking-widest">{t.tattooStyle}</p>
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
  <section class="py-20 px-6 text-center border-t border-border">
    <RevealOnScroll>
      <h2 class="text-3xl font-display font-semibold text-white mb-4 tracking-wide">YOUR TURN</h2>
      <p class="text-zinc-500 mb-8 font-mono text-sm">Ready to add your story to this wall?</p>
      <a href="/book" class="px-8 py-3 bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all duration-150">
        BOOK A SESSION
      </a>
    </RevealOnScroll>
  </section>
</div>