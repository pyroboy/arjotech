<script lang="ts">
  import { Upload, Trash2, Pencil, X, Check, Image, Filter } from 'lucide-svelte';
  import type { MediaAsset } from '$lib/db/schema';

  const CATEGORIES = ['all', 'tattoo', 'painting', 'flash', 'design', 'testimonial', 'studio', 'misc'] as const;
  type Category = (typeof CATEGORIES)[number];

  let assets = $state<MediaAsset[]>([]);
  let loading = $state(false);
  let uploading = $state(false);
  let categoryFilter = $state<Category>('all');
  let editingId = $state<string | null>(null);
  let editTitle = $state('');
  let editAlt = $state('');
  let deleteConfirmId = $state<string | null>(null);
  let uploadCategory = $state<Exclude<Category, 'all'>>('misc');
  let uploadTitle = $state('');
  let errorMsg = $state('');

  async function fetchAssets() {
    loading = true;
    errorMsg = '';
    try {
      const params = categoryFilter !== 'all' ? `?category=${categoryFilter}` : '';
      const res = await fetch(`/api/assets${params}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to load');
      assets = data.assets;
    } catch (e: unknown) {
      errorMsg = e instanceof Error ? e.message : 'Failed to load assets';
    } finally {
      loading = false;
    }
  }

  async function handleUpload(e: Event) {
    const input = e.target as HTMLInputElement;
    const files = input.files;
    if (!files || files.length === 0) return;

    uploading = true;
    errorMsg = '';
    for (const file of Array.from(files)) {
      const fd = new FormData();
      fd.append('file', file);
      fd.append('category', uploadCategory);
      if (uploadTitle) fd.append('title', uploadTitle);
      try {
        const res = await fetch('/api/assets', { method: 'POST', body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error ?? 'Upload failed');
        assets = [data, ...assets];
      } catch (e: unknown) {
        errorMsg = e instanceof Error ? e.message : 'Upload failed';
      }
    }
    uploading = false;
    input.value = '';
    uploadTitle = '';
  }

  async function saveEdit(id: string) {
    try {
      const res = await fetch(`/api/assets/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: editTitle, altText: editAlt })
      });
      const updated = await res.json();
      if (!res.ok) throw new Error(updated.error ?? 'Update failed');
      assets = assets.map((a) => (a.id === id ? updated : a));
    } catch (e: unknown) {
      errorMsg = e instanceof Error ? e.message : 'Update failed';
    } finally {
      editingId = null;
    }
  }

  async function deleteAsset(id: string) {
    try {
      const res = await fetch(`/api/assets/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Delete failed');
      }
      assets = assets.filter((a) => a.id !== id);
    } catch (e: unknown) {
      errorMsg = e instanceof Error ? e.message : 'Delete failed';
    } finally {
      deleteConfirmId = null;
    }
  }

  function startEdit(asset: MediaAsset) {
    editingId = asset.id;
    editTitle = asset.title ?? '';
    editAlt = asset.altText ?? '';
  }

  $effect(() => {
    fetchAssets();
  });

  $effect(() => {
    categoryFilter;
    fetchAssets();
  });
</script>

<svelte:head>
  <title>Media Assets — Admin</title>
</svelte:head>

<div class="min-h-screen bg-surface-900 text-zinc-100 p-6">
  <div class="max-w-7xl mx-auto">
    <!-- Header -->
    <div class="flex items-center justify-between mb-6">
      <div class="flex items-center gap-3">
        <Image class="w-6 h-6 text-ink-500" />
        <h1 class="text-2xl font-display font-bold">Media Assets</h1>
        <span class="text-zinc-500 text-sm">({assets.length} files)</span>
      </div>
    </div>

    {#if errorMsg}
      <div class="mb-4 px-4 py-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">
        {errorMsg}
        <button onclick={() => (errorMsg = '')} class="ml-2 opacity-60 hover:opacity-100"><X class="w-4 h-4 inline" /></button>
      </div>
    {/if}

    <!-- Upload + Filter Row -->
    <div class="flex flex-wrap gap-4 mb-6">
      <!-- Upload section -->
      <div class="glass-panel rounded-xl p-4 flex flex-col gap-3 min-w-64">
        <p class="text-sm font-medium text-zinc-300">Upload Files</p>
        <div class="flex gap-2">
          <select
            bind:value={uploadCategory}
            class="bg-surface-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-200 flex-1"
          >
            {#each CATEGORIES.filter((c) => c !== 'all') as cat}
              <option value={cat}>{cat}</option>
            {/each}
          </select>
        </div>
        <input
          type="text"
          bind:value={uploadTitle}
          placeholder="Title (optional)"
          class="bg-surface-900 border border-zinc-700 rounded-lg px-3 py-1.5 text-sm text-zinc-200"
        />
        <label
          class="flex items-center gap-2 cursor-pointer px-4 py-2 rounded-lg bg-ink-500/20 border border-ink-500/40 text-ink-400 hover:bg-ink-500/30 transition-colors text-sm font-medium"
        >
          {#if uploading}
            <span class="animate-pulse">Uploading…</span>
          {:else}
            <Upload class="w-4 h-4" />
            Choose files
          {/if}
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            multiple
            disabled={uploading}
            onchange={handleUpload}
            class="hidden"
          />
        </label>
      </div>

      <!-- Category filter -->
      <div class="flex flex-wrap gap-2 items-start pt-1">
        <Filter class="w-4 h-4 text-zinc-500 mt-2" />
        {#each CATEGORIES as cat}
          <button
            onclick={() => (categoryFilter = cat)}
            class="px-3 py-1.5 rounded-full text-sm border transition-colors {categoryFilter === cat
              ? 'bg-ink-500/20 border-ink-500/50 text-ink-400'
              : 'border-zinc-700 text-zinc-400 hover:border-zinc-500'}"
          >
            {cat}
          </button>
        {/each}
      </div>
    </div>

    <!-- Asset Grid -->
    {#if loading}
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {#each Array(10) as _}
          <div class="aspect-square rounded-xl bg-zinc-800 animate-pulse"></div>
        {/each}
      </div>
    {:else if assets.length === 0}
      <div class="text-center py-20 text-zinc-500">
        <Image class="w-12 h-12 mx-auto mb-3 opacity-30" />
        <p>No assets yet. Upload some files above.</p>
      </div>
    {:else}
      <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {#each assets as asset (asset.id)}
          <div class="group relative rounded-xl overflow-hidden bg-zinc-800 border border-zinc-700">
            <img
              src={asset.url}
              alt={asset.altText ?? asset.title ?? asset.originalFilename}
              loading="lazy"
              class="w-full aspect-square object-cover"
            />

            <!-- Category badge -->
            <span class="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-black/60 text-xs text-zinc-300">
              {asset.category}
            </span>

            <!-- Hover overlay -->
            <div class="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3 gap-2">
              {#if editingId === asset.id}
                <input
                  type="text"
                  bind:value={editTitle}
                  placeholder="Title"
                  class="bg-zinc-900 border border-zinc-600 rounded px-2 py-1 text-xs text-zinc-100 w-full"
                />
                <input
                  type="text"
                  bind:value={editAlt}
                  placeholder="Alt text"
                  class="bg-zinc-900 border border-zinc-600 rounded px-2 py-1 text-xs text-zinc-100 w-full"
                />
                <div class="flex gap-2">
                  <button
                    onclick={() => saveEdit(asset.id)}
                    class="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-emerald-600/80 hover:bg-emerald-600 text-xs text-white"
                  >
                    <Check class="w-3 h-3" /> Save
                  </button>
                  <button
                    onclick={() => (editingId = null)}
                    class="flex-1 flex items-center justify-center gap-1 py-1 rounded bg-zinc-700 hover:bg-zinc-600 text-xs text-white"
                  >
                    <X class="w-3 h-3" /> Cancel
                  </button>
                </div>
              {:else if deleteConfirmId === asset.id}
                <p class="text-xs text-red-400 text-center">Delete this file?</p>
                <div class="flex gap-2">
                  <button
                    onclick={() => deleteAsset(asset.id)}
                    class="flex-1 py-1 rounded bg-red-600/80 hover:bg-red-600 text-xs text-white"
                  >
                    Yes, delete
                  </button>
                  <button
                    onclick={() => (deleteConfirmId = null)}
                    class="flex-1 py-1 rounded bg-zinc-700 hover:bg-zinc-600 text-xs text-white"
                  >
                    Cancel
                  </button>
                </div>
              {:else}
                <p class="text-xs text-zinc-200 truncate">{asset.title ?? asset.originalFilename}</p>
                <div class="flex gap-2">
                  <button
                    onclick={() => startEdit(asset)}
                    class="flex-1 flex items-center justify-center gap-1 py-1.5 rounded bg-zinc-700/80 hover:bg-zinc-600 text-xs text-white"
                  >
                    <Pencil class="w-3 h-3" /> Edit
                  </button>
                  <button
                    onclick={() => (deleteConfirmId = asset.id)}
                    class="flex items-center justify-center p-1.5 rounded bg-red-500/20 hover:bg-red-500/40 text-red-400"
                  >
                    <Trash2 class="w-3 h-3" />
                  </button>
                </div>
              {/if}
            </div>
          </div>
        {/each}
      </div>
    {/if}
  </div>
</div>
