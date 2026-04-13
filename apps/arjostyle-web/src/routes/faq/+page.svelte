<script lang="ts">
  import FAQSection from '$lib/components/landing/FAQSection.svelte';
</script>

<svelte:head>
  <title>FAQ — Arjo Magno</title>
  <meta name="description" content="Answers to common questions about tattoo bookings, pricing, aftercare, safety, and the process at ArjoStyle Tattoo Studio." />
  <meta property="og:title" content="FAQ — Arjo Magno" />
  <meta property="og:description" content="Answers to common questions about tattoo bookings, pricing, aftercare, and safety." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://arjostyle.ink/faq" />
</svelte:head>

<div class="min-h-screen bg-dark pt-8">
  <FAQSection />

  <div class="text-center pb-20 px-6">
    <p class="text-zinc-600 text-sm font-mono mb-4">Still have a question?</p>
    <a href="/contact" class="px-6 py-3 border border-border text-zinc-400 text-sm font-mono hover:bg-elevated hover:border-border-light hover:text-white transition-colors">
      CONTACT ME
    </a>
  </div>
</div>
