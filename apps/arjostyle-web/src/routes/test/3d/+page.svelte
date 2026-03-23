<script lang="ts">
  import Human3DViewer from '$lib/components/three/Human3DViewer.svelte';
  import { defaultBodyPartMappings } from '$lib/data/defaultMappings';
  import type { BodyPartMappingData } from '$lib/types/mapping';

  const MODEL_URL = 'https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/male_low_poly_human_body_jtzm1e.glb';

  // Build category list from mappings
  const categories = Object.keys(defaultBodyPartMappings);

  let selectedCategory = $state(categories[0] ?? '');
  let selectedPlacement = $state('');
  let editMode = $state(false);
  let isColor = $state(true);
  let simulatedSize = $state(10);

  // Get placements for current category
  let placements = $derived.by(() => {
    if (!selectedCategory) return [];
    const cat = defaultBodyPartMappings[selectedCategory];
    return cat ? Object.keys(cat) : [];
  });

  // Auto-select first placement when category changes
  $effect(() => {
    if (placements.length > 0 && !placements.includes(selectedPlacement)) {
      selectedPlacement = placements[0];
    }
  });

  // Get current mapping data
  let currentMapping = $derived.by((): BodyPartMappingData | null => {
    if (!selectedCategory || !selectedPlacement) return null;
    return defaultBodyPartMappings[selectedCategory]?.[selectedPlacement] ?? null;
  });

  // Pain level color badge
  let painLevel = $derived(currentMapping?.placementPainInfo?.level ?? 0);
  let painColor = $derived.by(() => {
    if (painLevel <= 3) return 'bg-green-500';
    if (painLevel <= 6) return 'bg-yellow-500';
    return 'bg-red-500';
  });
</script>

<svelte:head>
  <title>3D Model Test | ArjoStyle</title>
</svelte:head>

