<script lang="ts">
  import { bookingStore } from '$lib/stores/booking.svelte';
  import TattooDesignStep from './steps/TattooDesignStep.svelte';
  import ContactScheduleStep from './steps/ContactScheduleStep.svelte';
  import ReviewStep from './steps/ReviewStep.svelte';
  import TattooPreviewInfo from '$components/booking/TattooPreviewInfo.svelte';
  import { ChevronLeft, ChevronRight } from 'lucide-svelte';

  interface Props {
    onClose?: () => void;
  }

  let { onClose = () => {} }: Props = $props();

  const store = bookingStore;

  let contentEl: HTMLDivElement;

  let wrapperEl: HTMLDivElement;

  // TattooPreviewInfo state — compact on mobile, full on desktop
  // Tap to toggle between mini (150px) and expanded (300px) on mobile
  let innerWidth = $state(typeof window !== 'undefined' ? window.innerWidth : 640);
  let isPreviewExpanded = $state(false);
  const PREVIEW_HEIGHT = $derived(
    innerWidth < 640
      ? (isPreviewExpanded ? 300 : 150)
      : 288
  );

  const showPreview = $derived(store.currentStepIndex >= 0 && store.currentStepIndex <= 2);

  // Zoom control via camera FOV
  let cameraFov = $state(45);
  const MIN_FOV = 15;
  const MAX_FOV = 75;

  function togglePreviewExpand() {
    isPreviewExpanded = !isPreviewExpanded;
  }

  function zoomIn() {
    cameraFov = Math.max(MIN_FOV, cameraFov - 10);
  }

  function zoomOut() {
    cameraFov = Math.min(MAX_FOV, cameraFov + 10);
  }

  // --- Slide transition direction ---
  let transitionDirection = $state<'left' | 'right'>('left');

  // --- Step completion mini-celebration ---
  let showStepComplete = $state(false);
  let completedStepIndex = $state(-1);

  // --- Step change: scroll to top ---
  let lastStepIndex = -1;
  $effect(() => {
    const idx = store.currentStepIndex;
    if (idx !== lastStepIndex) {
      lastStepIndex = idx;
      if (contentEl) {
        setTimeout(() => contentEl?.scrollTo({ top: 0 }), 320);
      }
    }
  });

  // Wrap store.changeStep to add direction tracking + celebration
  function handleChangeStep(newIndex: number) {
    if (newIndex > store.currentStepIndex) {
      transitionDirection = 'left';
      // Trigger celebration for the step we're leaving (it's now complete)
      completedStepIndex = store.currentStepIndex;
      showStepComplete = true;
      setTimeout(() => {
        showStepComplete = false;
      }, 800);
    } else {
      transitionDirection = 'right';
    }
    store.changeStep(newIndex);
  }

  function handleSubmitSuccess() {
    store.reset();
    onClose();
  }

  function handleBookAnother() {
    store.reset();
  }

  // Step labels for progress bar
  const steps = store.steps;

  // Abbreviated labels for mobile
  const mobileLabels = ['Tattoo', 'Book', 'Review'];
</script>

<style>
  @keyframes scaleIn {
    0% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1.2); }
    100% { transform: scale(1); opacity: 1; }
  }
</style>

<svelte:window bind:innerWidth={innerWidth} />

