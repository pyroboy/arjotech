<script lang="ts">
  import { bookingStore } from '$lib/stores/booking.svelte';
  import Human3DViewer from '$lib/components/three/Human3DViewer.svelte';
  import type { BodyPartMappingData } from '$types/mapping';
  import { Save, RotateCcw, Eye, Crosshair, Move3d, Gauge, Ruler } from 'lucide-svelte';
  import { defaultBodyPartMappings } from '$lib/data/defaultMappings';

  // State
  let selectedCategory = $state('');
  let selectedPlacement = $state('');
  let showSaveSuccess = $state(false);
  let isSaving = $state(false);

  // Derived state
  let categories = $derived(Object.keys(bookingStore.liveBodyPartMappings));
  let placements = $derived(
    selectedCategory ? Object.keys(bookingStore.liveBodyPartMappings[selectedCategory] || {}).sort() : []
  );
  let currentData = $derived(
    selectedCategory && selectedPlacement
      ? bookingStore.liveBodyPartMappings[selectedCategory]?.[selectedPlacement] ?? null
      : null
  );

  // Helper function for pain level color
  function getPainLevelColor(level: number): string {
    if (level <= 3) return 'bg-green-500/20 border-green-500/50 text-green-300';
    if (level <= 6) return 'bg-yellow-500/20 border-yellow-500/50 text-yellow-300';
    if (level <= 8) return 'bg-orange-500/20 border-orange-500/50 text-orange-300';
    return 'bg-red-500/20 border-red-500/50 text-red-300';
  }

  function getPainLevelLabel(level: number): string {
    if (level <= 3) return 'Low';
    if (level <= 6) return 'Medium';
    if (level <= 8) return 'High';
    return 'Extreme';
  }

  // Update field handler
  function updateField(field: string, value: any) {
    if (!selectedCategory || !selectedPlacement) return;

    bookingStore.editMode = true;
    const mappings = structuredClone(bookingStore.liveBodyPartMappings);
    const data = mappings[selectedCategory][selectedPlacement];

    // Handle nested fields
    if (field.startsWith('position.')) {
      const idx = parseInt(field.split('.')[1]);
      data.position[idx] = parseFloat(value);
    } else if (field.startsWith('placementSizeLimits.')) {
      const key = field.split('.')[1];
      if (!data.placementSizeLimits) {
        data.placementSizeLimits = { min: 0.5, max: 12, multiplier: 1 };
      }
      data.placementSizeLimits[key as keyof typeof data.placementSizeLimits] = parseFloat(value);
    } else if (field.startsWith('placementPainInfo.')) {
      const key = field.split('.')[1];
      if (!data.placementPainInfo) {
        data.placementPainInfo = { level: 1, reason: '' };
      }
      if (key === 'level') {
        data.placementPainInfo.level = Math.max(1, Math.min(10, parseInt(value)));
      } else {
        (data.placementPainInfo as any)[key] = value;
      }
    } else {
      (data as any)[field] = parseFloat(value);
    }

    bookingStore.liveBodyPartMappings = mappings;
  }

  // Save to database (placeholder)
  async function handleSave() {
    isSaving = true;
    try {
      // Placeholder: just log for now
      console.log('Saving body part mappings:', bookingStore.liveBodyPartMappings);

      // TODO: Call API endpoint when available
      // const response = await fetch('/api/admin/mappings', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(bookingStore.liveBodyPartMappings)
      // });

      // if (!response.ok) throw new Error('Failed to save');

      showSaveSuccess = true;
      setTimeout(() => {
        showSaveSuccess = false;
      }, 3000);
    } catch (error) {
      console.error('Save error:', error);
      alert('Failed to save mappings');
    } finally {
      isSaving = false;
    }
  }

  // Reset to defaults
  function handleReset() {
    if (confirm('Reset all mappings to defaults? This cannot be undone.')) {
      bookingStore.liveBodyPartMappings = structuredClone(defaultBodyPartMappings);
      bookingStore.editMode = false;
      selectedCategory = '';
      selectedPlacement = '';
    }
  }

  // Initialize first category
  $effect(() => {
    if (categories.length > 0 && !selectedCategory) {
      selectedCategory = categories[0];
    }
  });

  // Reset placement when category changes
  $effect(() => {
    if (selectedCategory && !placements.includes(selectedPlacement)) {
      selectedPlacement = placements[0] || '';
    }
  });
</script>

<svelte:head>
  <title>3D Model Mapping — Admin</title>
</svelte:head>

