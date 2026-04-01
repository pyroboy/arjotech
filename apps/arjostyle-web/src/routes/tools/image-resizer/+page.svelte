<script lang="ts">
  interface PresetSize {
    name: string;
    width: number;
    height: number;
    category: string;
  }

  const PRESET_SIZES: PresetSize[] = [
    {
      name: 'Instagram Square',
      width: 1080,
      height: 1080,
      category: 'Social Media'
    },
    {
      name: 'Instagram Story',
      width: 1080,
      height: 1920,
      category: 'Social Media'
    },
    {
      name: 'Facebook Cover',
      width: 820,
      height: 312,
      category: 'Social Media'
    },
    {
      name: 'Twitter Header',
      width: 1500,
      height: 500,
      category: 'Social Media'
    },
    {
      name: 'YouTube Thumbnail',
      width: 1280,
      height: 720,
      category: 'Video'
    },
    {
      name: 'LinkedIn Banner',
      width: 1584,
      height: 396,
      category: 'Social Media'
    },
    { name: 'Passport Photo', width: 413, height: 531, category: 'Documents' }
  ];

  let uploadedImage: {
    file: File;
    preview: string;
    originalWidth: number;
    originalHeight: number;
    originalSize: number;
  } | null = $state(null);

  let resizedImage: {
    blob: Blob;
    url: string;
    width: number;
    height: number;
    size: number;
  } | null = $state(null);

  let customWidth = $state(1080);
  let customHeight = $state(1080);
  let lockAspectRatio = $state(false);
  let usePreset = $state(false);
  let selectedPreset = $state<PresetSize>(PRESET_SIZES[0]);
  let selectedFormat = $state<'png' | 'jpeg' | 'webp'>('png');
  let quality = $state(0.85);
  let dragActive = $state(false);
  let isResizing = $state(false);

  let displayWidth = $derived(
    usePreset ? selectedPreset.width : customWidth
  );
  let displayHeight = $derived(
    usePreset ? selectedPreset.height : customHeight
  );

  let originalAspectRatio = $derived.by(() => {
    if (!uploadedImage) return 1;
    return uploadedImage.originalWidth / uploadedImage.originalHeight;
  });

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragActive = false;
    if (e.dataTransfer?.files?.[0]) {
      addImage(e.dataTransfer.files[0]);
    }
  }

  function handleFileSelect(files: FileList | null) {
    if (files?.[0]) {
      addImage(files[0]);
    }
  }

  function addImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) return;
      const img = new window.Image();
      img.onload = () => {
        uploadedImage = {
          file,
          preview: e.target!.result as string,
          originalWidth: img.width,
          originalHeight: img.height,
          originalSize: file.size
        };
        customWidth = img.width;
        customHeight = img.height;
        resizedImage = null;
      };
      img.src = e.target.result as string;
    };
    reader.readAsDataURL(file);
  }

  function updateHeight() {
    if (lockAspectRatio && !usePreset) {
      customHeight = Math.round(customWidth / originalAspectRatio);
    }
  }

  function updateWidth() {
    if (lockAspectRatio && !usePreset) {
      customWidth = Math.round(customHeight * originalAspectRatio);
    }
  }

  async function resize() {
    if (!uploadedImage) return;

    isResizing = true;
    const img = new window.Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        isResizing = false;
        return;
      }

      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const scale = Math.min(
        canvas.width / img.width,
        canvas.height / img.height
      );
      const x = (canvas.width - img.width * scale) / 2;
      const y = (canvas.height - img.height * scale) / 2;

      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      let mimeType = 'image/png';
      if (selectedFormat === 'jpeg') mimeType = 'image/jpeg';
      else if (selectedFormat === 'webp') mimeType = 'image/webp';

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            isResizing = false;
            return;
          }
          const url = URL.createObjectURL(blob);
          resizedImage = {
            blob,
            url,
            width: displayWidth,
            height: displayHeight,
            size: blob.size
          };
          isResizing = false;
        },
        mimeType,
        selectedFormat === 'png' ? undefined : quality
      );
    };
    img.src = uploadedImage.preview;
  }

  function download() {
    if (!resizedImage || !uploadedImage) return;
    const a = document.createElement('a');
    a.href = resizedImage.url;
    const ext = selectedFormat === 'jpeg' ? 'jpg' : selectedFormat;
    const baseName = uploadedImage.file.name.split('.')[0];
    a.download = `${baseName}-${displayWidth}x${displayHeight}.${ext}`;
    a.click();
  }

  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }
