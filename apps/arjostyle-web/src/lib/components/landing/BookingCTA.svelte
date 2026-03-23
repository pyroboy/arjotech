<script lang="ts">
  import RevealOnScroll from '$components/ui/RevealOnScroll.svelte';

  interface Props {
    onOpenBookingModal: () => void;
  }

  let { onOpenBookingModal }: Props = $props();
</script>

<section class="bg-ink-500/5 py-20">
  <RevealOnScroll>
    <div class="container mx-auto px-4 text-center">
      <h2 class="text-3xl md:text-4xl font-bold mb-4 text-white">Ready to Get Inked?</h2>
      <p class="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
        Book your consultation now and take the first step towards your perfect tattoo.
        Our artists are ready to bring your vision to life.
      </p>
      <button
        onclick={onOpenBookingModal}
        class="px-8 py-3 bg-ink-500 text-white rounded-lg font-semibold hover:bg-ink-400 transition-colors text-lg"
      >
        Book Your Appointment
      </button>
    </div>
  </RevealOnScroll>
</section>
