<script lang="ts">
  import Human3DViewer from '$components/three/Human3DViewer.svelte';
  import LevelIndicator from './LevelIndicator.svelte';
  import PainDisplaySection from './PainDisplaySection.svelte';
  import { cn } from '$lib/utils/cn';
  import { formatCurrency, formatDuration } from '$lib/utils/formatters';
  import { Tag, Clock, Ruler, Palette, Zap, Layers } from 'lucide-svelte';
  import type { BodyPartMappings, BodyPartMappingData } from '$types/mapping';

  const MAX_HEIGHT = 288;
  const DRAG_THRESHOLD = 5;

  interface Props {
    modelId: string;
    selectedCategory: string | null;
    currentPlacement: string | null;
    isColor: boolean;
    painLevel: number;
    painReason?: string;
    size: number | undefined;
    priceTierLevel: number;
    estimatedPrice: number | undefined;
    estimatedDuration: number | undefined;
    selectedStyle: string | null;
    previewHeight: number;
    isMiniMode?: boolean;
    onToggleExpand: () => void;
    editMode: boolean;
    liveMappings: BodyPartMappings | null | undefined;
    onMappingUpdate: (category: string, placement: string, update: Partial<BodyPartMappingData>) => void;
  }

  let {
    modelId,
    selectedCategory,
    currentPlacement,
    isColor,
    painLevel,
    painReason,
    size,
    priceTierLevel,
    estimatedPrice,
    estimatedDuration,
    selectedStyle,
    previewHeight,
    isMiniMode = false,
    onToggleExpand,
    editMode,
    liveMappings,
    onMappingUpdate,
  }: Props = $props();

  const isMinimized = $derived(isMiniMode);
  const expandedTargetWidth = MAX_HEIGHT / 1.5;

  const roundedEstimatedPrice = $derived(
    estimatedPrice !== undefined
      ? (estimatedPrice / 2 >= 1000
          ? Math.round(estimatedPrice / 2 / 500) * 500
          : Math.round(estimatedPrice / 2 / 100) * 100)
      : 0
  );

  const priceTiers = [
    { level: 1, range: [1, 3] as [number, number], label: 'Simple', colorClass: 'bg-green-500' },
    { level: 2, range: [4, 6] as [number, number], label: 'Detailed', colorClass: 'bg-blue-500' },
    { level: 3, range: [7, 10] as [number, number], label: 'Intricate', colorClass: 'bg-purple-600' },
  ];

  const currentTier = $derived(
    priceTiers.find((tier) => tier.range[0] <= priceTierLevel && priceTierLevel <= tier.range[1]) || priceTiers[0]
  );

  const priceTierColorStops = priceTiers.map((tier) => ({
    level: tier.level,
    colorClass: tier.colorClass,
  }));

  const hasRequiredInfoForOverlay = $derived(selectedCategory !== null && currentPlacement !== null);
  const showFlashingState = $derived(size === 0 && !!selectedCategory && !!currentPlacement);

  const modelUrl = $derived(
    modelId === 'default-human'
      ? 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/male_low_poly_human_body_jtzm1e.glb'
      : undefined
  );

  // Current mapping data for the 3D viewer
  const currentMappingData = $derived.by(() => {
    if (!selectedCategory || !currentPlacement || !liveMappings) return undefined;
    return liveMappings[selectedCategory]?.[currentPlacement];
  });

  // Drag detection
  let isDragging = false;
  let startDragPos = { x: 0, y: 0 };

  function handleMouseDown(event: MouseEvent) {
    if (event.button !== 0) return;
    isDragging = false;
    startDragPos = { x: event.clientX, y: event.clientY };
  }

  function handleMouseMove(event: MouseEvent) {
    if (event.buttons !== 1 || isDragging) return;
    const dx = event.clientX - startDragPos.x;
    const dy = event.clientY - startDragPos.y;
    if (Math.sqrt(dx * dx + dy * dy) > DRAG_THRESHOLD) {
      isDragging = true;
    }
  }

  function handleClick(event: MouseEvent) {
    if (isDragging) {
      event.stopPropagation();
      isDragging = false;
      return;
    }
    onToggleExpand();
  }

  function handleKeyDown(e: KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onToggleExpand();
    }
  }

  // Track last changed prop for flashing emphasis
  type LastChangedProp = 'category' | 'placement' | null;
  let lastChangedProp = $state<LastChangedProp>(null);
  let prevCategory = $state<string | null>(null);
  let prevPlacement = $state<string | null>(null);

  $effect(() => {
    const catChanged = selectedCategory !== prevCategory && prevCategory !== undefined;
    const plcChanged = currentPlacement !== prevPlacement && prevPlacement !== undefined;
    if (catChanged) lastChangedProp = 'category';
    else if (plcChanged) lastChangedProp = 'placement';
    prevCategory = selectedCategory;
    prevPlacement = currentPlacement;
  });
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
  class={cn('overflow-hidden shadow-md w-full cursor-pointer sticky top-0 z-20 bg-surface-900 border border-zinc-800 rounded-lg')}
  style="height: {previewHeight}px;"
  role="button"
  tabindex={0}
  onmousedown={handleMouseDown}
  onmousemove={handleMouseMove}
  onclick={handleClick}
  onkeydown={handleKeyDown}
  aria-expanded={!isMinimized}
  aria-label={isMinimized ? 'Click to expand preview details' : 'Click to minimize preview details'}
