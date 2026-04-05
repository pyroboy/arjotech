<script lang="ts">
  import { onMount } from 'svelte';

  interface UploadedImage {
    id: string;
    file: File;
    preview: string;
    width: number;
    height: number;
    originalSize: number;
  }

  interface ConvertedImage {
    id: string;
    format: 'png' | 'jpeg' | 'webp';
    blob: Blob;
    size: number;
    url: string;
  }

  let uploadedImages = $state<UploadedImage[]>([]);
  let convertedImages = $state<Map<string, ConvertedImage>>(new Map());
  let selectedFormat = $state<'png' | 'jpeg' | 'webp'>('png');
  let quality = $state(0.85);
  let isConverting = $state(false);
  let dragActive = $state(false);

  function handleDrop(e: DragEvent) {
    e.preventDefault();
    dragActive = false;
    if (e.dataTransfer?.files) {
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        f.type.startsWith('image/')
      );
      files.forEach((file) => addImage(file));
    }
  }

  function handleFiles(files: FileList | null) {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (file.type.startsWith('image/')) {
        addImage(file);
      }
    });
  }

  function addImage(file: File) {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (!e.target?.result) return;
      const img = new window.Image();
      img.onload = () => {
        const id = String(Date.now()) + Math.random();
        uploadedImages.push({
          id,
          file,
          preview: e.target!.result as string,
          width: img.width,
          height: img.height,
          originalSize: file.size
        });
        uploadedImages = uploadedImages;
        convertedImages.delete(id);
      };
      img.src = e.target.result as string;
    };
    reader.readAsDataURL(file);
  }

  async function convertImage(uploadedImage: UploadedImage) {
    const img = new window.Image();
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(img, 0, 0);

      let mimeType = 'image/png';
      let formatKey: 'png' | 'jpeg' | 'webp' = 'png';
      if (selectedFormat === 'jpeg') {
        mimeType = 'image/jpeg';
        formatKey = 'jpeg';
      } else if (selectedFormat === 'webp') {
        mimeType = 'image/webp';
        formatKey = 'webp';
      }

      canvas.toBlob(
        (blob) => {
          if (!blob) return;
          const url = URL.createObjectURL(blob);
          convertedImages.set(uploadedImage.id, {
            id: uploadedImage.id,
            format: formatKey,
            blob,
            size: blob.size,
            url
          });
          convertedImages = convertedImages;
        },
        mimeType,
        selectedFormat === 'png' ? undefined : quality
      );
    };
    img.src = uploadedImage.preview;
  }

  async function convertAll() {
    isConverting = true;
    for (const img of uploadedImages) {
      await convertImage(img);
    }
    isConverting = false;
  }

  function downloadImage(converted: ConvertedImage, originalImage: UploadedImage) {
    const a = document.createElement('a');
    a.href = converted.url;
    const ext = converted.format === 'jpeg' ? 'jpg' : converted.format;
    a.download = `${originalImage.file.name.split('.')[0]}.${ext}`;
    a.click();
  }

  function removeImage(id: string) {
    uploadedImages = uploadedImages.filter((img) => img.id !== id);
    convertedImages.delete(id);
  }

  function formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  function calculateSavings(original: number, converted: number): string {
    const savings = ((original - converted) / original) * 100;
    return savings.toFixed(1);
  }
</script>

<svelte:head>
  <title>Image Format Converter — ArjoStyle Free Tools</title>
  <meta
    name="description"
    content="Convert images between PNG, JPEG, and WEBP formats. Adjust quality and compare file sizes. No uploads to servers."
  />
</svelte:head>

