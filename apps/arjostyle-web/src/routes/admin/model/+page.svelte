<script lang="ts">
  import { bookingStore } from '$lib/stores/booking.svelte';
  import Human3DViewer from '$lib/components/three/Human3DViewer.svelte';
  import type { BodyPartMappingData } from '$types/mapping';
  import { onMount } from 'svelte';
  import { Save, RotateCcw, Eye, Crosshair, Move3d, Gauge, Ruler, Palette, ExternalLink } from 'lucide-svelte';
  import { defaultBodyPartMappings } from '$lib/data/defaultMappings';
  import { SIZE_CATEGORIES, getPriceRange } from '$data/sizeCategoryMap';

  let selectedCategory = $state('');
  let selectedPlacement = $state('');
  let showSaveSuccess = $state(false);
  let showSaveModal = $state(false);
  let saveMessage = $state('');
  let saveTimestamp = $state('');
  let isSaving = $state(false);
  let showCameraSet = $state(false);
  let activeSection = $state<'position' | 'preview'>('position');
  let isColor = $state(false);
  let isCoverUp = $state(false);
  let previewSizeCategory = $state<string>('medium');

  // Live camera readout — display only, updated by OrbitControls without touching the store
  let liveCamAzimuth = $state(0);
  let liveCamPolar = $state(1.57);
  let liveCamDistance = $state(1.5);

  // Apply current orbit camera position to the mapping
  function applyCameraToMapping() {
    updateField('cameraAzimuth', liveCamAzimuth);
    updateField('cameraPolar', liveCamPolar);
    updateField('cameraDistance', liveCamDistance);
    showCameraSet = true;
    setTimeout(() => { showCameraSet = false; }, 2000);
  }

  let categories = $derived(Object.keys(bookingStore.liveBodyPartMappings));
  let placements = $derived(
    selectedCategory ? Object.keys(bookingStore.liveBodyPartMappings[selectedCategory] || {}).sort() : []
  );
  let currentData = $derived(
    selectedCategory && selectedPlacement
      ? bookingStore.liveBodyPartMappings[selectedCategory]?.[selectedPlacement] ?? null
      : null
  );

  // Live price calculation based on current mapping data
  let priceRange = $derived(getPriceRange(previewSizeCategory, isColor, isCoverUp));
  let multiplier = $derived(currentData?.placementSizeLimits?.multiplier ?? 1);
  let adjustedPrice = $derived({
    min: Math.round(priceRange.min * multiplier),
    max: Math.round(priceRange.max * multiplier),
  });
  let estimatedDuration = $derived.by(() => {
    const sizeData = SIZE_CATEGORIES.find(s => s.id === previewSizeCategory);
    const baseMins = (sizeData?.sqInches ?? 4) * 15; // ~15 min per sq inch
    return Math.round(baseMins * multiplier);
  });

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

  function updateField(field: string, value: any) {
    if (!selectedCategory || !selectedPlacement) return;
    bookingStore.editMode = true;
    // Direct mutation through Svelte 5's $state proxy — triggers fine-grained reactivity
    const data = bookingStore.liveBodyPartMappings[selectedCategory][selectedPlacement];
    if (!data) return;

    if (field.startsWith('position.')) {
      const idx = parseInt(field.split('.')[1]);
      data.position[idx] = parseFloat(value);
    } else if (field.startsWith('placementSizeLimits.')) {
      const key = field.split('.')[1];
      if (!data.placementSizeLimits) data.placementSizeLimits = { min: 0.5, max: 12, multiplier: 1 };
      (data.placementSizeLimits as any)[key] = parseFloat(value);
    } else if (field.startsWith('placementPainInfo.')) {
      const key = field.split('.')[1];
      if (!data.placementPainInfo) data.placementPainInfo = { level: 1, reason: '' };
      if (key === 'level') {
        data.placementPainInfo.level = Math.max(1, Math.min(10, parseInt(value)));
      } else {
        (data.placementPainInfo as any)[key] = value;
      }
    } else {
      (data as any)[field] = parseFloat(value);
    }
  }


  async function handleSave() {
    isSaving = true;
    try {
      const res = await fetch('/api/mappings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingStore.liveBodyPartMappings),
      });
      if (!res.ok) throw new Error('Save failed');
      const data = await res.json();
      saveTimestamp = new Date(data.timestamp).toLocaleTimeString();
      const targets = [data.savedToNeon && 'Neon DB', data.savedToKV && 'KV Cache'].filter(Boolean).join(' + ');
      saveMessage = `Mappings saved to ${targets}`;
      showSaveModal = true;
    } catch (error) {
      console.error('Save error:', error);
      saveMessage = 'Failed to save — check connection';
      showSaveModal = true;
    } finally {
      isSaving = false;
    }
  }

  function handleReset() {
    if (confirm('Reset all mappings to defaults?')) {
      bookingStore.liveBodyPartMappings = structuredClone(defaultBodyPartMappings);
      bookingStore.editMode = false;
      selectedCategory = '';
      selectedPlacement = '';
    }
  }

  // Load saved mappings from KV on mount
  onMount(() => { bookingStore.loadMappingsFromKV(); });

  $effect(() => {
    if (categories.length > 0 && !selectedCategory) selectedCategory = categories[0];
  });

  $effect(() => {
    if (selectedCategory && !placements.includes(selectedPlacement)) selectedPlacement = placements[0] || '';
  });

  // Clamp scale to valid range when placement changes or data loads
  $effect(() => {
    if (currentData && selectedCategory && selectedPlacement) {
      const maxSq = currentData.placementSizeLimits?.max ?? 12;
      const maxScale = 0.05 * Math.sqrt(maxSq);
      const minSq = currentData.placementSizeLimits?.min ?? 0.5;
      const minScale = 0.05 * Math.sqrt(minSq);
      if (currentData.scale > maxScale) {
        updateField('scale', maxScale);
      } else if (currentData.scale < minScale) {
        updateField('scale', minScale);
      }
    }
  });

  const inputClass = 'bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm w-full focus:border-ink-500 focus:outline-none transition-colors';