</script>

<svelte:head>
  <title>Image Resizer — ArjoStyle Free Tools</title>
  <meta
    name="description"
    content="Resize and crop images to preset or custom dimensions. Support for Instagram, Facebook, Twitter, YouTube, and more."
  />
</svelte:head>

<div class="min-h-screen bg-surface-900 text-zinc-400">
  <div class="max-w-6xl mx-auto px-4 py-12 md:py-16">
    <!-- Header -->
    <div class="mb-12">
      <h1 class="text-4xl md:text-5xl font-bold text-white mb-3">Image Resizer</h1>
      <p class="text-zinc-400 text-lg max-w-2xl">
        Resize images to custom dimensions or popular preset sizes for social media.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
      <!-- Controls -->
      <div class="lg:col-span-1 space-y-6">
        <!-- Upload Area -->
        <div
          class="bg-zinc-800/50 border-2 {dragActive
            ? 'border-orange-500 bg-orange-500/5'
            : 'border-dashed border-zinc-600'} rounded-xl p-8 text-center transition cursor-pointer"
          ondrop={handleDrop}
          ondragover={(e) => {
            e.preventDefault();
            dragActive = true;
          }}
          ondragleave={() => (dragActive = false)}
          role="button"
          tabindex="0"
          onkeydown={(e) => { if (e.key === 'Enter' || e.key === ' ') document.getElementById('file-input')?.click(); }}
        >
          <p class="text-white font-semibold mb-2">Drop image here</p>
          <p class="text-zinc-500 text-sm mb-4">or click to select</p>
          <input
            type="file"
            accept="image/*"
            onchange={(e) => handleFileSelect(e.currentTarget.files)}
            class="hidden"
            id="file-input"
          />
          <label for="file-input">
            <button
              type="button"
              onclick={() => document.getElementById('file-input')?.click()}
              class="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-400 transition"
            >
              Choose File
            </button>
          </label>
        </div>

        {#if uploadedImage}
          <!-- Preset Sizes -->
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
            <h2 class="text-white font-bold mb-3 text-sm">Preset Sizes</h2>
            <div class="space-y-2 max-h-96 overflow-y-auto">
              {#each PRESET_SIZES as preset (preset.name)}
                <button
                  onclick={() => {
                    selectedPreset = preset;
                    usePreset = true;
                  }}
                  class="w-full text-left px-3 py-2 rounded-lg transition text-sm {usePreset &&
                  selectedPreset.name === preset.name
                    ? 'bg-orange-500 text-white'
                    : 'bg-surface-900 text-zinc-300 hover:bg-zinc-700'}"
                >
                  <p class="font-semibold">{preset.name}</p>
                  <p class="text-xs {usePreset && selectedPreset.name === preset.name ? 'text-orange-100' : 'text-zinc-500'}">
                    {preset.width} × {preset.height}px
                  </p>
                </button>
              {/each}
            </div>
          </div>

          <!-- Custom Size -->
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
            <button
              onclick={() => (usePreset = false)}
              class="w-full text-left mb-3"
            >
              <h2 class="text-white font-bold text-sm {!usePreset ? 'text-orange-400' : ''}">
                Custom Size
              </h2>
            </button>

            <div class="space-y-3">
              <div>
                <label class="block text-xs text-zinc-400 mb-1">Width (px)
                <input
                  type="number"
                  bind:value={customWidth}
                  onchange={updateHeight}
                  disabled={usePreset}
                  class="w-full px-3 py-2 bg-surface-900 border border-zinc-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 disabled:opacity-50"
                />
</label>
              </div>
              <div>
                <label class="block text-xs text-zinc-400 mb-1">Height (px)
                <input
                  type="number"
                  bind:value={customHeight}
                  onchange={updateWidth}
                  disabled={usePreset}
                  class="w-full px-3 py-2 bg-surface-900 border border-zinc-600 rounded-lg text-white text-sm focus:outline-none focus:border-orange-500 disabled:opacity-50"
                />
</label>
              </div>
              <label
                class="flex items-center gap-2 cursor-pointer {usePreset
                  ? 'opacity-50 cursor-not-allowed'
                  : ''}"
              >
                <input
                  type="checkbox"
                  bind:checked={lockAspectRatio}
                  disabled={usePreset}
                  class="w-4 h-4 rounded border-zinc-600 bg-surface-900 text-orange-500"
                />
                <span class="text-sm text-zinc-300">Lock aspect ratio</span>
              </label>
            </div>
          </div>

          <!-- Output Format -->
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
            <h2 class="text-white font-bold mb-3 text-sm">Output Format</h2>
            <div class="space-y-2">
              {#each ['png', 'jpeg', 'webp'] as format}
                <label class="flex items-center gap-3 cursor-pointer">
                  <input
                    type="radio"
                    name="format"
                    value={format}
                    bind:group={selectedFormat}
                    class="w-4 h-4 text-orange-500"
                  />
                  <span class="text-white text-sm">{format.toUpperCase()}</span>
                </label>
              {/each}
            </div>
          </div>

          {#if selectedFormat !== 'png'}
            <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
              <div class="flex justify-between items-center mb-3">
                <h2 class="text-white font-bold text-sm">Quality</h2>
                <span class="text-orange-500 font-semibold text-sm">
                  {Math.round(quality * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.1"
                max="1"
                step="0.05"
                bind:value={quality}
                class="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          {/if}

          <!-- Resize Button -->
          <button
            onclick={resize}
            disabled={isResizing}
            class="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-400 transition disabled:bg-zinc-700 disabled:cursor-not-allowed"
          >
            {isResizing ? 'Resizing...' : 'Resize Image'}
          </button>
        {/if}
      </div>

      <!-- Preview -->
      <div class="lg:col-span-2">
        {#if !uploadedImage}
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-12 text-center h-full flex items-center justify-center">
            <div>
              <p class="text-zinc-500 text-lg mb-2">No image uploaded</p>
              <p class="text-zinc-600 text-sm">Upload an image to get started</p>
            </div>
          </div>
        {:else}
          <div class="space-y-4">
            <!-- Original Image -->
            <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
              <h2 class="text-white font-semibold mb-3 text-sm">Original Image</h2>
              <img
                src={uploadedImage.preview}
                alt="Original"
                class="w-full max-h-96 object-contain rounded-lg mb-4 bg-surface-900"
              />
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p class="text-zinc-500">Dimensions</p>
                  <p class="text-white font-semibold">
                    {uploadedImage.originalWidth} × {uploadedImage.originalHeight}px
                  </p>
                </div>
                <div>
                  <p class="text-zinc-500">File Size</p>
                  <p class="text-white font-semibold">
                    {formatBytes(uploadedImage.originalSize)}
                  </p>
                </div>
              </div>
            </div>

            <!-- Resized Image -->
            {#if resizedImage}
              <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
                <h2 class="text-white font-semibold mb-3 text-sm">
                  Resized Image ({selectedFormat.toUpperCase()})
                </h2>
                <img
                  src={resizedImage.url}
                  alt="Resized"
                  class="w-full max-h-96 object-contain rounded-lg mb-4 bg-surface-900"
                />
                <div class="grid grid-cols-2 gap-4 text-sm mb-4">
                  <div>
                    <p class="text-zinc-500">New Dimensions</p>
                    <p class="text-white font-semibold">
                      {resizedImage.width} × {resizedImage.height}px
                    </p>
                  </div>
                  <div>
                    <p class="text-zinc-500">New File Size</p>
                    <p class="text-white font-semibold">
                      {formatBytes(resizedImage.size)}
                    </p>
                  </div>
                </div>
                <button
                  onclick={download}
                  class="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-400 transition"
                >
                  Download {displayWidth}×{displayHeight}
                </button>
              </div>
            {/if}
          </div>
        {/if}
      </div>
    </div>

    <!-- Footer -->
    <div class="text-center text-zinc-500 text-sm border-t border-zinc-800 pt-8">
      <p>
        Part of <a href="/tools" class="text-orange-500 hover:text-orange-400 transition">
          ArjoStyle Free Tools
        </a>
      </p>
    </div>
  </div>
</div>
