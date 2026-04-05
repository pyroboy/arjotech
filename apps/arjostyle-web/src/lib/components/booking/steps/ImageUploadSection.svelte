<script lang="ts">
  interface Props {
    images: File[];
    isDraggingOver: boolean;
    handleFileChange: (e: Event & { currentTarget: HTMLInputElement }) => void;
    removeImage: (index: number) => void;
    handleDragOver: (e: DragEvent) => void;
    handleDragLeave: (e: DragEvent) => void;
    handleDrop: (e: DragEvent) => void;
    maxImages: number;
    allowedImageTypes: string[];
    maxFileSizeMb: number;
    onShowGuide: () => void;
    uploading?: boolean;
  }

  let {
    images,
    isDraggingOver,
    handleFileChange,
    removeImage,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    maxImages,
    allowedImageTypes,
    maxFileSizeMb,
    onShowGuide,
    uploading = false,
  }: Props = $props();

  function getObjectUrl(file: File): string {
    return URL.createObjectURL(file);
  }
</script>

<div class="mb-6">
  <div class="flex justify-between items-center mb-3">
    <h3 class="text-xl font-semibold text-white flex items-center gap-2">
      Reference Images
      <span class="text-xs text-zinc-400 font-normal bg-zinc-800/30 px-2 py-0.5 rounded-full">
        {images.length}/{maxImages}
      </span>
    </h3>
    <button
      class="text-sm text-ink-500 hover:text-ink-400 underline transition-colors flex items-center gap-1 px-2 py-1 rounded"
      type="button"
      onclick={onShowGuide}
    >
      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10"></circle>
        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
      Submission Guide
    </button>
  </div>

  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="bg-surface-800 transition-all duration-300 border-2 rounded-lg shadow-sm hover:shadow-md relative
      {uploading ? 'opacity-50 pointer-events-none' : ''}
      {isDraggingOver ? 'border-ink-500 border-solid ring-2 ring-ink-500/20' : 'border-dashed border-zinc-700/50'}"
    ondragover={handleDragOver}
    ondragleave={handleDragLeave}
    ondrop={handleDrop}
  >
    {#if images.length === 0}
      <label
        for="file-upload-empty"
        class="flex flex-col items-center justify-center cursor-pointer py-2 px-2 transition-colors rounded-md
          {isDraggingOver ? 'bg-ink-500/10 text-ink-500' : 'hover:bg-zinc-800/20'}"
      >
        <div class="w-16 h-16 rounded-full flex items-center justify-center {isDraggingOver ? 'bg-ink-500/20' : 'bg-zinc-800/30'}">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="{isDraggingOver ? 'text-ink-500' : 'text-zinc-400'}">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
            <circle cx="8.5" cy="8.5" r="1.5"></circle>
            <polyline points="21 15 16 10 5 21"></polyline>
          </svg>
        </div>
        <p class="text-xl font-medium mb-1 text-white">{uploading ? 'Uploading...' : isDraggingOver ? 'Drop images here' : 'Drag / Drop Images here'}</p>
        <p class="text-sm text-center text-zinc-400 max-w-md">
          or click to upload up to {maxImages} images (max {maxFileSizeMb}MB each, JPG/PNG/GIF/WEBP)
        </p>
        <input
          id="file-upload-empty"
          name="file-upload"
          type="file"
          accept={allowedImageTypes.join(',')}
          class="sr-only"
          onchange={handleFileChange}
          multiple
          disabled={uploading || images.length >= maxImages}
          aria-label="Upload reference images"
        />
      </label>
    {:else}
      <div class="p-4">
        <div class="text-zinc-400 text-sm mb-4">
          Drag & drop or click to upload up to {maxImages} images (max {maxFileSizeMb}MB each, JPG/PNG/GIF/WEBP).
        </div>
        <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {#each images as file, index (`${file.name}-${file.size}-${index}`)}
            <div class="relative aspect-square rounded-lg overflow-hidden group border border-zinc-700/30 hover:border-zinc-600 transition-all shadow-sm hover:shadow-md">
              <img
                src={getObjectUrl(file)}
                alt="Reference preview {index + 1}: {file.name}"
                class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-2">
                <p class="text-white text-xs truncate w-full">{file.name}</p>
              </div>
              <button
                type="button"
                onclick={() => removeImage(index)}
                aria-label="Remove image {index + 1}"
                class="absolute top-2 right-2 bg-black/60 text-white rounded-full w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-ink-500 hover:bg-red-600"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </button>
            </div>
          {/each}

          {#if images.length < maxImages}
            <label
              for="file-upload"
              class="relative border-2 rounded-lg flex flex-col items-center justify-center cursor-pointer transition-colors text-zinc-400 hover:text-ink-500 hover:border-ink-500 aspect-square
                {isDraggingOver ? 'border-ink-500 bg-ink-500/10 text-ink-500 border-solid' : 'border-dashed border-zinc-700/50 hover:bg-zinc-800/20'}"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="mb-2">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <line x1="5" y1="12" x2="19" y2="12"></line>
              </svg>
              <span class="text-xs font-medium text-center px-2">{uploading ? 'Uploading...' : isDraggingOver ? 'Drop here' : 'Add image'}</span>
              <input
                id="file-upload"
                name="file-upload"
                type="file"
                accept={allowedImageTypes.join(',')}
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onchange={handleFileChange}
                multiple
                disabled={uploading || images.length >= maxImages}
                aria-label="Upload more reference images"
              />
            </label>
          {/if}
        </div>
      </div>
    {/if}
  </div>
</div>