<div class="min-h-screen bg-zinc-950 text-white">
  <!-- Header -->
  <div class="border-b border-zinc-800 bg-zinc-900/50 px-6 py-4">
    <h1 class="text-2xl font-bold">
      <span class="text-amber-500">3D Body Placement</span> Test Page
    </h1>
    <p class="text-zinc-400 text-sm mt-1">
      Verify the 3D model loads, highlight sphere renders, and placement data maps correctly.
    </p>
  </div>

  <div class="flex flex-col lg:flex-row gap-0 h-[calc(100vh-80px)]">
    <!-- Left Panel: Controls -->
    <div class="w-full lg:w-96 border-r border-zinc-800 bg-zinc-900/30 p-6 overflow-y-auto flex-shrink-0">
      <!-- Category Dropdown -->
      <div class="mb-6">
        <label for="category" class="block text-xs font-semibold text-zinc-400 uppercase mb-2">
          Body Category
        </label>
        <select
          id="category"
          bind:value={selectedCategory}
          class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
        >
          {#each categories as cat}
            <option value={cat}>{cat}</option>
          {/each}
        </select>
      </div>

      <!-- Placement Dropdown -->
      <div class="mb-6">
        <label for="placement" class="block text-xs font-semibold text-zinc-400 uppercase mb-2">
          Placement ({placements.length} options)
        </label>
        <select
          id="placement"
          bind:value={selectedPlacement}
          class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-amber-500 transition-colors"
        >
          {#each placements as pl}
            <option value={pl}>{pl}</option>
          {/each}
        </select>
      </div>

      <!-- Size Slider -->
      <div class="mb-6">
        <label for="size-slider" class="block text-xs font-semibold text-zinc-400 uppercase mb-2">
          Simulated Size: <span class="text-amber-400">{simulatedSize} cm²</span>
        </label>
        <input
          id="size-slider"
          type="range"
          min="0"
          max="200"
          step="1"
          bind:value={simulatedSize}
          class="w-full accent-amber-500"
        />
        <div class="flex justify-between text-xs text-zinc-500 mt-1">
          <span>0</span>
          <span>50</span>
          <span>100</span>
          <span>150</span>
          <span>200</span>
        </div>
      </div>

      <!-- Toggles -->
      <div class="mb-6 flex gap-4">
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" bind:checked={isColor} class="accent-amber-500 w-4 h-4" />
          <span class="text-sm text-zinc-300">Color Mode</span>
        </label>
        <label class="flex items-center gap-2 cursor-pointer">
          <input type="checkbox" bind:checked={editMode} class="accent-cyan-500 w-4 h-4" />
          <span class="text-sm text-zinc-300">Edit Mode</span>
        </label>
      </div>

      <!-- Divider -->
      <hr class="border-zinc-800 mb-6" />

      <!-- Current Mapping Data -->
      {#if currentMapping}
        <div class="space-y-4">
          <h3 class="text-sm font-semibold text-zinc-300 uppercase tracking-wider">Mapping Data</h3>

          <!-- Position -->
          <div class="bg-zinc-800/50 rounded-lg p-3">
            <p class="text-xs text-zinc-500 font-semibold uppercase mb-1">Position [x, y, z]</p>
            <p class="text-white font-mono text-sm">
              [{currentMapping.position.map(v => v.toFixed(3)).join(', ')}]
            </p>
          </div>

          <!-- Scale -->
          <div class="bg-zinc-800/50 rounded-lg p-3">
            <p class="text-xs text-zinc-500 font-semibold uppercase mb-1">Default Scale</p>
            <p class="text-white font-mono text-sm">{currentMapping.scale.toFixed(4)}</p>
          </div>

          <!-- Camera -->
          <div class="bg-zinc-800/50 rounded-lg p-3">
            <p class="text-xs text-zinc-500 font-semibold uppercase mb-1">Camera</p>
            <div class="grid grid-cols-3 gap-2 text-xs">
              <div>
                <span class="text-zinc-500">Azimuth</span>
                <p class="text-white font-mono">{(currentMapping.cameraAzimuth ?? 0).toFixed(2)}</p>
              </div>
              <div>
                <span class="text-zinc-500">Polar</span>
                <p class="text-white font-mono">{(currentMapping.cameraPolar ?? 0).toFixed(2)}</p>
              </div>
              <div>
                <span class="text-zinc-500">Distance</span>
                <p class="text-white font-mono">{(currentMapping.cameraDistance ?? 0).toFixed(2)}</p>
              </div>
            </div>
          </div>

          <!-- Size Limits -->
          {#if currentMapping.placementSizeLimits}
            <div class="bg-zinc-800/50 rounded-lg p-3">
              <p class="text-xs text-zinc-500 font-semibold uppercase mb-1">Size Limits</p>
              <div class="grid grid-cols-3 gap-2 text-xs">
                <div>
                  <span class="text-zinc-500">Min</span>
                  <p class="text-white font-mono">{currentMapping.placementSizeLimits.min}</p>
                </div>
                <div>
                  <span class="text-zinc-500">Max</span>
                  <p class="text-white font-mono">{currentMapping.placementSizeLimits.max}</p>
                </div>
                <div>
                  <span class="text-zinc-500">Multiplier</span>
                  <p class="text-white font-mono">{currentMapping.placementSizeLimits.multiplier}x</p>
                </div>
              </div>
            </div>
          {/if}

          <!-- Pain Info -->
          {#if currentMapping.placementPainInfo}
            <div class="bg-zinc-800/50 rounded-lg p-3">
              <p class="text-xs text-zinc-500 font-semibold uppercase mb-1">Pain Info</p>
              <div class="flex items-center gap-3 mb-2">
                <span class="inline-flex items-center gap-1.5">
                  <span class="w-3 h-3 rounded-full {painColor}"></span>
                  <span class="text-white font-bold text-lg">{painLevel}</span>
                  <span class="text-zinc-500 text-sm">/ 10</span>
                </span>
              </div>
              {#if currentMapping.placementPainInfo.reason}
                <p class="text-zinc-400 text-xs italic">{currentMapping.placementPainInfo.reason}</p>
              {/if}
            </div>
          {/if}
        </div>
      {:else}
        <div class="text-center text-zinc-500 py-8">
          <p>Select a category and placement to see mapping data</p>
        </div>
      {/if}

      <!-- Asset URL Info -->
      <div class="mt-6 bg-zinc-800/50 rounded-lg p-3">
        <p class="text-xs text-zinc-500 font-semibold uppercase mb-1">GLB Asset URL</p>
        <p class="text-cyan-400 text-xs font-mono break-all">{MODEL_URL}</p>
      </div>

      <!-- Stats -->
      <div class="mt-4 bg-zinc-800/50 rounded-lg p-3">
        <p class="text-xs text-zinc-500 font-semibold uppercase mb-2">Mapping Stats</p>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span class="text-zinc-500">Categories</span>
            <p class="text-white font-mono">{categories.length}</p>
          </div>
          <div>
            <span class="text-zinc-500">Total Placements</span>
            <p class="text-white font-mono">{Object.values(defaultBodyPartMappings).reduce((sum, cat) => sum + Object.keys(cat).length, 0)}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Right Panel: 3D Viewer -->
    <div class="flex-1 relative bg-zinc-950">
      {#if currentMapping}
        <Human3DViewer
          modelUrl={MODEL_URL}
          {isColor}
          mapping={currentMapping}
          {editMode}
          selectedCategory={selectedCategory}
          currentPlacement={selectedPlacement}
          size={simulatedSize}
        />
      {:else}
        <div class="flex items-center justify-center h-full">
          <div class="text-center">
            <div class="w-16 h-16 border-2 border-zinc-700 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <p class="text-zinc-500">Select a body part to load the 3D viewer</p>
          </div>
        </div>
      {/if}

      <!-- Floating info badge -->
      {#if currentMapping}
        <div class="absolute top-4 left-4 bg-zinc-900/90 border border-zinc-700 rounded-lg px-4 py-2 backdrop-blur-sm">
          <p class="text-sm font-semibold text-white">{selectedCategory} &rarr; {selectedPlacement}</p>
          <p class="text-xs text-zinc-400">Pain: {painLevel}/10 &bull; Size: {simulatedSize}cm²</p>
        </div>
      {/if}

      <!-- Edit mode indicator -->
      {#if editMode}
        <div class="absolute top-4 right-4 bg-cyan-500/20 border border-cyan-500/40 rounded-lg px-3 py-1.5 backdrop-blur-sm">
          <p class="text-xs font-semibold text-cyan-400 uppercase tracking-wider">Edit Mode</p>
        </div>
      {/if}
    </div>
  </div>
</div>