>
  <div class={cn('relative h-full select-none flex', isMinimized ? 'items-center' : 'items-stretch')}>
    <!-- 3D Model Container -->
    <div
      class={cn('relative bg-zinc-800 overflow-hidden flex-shrink-0')}
      style="width: {expandedTargetWidth}px; height: {MAX_HEIGHT}px; border-radius: 8px; pointer-events: none;"
    >
      {#if modelUrl}
        <div class="absolute inset-0 z-0">
          <Human3DViewer
            {modelUrl}
            {isColor}
            mapping={currentMappingData}
            {editMode}
            {onMappingUpdate}
            {selectedCategory}
            {currentPlacement}
            {size}
            isContainerResizing={false}
          />
        </div>
      {/if}
    </div>

    <!-- Info Container -->
    <div
      class={cn(
        'relative overflow-hidden',
        isMinimized
          ? 'flex-grow pl-3 pointer-events-none'
          : 'flex-1 bg-surface-900 h-full order-last flex flex-col pointer-events-auto'
      )}
    >
      <!-- Minimized View -->
      <div
        class={cn(
          'transition-opacity duration-400 ease-in-out space-y-1.5 text-sm px-2 py-1',
          isMinimized ? 'opacity-100' : 'opacity-0 absolute -z-10 pointer-events-none'
        )}
        aria-hidden={!isMinimized}
      >
        <div class="mb-1">
          <h3 class="font-semibold text-sm leading-tight truncate text-white" title={currentPlacement ?? 'Select Placement'}>
            {currentPlacement || 'Placement'}
          </h3>
          <p class="text-[0.7rem] leading-tight text-zinc-400 truncate" title={selectedCategory ?? 'Select Category'}>
            {selectedCategory || 'Category'}
          </p>
        </div>
        <div class="grid grid-cols-3 gap-x-2.5 gap-y-1 text-xs">
          <div class="flex items-center gap-1 truncate" title="Booking Downpayment: {formatCurrency(roundedEstimatedPrice)}">
            <Tag size={12} class="flex-shrink-0 text-zinc-500" />
            <span class="font-medium text-sm text-white">{formatCurrency(roundedEstimatedPrice)}</span>
          </div>
          <div class="flex items-center gap-1 truncate" title="Est. Time: {formatDuration(estimatedDuration)}">
            <Clock size={12} class="flex-shrink-0 text-zinc-500" />
            <span class="text-zinc-400">{formatDuration(estimatedDuration)}</span>
          </div>
          <div class="flex items-center gap-1 truncate" title="Size: {size !== undefined ? size + '\"' : 'N/A'}">
            <Ruler size={12} class="flex-shrink-0 text-zinc-500" />
            <span class="text-zinc-400">{size !== undefined ? `${size}"` : 'N/A'}</span>
          </div>
          <div class="flex items-center gap-1 truncate" title="Style: {selectedStyle || 'Not specified'}">
            <Palette size={12} class="flex-shrink-0 text-zinc-500" />
            <span class="text-zinc-400 truncate max-w-[80px]">{selectedStyle || 'N/A'}</span>
          </div>
          <div class="flex items-center gap-1" title="Pain: {painLevel}/10">
            <Zap size={12} class="flex-shrink-0 text-orange-500" />
            <div class="flex-grow min-w-0">
              <LevelIndicator level={painLevel} ariaLabel="Pain Level" minimized={true} showDivisions={false} class="my-0" />
            </div>
          </div>
          <div class="flex items-center gap-1" title="Complexity: {priceTierLevel}/10 - {currentTier?.label}">
            <Layers size={12} class="flex-shrink-0 text-blue-500" />
            <div class="flex-grow min-w-0">
              <LevelIndicator
                level={priceTierLevel}
                ariaLabel="Complexity Level"
                minimized={true}
                showDivisions={false}
                colorStops={priceTierColorStops}
                class="my-0"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Expanded View -->
      <div
        class={cn(
          'flex flex-col h-full px-4',
          !isMinimized ? 'opacity-100' : 'opacity-0 absolute -z-10 pointer-events-none'
        )}
        aria-hidden={isMinimized}
      >
        <div class="flex-grow relative overflow-hidden">
          {#if showFlashingState}
            <div class="absolute inset-0 flex flex-col items-center justify-center text-center z-10 p-2 bg-surface-900/60  transition-opacity duration-300">
              <p
                class={cn(
                  'font-bold uppercase tracking-tight mb-1 sm:mb-2 transition-all duration-300 ease-out',
                  lastChangedProp === 'category' || (!lastChangedProp && selectedCategory)
                    ? 'text-4xl sm:text-5xl text-white scale-105'
                    : 'text-xl sm:text-2xl text-zinc-400 scale-100'
                )}
              >
                {selectedCategory || 'Category...'}
              </p>
              <h3
                class={cn(
                  'font-extrabold transition-all duration-300 ease-out',
                  lastChangedProp === 'placement' || (!lastChangedProp && !selectedCategory && currentPlacement)
                    ? 'text-4xl sm:text-5xl text-white scale-105'
                    : 'text-xl sm:text-2xl text-zinc-300 scale-100'
                )}
              >
                {currentPlacement || 'Placement...'}
              </h3>
              <p class="mt-4 text-sm text-zinc-400">Select Size to Continue</p>
            </div>
          {:else}
            <div class="flex flex-col h-full transition-opacity duration-300">
              <!-- Header -->
              <div class="flex-shrink-0 w-full px-2 pt-1 border-b-2 border-zinc-700 bg-gradient-to-r from-surface-900 to-zinc-800 rounded-t-lg shadow-sm">
                <p class="text-xs font-medium uppercase tracking-wider text-zinc-400">
                  {selectedCategory || 'Category'}
                </p>
                <h3 class="text-xl font-bold text-white">
                  {currentPlacement || 'Placement'}
                </h3>
              </div>
              <!-- Scrollable Details -->
              <div class="flex-grow overflow-y-auto px-4 py-3 space-y-4 sm:space-y-6 min-w-[400px] max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto">
                <div class="flex flex-col items-start sm:flex-row sm:justify-between sm:items-baseline">
                  <h3 class="text-sm md:text-base font-medium text-zinc-400 mb-0.5 sm:mb-0">Booking Downpayment:</h3>
                  <span class="text-2xl md:text-3xl font-bold text-white">{formatCurrency(roundedEstimatedPrice)}</span>
                </div>
                {#if estimatedPrice !== undefined}
                  <div class="flex flex-col items-start sm:flex-row sm:justify-between sm:items-baseline">
                    <h3 class="text-sm md:text-base font-medium text-zinc-400 mb-0.5 sm:mb-0">Est. Full Price:</h3>
                    <span class="text-sm font-light text-white">{formatCurrency(estimatedPrice)}</span>
                  </div>
                {/if}
                <div class="flex flex-col items-start sm:flex-row sm:justify-between sm:items-baseline">
                  <h3 class="text-xs md:text-sm font-medium text-zinc-400 mb-0.5 sm:mb-0">Est. Time:</h3>
                  <span class="text-base md:text-lg font-medium text-white">{formatDuration(estimatedDuration)}</span>
                </div>
                <div class="flex flex-col items-start sm:flex-row sm:justify-between sm:items-baseline">
                  <h3 class="text-xs md:text-sm font-medium text-zinc-400 mb-0.5 sm:mb-0">Size:</h3>
                  <span class="text-base md:text-lg font-medium text-white">{size !== undefined ? `${size} sq. in` : 'N/A'}</span>
                </div>
                <div class="flex flex-col items-start sm:flex-row sm:justify-between sm:items-baseline">
                  <h3 class="text-xs md:text-sm font-medium text-zinc-400 mb-0.5 sm:mb-0">Style:</h3>
                  <span class="text-base md:text-lg font-medium text-white truncate max-w-[150px] sm:max-w-[180px] md:max-w-[200px]" title={selectedStyle || 'Not specified'}>
                    {selectedStyle || 'Not specified'}
                  </span>
                </div>
              </div>
            </div>
          {/if}
        </div>

        <!-- Bottom Sections -->
        <div
          class={cn(
            'flex-shrink-0 px-1 pb-2 pt-1 border-t border-zinc-700 transition-opacity',
            !isMinimized ? 'opacity-100' : 'opacity-0'
          )}
        >
          <PainDisplaySection {painLevel} {painReason} />

          {#if !showFlashingState && hasRequiredInfoForOverlay}
            <div class="flex-shrink-0 px-1 pb-2 pt-1 space-y-1 border-t border-zinc-700 mt-2">
              <div class="border-t border-zinc-800 pt-2"></div>
              <span class="text-sm font-medium text-zinc-400 flex items-center mb-1">
                <Layers size={14} class="mr-1 inline-block text-blue-500 flex-shrink-0" />
                Complexity:
              </span>
              <LevelIndicator
                level={priceTierLevel}
                ariaLabel="Price Tier Level: {currentTier.label}"
                colorStops={priceTierColorStops}
                showDivisions={true}
              />
              <div class="flex justify-between text-xs mt-1">
                {#each priceTiers as tier}
                  <span
                    class={cn(
                      'transition-colors duration-200 px-1 text-center flex-1',
                      currentTier.label === tier.label ? 'text-white font-semibold' : 'text-zinc-500'
                    )}
                  >
                    {tier.label}
                  </span>
                {/each}
              </div>
            </div>
          {/if}
        </div>
      </div>
    </div>

    <!-- Main Overlay Prompt -->
    {#if !hasRequiredInfoForOverlay && !isMinimized}
      <div
        class="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface-900/80 to-surface-900/90  z-30 transition-opacity duration-300"
        aria-hidden={hasRequiredInfoForOverlay || isMinimized}
      >
        <div class="text-center p-6">
          <div class="perspective-container mb-3">
            <p class="font-semibold text-2xl uppercase tracking-[0.5rem] text-white">TATTOO CALCULATOR</p>
          </div>
          <p class="text-xl text-zinc-400 mt-1.5">Adjust sliders to calculate Downpayment.</p>
        </div>
      </div>
    {/if}
  </div>
</div>
