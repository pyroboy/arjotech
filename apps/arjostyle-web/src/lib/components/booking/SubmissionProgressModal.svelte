<script lang="ts">
  import { Loader2, CheckCircle, AlertTriangle, UploadCloud } from 'lucide-svelte';
  import { cn } from '$lib/utils/cn';

  interface Props {
    isOpen: boolean;
    progress: number;
    statusText: string;
    totalFiles?: number;
    filesUploaded?: number;
    isError?: boolean;
    isSuccess?: boolean;
  }

  let {
    isOpen,
    progress,
    statusText,
    totalFiles,
    filesUploaded,
    isError = false,
    isSuccess = false,
  }: Props = $props();

  const iconInfo = $derived.by(() => {
    if (isSuccess) return { icon: CheckCircle, className: 'h-8 w-8 text-green-500' };
    if (isError) return { icon: AlertTriangle, className: 'h-8 w-8 text-red-500' };
    if (statusText.toLowerCase().includes('uploading') || statusText.toLowerCase().includes('processing image'))
      return { icon: UploadCloud, className: 'h-8 w-8 text-ink-500 animate-pulse' };
    return { icon: Loader2, className: 'h-8 w-8 animate-spin text-ink-500' };
  });
</script>

{#if isOpen}
  <div class="fixed inset-0 z-[200] flex items-center justify-center">
    <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
    <div class="relative z-10 w-full max-w-[425px] mx-4 bg-surface-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
      <div class="text-center mb-4">
        <h3 class="text-xl font-semibold text-white">Submitting Your Request</h3>
        <p class="text-sm text-zinc-400 mt-1">Please wait while we process your booking...</p>
      </div>
      <div class="py-6 px-2 space-y-4">
        <div class="flex justify-center items-center mb-4 h-8">
          {#if iconInfo}
            {@const Icon = iconInfo.icon}
            <Icon
              class={cn('transition-all', iconInfo.className)}
            />
          {/if}
        </div>
        <div class="w-full bg-zinc-800 rounded-full h-2.5 overflow-hidden">
          <div
            class="bg-ink-500 h-full rounded-full transition-all duration-500 ease-out"
            style="width: {progress}%"
          ></div>
        </div>
        <p class="text-center text-sm text-zinc-400 mt-2 min-h-[20px]">
          {statusText}
          {#if totalFiles && filesUploaded !== undefined && progress < 100 && !isError && !isSuccess}
            <span class="ml-1">({filesUploaded} / {totalFiles})</span>
          {/if}
        </p>
      </div>
    </div>
  </div>
{/if}
