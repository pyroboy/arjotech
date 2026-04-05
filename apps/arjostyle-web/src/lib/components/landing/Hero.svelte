<script lang="ts">
  interface Props {
    onOpenBookingModal: () => void;
  }

  let { onOpenBookingModal }: Props = $props();

  function scrollToPortfolio() {
    const el = document.getElementById('portfolio');
    if (el) {
      const headerOffset = 80;
      const elementPosition = el.getBoundingClientRect().top + window.pageYOffset;
      window.scrollTo({ top: elementPosition - headerOffset, behavior: 'smooth' });
    }
  }
</script>

<section class="relative min-h-screen flex items-center justify-center overflow-hidden">
  <!-- Semi-transparent overlay -->
  <div class="absolute inset-0 bg-surface-900/30 z-[1]"></div>

  <!-- Background gradient -->
  <div class="absolute inset-0 bg-gradient-to-b from-surface-900 to-surface-900/80 z-[-1]"></div>

  <!-- Abstract background shapes -->
  <div class="absolute inset-0 overflow-hidden z-[-1]">
    <div class="absolute top-1/4 -left-20 w-80 h-80 rounded-full bg-ink-500/5 opacity-50 blur-3xl"></div>
    <div class="absolute bottom-1/4 -right-20 w-96 h-96 rounded-full bg-ink-500/5 opacity-50 blur-3xl"></div>
  </div>

  <!-- Content -->
  <div class="relative z-10 max-w-7xl mx-auto px-6 py-24 text-center">
    <h1 class="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight mb-6 text-white drop-shadow-xl">
      <span>Timeless Tattoos</span>
      <br />
      <span>Artistry Without Limits.</span>
    </h1>

    <p class="text-base md:text-lg text-zinc-400 mx-auto mb-10 drop-shadow-md">
      Custom designs crafted with precision — from fine line to full color, your story permanently inked.
    </p>

    <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
      <button
        class="bg-ink-500 hover:bg-ink-400 min-w-[180px] h-12 text-base transition-all duration-300 hover:shadow-xl text-white shadow-md rounded-lg font-medium px-6"
        onclick={onOpenBookingModal}
      >
        Book Now
      </button>
      <button
        class="min-w-[180px] h-12 text-base border border-zinc-700 hover:border-zinc-500 transition-all duration-300 bg-surface-900/50 hover:bg-surface-800/80 text-white shadow-md hover:shadow-lg rounded-lg font-medium px-6"
        onclick={scrollToPortfolio}
      >
        View Portfolio
      </button>
    </div>
  </div>
</section>