<div bind:this={wrapperEl} class="flex flex-col h-[100dvh] sm:h-full sm:max-h-[90vh] bg-surface-900">
  <!-- Header -->
  <div class="relative z-50 flex-shrink-0 border-b border-zinc-800 px-4 sm:px-6 py-2 sm:py-4">
    <div class="flex items-center justify-center relative">
      <img
        src="https://res.cloudinary.com/dexcw6vg0/image/upload/v1744505507/usvdknljttntfwcjzujg.webp"
        alt="Logo"
        class="absolute left-1 sm:left-2 h-6 sm:h-12 w-auto"
      />
      <div class="text-center leading-[1]">
        <span class="text-base sm:text-4xl font-bold uppercase tracking-[0.25em] text-white">
          <span class="text-[1.2em]">A</span>RJO<span class="text-[1.2em]">S</span>TYLE
        </span>
        <br />
        <span class="text-base sm:text-4xl font-light uppercase tracking-[0.6em] text-white">TATTOO</span>
      </div>
    </div>
  </div>

  <!-- Progress bar — compact, no labels -->
  <div class="relative z-40 flex-shrink-0 px-4 sm:px-6 py-1.5 border-b border-zinc-800">
    <div class="flex gap-1 h-2 items-center">
      {#each steps as step, i}
        {@const isClickable = i <= store.maxAllowedStep}
        {@const isCompleted = i < store.currentStepIndex && store.isStepComplete(i, store.formData)}
        {@const isActive = i === store.currentStepIndex}
        {@const justCompleted = showStepComplete && i === completedStepIndex}
        <button
          class="relative flex-1 h-2 rounded-full transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-ink-500
            {isActive ? 'bg-ink-500 shadow-[0_0_8px_rgba(234,88,12,0.4)]' : isCompleted ? 'bg-ink-500/60' : 'bg-zinc-800/40'}
            {isClickable ? 'cursor-pointer hover:bg-ink-500/60' : 'cursor-not-allowed opacity-50'}"
          disabled={!isClickable || store.isTransitioning}
          onclick={() => isClickable && handleChangeStep(i)}
          title={step.title + (isClickable ? '' : ' (Complete previous steps)')}
          aria-label="Step {i + 1}: {step.title}{isClickable ? '' : ' - Disabled'}"
        >
          {#if justCompleted}
            <span
              class="absolute inset-0 flex items-center justify-center text-[7px] font-bold text-white"
              style="animation: scaleIn 0.3s ease-out forwards;"
            >&#10003;</span>
          {/if}
        </button>
      {/each}
    </div>
  </div>

  <!-- Preview: Persistent 3D model — toggle button for expand/collapse, OrbitControls work freely -->
  {#if showPreview}
    <div
      class="relative z-20 flex-shrink-0 overflow-hidden transition-[height] duration-300 ease-out"
      style="height: {PREVIEW_HEIGHT}px;"
    >
      <!-- 3 icons bottom-right: expand/minimize + zoom in + zoom out (YouTube-style) -->
      <div class="absolute bottom-2 right-2 z-30 sm:hidden flex flex-col gap-1">
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg bg-black/50 text-white/70 hover:text-white transition-colors active:scale-90"
          onclick={zoomIn}
          disabled={cameraFov <= MIN_FOV}
          aria-label="Zoom in"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg bg-black/50 text-white/70 hover:text-white transition-colors active:scale-90"
          onclick={zoomOut}
          disabled={cameraFov >= MAX_FOV}
          aria-label="Zoom out"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="5" y1="12" x2="19" y2="12"/></svg>
        </button>
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg bg-black/50 text-white/70 hover:text-white transition-colors active:scale-90"
          onclick={togglePreviewExpand}
          aria-label={isPreviewExpanded ? 'Minimize' : 'Expand'}
        >
          {#if isPreviewExpanded}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="4 14 10 14 10 20"/><polyline points="20 10 14 10 14 4"/><line x1="14" y1="10" x2="21" y2="3"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
          {:else}
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/></svg>
          {/if}
        </button>
      </div>
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
        previewHeight={PREVIEW_HEIGHT}
        {cameraFov}
        isMiniMode={false}
        onToggleExpand={togglePreviewExpand}
        editMode={false}
        liveMappings={store.liveBodyPartMappings}
        onMappingUpdate={(category, placement, update) => store.updateMapping(category, placement, update)}
      />
    </div>
  {/if}

  <!-- Step content -->
  <div
    bind:this={contentEl}
    style="scroll-snap-type: y proximity;"
    class="relative z-10 flex-1 overflow-y-auto px-4 sm:px-6 pb-6 transition-all duration-300 ease-out
      {store.isTransitioning
        ? transitionDirection === 'left'
          ? 'opacity-0 -translate-x-5'
          : 'opacity-0 translate-x-5'
        : 'opacity-100 translate-x-0'}"
  >
    {#if store.currentStepIndex === 0}
      <TattooDesignStep formData={store.formData} updateFormData={(d) => store.updateFormData(d)} />
    {:else if store.currentStepIndex === 1}
      <ContactScheduleStep formData={store.formData} updateFormData={(d) => store.updateFormData(d)} />
    {:else if store.currentStepIndex === 2}
      <ReviewStep formData={store.formData} updateFormData={(d) => store.updateFormData(d)} onSubmitSuccess={handleSubmitSuccess} onBookAnother={handleBookAnother} onEditStep={(step) => handleChangeStep(step)} />
    {/if}
  </div>

  <!-- Nav buttons (fixed at bottom of flex column) -->
  <div class="relative z-50 flex-shrink-0 flex justify-between py-3 px-4 sm:px-6 bg-surface-900 border-t border-zinc-800 shadow-[0_-4px_12px_rgba(0,0,0,0.3)]">
    <button
      class="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-700 text-zinc-300 hover:border-zinc-500 transition-colors text-sm sm:text-base disabled:opacity-50 focus:ring-2 focus:ring-zinc-500/50 focus:ring-offset-2 focus:ring-offset-surface-900"
      disabled={store.isTransitioning}
      onclick={() => {
        if (store.currentStepIndex === 0) {
          onClose();
        } else {
          handleChangeStep(store.currentStepIndex - 1);
        }
      }}
      aria-label={store.currentStepIndex === 0 ? 'Close booking' : 'Previous step'}
    >
      <ChevronLeft size={16} />
      {store.currentStepIndex === 0 ? 'Cancel' : 'Previous'}
    </button>

    {#if store.currentStepIndex < steps.length - 1}
      <button
        class="flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl font-medium text-sm sm:text-base transition-all
          bg-ink-500 text-white hover:bg-ink-400
          {!store.canProceed ? 'opacity-50 cursor-not-allowed' : ''}
          disabled:opacity-50 disabled:cursor-not-allowed focus:ring-2 focus:ring-ink-500/50 focus:ring-offset-2 focus:ring-offset-surface-900"
        disabled={store.isTransitioning || !store.canProceed}
        onclick={() => {
          if (store.canProceed && store.currentStepIndex < steps.length - 1) {
            handleChangeStep(store.currentStepIndex + 1);
          }
        }}
        title={!store.canProceed ? 'Please complete the required fields for this step' : 'Go to next step'}
      >
        Next
        <ChevronRight size={16} />
      </button>
    {/if}
  </div>
</div>
