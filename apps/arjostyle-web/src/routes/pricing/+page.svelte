<script lang="ts">
  import RevealOnScroll from '$lib/components/ui/RevealOnScroll.svelte';
  import { formatCurrency } from '$lib/utils/formatters';

  let { data } = $props();
</script>

<svelte:head>
  <title>Pricing & Rates — Arjo Magno</title>
  <meta name="description" content="Transparent tattoo, painting, and design pricing. Starting at ₱1,000. View rates, booking terms, and deposit policy." />
  <meta property="og:title" content="Pricing & Rates — Arjo Magno" />
  <meta property="og:description" content="Transparent tattoo, painting, and design pricing. Starting at ₱1,000." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://arjostyle.ink/pricing" />
</svelte:head>

<div class="min-h-screen bg-surface-900 text-zinc-100">
  <!-- Hero -->
  <section class="pt-20 pb-12 px-6">
    <div class="max-w-4xl mx-auto text-center">
      <RevealOnScroll>
        <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-4">
          Transparent <span class="text-ink-500">Pricing</span>
        </h1>
      </RevealOnScroll>
      <RevealOnScroll delay={100}>
        <p class="text-zinc-400 text-lg max-w-2xl mx-auto">
          No hidden fees. Every quote is based on size, complexity, and placement.
          Use the <a href="/book" class="text-ink-400 hover:underline">booking form</a> for a real-time estimate.
        </p>
      </RevealOnScroll>
    </div>
  </section>

  <!-- Tattoo Pricing -->
  <section class="py-16 px-6">
    <div class="max-w-4xl mx-auto">
      <RevealOnScroll>
        <h2 class="text-2xl font-display font-semibold text-white mb-2">Tattoo Rates</h2>
        <p class="text-zinc-500 text-sm mb-8">Starting prices — final cost confirmed at consultation based on design complexity.</p>
      </RevealOnScroll>

      <div class="grid gap-4">
        {#each data.tattooTiers as tier, i}
          <RevealOnScroll delay={i * 60}>
            <div class="glass-panel rounded-xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-zinc-800">
              <div>
                <div class="flex items-center gap-3 mb-1">
                  <span class="font-semibold text-white text-lg">{tier.label}</span>
                  <span class="text-xs px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-400">{tier.size}</span>
                </div>
                <p class="text-zinc-400 text-sm">{tier.description}</p>
                <div class="flex flex-wrap gap-1.5 mt-2">
                  {#each tier.examples as ex}
                    <span class="text-xs px-2 py-0.5 rounded-full bg-zinc-800/60 text-zinc-500">{ex}</span>
                  {/each}
                </div>
              </div>
              <div class="text-right shrink-0">
                <p class="text-xs text-zinc-500 mb-0.5">Starting at</p>
                <p class="text-2xl font-bold text-ink-400">{formatCurrency(tier.startingAt)}</p>
              </div>
            </div>
          </RevealOnScroll>
        {/each}
      </div>

      <!-- Add-ons -->
      <RevealOnScroll delay={200}>
        <div class="mt-8 p-5 rounded-xl border border-zinc-800 bg-zinc-900/40">
          <h3 class="text-sm font-semibold text-zinc-300 uppercase tracking-wider mb-3">Add-ons & Notes</h3>
          <ul class="space-y-2">
            {#each data.addOns as item}
              <li class="flex items-start gap-2 text-sm">
                <span class="w-1.5 h-1.5 bg-ink-500 rounded-full mt-1.5 shrink-0"></span>
                <span><strong class="text-zinc-200">{item.label}:</strong> <span class="text-zinc-400">{item.note}</span></span>
              </li>
            {/each}
          </ul>
        </div>
      </RevealOnScroll>
    </div>
  </section>

  <!-- Painting Commissions -->
  <section class="py-16 px-6 border-t border-zinc-800/50">
    <div class="max-w-4xl mx-auto">
      <RevealOnScroll>
        <h2 class="text-2xl font-display font-semibold text-white mb-2">Painting Commissions</h2>
        <p class="text-zinc-500 text-sm mb-8">Original acrylic and mixed media works. <a href="/paintings" class="text-ink-400 hover:underline">View the gallery →</a></p>
      </RevealOnScroll>

      <div class="grid sm:grid-cols-2 gap-4">
        {#each data.paintingPrices as tier, i}
          <RevealOnScroll delay={i * 60}>
            <div class="glass-panel rounded-xl p-5 border border-zinc-800">
              <p class="font-medium text-zinc-100 mb-1">{tier.label}</p>
              {#if tier.startingAt}
                <p class="text-xl font-bold text-ink-400">{formatCurrency(tier.startingAt)}</p>
              {:else}
                <p class="text-zinc-400 text-sm">{tier.note}</p>
              {/if}
            </div>
          </RevealOnScroll>
        {/each}
      </div>
    </div>
  </section>

  <!-- Design Packages -->
  <section class="py-16 px-6 border-t border-zinc-800/50">
    <div class="max-w-4xl mx-auto">
      <RevealOnScroll>
        <h2 class="text-2xl font-display font-semibold text-white mb-2">Design Services</h2>
        <p class="text-zinc-500 text-sm mb-8">Logos, menus, brand identities. <a href="/design" class="text-ink-400 hover:underline">View design work →</a></p>
      </RevealOnScroll>

      <div class="grid sm:grid-cols-3 gap-4">
        {#each data.designPackages as pkg, i}
          <RevealOnScroll delay={i * 60}>
            <div class="glass-panel rounded-xl p-5 border border-zinc-800 flex flex-col gap-3">
              <div>
                <p class="font-semibold text-white mb-1">{pkg.label}</p>
                <p class="text-xl font-bold text-ink-400">{formatCurrency(pkg.startingAt)}</p>
              </div>
              <ul class="space-y-1.5">
                {#each pkg.includes as item}
                  <li class="text-xs text-zinc-400 flex items-start gap-1.5">
                    <span class="text-ink-500 mt-0.5">✓</span> {item}
                  </li>
                {/each}
              </ul>
            </div>
          </RevealOnScroll>
        {/each}
      </div>
    </div>
  </section>

  <!-- Booking Terms -->
  <section class="py-16 px-6 border-t border-zinc-800/50">
    <div class="max-w-4xl mx-auto">
      <RevealOnScroll>
        <h2 class="text-2xl font-display font-semibold text-white mb-8">Booking Terms</h2>
      </RevealOnScroll>
      <div class="divide-y divide-zinc-800">
        {#each data.bookingTerms as term, i}
          <RevealOnScroll delay={i * 50}>
            <div class="py-4 flex flex-col sm:flex-row sm:gap-8">
              <span class="text-sm font-medium text-zinc-300 w-36 shrink-0">{term.label}</span>
              <span class="text-sm text-zinc-400">{term.value}</span>
            </div>
          </RevealOnScroll>
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="py-20 px-6 text-center">
    <RevealOnScroll>
      <h2 class="text-2xl font-display font-semibold text-white mb-4">Ready to Book?</h2>
      <p class="text-zinc-400 mb-8 max-w-md mx-auto">Get a real-time price estimate and secure your slot with the online booking form.</p>
      <div class="flex flex-wrap gap-4 justify-center">
        <a href="/book" class="px-8 py-3 bg-ink-500 text-white rounded-full font-semibold hover:bg-ink-400 transition-colors">
          Book Now
        </a>
        <a href="/faq" class="px-8 py-3 border border-zinc-700 text-zinc-300 rounded-full hover:bg-zinc-800 transition-colors">
          View FAQ
        </a>
      </div>
    </RevealOnScroll>
  </section>
</div>
