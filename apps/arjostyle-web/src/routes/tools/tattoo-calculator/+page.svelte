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

<div class="min-h-screen bg-surface-900 pt-20 pb-16 px-4 md:px-8">
  <div class="max-w-6xl mx-auto">
    <!-- Header -->
    <div class="mb-10 text-center">
      <div class="inline-block mb-4">
        <span class="px-3 py-1 text-xs font-medium rounded-full bg-zinc-800 text-zinc-400 border border-zinc-700/50">
          Legacy Tool — Now part of the streamlined booking flow
        </span>
      </div>
      <h1 class="text-4xl md:text-5xl font-bold text-white mb-3">Tattoo Calculator</h1>
      <p class="text-zinc-400 text-lg max-w-2xl mx-auto">
        Interactive 3D body placement with real-time pricing
      </p>
    </div>

    <!-- Main Content: Preview + Calculator -->
    <div class="grid lg:grid-cols-5 gap-8 mb-16">
      <!-- Preview Panel -->
      <div class="lg:col-span-2">
        <div class="sticky top-24">
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg overflow-hidden">
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
      </div>

      <!-- Calculator Panel -->
      <div class="lg:col-span-3">
        <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-lg p-6">
          <TattooCalculator
            bodyPartMappings={defaultBodyPartMappings}
            onchange={handleCalculatorChange}
          />
        </div>
      </div>
    </div>

    <!-- CTA Section -->
    <div class="text-center pt-8 border-t border-zinc-700/50">
      <h2 class="text-2xl font-bold text-white mb-3">Ready to book?</h2>
      <p class="text-zinc-400 mb-6 max-w-lg mx-auto">
        Use the streamlined booking flow to submit your tattoo inquiry. I'll review and confirm pricing during consultation.
      </p>
      <a
        href="/book"
        class="inline-flex items-center gap-2 px-8 py-3 bg-orange-500 text-white font-semibold rounded-lg hover:bg-orange-600 transition-all duration-200 transform hover:scale-105"
      >
        Book a Session →
      </a>
    </div>

    <!-- Footer -->
    <div class="mt-12 pt-8 border-t border-zinc-700/50 text-center text-xs text-zinc-500">
      <a href="/tools" class="hover:text-zinc-400 transition-colors">
        Part of ArjoStyle Free Tools →
      </a>
    </div>
  </div>
</div>
