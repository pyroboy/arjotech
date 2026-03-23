<script lang="ts">
  import { bookingStore } from '$lib/stores/booking.svelte';
  import AgeVerificationStep from './steps/AgeVerificationStep.svelte';
  import TattooCalculator from '$components/booking/TattooCalculator.svelte';
  import TattooPreviewInfo from '$components/booking/TattooPreviewInfo.svelte';
  import ReferenceStep from './steps/ReferenceStep.svelte';
  import PersonalInfoStep from './steps/PersonalInfoStep.svelte';
  import SchedulingStep from './steps/SchedulingStep.svelte';
  import ReviewStep from './steps/ReviewStep.svelte';
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';
  import type { BodyPartMappingData } from '$types/mapping';

  interface Props {
    onClose?: () => void;
  }

  let { onClose = () => {} }: Props = $props();

  const store = bookingStore;

  let contentEl: HTMLDivElement;

  let wrapperEl: HTMLDivElement;

  // TattooPreviewInfo state — GPU-only transform:scale() approach
  const SCROLL_RANGE = 150;
  const FULL_HEIGHT = 288;
  const MINI_HEIGHT = 80;
  const SCALE_MIN = MINI_HEIGHT / FULL_HEIGHT; // ~0.278

  let scrollProgress = $state(0); // 0 = full, 1 = mini
  let isExpanded = $state(true); // for click toggle

  const isOnStep1 = $derived(store.currentStepIndex === 1);
  const showPreview = $derived(store.currentStepIndex >= 1 && store.currentStepIndex <= 5);

  // Derived scale for CSS transform
  const previewScale = $derived(isExpanded ? 1 - scrollProgress * (1 - SCALE_MIN) : SCALE_MIN);
  const isMiniMode = $derived(previewScale <= SCALE_MIN + 0.02);

  function togglePreviewExpand() {
    isExpanded = !isExpanded;
  }

  function handleMappingUpdate(category: string, placement: string, update: Partial<BodyPartMappingData>) {
    store.updateMapping(category, placement, update);
  }

  // --- Scroll handler: passive, rAF-throttled, updates only a 0-1 number ---
  let scrollRaf: number | null = null;
  function handleContentScroll() {
    if (scrollRaf !== null) return;
    scrollRaf = requestAnimationFrame(() => {
      scrollRaf = null;
      if (!contentEl || !isOnStep1) return;
      scrollProgress = Math.min(1, Math.max(0, contentEl.scrollTop / SCROLL_RANGE));
    });
  }

  // --- Attach/detach scroll listener on Step 1 ---
  $effect(() => {
    if (isOnStep1 && contentEl) {
      scrollProgress = 0;
      isExpanded = true;
      contentEl.addEventListener('scroll', handleContentScroll, { passive: true });
      return () => {
        contentEl.removeEventListener('scroll', handleContentScroll);
        if (scrollRaf !== null) { cancelAnimationFrame(scrollRaf); scrollRaf = null; }
      };
    }
  });

  // --- Step change: reset scroll + expand state ---
  let lastStepIndex = -1;
  $effect(() => {
    const idx = store.currentStepIndex;
    if (idx !== lastStepIndex) {
      const prevIdx = lastStepIndex;
      lastStepIndex = idx;
      if (idx === 1) { scrollProgress = 0; isExpanded = true; }
      else if (prevIdx === 1) isExpanded = false;
      if (contentEl) {
        setTimeout(() => contentEl.scrollTo({ top: 0 }), 170);
      }
    }
  });

  function handleSubmitSuccess() {
    store.reset();
    onClose();
  }

  // Step labels for progress bar
  const steps = store.steps;
</script>

