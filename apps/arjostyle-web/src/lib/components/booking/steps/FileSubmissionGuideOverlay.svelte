<script lang="ts">
  import { ChevronLeft, ChevronRight, X } from 'lucide-svelte';

  interface Props {
    open: boolean;
    onClose: () => void;
    placement?: string;
  }

  let { open, onClose, placement }: Props = $props();

  let activeSlide = $state(0);
  let overlayRef: HTMLDivElement;
  let autoplayTimer: ReturnType<typeof setInterval> | null = null;

  const slides = $derived([
    {
      title: 'Placement Photo',
      image: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745568419/odoepvhgbpmagfqo0gip.webp',
      description: `A clear, straight-on photo of the ${placement || 'body part'} where you want the tattoo. Good lighting helps!`,
    },
    {
      title: 'Reference Images',
      image: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745568419/h1dsfjqsjhhjydgdykpn.webp',
      description: 'Examples of tattoos, art, photos, or styles you like that convey your desired aesthetic.',
    },
    {
      title: 'Sketches (Optional)',
      image: 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745568419/aypdxeb6ep6qdhftdcnr.webp',
      description: "If you have a rough drawing or sketch of your idea, feel free to include it.",
    },
  ]);

  function nextSlide() {
    activeSlide = activeSlide === slides.length - 1 ? 0 : activeSlide + 1;
  }

  function prevSlide() {
    activeSlide = activeSlide === 0 ? slides.length - 1 : activeSlide - 1;
  }

  function resetAutoplay() {
    if (autoplayTimer) clearInterval(autoplayTimer);
    autoplayTimer = setInterval(nextSlide, 5000);
  }

  $effect(() => {
    if (!open) {
      if (autoplayTimer) clearInterval(autoplayTimer);
      return;
    }
    activeSlide = 0;
    resetAutoplay();
    document.body.style.overflow = 'hidden';

    return () => {
      if (autoplayTimer) clearInterval(autoplayTimer);
      document.body.style.overflow = '';
    };
  });

  // Reset autoplay on slide change
  $effect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    activeSlide;
    if (open) resetAutoplay();
  });

  function handleClickOutside(event: MouseEvent) {
    if (overlayRef && !overlayRef.contains(event.target as Node)) {
      onClose();
    }
  }
</script>

{#if open}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="fixed inset-0 bg-black/70 z-50 backdrop-blur-sm transition-all duration-300 overflow-y-auto p-4"
    onclick={handleClickOutside}
  >
    <div bind:this={overlayRef} class="relative max-w-lg w-full bg-zinc-900 text-white rounded-xl p-6 shadow-xl border border-zinc-700 mx-auto mb-8">
      <button
        onclick={onClose}
        class="absolute top-4 right-4 text-zinc-400 hover:text-white transition-colors z-10"
        aria-label="Close Guide"
      >
        <X size={24} />
      </button>

      <h3 class="text-2xl font-bold mb-6 text-center">Reference Submission Guide</h3>

      <div class="relative overflow-hidden rounded-lg mb-8" style="min-height: 340px;">
        <div class="relative w-full h-full">
          {#each slides as slide, index}
            <div
              class="absolute inset-0 flex flex-col transition-opacity duration-500
                {activeSlide === index ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}"
            >
              <div class="flex justify-center mb-6">
                <img
                  src={slide.image}
                  alt={slide.title}
                  class="w-48 h-48 rounded-lg object-cover mt-4"
                  loading="lazy"
                />
              </div>
              <h4 class="text-xl font-bold text-center text-blue-400 mb-3">{slide.title}</h4>
              <p class="text-center text-zinc-300 px-8">
                {#if index === 0 && placement}
                  A clear, straight-on photo of the <span class="font-bold text-white">{placement}</span> where you want the tattoo. Good lighting helps!
                {:else}
                  {slide.description}
                {/if}
              </p>
            </div>
          {/each}
        </div>

        <button
          onclick={prevSlide}
          class="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-20 transition-colors"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={20} />
        </button>
        <button
          onclick={nextSlide}
          class="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full z-20 transition-colors"
          aria-label="Next Slide"
        >
          <ChevronRight size={20} />
        </button>

        <div class="absolute bottom-0 left-0 right-0 flex justify-center gap-2 pb-2 z-20">
          {#each slides as _, index}
            <button
              onclick={() => (activeSlide = index)}
              class="w-2 h-2 rounded-full transition-colors {activeSlide === index ? 'bg-blue-500' : 'bg-zinc-500 hover:bg-zinc-400'}"
              aria-label="Go to slide {index + 1}"
            ></button>
          {/each}
        </div>
      </div>

      <div class="flex justify-center">
        <button
          onclick={onClose}
          class="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors font-medium"
        >
          Got It
        </button>
      </div>
    </div>
  </div>
{/if}
