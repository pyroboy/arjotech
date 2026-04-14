<svelte:head>
  <title>Aftercare — Arjo Magno</title>
  <meta name="description" content="Tattoo aftercare guide by Arjo Magno. Complete healing instructions from day 1 through long-term care for clients in the Philippines." />
  <meta property="og:title" content="Aftercare — Arjo Magno" />
  <meta property="og:description" content="Tattoo aftercare guide. Step-by-step healing instructions from day 1 through long-term care." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://arjostyle.ink/aftercare" />
</svelte:head>

<div class="min-h-screen bg-dark px-6 py-20">
  <div class="max-w-2xl mx-auto">
    <p class="text-ink text-[10px] font-mono uppercase tracking-[0.3em] mb-4">HEALING GUIDE</p>
    <h1 class="font-display text-5xl text-white mb-3 tracking-wide">TATTOO AFTERCARE</h1>
    <p class="text-zinc-500 leading-relaxed mb-10 font-mono text-sm">Follow these steps carefully. Good aftercare means a cleaner, crisper, longer-lasting tattoo. When in doubt, message me — don't wait.</p>

    <div class="space-y-10">

      <!-- FIRST 24 HOURS -->
      <div class="border-b border-border pb-10">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-ink font-mono text-xs uppercase tracking-widest">Phase 1</span>
          <span class="text-zinc-700">|</span>
          <h2 class="font-display text-2xl text-white tracking-wide">FIRST 24 HOURS</h2>
        </div>
        <div class="space-y-3">
          <div class="bg-elevated border border-border p-4">
            <p class="text-ink text-xs font-mono uppercase tracking-widest mb-2">Leave the bandage on</p>
            <p class="text-zinc-400 font-mono text-sm leading-relaxed">Keep the initial covering on for 2–4 hours after your session. Don't sleep on it if possible — lay a clean towel over your bed if you need to sleep.</p>
          </div>
          <div class="bg-elevated border border-border p-4">
            <p class="text-ink text-xs font-mono uppercase tracking-widest mb-2">First wash</p>
            <p class="text-zinc-400 font-mono text-sm leading-relaxed">Remove the bandage. Wash gently with lukewarm water and fragrance-free soap — no fragrance, no dye, no scrubbing. Pat dry with a clean paper towel. Never use a shared towel.</p>
          </div>
          <div class="bg-elevated border border-border p-4">
            <p class="text-ink text-xs font-mono uppercase tracking-widest mb-2">Apply lotion</p>
            <p class="text-zinc-400 font-mono text-sm leading-relaxed">Once dry, apply a THIN layer of unscented lotion (CetrIM, Lubriderm, or similar). Just enough to feel barely moist — not greasy. Pat excess with paper towel.</p>
          </div>
        </div>
      </div>

      <!-- DAYS 1–14 -->
      <div class="border-b border-border pb-10">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-ink font-mono text-xs uppercase tracking-widest">Phase 2</span>
          <span class="text-zinc-700">|</span>
          <h2 class="font-display text-2xl text-white tracking-wide">DAYS 1–14 — HEALING</h2>
        </div>
        <ul class="space-y-3">
          {#each [
            { label: 'Lotion 2–3x daily', note: 'Unscented only. If it stings, you\'re using too much or the wrong product.' },
            { label: 'No soaking', note: 'No pools, ocean, baths, or jacuzzi. Quick showers are fine — just don\'t let the tattoo sit in water.' },
            { label: 'No direct sunlight', note: 'Keep it covered or in shade. Fresh tattoos fade faster in UV light.' },
            { label: 'No scratching or picking', note: 'It will peel and feel itchy. That\'s normal. Slap it gently instead of scratching. Do not peel the skin.' },
            { label: 'Let it breathe', note: 'Don\'t keep it covered all day. Open air helps the surface skin heal faster. Loose clothing only over the area.' },
            { label: 'No gym on fresh ink', note: 'Sweat and friction on a fresh tattoo can cause ink rejection and infection. Wait 48 hours before intense exercise.' }
          ] as item}
            <li class="flex items-start gap-3 bg-elevated border border-border p-4">
              <span class="w-1.5 h-1.5 bg-ink mt-2 shrink-0"></span>
              <div>
                <span class="text-zinc-200 font-mono text-sm font-medium">{item.label}</span>
                <span class="text-zinc-600 font-mono text-sm"> — {item.note}</span>
              </div>
            </li>
          {/each}
        </ul>
      </div>

      <!-- DAYS 14–30 -->
      <div class="border-b border-border pb-10">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-ink font-mono text-xs uppercase tracking-widest">Phase 3</span>
          <span class="text-zinc-700">|</span>
          <h2 class="font-display text-2xl text-white tracking-wide">WEEKS 2–4 — SETTLING</h2>
        </div>
        <div class="bg-elevated border border-border p-5">
          <p class="text-zinc-400 font-mono text-sm leading-relaxed mb-3">
            The surface looks healed but the deeper layers are still rebuilding. Continue moisturizing once or twice daily. You may still see some dead skin flaking off — that's normal.
          </p>
          <p class="text-zinc-400 font-mono text-sm leading-relaxed">
            This is when the tattoo will look its worst — slightly cloudy, dull, or even like the ink is fading. It's not. The ink is settling into the mid-layers of skin. Don't panic.
          </p>
        </div>
        <div class="mt-4 p-4 border border-ink-500/20 bg-ink-500/5">
          <p class="text-ink font-mono text-xs uppercase tracking-widest mb-2">Expected timeline</p>
          <p class="text-zinc-400 font-mono text-sm">Surface skin closes: 2–3 weeks. Full internal healing: 3–6 months. Tattoo looks best: 1 month after session (after dead skin settles).</p>
        </div>
      </div>

      <!-- LONG TERM -->
      <div class="pb-10">
        <div class="flex items-center gap-3 mb-4">
          <span class="text-ink font-mono text-xs uppercase tracking-widest">Phase 4</span>
          <span class="text-zinc-700">|</span>
          <h2 class="font-display text-2xl text-white tracking-wide">LONG-TERM CARE</h2>
        </div>
        <ul class="space-y-3">
          {#each [
            { label: 'SPF 30+ always', note: 'Sun is the #1 cause of tattoo fading. Apply sunscreen over healed tattoos when the area will be exposed.' },
            { label: 'Moisturize daily', note: 'Dry skin accelerates ink breakdown. A daily unscented lotion keeps the skin supple and the ink contained.' },
            { label: 'Watch for color changes', note: 'If you notice the ink looking raised, bumpy, or changing color months after healing, get it checked — don\'t ignore signs of reaction.' }
          ] as item}
            <li class="flex items-start gap-3 bg-elevated border border-border p-4">
              <span class="w-1.5 h-1.5 bg-ink mt-2 shrink-0"></span>
              <div>
                <span class="text-zinc-200 font-mono text-sm font-medium">{item.label}</span>
                <span class="text-zinc-600 font-mono text-sm"> — {item.note}</span>
              </div>
            </li>
          {/each}
        </ul>
      </div>

    </div>

    <!-- RED FLAGS -->
    <div class="mt-12 p-5 border border-red-500/30 bg-red-500/5">
      <p class="text-red-400 font-mono text-xs uppercase tracking-widest mb-3">When to contact me immediately</p>
      <ul class="space-y-2">
        {#each ['Signs of infection: increasing redness, heat, pus, or red streaks spreading from the tattoo',
                'Severe allergic reaction: raised bumps, intense itching, or swelling beyond the tattoo area',
                'Fever or chills accompanying a red/hot tattoo',
                'The tattoo was mechanically injured (hit, torn, scraped) while healing'] as item}
          <li class="flex items-start gap-2 text-zinc-400 font-mono text-sm">
            <span class="w-1 h-1 bg-red-400 mt-2 shrink-0"></span>
            {item}
          </li>
        {/each}
      </ul>
    </div>

    <div class="mt-8 text-center">
      <p class="text-zinc-600 font-mono text-sm mb-4">Questions about your healing? Message me directly.</p>
      <a href="/contact" class="inline-block px-6 py-3 border border-border text-zinc-400 text-sm font-mono hover:bg-elevated hover:border-border-light hover:text-white transition-colors">
        CONTACT ME
      </a>
    </div>

  </div>
</div>
