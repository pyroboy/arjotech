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

<div class="min-h-screen bg-surface-900 pt-8">
  <FAQSection />

  <div class="text-center pb-20">
    <p class="text-zinc-500 text-sm mb-4">Still have a question?</p>
    <a href="/contact" class="px-6 py-2.5 border border-zinc-700 text-zinc-300 rounded-full text-sm hover:bg-zinc-800 transition-colors">
      Contact Me
    </a>
  </div>
</div>
