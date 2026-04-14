<script lang="ts">
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';

  interface Slide {
    eyebrow: string;
    headline: string;
    body: string;
    accent: string;
  }

  const slides: Slide[] = [
    {
      eyebrow: 'ARJOSTYLE',
      headline: 'Custom Designs.\nFilipino Artistry.\nSoul-Filled Ink.',
      body: 'Every piece is a custom commission — designed around YOUR story, your skin, your meaning.',
      accent: '01'
    },
    {
      eyebrow: 'THE PROCESS',
      headline: 'Bespoke Tattoos,\nNot Stencils.',
      body: 'No flash piles. No copy-paste. You bring the story — I bring it to life with precision and care.',
      accent: '02'
    },
    {
      eyebrow: 'BOOK WITH CONFIDENCE',
      headline: 'Your Vision.\nMy Art.\nOur Collaboration.',
      body: '+ 50% deposit to secure your slot  |  + Clear pricing upfront - no surprises  |  + Aftercare guidance included  |  + Revisions until it is right',
      accent: '03'
    }
  ];

  let current = $state(0);

  function prev() { current = (current - 1 + slides.length) % slides.length; }
  function next() { current = (current + 1) % slides.length; }
  function go(i: number) { current = i; }
</script>

<section class="bg-surface-900 py-16 px-4">
  <div class="max-w-4xl mx-auto">

    <!-- Carousel wrapper -->
    <div class="relative bg-surface-800 rounded-2xl border border-zinc-800 overflow-hidden shadow-2xl shadow-black/50">

      <!-- Slide area -->
      <div class="relative aspect-[4/3] md:aspect-[16/9]">

        {#each slides as slide, i}
          <div
            class="absolute inset-0 transition-opacity duration-500 flex flex-col justify-between p-8 md:p-12"
            style="opacity: {current === i ? 1 : 0}; pointer-events: {current === i ? 'auto' : 'none'};"
          >
            <!-- Background accent -->
            <div class="absolute top-0 right-0 w-64 h-64 bg-ink-500/5 rounded-full blur-3xl" aria-hidden="true"></div>
            <div class="absolute bottom-0 left-0 w-48 h-48 bg-ink-500/5 rounded-full blur-3xl" aria-hidden="true"></div>

            <!-- Eyebrow + slide number -->
            <div class="flex items-center justify-between">
              <p class="font-mono text-xs tracking-[0.3em] text-ink-500 uppercase">{slide.eyebrow}</p>
              <span class="font-mono text-xs text-zinc-600">{slide.accent} / {String(slides.length).padStart(2, '0')}</span>
            </div>

            <!-- Headline -->
            <div class="flex-1 flex items-center">
              <h2 class="font-display text-3xl md:text-5xl lg:text-6xl text-white leading-[1.1] whitespace-pre-line">
                {slide.headline}
              </h2>
            </div>

            <!-- Body -->
            <p class="text-zinc-400 text-sm md:text-base leading-relaxed max-w-xl whitespace-pre-line">{slide.body}</p>

            <!-- Decorative bottom rule -->
            <div class="mt-6 flex items-center gap-3">
              <div class="h-px flex-1 bg-gradient-to-r from-ink-500/40 to-transparent"></div>
              <span class="text-ink-500 text-xs">✦</span>
              <div class="h-px flex-1 bg-gradient-to-l from-ink-500/40 to-transparent"></div>
            </div>
          </div>
        {/each}
      </div>

      <!-- Prev / Next arrows -->
      <button
        onclick={prev}
        class="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface-900/80 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-ink-500/50 transition-all duration-200"
        aria-label="Previous slide"
      >
        <ChevronLeft class="w-5 h-5" />
      </button>
      <button
        onclick={next}
        class="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface-900/80 border border-zinc-700 flex items-center justify-center text-zinc-400 hover:text-white hover:border-ink-500/50 transition-all duration-200"
        aria-label="Next slide"
      >
        <ChevronRight class="w-5 h-5" />
      </button>
    </div>

    <!-- Dot indicators -->
    <div class="flex items-center justify-center gap-2 mt-6">
      {#each slides as _, i}
        <button
          onclick={() => go(i)}
          class="rounded-full transition-all duration-300 {current === i ? 'w-6 h-2 bg-ink-500' : 'w-2 h-2 bg-zinc-700 hover:bg-zinc-500'}"
          aria-label="Go to slide {i + 1}"
        ></button>
      {/each}
    </div>

    <!-- CTA under carousel -->
    <div class="text-center mt-8">
      <a
        href="/tattoo#portfolio"
        class="inline-flex items-center gap-2 text-sm text-zinc-400 hover:text-ink-500 transition-colors duration-200"
      >
        Skip to portfolio
        <span aria-hidden="true">↓</span>
      </a>
    </div>
  </div>
</section>
