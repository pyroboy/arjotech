<script lang="ts">
  import Human3DViewer from '$components/three/Human3DViewer.svelte';
  import { cn } from '$lib/utils/cn';
  import { Zap } from 'lucide-svelte';
  import type { BodyPartMappings, BodyPartMappingData } from '$types/mapping';

  const MAX_HEIGHT = 288;

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
    cameraFov?: number;
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
    painReason: _painReason,
    size,
    priceTierLevel: _priceTierLevel,
    estimatedPrice: _estimatedPrice,
    estimatedDuration: _estimatedDuration,
    selectedStyle,
    previewHeight,
    cameraFov = 45,
    isMiniMode = false,
    onToggleExpand,
    editMode,
    liveMappings,
    onMappingUpdate,
  }: Props = $props();

  // Info bar height for camera offset compensation (~44px when visible)
  const INFO_BAR_HEIGHT = 44;
  const modelScale = $derived(previewHeight / MAX_HEIGHT);

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

  // Pain badge color
  const painBadgeClass = $derived.by(() => {
    if (painLevel <= 3) return 'bg-emerald-500/20 text-emerald-400';
    if (painLevel <= 6) return 'bg-amber-500/20 text-amber-400';
    return 'bg-orange-500/20 text-orange-400';
  });

  // Style display: only show if exists and not "not-sure"
  const displayStyle = $derived.by(() => {
    if (!selectedStyle || selectedStyle === 'not-sure') return null;
    return selectedStyle.charAt(0).toUpperCase() + selectedStyle.slice(1);
  });
</script>

<div
  class={cn('overflow-hidden shadow-md w-full z-20 bg-surface-900 border border-zinc-800 rounded-lg transition-[height] duration-300 ease-out')}
  style="height: {previewHeight}px;"
>
  <div class="relative h-full select-none">
    <!-- Background depth: subtle radial gradient -->
    <div
      class="absolute inset-0 z-0"
      style="background: radial-gradient(ellipse at center, rgba(255,255,255,0.03) 0%, transparent 70%);"
    ></div>

    <!-- 3D Model: full width hero background -->
    <div
      class="absolute inset-0 z-10 overflow-hidden"
    >
      {#if modelUrl}
        <div
          class="w-full h-full flex items-center justify-center"
        >
          <Human3DViewer
            {modelUrl}
            {isColor}
            {cameraFov}
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


    <!-- Flashing State Overlay (size=0, category+placement selected) -->
    {#if showFlashingState}
      <div class="absolute inset-0 flex flex-col items-center justify-center text-center z-20 p-3 bg-surface-900/70 backdrop-blur-sm">
        <p class="text-[9px] text-zinc-400 uppercase tracking-wider mb-0.5">
          {selectedCategory}
        </p>
        <h3 class="text-lg sm:text-2xl font-extrabold text-white">
          {currentPlacement}
        </h3>
        <p class="mt-2 text-xs sm:text-sm text-zinc-400">Select a size to continue</p>
      </div>
    {/if}

    <!-- Initial Overlay Prompt (no placement selected) -->
    {#if !hasRequiredInfoForOverlay}
      <div class="absolute inset-0 flex items-center justify-center z-30 bg-surface-900/70 backdrop-blur-sm">
        <div class="text-center p-4">
          <p class="font-semibold text-lg sm:text-2xl uppercase tracking-[0.3rem] sm:tracking-[0.5rem] text-white">YOUR TATTOO</p>
          <p class="text-sm sm:text-xl text-zinc-400 mt-1">Choose a body region to see it on the 3D model</p>
        </div>
      </div>
    {/if}
  </div>
</div>