<div class="flex h-[calc(100vh-0px)] bg-surface-900">
  <!-- Left Sidebar -->
  <div class="w-96 overflow-y-auto bg-surface-800 border-r border-zinc-800 p-6 flex flex-col">
    <!-- Header -->
    <div class="mb-6">
      <h1 class="text-xl font-bold text-white mb-1">Model Mapping Editor</h1>
      <p class="text-xs text-zinc-500">Edit 3D body part positions and settings</p>
    </div>

    <!-- Section 1: Category & Placement Selection -->
    <div class="mb-6 pb-6 border-b border-zinc-700">
      <div class="mb-4">
        <label for="category" class="block text-sm font-medium text-zinc-300 mb-2">Body Category</label>
        <select
          id="category"
          bind:value={selectedCategory}
          class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm w-full focus:border-ink-500 focus:outline-none transition-colors"
        >
          {#each categories as cat}
            <option value={cat}>{cat}</option>
          {/each}
        </select>
      </div>

      <div>
        <label for="placement" class="block text-sm font-medium text-zinc-300 mb-2">Placement</label>
        <select
          id="placement"
          bind:value={selectedPlacement}
          class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2.5 text-white text-sm w-full focus:border-ink-500 focus:outline-none transition-colors"
        >
          {#each placements as place}
            <option value={place}>{place}</option>
          {/each}
        </select>
      </div>
    </div>

    <!-- Section 2: Position & Scale -->
    {#if currentData}
      <div class="mb-6 pb-6 border-b border-zinc-700">
        <div class="flex items-center gap-2 mb-4">
          <Move3d size={16} class="text-ink-500" />
          <h3 class="text-sm font-semibold text-white">3D Position</h3>
        </div>

        <div class="grid grid-cols-3 gap-2 mb-4">
          <div>
            <label class="block text-xs text-zinc-500 mb-1">X</label>
            <input
              type="number"
              step="0.001"
              value={currentData.position[0]}
              onchange={(e) => updateField('position.0', e.currentTarget.value)}
              class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm w-full focus:border-ink-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label class="block text-xs text-zinc-500 mb-1">Y</label>
            <input
              type="number"
              step="0.001"
              value={currentData.position[1]}
              onchange={(e) => updateField('position.1', e.currentTarget.value)}
              class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm w-full focus:border-ink-500 focus:outline-none transition-colors"
            />
          </div>
          <div>
            <label class="block text-xs text-zinc-500 mb-1">Z</label>
            <input
              type="number"
              step="0.001"
              value={currentData.position[2]}
              onchange={(e) => updateField('position.2', e.currentTarget.value)}
              class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm w-full focus:border-ink-500 focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <label class="block text-xs text-zinc-500 mb-1">Scale</label>
          <input
            type="number"
            step="0.01"
            value={currentData.scale}
            onchange={(e) => updateField('scale', e.currentTarget.value)}
            class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm w-full focus:border-ink-500 focus:outline-none transition-colors"
          />
        </div>
      </div>

      <!-- Section 3: Camera Settings -->
      <div class="mb-6 pb-6 border-b border-zinc-700">
        <div class="flex items-center gap-2 mb-4">
          <Eye size={16} class="text-tech-500" />
          <h3 class="text-sm font-semibold text-white">Camera View</h3>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs text-zinc-500 mb-1">Azimuth</label>
            <input
              type="number"
              step="0.01"
              value={currentData.cameraAzimuth ?? 0}
              onchange={(e) => updateField('cameraAzimuth', e.currentTarget.value)}
              class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm w-full focus:border-ink-500 focus:outline-none transition-colors"
            />
            <p class="text-xs text-zinc-600 mt-1">Horizontal rotation (radians)</p>
          </div>

          <div>
            <label class="block text-xs text-zinc-500 mb-1">Polar</label>
            <input
              type="number"
              step="0.01"
              value={currentData.cameraPolar ?? 1.57}
              onchange={(e) => updateField('cameraPolar', e.currentTarget.value)}
              class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm w-full focus:border-ink-500 focus:outline-none transition-colors"
            />
            <p class="text-xs text-zinc-600 mt-1">Vertical rotation (radians)</p>
          </div>

          <div>
            <label class="block text-xs text-zinc-500 mb-1">Distance</label>
            <input
              type="number"
              step="0.01"
              value={currentData.cameraDistance ?? 1}
              onchange={(e) => updateField('cameraDistance', e.currentTarget.value)}
              class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm w-full focus:border-ink-500 focus:outline-none transition-colors"
            />
            <p class="text-xs text-zinc-600 mt-1">Distance from target</p>
          </div>
        </div>
      </div>

      <!-- Section 4: Pain Level -->
      <div class="mb-6 pb-6 border-b border-zinc-700">
        <div class="flex items-center gap-2 mb-4">
          <Gauge size={16} class="text-red-500" />
          <h3 class="text-sm font-semibold text-white">Pain Info</h3>
        </div>

        <div class="mb-3">
          <label class="block text-xs text-zinc-500 mb-2">Pain Level (1-10)</label>
          <div class="flex items-center gap-3">
            <input
              type="number"
              min="1"
              max="10"
              value={currentData.placementPainInfo?.level ?? 1}
              onchange={(e) => updateField('placementPainInfo.level', e.currentTarget.value)}
              class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm flex-1 focus:border-ink-500 focus:outline-none transition-colors"
            />
            <div
              class={`px-3 py-2 rounded-lg border text-xs font-medium ${getPainLevelColor(
                currentData.placementPainInfo?.level ?? 1
              )}`}
            >
              {getPainLevelLabel(currentData.placementPainInfo?.level ?? 1)}
            </div>
          </div>
        </div>

        <div>
          <label class="block text-xs text-zinc-500 mb-1">Reason</label>
          <textarea
            rows="3"
            value={currentData.placementPainInfo?.reason ?? ''}
            onchange={(e) => updateField('placementPainInfo.reason', e.currentTarget.value)}
            class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm w-full focus:border-ink-500 focus:outline-none transition-colors resize-none"
            placeholder="Describe why this placement is painful..."
          />
        </div>
      </div>

      <!-- Section 5: Size Limits -->
      <div class="mb-6 pb-6 border-b border-zinc-700">
        <div class="flex items-center gap-2 mb-4">
          <Ruler size={16} class="text-tech-500" />
          <h3 class="text-sm font-semibold text-white">Size Limits</h3>
        </div>

        <div class="space-y-3">
          <div>
            <label class="block text-xs text-zinc-500 mb-1">Minimum Size (cm)</label>
            <input
              type="number"
              step="0.5"
              value={currentData.placementSizeLimits?.min ?? 0.5}
              onchange={(e) => updateField('placementSizeLimits.min', e.currentTarget.value)}
              class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm w-full focus:border-ink-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label class="block text-xs text-zinc-500 mb-1">Maximum Size (cm)</label>
            <input
              type="number"
              step="0.5"
              value={currentData.placementSizeLimits?.max ?? 12}
              onchange={(e) => updateField('placementSizeLimits.max', e.currentTarget.value)}
              class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm w-full focus:border-ink-500 focus:outline-none transition-colors"
            />
          </div>

          <div>
            <label class="block text-xs text-zinc-500 mb-1">Size Multiplier</label>
            <input
              type="number"
              step="0.1"
              value={currentData.placementSizeLimits?.multiplier ?? 1}
              onchange={(e) => updateField('placementSizeLimits.multiplier', e.currentTarget.value)}
              class="bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm w-full focus:border-ink-500 focus:outline-none transition-colors"
            />
            <p class="text-xs text-zinc-600 mt-1">Scaling factor for this placement</p>
          </div>
        </div>
      </div>
    {:else}
      <div class="flex items-center justify-center py-12 px-4 text-center border border-dashed border-zinc-700 rounded-lg bg-zinc-900/50">
        <div>
          <Crosshair size={32} class="mx-auto mb-2 text-zinc-600" />
          <p class="text-sm text-zinc-500">Select a category and placement to begin</p>
        </div>
      </div>

      <div class="flex-1" />
    {/if}

    <!-- Action Buttons -->
    <div class="pt-6 border-t border-zinc-700 space-y-2">
      {#if showSaveSuccess}
        <div class="bg-green-500/10 border border-green-500/50 rounded-lg px-3 py-2 text-xs text-green-300">
          ✓ Mappings saved successfully
        </div>
      {/if}

      <button
        onclick={handleSave}
        disabled={isSaving || !bookingStore.editMode}
        class="w-full flex items-center justify-center gap-2 bg-ink-500 hover:bg-ink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-2.5 px-3 rounded-lg transition-colors text-sm"
      >
        <Save size={16} />
        {isSaving ? 'Saving...' : 'Save to Database'}
      </button>

      <button
        onclick={handleReset}
        class="w-full flex items-center justify-center gap-2 bg-transparent border border-zinc-700 hover:border-zinc-600 hover:bg-zinc-800 text-zinc-300 hover:text-white font-medium py-2.5 px-3 rounded-lg transition-colors text-sm"
      >
        <RotateCcw size={16} />
        Reset to Defaults
      </button>
    </div>
  </div>

  <!-- Right side: 3D Viewer -->
  <div class="flex-1 relative bg-black">
    {#if selectedCategory && selectedPlacement}
      <Human3DViewer
        modelUrl="https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/male_low_poly_human_body_jtzm1e.glb"
        mapping={currentData}
        editMode={true}
        {selectedCategory}
        currentPlacement={selectedPlacement}
      />

      <!-- Overlay info badge -->
      {#if currentData}
        <div class="absolute top-4 left-4 bg-black/60 backdrop-blur-sm rounded-lg px-4 py-3 text-xs font-mono text-zinc-400 space-y-1">
          <p class="text-zinc-300 font-semibold">{selectedCategory} → {selectedPlacement}</p>
          <p>
            Pain: <span class="text-white">{currentData.placementPainInfo?.level ?? '?'}/10</span>
          </p>
          <p>
            Pos: <span class="text-white">[{currentData.position.map((n) => n.toFixed(3)).join(', ')}]</span>
          </p>
          <p>
            Scale: <span class="text-white">{currentData.scale.toFixed(3)}</span>
          </p>
        </div>
      {/if}
    {:else}
      <div class="flex items-center justify-center h-full">
        <div class="text-center">
          <Crosshair size={48} class="mx-auto mb-4 text-zinc-700" />
          <p class="text-lg text-zinc-600">Select a category and placement to begin editing</p>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  :global(input:focus, select:focus, textarea:focus) {
    outline: none;
    box-shadow: none;
  }
</style>
