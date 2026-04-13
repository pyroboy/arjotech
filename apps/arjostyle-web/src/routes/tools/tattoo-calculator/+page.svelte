<script lang="ts">
  import TattooCalculator from '$lib/components/booking/TattooCalculator.svelte';
  import TattooPreviewInfo from '$lib/components/booking/TattooPreviewInfo.svelte';
  import { defaultBodyPartMappings } from '$lib/data/defaultMappings';
  import type { BodyPartMappings, BodyPartMappingData } from '$types/mapping';

  const PREVIEW_HEIGHT = 288;

  let size = $state(0);
  let isColor = $state(false);
  let selectedCategory = $state('');
  let placementIndex = $state(0);
  let currentPlacement = $state<string | null>(null);
  let isCoverUp = $state(false);
  let painLevel = $state(0);
  let painReason = $state<string | undefined>(undefined);
  let estimatedPrice = $state<number | undefined>(undefined);
  let estimatedDuration = $state<number | undefined>(undefined);
  let complexity = $state(0);
  let previewExpanded = $state(true);

  function handleCalculatorChange(values: {
    size: number;
    isColor: boolean;
    selectedCategory: string;
    placementIndex: number;
    currentPlacement: string | null;
    painLevel: number | null;
    painReason?: string;
    isCoverUp: boolean;
    pricing: { total: number };
    estimatedDurationMinutes: number;
    estimatedSessions: number;
    complexity: number;
    visualComplexityScore: number;
    sizeSliderTouched: boolean;
    placementSliderTouched: boolean;
  }) {
    size = values.size;
    isColor = values.isColor;
    selectedCategory = values.selectedCategory;
    placementIndex = values.placementIndex;
    currentPlacement = values.currentPlacement;
    isCoverUp = values.isCoverUp;
    painLevel = values.painLevel ?? 0;
    painReason = values.painReason;
    estimatedPrice = values.pricing.total;
    estimatedDuration = values.estimatedDurationMinutes;
    complexity = values.complexity;
  }

  function handleMappingUpdate(_category: string, _placement: string, _update: Partial<BodyPartMappingData>) {
    // no-op for standalone tool page
  }

  const priceTierLevel = $derived(
    complexity <= 0 ? 1 : complexity <= 1 ? 2 : complexity <= 2 ? 3 : 4
  );
</script>

<svelte:head>
  <title>Tattoo Calculator — ArjoStyle</title>
  <meta
    name="description"
    content="Interactive 3D tattoo calculator with body placement, real-time pricing, pain level indicators, and session estimates. Plan your tattoo before booking."
  />
</svelte:head>

<div class="min-h-screen pt-20 pb-16 px-4 md:px-8" style="background-color: var(--bg-dark);">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-10 text-center">
      <div class="mb-4">
        <a href="/tools" class="text-mono-label hover:text-ink transition-colors">← ALL TOOLS</a>
      </div>
      <p class="text-mono-label mb-3">BUSINESS CALCULATOR</p>
      <h1 class="font-display text-display-sm md:text-display-md text-white mb-3 tracking-wide">
        TATTOO CALCULATOR
      </h1>
      <p class="text-sm max-w-2xl mx-auto" style="color: var(--text-secondary);">
        Interactive 3D body placement with real-time pricing. Plan your tattoo before booking.
      </p>
    </div>

    <!-- Main Content: Preview + Calculator -->
    <div class="grid lg:grid-cols-5 gap-8 mb-16">
      <!-- Preview Panel -->
      <div class="lg:col-span-2">
        <div class="sticky top-24 brutal-card overflow-hidden">
          <TattooPreviewInfo
            modelId="default"
            {selectedCategory}
            {currentPlacement}
            {isColor}
            {painLevel}
            {painReason}
            {size}
            {priceTierLevel}
            {estimatedPrice}
            {estimatedDuration}
            selectedStyle={null}
            previewHeight={PREVIEW_HEIGHT}
            isMiniMode={false}
            onToggleExpand={() => { previewExpanded = !previewExpanded; }}
            editMode={false}
            liveMappings={defaultBodyPartMappings}
            onMappingUpdate={handleMappingUpdate}
          />
        </div>
      </div>

      <!-- Calculator Panel -->
      <div class="lg:col-span-3">
        <div class="brutal-card p-6">
          <TattooCalculator
            bodyPartMappings={defaultBodyPartMappings}
            onchange={handleCalculatorChange}
          />
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="text-center pt-8" style="border-top: 1px solid var(--border);">
      <h2 class="font-display text-2xl text-white mb-3">READY TO BOOK?</h2>
      <p class="mb-6 max-w-lg mx-auto text-sm" style="color: var(--text-secondary);">
        Use the streamlined booking flow to submit your tattoo inquiry. I'll review and confirm pricing during consultation.
      </p>
      <a
        href="/book"
        class="brutal-btn brutal-btn-primary"
      >
        BOOK A SESSION →
      </a>
    </div>

    <!-- Footer -->
    <div class="mt-12 pt-8 text-center" style="border-top: 1px solid var(--border);">
      <a href="/tools" class="text-mono-label hover:text-ink transition-colors">
        Part of ArjoStyle Free Tools →
      </a>
    </div>
  </div>
</div>
