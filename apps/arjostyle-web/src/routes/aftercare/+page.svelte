<svelte:head>
  <title>Aftercare — Arjo Magno</title>
  <meta name="description" content="Essential tattoo aftercare guide by Arjo Magno. Learn how to care for your new tattoo during the first 24 hours, healing phase, and long-term maintenance." />
  <meta property="og:title" content="Aftercare — Arjo Magno" />
  <meta property="og:description" content="Essential tattoo aftercare guide by Arjo Magno. Learn how to care for your new tattoo during the first 24 hours, healing phase, and long-term maintenance." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://arjostyle-web.pages.dev/aftercare" />
</svelte:head>

<div class="min-h-screen bg-dark px-6 py-20">
  <div class="max-w-2xl mx-auto">
    <p class="text-ink text-[10px] font-mono uppercase tracking-[0.3em] mb-4">HEALING GUIDE</p>
    <h1 class="font-display text-5xl text-white mb-8 tracking-wide">TATTOO AFTERCARE</h1>

    <p class="text-zinc-400 leading-relaxed mb-8 font-mono text-sm">Proper aftercare ensures your tattoo heals beautifully. Follow these guidelines carefully.</p>

    <div class="space-y-8">
      <div class="border-b border-border pb-8">
        <h2 class="font-display text-2xl text-white mb-4 tracking-wide">FIRST 24 HOURS</h2>
        <p class="text-zinc-500 leading-relaxed font-mono text-sm">Keep the bandage on for 2-4 hours. After removing, gently wash with fragrance-free soap and lukewarm water. Pat dry — do not rub.</p>
      </div>

      <div class="border-b border-border pb-8">
        <h2 class="font-display text-2xl text-white mb-4 tracking-wide">DAYS 1–14</h2>
        <ul class="space-y-3">
          {#each ['Apply a thin layer of unscented lotion 2-3x daily', 'Avoid submerging in water (pools, ocean, baths)', 'Keep out of direct sunlight', 'Do not scratch or pick at peeling skin'] as item}
            <li class="flex items-start gap-3 text-zinc-500 font-mono text-sm">
              <span class="w-1.5 h-1.5 bg-ink mt-1.5 shrink-0"></span>
              {item}
            </li>
          {/each}
        </ul>
      </div>

      <div>
        <h2 class="font-display text-2xl text-white mb-4 tracking-wide">LONG-TERM CARE</h2>
        <p class="text-zinc-500 leading-relaxed font-mono text-sm">Always apply SPF 30+ sunscreen over healed tattoos when exposed to sun. This preserves color and line quality for years.</p>
      </div>
    </div>
  </div>
</div>