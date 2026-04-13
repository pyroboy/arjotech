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

<div class="min-h-screen bg-dark text-zinc-100">
  <!-- Hero -->
  <section class="pt-20 pb-12 px-6 border-b border-border">
    <div class="max-w-4xl mx-auto text-center">
      <RevealOnScroll>
        <h1 class="text-4xl md:text-5xl font-display font-bold text-white mb-4 tracking-wide">
          TRANSPARENT <span class="text-ink">PRICING</span>
        </h1>
      </RevealOnScroll>
      <RevealOnScroll delay={100}>
        <p class="text-zinc-400 text-lg max-w-2xl mx-auto">
          No hidden fees. Every quote is based on size, complexity, and placement.
          Use the <a href="/book" class="text-ink hover:underline">booking form</a> for a real-time estimate.
        </p>
      </RevealOnScroll>
    </div>
  </section>

  <!-- Tattoo Pricing -->
  <section class="py-16 px-6 border-b border-border">
    <div class="max-w-4xl mx-auto">
      <RevealOnScroll>
        <h2 class="text-2xl font-display font-semibold text-white mb-2 tracking-wide">TATTOO RATES</h2>
        <p class="text-zinc-600 text-sm font-mono mb-8">Starting prices — final cost confirmed at consultation based on design complexity.</p>
      </RevealOnScroll>

      <div class="grid gap-2">
        {#each data.tattooTiers as tier, i}
          <RevealOnScroll delay={i * 60}>
            <div class="bg-elevated border border-border p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <div class="flex items-center gap-3 mb-1">
                  <span class="font-display text-white text-lg tracking-wide">{tier.label}</span>
                  <span class="text-[10px] font-mono px-2 py-0.5 border border-border text-zinc-500 uppercase tracking-widest">{tier.size}</span>
                </div>
                <p class="text-zinc-500 text-sm">{tier.description}</p>
                <div class="flex flex-wrap gap-1.5 mt-2">
                  {#each tier.examples as ex}
                    <span class="text-[10px] font-mono px-2 py-0.5 border border-border text-zinc-600 uppercase tracking-wide">{ex}</span>
                  {/each}
                </div>
              </div>
              <div class="text-right shrink-0">
                <p class="text-[10px] font-mono text-zinc-600 uppercase tracking-widest mb-0.5">Starting at</p>
                <p class="text-2xl font-display text-ink tracking-wide">{formatCurrency(tier.startingAt)}</p>
              </div>
            </div>
          </RevealOnScroll>
        {/each}
      </div>

      <!-- Add-ons -->
      <RevealOnScroll delay={200}>
        <div class="mt-8 p-5 border border-border bg-elevated">
          <h3 class="text-sm font-mono font-semibold text-zinc-300 uppercase tracking-widest mb-3">ADD-ONS & NOTES</h3>
          <ul class="space-y-2">
            {#each data.addOns as item}
              <li class="flex items-start gap-2 text-sm">
                <span class="w-1.5 h-1.5 bg-ink mt-1.5 shrink-0"></span>
                <span><strong class="text-zinc-200">{item.label}:</strong> <span class="text-zinc-500">{item.note}</span></span>
              </li>
            {/each}
          </ul>
        </div>
      </RevealOnScroll>
    </div>
  </section>

  <!-- Painting Commissions -->
  <section class="py-16 px-6 border-b border-border">
    <div class="max-w-4xl mx-auto">
      <RevealOnScroll>
        <h2 class="text-2xl font-display font-semibold text-white mb-2 tracking-wide">PAINTING COMMISSIONS</h2>
        <p class="text-zinc-600 text-sm font-mono mb-8">Original acrylic and mixed media works. <a href="/paintings" class="text-ink hover:underline">View the gallery →</a></p>
      </RevealOnScroll>

      <div class="grid sm:grid-cols-2 gap-2">
        {#each data.paintingPrices as tier, i}
          <RevealOnScroll delay={i * 60}>
            <div class="bg-elevated border border-border p-5">
              <p class="font-display text-white mb-1 tracking-wide">{tier.label}</p>
              {#if tier.startingAt}
                <p class="text-xl font-display text-ink tracking-wide">{formatCurrency(tier.startingAt)}</p>
              {:else}
                <p class="text-zinc-600 text-sm font-mono">{tier.note}</p>
              {/if}
            </div>
          </RevealOnScroll>
        {/each}
      </div>
    </div>
  </section>

  <!-- Design Packages -->
  <section class="py-16 px-6 border-b border-border">
    <div class="max-w-4xl mx-auto">
      <RevealOnScroll>
        <h2 class="text-2xl font-display font-semibold text-white mb-2 tracking-wide">DESIGN SERVICES</h2>
        <p class="text-zinc-600 text-sm font-mono mb-8">Logos, menus, brand identities. <a href="/design" class="text-ink hover:underline">View design work →</a></p>
      </RevealOnScroll>

      <div class="grid sm:grid-cols-3 gap-2">
        {#each data.designPackages as pkg, i}
          <RevealOnScroll delay={i * 60}>
            <div class="bg-elevated border border-border p-5 flex flex-col gap-3">
              <div>
                <p class="font-display text-white mb-1 tracking-wide">{pkg.label}</p>
                <p class="text-xl font-display text-ink tracking-wide">{formatCurrency(pkg.startingAt)}</p>
              </div>
              <ul class="space-y-1.5">
                {#each pkg.includes as item}
                  <li class="text-xs text-zinc-500 flex items-start gap-1.5 font-mono">
                    <span class="text-ink mt-0.5">✓</span> {item}
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
  <section class="py-16 px-6 border-b border-border">
    <div class="max-w-4xl mx-auto">
      <RevealOnScroll>
        <h2 class="text-2xl font-display font-semibold text-white mb-8 tracking-wide">BOOKING TERMS</h2>
      </RevealOnScroll>
      <div class="divide-y divide-border">
        {#each data.bookingTerms as term, i}
          <RevealOnScroll delay={i * 50}>
            <div class="py-4 flex flex-col sm:flex-row sm:gap-8">
              <span class="text-sm font-mono font-medium text-zinc-300 w-36 shrink-0 uppercase tracking-wide">{term.label}</span>
              <span class="text-sm text-zinc-500">{term.value}</span>
            </div>
          </RevealOnScroll>
        {/each}
      </div>
    </div>
  </section>

  <!-- CTA -->
  <section class="py-20 px-6 text-center">
    <RevealOnScroll>
      <h2 class="text-3xl font-display font-semibold text-white mb-4 tracking-wide">READY TO BOOK?</h2>
      <p class="text-zinc-500 mb-8 max-w-md mx-auto text-sm font-mono">Get a real-time price estimate and secure your slot with the online booking form.</p>
      <div class="flex flex-wrap gap-3 justify-center">
        <a href="/book" class="px-8 py-3 bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-all duration-150">
          BOOK NOW
        </a>
        <a href="/faq" class="px-8 py-3 border border-border text-zinc-300 text-sm font-medium hover:bg-elevated hover:border-border-light transition-colors">
          VIEW FAQ
        </a>
      </div>
    </RevealOnScroll>
  </section>
</div>