</script>

<svelte:head>
  <title>3D Model Mapping — Admin</title>
</svelte:head>

<!-- Mobile: flex column with 3D on top, controls always visible below -->
<!-- Desktop: sidebar + viewer -->
<div class="flex flex-col sm:flex-row h-[100dvh] bg-surface-900">

  <!-- Desktop Sidebar (hidden on mobile) -->
  <div class="hidden sm:flex w-96 overflow-y-auto bg-surface-800 border-r border-zinc-800 p-6 flex-col">
    <div class="mb-6">
      <h1 class="text-xl font-bold text-white mb-1">Model Mapping Editor</h1>
      <p class="text-xs text-zinc-500">Edit 3D body part positions and settings</p>
    </div>
    <div class="mb-6 pb-6 border-b border-zinc-700">
      <div class="mb-4">
        <label for="cat-d" class="block text-sm font-medium text-zinc-300 mb-2">Category
        <select id="cat-d" bind:value={selectedCategory} class={inputClass}>
          {#each categories as cat}<option value={cat}>{cat}</option>{/each}
        </select>
</label>
      </div>
      <div>
        <label for="pl-d" class="block text-sm font-medium text-zinc-300 mb-2">Placement
        <select id="pl-d" bind:value={selectedPlacement} class={inputClass}>
          {#each placements as p}<option value={p}>{p}</option>{/each}
        </select>
</label>
      </div>
    </div>
    {#if currentData}
      <div class="mb-6 pb-6 border-b border-zinc-700">
        <div class="flex items-center gap-2 mb-4"><Move3d size={16} class="text-ink-500" /><h2 class="text-sm font-semibold text-white">3D Position</h2></div>
        <div class="grid grid-cols-3 gap-2 mb-4">
          {#each ['X','Y','Z'] as axis, i}
            <div><label class="block text-xs text-zinc-500 mb-1">{axis}<input type="number" step="0.001" value={currentData.position[i]} onchange={(e) => updateField(`position.${i}`, e.currentTarget.value)} class={inputClass} /></label></div>
          {/each}
        </div>
        <div><label class="block text-xs text-zinc-500 mb-1">Scale<input type="number" step="0.01" value={currentData.scale} onchange={(e) => updateField('scale', e.currentTarget.value)} class={inputClass} /></label></div>
      </div>
      <div class="mb-6 pb-6 border-b border-zinc-700">
        <div class="flex items-center gap-2 mb-4"><Eye size={16} class="text-tech-500" /><h2 class="text-sm font-semibold text-white">Camera</h2></div>
        <div class="space-y-3">
          <div><label class="block text-xs text-zinc-500 mb-1">Azimuth<input type="number" step="0.01" value={currentData.cameraAzimuth ?? 0} onchange={(e) => updateField('cameraAzimuth', e.currentTarget.value)} class={inputClass} /></label></div>
          <div><label class="block text-xs text-zinc-500 mb-1">Polar<input type="number" step="0.01" value={currentData.cameraPolar ?? 1.57} onchange={(e) => updateField('cameraPolar', e.currentTarget.value)} class={inputClass} /></label></div>
          <div><label class="block text-xs text-zinc-500 mb-1">Distance<input type="number" step="0.01" value={currentData.cameraDistance ?? 1} onchange={(e) => updateField('cameraDistance', e.currentTarget.value)} class={inputClass} /></label></div>
        </div>
      </div>
      <div class="mb-6 pb-6 border-b border-zinc-700">
        <div class="flex items-center gap-2 mb-4"><Gauge size={16} class="text-red-500" /><h2 class="text-sm font-semibold text-white">Pain</h2></div>
        <div class="flex items-center gap-3 mb-3">
          <input type="number" min="1" max="10" value={currentData.placementPainInfo?.level ?? 1} onchange={(e) => updateField('placementPainInfo.level', e.currentTarget.value)} class="{inputClass} flex-1" />
          <div class={`px-3 py-2 rounded-lg border text-xs font-medium ${getPainLevelColor(currentData.placementPainInfo?.level ?? 1)}`}>{getPainLevelLabel(currentData.placementPainInfo?.level ?? 1)}</div>
        </div>
        <textarea rows="2" value={currentData.placementPainInfo?.reason ?? ''} onchange={(e) => updateField('placementPainInfo.reason', e.currentTarget.value)} class="{inputClass} resize-none" placeholder="Reason..."></textarea>
      </div>
      <div class="mb-6 pb-6 border-b border-zinc-700">
        <div class="flex items-center gap-2 mb-4"><Ruler size={16} class="text-tech-500" /><h2 class="text-sm font-semibold text-white">Size</h2></div>
        <div class="space-y-3">
          <div><label class="block text-xs text-zinc-500 mb-1">Min<input type="number" step="0.5" value={currentData.placementSizeLimits?.min ?? 0.5} onchange={(e) => updateField('placementSizeLimits.min', e.currentTarget.value)} class={inputClass} /></label></div>
          <div><label class="block text-xs text-zinc-500 mb-1">Max<input type="number" step="0.5" value={currentData.placementSizeLimits?.max ?? 12} onchange={(e) => updateField('placementSizeLimits.max', e.currentTarget.value)} class={inputClass} /></label></div>
          <div><label class="block text-xs text-zinc-500 mb-1">Multiplier<input type="number" step="0.1" value={currentData.placementSizeLimits?.multiplier ?? 1} onchange={(e) => updateField('placementSizeLimits.multiplier', e.currentTarget.value)} class={inputClass} /></label></div>
        </div>
      </div>
    {/if}
    <div class="pt-6 border-t border-zinc-700 space-y-2 mt-auto">
      {#if showSaveSuccess}<div class="bg-green-500/10 border border-green-500/50 rounded-lg px-3 py-2 text-xs text-green-300">{saveMessage}</div>{/if}
      <button onclick={handleSave} disabled={isSaving || !bookingStore.editMode} class="w-full flex items-center justify-center gap-2 bg-ink-500 hover:bg-ink-600 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm"><Save size={16} /> Save</button>
      <button onclick={handleReset} class="w-full flex items-center justify-center gap-2 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 font-medium py-2.5 rounded-lg text-sm"><RotateCcw size={16} /> Reset</button>
    </div>
  </div>

  <!-- 3D Viewer — fills space above mobile controls -->
  <div class="flex-1 relative bg-black min-h-0">
    {#if selectedCategory && selectedPlacement}
      <Human3DViewer
        modelUrl="https://res.cloudinary.com/dexcw6vg0/image/upload/v1741855043/male_low_poly_human_body_jtzm1e.glb"
        mapping={currentData}
        editMode={true}
        {selectedCategory}
        {isColor}
        currentPlacement={selectedPlacement}
        size={undefined}
        onCameraChange={(azimuth, polar, distance) => {
          // Update display-only camera values without touching the store
          // to avoid circular reactivity (camera move → store → CameraAnimator → camera move)
          liveCamAzimuth = azimuth;
          liveCamPolar = polar;
          liveCamDistance = distance;
        }}
      />
      {#if currentData}
        <div class="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black/60 backdrop-blur-sm rounded-lg px-2.5 py-1.5 sm:px-4 sm:py-3 text-[9px] sm:text-xs font-mono text-zinc-400 space-y-0.5">
          <p class="text-zinc-300 font-semibold">{selectedCategory} → {selectedPlacement}</p>
          <p>Pos: <span class="text-white">[{currentData.position.map((n) => n.toFixed(3)).join(', ')}]</span></p>
          <p>Scale: <span class="text-white">{currentData.scale.toFixed(3)}</span> | Pain: <span class="text-white">{currentData.placementPainInfo?.level ?? '?'}/10</span></p>
          <p>Mult: <span class="text-white">{(currentData.placementSizeLimits?.multiplier ?? 1).toFixed(1)}x</span></p>
        </div>
        <a href="/book" class="absolute top-2 right-2 sm:top-4 sm:right-4 bg-ink-500/80 backdrop-blur-sm rounded-lg px-3 py-1.5 text-[10px] text-white hover:bg-ink-500 flex items-center gap-1 no-underline">
          Test Booking →
        </a>
      {/if}
    {:else}
      <div class="flex items-center justify-center h-full">
        <div class="text-center"><Crosshair size={48} class="mx-auto mb-4 text-zinc-700" /><p class="text-lg text-zinc-600">Select a placement</p></div>
      </div>
    {/if}
  </div>

  <!-- Mobile Controls Panel — split into scrollable content + fixed action bar -->
  <div class="sm:hidden flex-shrink-0 bg-zinc-900 border-t border-zinc-700 flex flex-col" style="max-height: 45dvh;">
    <!-- Scrollable content area -->
    <div class="flex-1 overflow-y-auto px-3 pt-3 pb-2 min-h-0">
      <!-- Selectors -->
      <div class="grid grid-cols-2 gap-2 mb-3">
        <select bind:value={selectedCategory} class="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs w-full">
          {#each categories as cat}<option value={cat}>{cat}</option>{/each}
        </select>
        <select bind:value={selectedPlacement} class="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs w-full">
          {#each placements as p}<option value={p}>{p}</option>{/each}
        </select>
      </div>

      {#if currentData}
        <!-- Section tabs -->
        <div class="flex gap-1 mb-3">
          {#each [
            { id: 'position' as const, label: 'Pos+Size', icon: Move3d },
            { id: 'preview' as const, label: 'Price+Pain', icon: Palette },
          ] as tab}
            {@const Icon = tab.icon}
            <button
              onclick={() => { activeSection = tab.id; }}
              class="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-[10px] font-medium transition-colors
                {activeSection === tab.id ? 'bg-ink-500/20 text-ink-400 border border-ink-500/30' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}"
            >
              <Icon size={10} />
              {tab.label}
            </button>
          {/each}
        </div>

        <!-- Position + Size sliders (merged) -->
        {#if activeSection === 'position'}
          <div class="space-y-2">
            <!-- Position X/Y/Z -->
            {#each [
              { label: 'X', field: 'position.0', value: currentData.position[0], min: -1, max: 1, step: 0.001 },
              { label: 'Y', field: 'position.1', value: currentData.position[1], min: -2, max: 1, step: 0.001 },
              { label: 'Z', field: 'position.2', value: currentData.position[2], min: -1, max: 1, step: 0.001 },
            ] as s}
              <div class="flex items-center gap-2">
                <span class="text-[10px] text-zinc-500 w-8 text-right shrink-0">{s.label}</span>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                  oninput={(e) => updateField(s.field, e.currentTarget.value)}
                  class="flex-1 h-1.5 accent-orange-500 cursor-pointer" />
                <span class="text-[10px] text-zinc-300 w-12 text-right font-mono shrink-0">{s.value.toFixed(3)}</span>
              </div>
            {/each}

            <div class="border-t border-zinc-700/50 pt-2 mt-1"></div>

            <!-- Size: Min / Max range in sq inches -->
            {#each [
              { label: 'Min', field: 'placementSizeLimits.min', value: currentData.placementSizeLimits?.min ?? 0.5, min: 0, max: 20, step: 0.5 },
              { label: 'Max', field: 'placementSizeLimits.max', value: currentData.placementSizeLimits?.max ?? 12, min: 1, max: 50, step: 0.5 },
            ] as s}
              <div class="flex items-center gap-2">
                <span class="text-[10px] text-zinc-500 w-8 text-right shrink-0">{s.label}</span>
                <input type="range" min={s.min} max={s.max} step={s.step} value={s.value}
                  oninput={(e) => updateField(s.field, e.currentTarget.value)}
                  class="flex-1 h-1.5 accent-blue-500 cursor-pointer" />
                <span class="text-[10px] text-zinc-300 w-16 text-right font-mono shrink-0">{s.value.toFixed(1)} sq in</span>
              </div>
            {/each}

            <!-- Scale: constrained to min/max sq inches, converted to 3D scale -->
            <div class="flex items-center gap-2">
              <span class="text-[10px] text-zinc-500 w-8 text-right shrink-0">Scale</span>
              <input type="range"
                min={0.05 * Math.sqrt(currentData.placementSizeLimits?.min ?? 0.5)}
                max={0.05 * Math.sqrt(currentData.placementSizeLimits?.max ?? 12)}
                step="0.001"
                value={currentData.scale}
                oninput={(e) => updateField('scale', e.currentTarget.value)}
                class="flex-1 h-1.5 accent-green-500 cursor-pointer" />
              <span class="text-[10px] text-zinc-300 w-16 text-right font-mono shrink-0">{Math.pow(currentData.scale / 0.05, 2).toFixed(1)} sq in</span>
            </div>
          </div>
        {/if}

        <!-- Price + Pain tab -->
        {#if activeSection === 'preview'}
          <div class="space-y-3">
            <!-- Color toggle -->
            <div class="flex gap-2">
              <button
                onclick={() => { isColor = false; }}
                class="flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all
                  {!isColor ? 'bg-zinc-200 text-zinc-900' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}"
              >B&W</button>
              <button
                onclick={() => { isColor = true; }}
                class="flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all
                  {isColor ? 'bg-ink-500 text-white' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}"
              >Color (+30%)</button>
              <button
                onclick={() => { isCoverUp = !isCoverUp; }}
                class="flex-1 py-1.5 rounded-lg text-[10px] font-medium transition-all
                  {isCoverUp ? 'bg-purple-600 text-white' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}"
              >Cover-up {isCoverUp ? 'ON' : 'OFF'}</button>
            </div>

            <!-- Pain slider + reason -->
            <div class="flex items-center gap-2">
              <span class="text-[10px] text-zinc-500 w-8 text-right shrink-0">Pain</span>
              <input type="range" min="1" max="10" step="1" value={currentData.placementPainInfo?.level ?? 1}
                oninput={(e) => updateField('placementPainInfo.level', e.currentTarget.value)}
                class="flex-1 h-1.5 accent-red-500 cursor-pointer" />
              <div class={`px-2 py-0.5 rounded border text-[10px] font-medium shrink-0 ${getPainLevelColor(currentData.placementPainInfo?.level ?? 1)}`}>
                {currentData.placementPainInfo?.level ?? 1}/10
              </div>
            </div>
            <textarea rows="1" value={currentData.placementPainInfo?.reason ?? ''} onchange={(e) => updateField('placementPainInfo.reason', e.currentTarget.value)} class="bg-slate-800 border border-slate-700 rounded-lg px-2 py-1.5 text-white text-xs w-full resize-none" placeholder="Pain reason..."></textarea>

            <!-- Multiplier slider -->
            <div class="flex items-center gap-2">
              <span class="text-[10px] text-zinc-500 w-8 text-right shrink-0">Mult</span>
              <input type="range" min="0.5" max="3" step="0.1"
                value={currentData.placementSizeLimits?.multiplier ?? 1}
                oninput={(e) => updateField('placementSizeLimits.multiplier', e.currentTarget.value)}
                class="flex-1 h-1.5 accent-orange-500 cursor-pointer" />
              <span class="text-[10px] text-ink-400 w-12 text-right font-mono font-bold shrink-0">{(currentData.placementSizeLimits?.multiplier ?? 1).toFixed(1)}x</span>
            </div>

            <!-- Size selector: 5 evenly spaced steps between min and max -->
            <div class="flex gap-1">
              {#each [
                { label: 'XS', pct: 0 },
                { label: 'S', pct: 0.25 },
                { label: 'M', pct: 0.5 },
                { label: 'L', pct: 0.75 },
                { label: 'XL', pct: 1 },
              ] as btn}
                {@const placementMin = currentData.placementSizeLimits?.min ?? 0.5}
                {@const placementMax = currentData.placementSizeLimits?.max ?? 12}
                {@const sqIn = placementMin + (placementMax - placementMin) * btn.pct}
                {@const scale3d = 0.05 * Math.sqrt(sqIn)}
                {@const isSelected = Math.abs(currentData.scale - scale3d) < 0.005}
                <button
                  onclick={() => {
                    updateField('scale', scale3d);
                    // Also set preview category to nearest match
                    const nearest = SIZE_CATEGORIES.reduce((prev, cur) =>
                      Math.abs(cur.sqInches - sqIn) < Math.abs(prev.sqInches - sqIn) ? cur : prev
                    );
                    previewSizeCategory = nearest.id;
                  }}
                  class="flex-1 py-1.5 rounded text-[9px] font-medium transition-all flex flex-col items-center gap-0.5
                    {isSelected ? 'bg-ink-500/20 text-ink-400 border border-ink-500/30' : 'bg-zinc-800 text-zinc-500 border border-zinc-700'}"
                >
                  <span>{btn.label}</span>
                  <span class="text-[7px] text-zinc-500">{sqIn.toFixed(1)} sq in</span>
                </button>
              {/each}
            </div>

            <!-- Price output -->
            <div class="bg-zinc-800/80 rounded-lg p-3 space-y-1.5">
              <div class="flex justify-between items-center">
                <span class="text-[10px] text-zinc-500">Base Price</span>
                <span class="text-xs text-zinc-300 font-mono">₱{priceRange.min.toLocaleString()} — ₱{priceRange.max.toLocaleString()}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-[10px] text-zinc-500">Placement Multiplier</span>
                <span class="text-xs text-ink-400 font-mono font-bold">{multiplier.toFixed(1)}x</span>
              </div>
              <div class="border-t border-zinc-700 pt-1.5 flex justify-between items-center">
                <span class="text-[10px] text-zinc-400 font-medium">Adjusted Price</span>
                <span class="text-sm text-white font-bold">₱{adjustedPrice.min.toLocaleString()} — ₱{adjustedPrice.max.toLocaleString()}</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-[10px] text-zinc-500">Est. Duration</span>
                <span class="text-xs text-zinc-300 font-mono">{Math.floor(estimatedDuration / 60)}h {estimatedDuration % 60}m</span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-[10px] text-zinc-500">Pain Level</span>
                <span class={`text-xs font-medium ${getPainLevelColor(currentData.placementPainInfo?.level ?? 1).split(' ').pop()}`}>
                  {currentData.placementPainInfo?.level ?? 1}/10 — {getPainLevelLabel(currentData.placementPainInfo?.level ?? 1)}
                </span>
              </div>
            </div>
          </div>
        {/if}

      {/if}
    </div>

    <!-- Fixed action bar — always visible at bottom -->
    <div class="flex-shrink-0 px-3 py-2 border-t border-zinc-700 bg-zinc-900 space-y-1.5">
      <div class="flex gap-1.5">
        <button onclick={handleSave} disabled={isSaving || !bookingStore.editMode} class="flex-1 flex items-center justify-center gap-1 bg-ink-500 hover:bg-ink-600 disabled:opacity-50 text-white font-medium py-2 rounded-lg text-[10px]">
          <Save size={11} /> {isSaving ? 'Saving...' : 'Save'}
        </button>
        <button onclick={applyCameraToMapping} class="flex items-center justify-center gap-1 bg-blue-600 hover:bg-blue-500 text-white py-2 px-2.5 rounded-lg text-[10px]">
          <Eye size={11} /> Set Cam
        </button>
        <button onclick={handleReset} class="flex items-center justify-center gap-1 border border-zinc-700 hover:bg-zinc-800 text-zinc-300 py-2 px-2.5 rounded-lg text-[10px]">
          <RotateCcw size={11} />
        </button>
        <a href="/book" class="flex items-center justify-center gap-1 border border-ink-500/50 hover:bg-ink-500/20 text-ink-400 py-2 px-2.5 rounded-lg text-[10px] no-underline">
          <ExternalLink size={11} /> Test
        </a>
      </div>
    </div>
  </div>
</div>

<!-- Toast notifications -->
{#if showCameraSet}
  <div class="fixed top-4 left-1/2 -translate-x-1/2 z-[300] bg-blue-600 text-white px-4 py-2 rounded-full text-xs font-medium shadow-lg">
    Camera position set
  </div>
{/if}

<!-- Save Success Modal -->
{#if showSaveModal}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="fixed inset-0 z-[200] flex items-center justify-center p-4">
    <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" onclick={() => { showSaveModal = false; }}
      onkeydown={(e) => { if (e.key === 'Escape') showSaveModal = false; }}></div>
    <div class="relative z-10 bg-zinc-900 border border-zinc-700 rounded-2xl p-6 max-w-sm w-full text-center shadow-2xl">
      {#if saveMessage.includes('Failed')}
        <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-red-500/20 flex items-center justify-center">
          <span class="text-2xl">✕</span>
        </div>
        <h2 class="text-lg font-bold text-white mb-1">Save Failed</h2>
        <p class="text-sm text-zinc-400 mb-4">{saveMessage}</p>
      {:else}
        <div class="w-14 h-14 mx-auto mb-4 rounded-full bg-green-500/20 flex items-center justify-center">
          <span class="text-2xl">✓</span>
        </div>
        <h2 class="text-lg font-bold text-white mb-1">Saved to KV!</h2>
        <p class="text-sm text-zinc-400 mb-1">{saveMessage}</p>
        <p class="text-xs text-zinc-500 mb-4">at {saveTimestamp} — changes are now live</p>
      {/if}
      <div class="flex flex-col gap-2">
        <div class="flex gap-2">
          <button
            onclick={() => { showSaveModal = false; }}
            class="flex-1 py-2 rounded-lg bg-zinc-800 border border-zinc-700 text-zinc-300 text-sm font-medium hover:bg-zinc-700 transition-colors"
          >Continue Editing</button>
          <a
            href="/book"
            class="flex-1 py-2 rounded-lg bg-ink-500 text-white text-sm font-medium hover:bg-ink-400 transition-colors no-underline text-center"
          >Test Booking</a>
        </div>
      </div>
    </div>
  </div>
{/if}

<style>
  :global(input:focus, select:focus, textarea:focus) {
    outline: none;
    box-shadow: none;
  }
  input[type="range"] {
    -webkit-appearance: none;
    appearance: none;
    background: transparent;
  }
  input[type="range"]::-webkit-slider-runnable-track {
    height: 4px;
    border-radius: 2px;
    background: #3f3f46;
  }
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 18px;
    height: 18px;
    border-radius: 50%;
    background: #ea580c;
    margin-top: -7px;
    cursor: pointer;
  }
</style>