<div class="min-h-screen bg-surface-900 text-zinc-400">
  <div class="max-w-6xl mx-auto px-4 py-12 md:py-16">
    <!-- Header -->
    <div class="mb-12">
      <h1 class="text-4xl md:text-5xl font-bold text-white mb-3">
        Image Format Converter
      </h1>
      <p class="text-zinc-400 text-lg max-w-2xl">
        Convert images to PNG, JPEG, or WEBP. Optimize file sizes with quality controls.
      </p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-12">
      <!-- Upload & Settings -->
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
          <p class="text-white font-semibold mb-2">Drop images here</p>
          <p class="text-zinc-500 text-sm mb-4">or select files</p>
          <input
            type="file"
            multiple
            accept="image/*"
            onchange={(e) => handleFiles(e.currentTarget.files)}
            class="hidden"
            id="file-input"
          />
          <label for="file-input" class="inline-block">
            <button
              type="button"
              onclick={() => document.getElementById('file-input')?.click()}
              class="bg-orange-500 text-white px-6 py-2 rounded-lg font-semibold hover:bg-orange-400 transition"
            >
              Choose Files
            </button>
          </label>
        </div>

        <!-- Format Settings -->
        <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
          <h2 class="text-white font-bold mb-4">Output Format</h2>
          <div class="space-y-3">
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="format"
                value="png"
                bind:group={selectedFormat}
                class="w-4 h-4 text-orange-500"
              />
              <span class="text-white">PNG</span>
              <span class="text-xs text-zinc-500">(lossless)</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="format"
                value="jpeg"
                bind:group={selectedFormat}
                class="w-4 h-4 text-orange-500"
              />
              <span class="text-white">JPEG</span>
              <span class="text-xs text-zinc-500">(lossy)</span>
            </label>
            <label class="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                name="format"
                value="webp"
                bind:group={selectedFormat}
                class="w-4 h-4 text-orange-500"
              />
              <span class="text-white">WEBP</span>
              <span class="text-xs text-zinc-500">(optimized)</span>
            </label>
          </div>
        </div>

        <!-- Quality Slider -->
        {#if selectedFormat !== 'png'}
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
            <div class="flex justify-between items-center mb-3">
              <h2 class="text-white font-bold">Quality</h2>
              <span class="text-orange-500 font-semibold">{Math.round(quality * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              bind:value={quality}
              class="w-full h-2 bg-zinc-700 rounded-lg appearance-none cursor-pointer"
            />
            <p class="text-xs text-zinc-500 mt-2">Lower = smaller file, lower quality</p>
          </div>
        {/if}

        <!-- Convert Button -->
        {#if uploadedImages.length > 0}
          <button
            onclick={convertAll}
            disabled={isConverting}
            class="w-full bg-orange-500 text-white py-3 rounded-lg font-semibold hover:bg-orange-400 transition disabled:bg-zinc-700 disabled:cursor-not-allowed"
          >
            {isConverting ? 'Converting...' : `Convert All (${uploadedImages.length})`}
          </button>
        {/if}
      </div>

      <!-- Images Grid -->
      <div class="lg:col-span-3">
        {#if uploadedImages.length === 0}
          <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-12 text-center">
            <p class="text-zinc-500 text-lg">No images uploaded yet</p>
            <p class="text-zinc-600 text-sm mt-2">
              Drop images above or click to select files
            </p>
          </div>
        {:else}
          <div class="space-y-4">
            {#each uploadedImages as uploadedImg (uploadedImg.id)}
              {@const converted = convertedImages.get(uploadedImg.id)}
              <div class="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-6">
                <div class="flex flex-col md:flex-row gap-6 items-start">
                  <!-- Original Image -->
                  <div class="flex-1">
                    <h3 class="text-white font-semibold mb-3 text-sm">Original</h3>
                    <img
                      src={uploadedImg.preview}
                      alt="Original"
                      class="w-full max-h-64 object-contain rounded-lg mb-3 bg-surface-900"
                    />
                    <div class="space-y-1 text-sm">
                      <p class="text-zinc-400">
                        <span class="text-zinc-500">File:</span> {uploadedImg.file.name}
                      </p>
                      <p class="text-zinc-400">
                        <span class="text-zinc-500">Size:</span>
                        {formatBytes(uploadedImg.originalSize)}
                      </p>
                      <p class="text-zinc-400">
                        <span class="text-zinc-500">Dimensions:</span>
                        {uploadedImg.width} × {uploadedImg.height}px
                      </p>
                    </div>
                  </div>

                  <!-- Arrow -->
                  <div class="flex items-center justify-center md:py-16">
                    <p class="text-zinc-600 font-bold text-2xl">→</p>
                  </div>

                  <!-- Converted Image -->
                  <div class="flex-1">
                    {#if converted}
                      <h3 class="text-white font-semibold mb-3 text-sm">
                        {selectedFormat.toUpperCase()}
                      </h3>
                      <img
                        src={converted.url}
                        alt="Converted"
                        class="w-full max-h-64 object-contain rounded-lg mb-3 bg-surface-900"
                      />
                      <div class="space-y-1 text-sm mb-4">
                        <p class="text-zinc-400">
                          <span class="text-zinc-500">Size:</span>
                          {formatBytes(converted.size)}
                        </p>
                        <p class="text-green-400">
                          <span class="text-green-600">Saved:</span>
                          {calculateSavings(uploadedImg.originalSize, converted.size)}%
                        </p>
                      </div>
                      <button
                        onclick={() => downloadImage(converted, uploadedImg)}
                        class="w-full bg-orange-500 text-white py-2 rounded-lg font-semibold hover:bg-orange-400 transition text-sm"
                      >
                        Download
                      </button>
                    {:else}
                      <div class="h-64 rounded-lg bg-surface-900 border border-dashed border-zinc-700 flex items-center justify-center">
                        <p class="text-zinc-600 text-sm">Click "Convert All" to start</p>
                      </div>
                    {/if}
                  </div>
                </div>

                <!-- Remove Button -->
                <div class="mt-4 border-t border-zinc-700 pt-4">
                  <button
                    onclick={() => removeImage(uploadedImg.id)}
                    class="text-red-500 hover:text-red-400 text-sm font-medium transition"
                  >
                    Remove Image
                  </button>
                </div>
              </div>
            {/each}
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
