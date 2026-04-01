<script lang="ts">
  import { page } from '$app/stores';
</script>

<svelte:head>
  <title>{$page.status} — Arjo Magno</title>
</svelte:head>

<div class="min-h-screen bg-surface-900 flex items-center justify-center px-6">
  <div class="text-center max-w-md">
    <p class="text-ink-500 font-mono text-sm tracking-widest uppercase mb-4">{$page.status}</p>
    <h1 class="font-display text-4xl sm:text-5xl text-white mb-4">
      {#if $page.status === 404}
        Page Not Found
      {:else}
        Something Went Wrong
      {/if}
    </h1>
    <p class="text-zinc-400 mb-8">
      {#if $page.status === 404}
        The page you're looking for doesn't exist or has been moved.
      {:else}
        {$page.error?.message ?? 'An unexpected error occurred.'}
      {/if}
    </p>
    <div class="flex flex-col sm:flex-row items-center justify-center gap-3">
      <a href="/" class="px-6 py-2.5 bg-ink-500 hover:bg-ink-400 text-white rounded-full font-medium text-sm transition-colors">
        Go Home
      </a>
      <a href="/book" class="px-6 py-2.5 border border-zinc-700 hover:border-zinc-500 text-zinc-300 rounded-full font-medium text-sm transition-colors">
        Book a Session
      </a>
    </div>
  </div>
</div>
