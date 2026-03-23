<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import { portfolioItems } from '$data/portfolioData';
  import type { PortfolioImageItem } from '$data/portfolioData';

  interface Props {
    onOpenBookingModal: () => void;
  }

  let { onOpenBookingModal }: Props = $props();

  let activeCategory = $state('all');

  const portfolioCategories = [
    { id: 'all', name: 'All Works' },
    { id: 'blackwork', name: 'Blackwork' },
    { id: 'minimalist', name: 'Minimalist' },
    { id: 'geometric', name: 'Geometric' },
    { id: 'traditional', name: 'Traditional' },
    { id: 'florals', name: 'Florals & Nature' },
    { id: 'japanese', name: 'Japanese' },
    { id: 'custom', name: 'Custom Designs' },
  ];

  const FALLBACK_IMAGE_SRC = 'https://images.unsplash.com/photo-1544867885-2333f61544ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80';

  const imageItems = $derived(
    portfolioItems.filter((item): item is PortfolioImageItem => item.type === 'image' && !!item.image)
  );

  const filteredImageItems = $derived(
    activeCategory === 'all' ? imageItems : imageItems.filter((item) => item.category === activeCategory)
  );

  function handleImageError(event: Event) {
    const target = event.currentTarget as HTMLImageElement;
    if (target.src === FALLBACK_IMAGE_SRC) {
      target.style.display = 'none';
      return;
    }
    target.onerror = null;
    target.src = FALLBACK_IMAGE_SRC;
    target.srcset = '';
    target.style.objectFit = 'contain';
    target.classList.add('opacity-50');
  }
</script>

<section id="portfolio" class="py-16 bg-gradient-to-b from-surface-950 to-surface-900 text-zinc-200">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div>
      <h3 class="text-2xl md:text-3xl font-semibold text-center mb-6 text-zinc-100">
        Tattoo <span class="text-white">Gallery</span>
      </h3>

      <div class="flex flex-wrap justify-center gap-2 md:gap-3 mb-12">
        {#each portfolioCategories as category}
          <button
            onclick={() => (activeCategory = category.id)}
            class={cn(
              'px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium rounded-md transition-all duration-300 border',
              activeCategory === category.id
                ? 'bg-zinc-700 text-white border-zinc-600 shadow-lg'
                : 'bg-surface-900 text-zinc-300 border-zinc-800 hover:bg-surface-800 hover:border-zinc-700'
            )}
            type="button"
          >
            {category.name}
          </button>
        {/each}
      </div>

      {#if filteredImageItems.length > 0}
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {#each filteredImageItems as item (item.id)}
            <div class="group relative overflow-hidden rounded-lg shadow-lg bg-surface-900 border border-zinc-800 hover:border-zinc-800/50 transition-all duration-300 hover:shadow-xl">
              <div class="aspect-[4/5] w-full overflow-hidden bg-zinc-800 flex items-center justify-center text-zinc-600">
                <img
                  src={item.image}
                  alt={item.title || `Portfolio image ${item.id}`}
                  class="w-full h-full object-cover object-center transition-transform duration-700 ease-in-out group-hover:scale-105"
                  loading="lazy"
                  onerror={handleImageError}
                />
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3 md:p-4 pointer-events-none">
                <span class="inline-block px-2 py-0.5 text-xs font-semibold bg-zinc-600/90 rounded-full text-white mb-2 self-start">
                  {portfolioCategories.find((cat) => cat.id === item.category)?.name || item.category}
                </span>
                <h4 class="text-white text-sm md:text-base font-bold mb-1 truncate">{item.title}</h4>
                <p class="text-zinc-200 text-xs md:text-sm">Artist: {item.artist}</p>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="text-center py-16 bg-surface-900/50 rounded-xl border border-dashed border-zinc-700">
          <p class="text-zinc-400 mb-3 text-lg">
            No designs found in the "{portfolioCategories.find((cat) => cat.id === activeCategory)?.name}" category.
          </p>
          <button onclick={() => (activeCategory = 'all')} class="text-zinc-400 hover:text-zinc-300 font-medium hover:underline" type="button">
            View all designs instead
          </button>
        </div>
      {/if}

      <div class="mt-16 text-center">
        <p class="text-zinc-300 mb-6 text-lg">Inspired? Let's create your next piece.</p>
        <button
          type="button"
          onclick={onOpenBookingModal}
          class="inline-block px-8 py-3 bg-zinc-600 hover:bg-zinc-700 text-white font-semibold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105"
        >
          Book Your Consultation
        </button>
      </div>
    </div>
  </div>
</section>
