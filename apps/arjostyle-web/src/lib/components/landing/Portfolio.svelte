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

  function cloudinarySrcset(url: string): string {
    const widths = [400, 600, 800];
    return widths
      .map((w) => {
        const transformed = url.replace('/image/upload/', `/image/upload/w_${w},q_auto,f_auto/`);
        return `${transformed} ${w}w`;
      })
      .join(', ');
  }

  function cloudinarySrc(url: string, width: number = 800): string {
    return url.replace('/image/upload/', `/image/upload/w_${width},q_auto,f_auto/`);
  }

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

<section id="portfolio" class="py-16 bg-dark text-zinc-200 border-b border-border">
  <div class="container mx-auto px-4 sm:px-6 lg:px-8">
    <div>
      <h2 class="text-3xl md:text-4xl font-display text-center mb-8 text-white tracking-wide">
        TATTOO <span class="text-ink">GALLERY</span>
      </h2>

      <div class="flex flex-wrap justify-center gap-1 md:gap-2 mb-12">
        {#each portfolioCategories as category}
          <button
            onclick={() => (activeCategory = category.id)}
            class={cn(
              'px-3 py-1.5 md:px-4 md:py-2 text-sm font-medium transition-all duration-150 border',
              activeCategory === category.id
                ? 'bg-white text-dark border-white font-bold'
                : 'bg-elevated text-zinc-400 border-border hover:border-border-light hover:text-white'
            )}
            type="button"
          >
            {category.name}
          </button>
        {/each}
      </div>

      {#if filteredImageItems.length > 0}
        <div class="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1 md:gap-2">
          {#each filteredImageItems as item (item.id)}
            <div class="group relative overflow-hidden bg-elevated border border-border hover:border-ink/30 transition-all duration-150">
              <div class="aspect-[4/5] w-full overflow-hidden bg-dark flex items-center justify-center text-zinc-700">
                <img
                  src={cloudinarySrc(item.image)}
                  srcset={cloudinarySrcset(item.image)}
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  alt={item.title || `Portfolio image ${item.id}`}
                  class="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                  decoding="async"
                  onerror={handleImageError}
                />
              </div>
              <div class="absolute inset-0 bg-dark/0 group-hover:bg-dark/80 transition-all duration-150 flex flex-col justify-end p-3 md:p-4 opacity-0 group-hover:opacity-100">
                <span class="inline-block px-2 py-0.5 text-[10px] font-mono bg-ink/20 border border-ink/30 text-ink uppercase tracking-widest mb-2 self-start">
                  {portfolioCategories.find((cat) => cat.id === item.category)?.name || item.category}
                </span>
                <h3 class="text-white text-sm md:text-base font-display tracking-wide mb-1 truncate">{item.title}</h3>
                <p class="text-zinc-400 text-xs font-mono">Artist: {item.artist}</p>
              </div>
            </div>
          {/each}
        </div>
      {:else}
        <div class="text-center py-16 bg-elevated border border-border">
          <p class="text-zinc-500 mb-3 text-base font-mono">
            No designs found in the "{portfolioCategories.find((cat) => cat.id === activeCategory)?.name}" category.
          </p>
          <button onclick={() => (activeCategory = 'all')} class="text-ink hover:text-ink-400 font-mono text-sm hover:underline" type="button">
            View all designs instead
          </button>
        </div>
      {/if}

      <div class="mt-16 text-center">
        <p class="text-zinc-400 mb-6 text-base font-mono">Inspired? Let's create your next piece.</p>
        <button
          type="button"
          onclick={onOpenBookingModal}
          class="inline-block px-8 py-4 bg-red-500 hover:bg-red-600 text-white font-bold transition-all duration-150 text-base"
        >
          BOOK YOUR CONSULTATION →
        </button>
      </div>
    </div>
  </div>
</section>