<div bind:this={wrapperEl} class="flex flex-col h-full max-h-[90vh] bg-surface-900">
  <!-- Header -->
  <div class="relative z-50 flex-shrink-0 border-b border-zinc-800 px-4 sm:px-6 py-4">
    <div class="flex items-center justify-center relative">
      <img
        src="https://res.cloudinary.com/dexcw6vg0/image/upload/v1744505507/usvdknljttntfwcjzujg.webp"
        alt="Logo"
        class="absolute left-1 sm:left-2 h-8 sm:h-12 w-auto"
      />
      <div class="text-center leading-[1]">
        <span class="text-xl sm:text-4xl font-bold uppercase tracking-[0.25em] text-white">
          <span class="text-[1.2em]">A</span>RJO<span class="text-[1.2em]">S</span>TYLE
        </span>
        <br />
        <span class="text-xl sm:text-4xl font-light uppercase tracking-[0.6em] text-white">TATTOO</span>
      </div>
    </div>
  </div>

  <!-- Progress bar -->
  <div class="relative z-40 flex-shrink-0 px-4 sm:px-6 py-3 border-b border-zinc-800">
    <div class="flex gap-1 h-3 items-center">
      {#each steps as step, i}
        {@const isClickable = i <= store.maxAllowedStep}
        {@const isCompleted = i < store.currentStepIndex && store.isStepComplete(i, store.formData)}
        {@const isActive = i === store.currentStepIndex}
        <button
          class="flex-1 h-3 rounded-full transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-ink-500
            {isActive ? 'bg-ink-500' : isCompleted ? 'bg-ink-500/50' : 'bg-zinc-800/40'}
            {isClickable ? 'cursor-pointer hover:bg-ink-500/60' : 'cursor-not-allowed opacity-50'}"
          disabled={!isClickable || store.isTransitioning}
          onclick={() => isClickable && store.changeStep(i)}
          title={step.title + (isClickable ? '' : ' (Complete previous steps)')}
          aria-label="Step {i + 1}: {step.title}{isClickable ? '' : ' - Disabled'}"
        ></button>
      {/each}
    </div>
    <div class="hidden sm:flex justify-between text-xs text-zinc-500 mt-1">
      {#each steps as step, i}
        {@const isClickable = i <= store.maxAllowedStep}
        <span class="flex-1 text-center truncate px-1 transition-opacity {!isClickable ? 'opacity-50' : ''}">{step.title}</span>
      {/each}
    </div>
  </div>

  <!-- Step content -->
  <div
    bind:this={contentEl}
    class="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 pb-6 transition-all duration-150
      {store.isTransitioning ? 'opacity-0' : 'opacity-100'}"
  >
    {#if showPreview}
      <div
        class="sticky top-0 z-20 -mx-4 sm:-mx-6 will-change-transform"
        style="height: {FULL_HEIGHT}px; transform: scale({previewScale}); transform-origin: top left; margin-bottom: -{(1 - previewScale) * FULL_HEIGHT}px;{isExpanded ? '' : ' transition: transform 200ms ease-out, margin-bottom 200ms ease-out;'}"
      >
        <TattooPreviewInfo
          modelId="default-human"
          selectedCategory={store.formData.selectedCategory ?? null}
          currentPlacement={store.formData.currentPlacement ?? null}
          isColor={store.formData.isColor}
          painLevel={store.formData.painLevel ?? 1}
          painReason={store.formData.painReason}
          size={store.formData.size ?? undefined}
          priceTierLevel={store.formData.visualComplexityScore ?? 1}
          estimatedPrice={store.formData.pricing?.total}
          estimatedDuration={store.formData.estimatedDurationMinutes}
          selectedStyle={store.formData.primaryTattooStyle ?? null}
          previewHeight={FULL_HEIGHT}
          {isMiniMode}
          onToggleExpand={togglePreviewExpand}
          editMode={false}
          liveMappings={store.liveBodyPartMappings}
          onMappingUpdate={handleMappingUpdate}
        />
      </div>
    {/if}

    {#if store.currentStepIndex === 0}
      <AgeVerificationStep formData={store.formData} updateFormData={(d) => store.updateFormData(d)} />
    {:else if store.currentStepIndex === 1}
      <TattooCalculator
        bodyPartMappings={store.liveBodyPartMappings}
        modelUrl="https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/male_low_poly_human_body_jtzm1e.glb"
        initialValues={{
          size: store.formData.size ?? 0,
          isColor: store.formData.isColor,
          selectedCategory: store.formData.selectedCategory ?? '',
          placementIndex: store.formData.placementIndex,
          isCoverUp: store.formData.isCoverUp,
          sizeSliderTouched: store.formData.sizeSliderTouched,
          placementSliderTouched: store.formData.placementSliderTouched,
        }}
        onchange={(data) => {
          const { painLevel, ...rest } = data;
          store.updateFormData({ ...rest, painLevel: painLevel ?? undefined });
        }}
      />
    {:else if store.currentStepIndex === 2}
      <ReferenceStep
        formData={store.formData}
        updateFormData={(d) => store.updateFormData(d)}
      />
    {:else if store.currentStepIndex === 3}
      <PersonalInfoStep formData={store.formData} updateFormData={(d) => store.updateFormData(d)} />
    {:else if store.currentStepIndex === 4}
      <SchedulingStep formData={store.formData} updateFormData={(d) => store.updateFormData(d)} />
    {:else if store.currentStepIndex === 5}
      <ReviewStep
        formData={store.formData}
        updateFormData={(d) => store.updateFormData(d)}
        onSubmitSuccess={handleSubmitSuccess}
      />
    {/if}
  </div>

  <!-- Nav buttons (fixed at bottom of flex column) -->
  <div class="relative z-50 flex-shrink-0 flex justify-between py-3 px-4 sm:px-6 bg-surface-900 border-t border-zinc-800 shadow-[0_-4px_12px_rgba(0,0,0,0.3)]">
    <button
      class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:border-zinc-500 transition-colors text-sm sm:text-base disabled:opacity-50"
      disabled={store.isTransitioning}
      onclick={() => store.previous(onClose)}
      aria-label={store.currentStepIndex === 0 ? 'Close booking' : 'Previous step'}
    >
      <ChevronLeft size={16} />
      {store.currentStepIndex === 0 ? 'Cancel' : 'Previous'}
    </button>

    {#if store.currentStepIndex < steps.length - 1}
      <button
        class="flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-medium text-sm sm:text-base transition-all
          {store.currentStepIndex === 0
            ? 'bg-[#ffaa00] text-black hover:bg-yellow-600 font-bold'
            : 'bg-ink-500 text-white hover:bg-ink-400'}
          {!store.canProceed ? 'opacity-50 cursor-not-allowed' : ''}
          disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={store.isTransitioning || !store.canProceed}
        onclick={() => store.next()}
        title={!store.canProceed ? 'Please complete the required fields for this step' : 'Go to next step'}
      >
        {store.currentStepIndex === 0 ? 'I am 18 or Older - Enter' : 'Next'}
        {#if store.currentStepIndex > 0}
          <ChevronRight size={16} />
        {/if}
      </button>
    {/if}
  </div>
</div>
