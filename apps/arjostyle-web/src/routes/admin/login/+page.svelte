<script lang="ts">
  import { enhance } from '$app/forms';
  import { Shield } from 'lucide-svelte';
  import { onMount } from 'svelte';

  let { form } = $props();
  let loading = $state(false);
  let turnstileToken = $state('');

  const SITE_KEY = '0x4AAAAAAC1Uizw_HjYxoSO_';

  onMount(() => {
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js';
    script.async = true;
    script.onload = () => {
      const win = window as Window & { turnstile?: any };
      if (win.turnstile) {
        win.turnstile.render('#turnstile-container', {
          sitekey: SITE_KEY,
          callback: (token: string) => {
            turnstileToken = token;
          }
        });
      }
    };
    document.head.appendChild(script);
  });
</script>

<svelte:head>
  <title>Admin Login | ArjoStyle</title>
</svelte:head>

<div class="min-h-screen bg-surface-900 flex items-center justify-center p-4">
  <div class="w-full max-w-md">
    <div class="text-center mb-8">
      <div class="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-zinc-800/50 border border-zinc-700 mb-4">
        <Shield class="w-8 h-8 text-ink-500" />
      </div>
      <h1 class="text-2xl font-bold text-white">Admin Login</h1>
      <p class="text-zinc-500 mt-2">Sign in to access the admin panel</p>
    </div>

    <div class="bg-surface-800/50 border border-zinc-800 rounded-2xl p-6">
      <form method="POST" use:enhance={() => {
        loading = true;
        return async ({ update }) => {
          loading = false;
          await update();
        };
      }}>
        <input type="hidden" name="turnstileToken" bind:value={turnstileToken} />

        {#if form?.error}
          <div class="mb-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {form.error}
          </div>
        {/if}

        <div class="space-y-4">
          <div>
            <label for="email" class="block text-sm font-medium text-zinc-400 mb-1.5">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              class="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-ink-500 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-zinc-400 mb-1.5">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              required
              class="w-full px-4 py-2.5 bg-zinc-900/50 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-ink-500 transition-colors"
              placeholder="••••••••"
            />
          </div>
        </div>

        <div class="mt-4">
          <div id="turnstile-container"></div>
        </div>

        <button
          type="submit"
          disabled={loading || !turnstileToken}
          class="w-full mt-6 px-5 py-2.5 bg-ink-500 text-white rounded-xl font-semibold hover:bg-ink-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>

    <div class="mt-6 text-center">
      <a href="/" class="text-sm text-zinc-500 hover:text-zinc-400 transition-colors">← Back to website</a>
    </div>
  </div>
</div>

<style>
  :global(.cf-turnstile) {
    display: flex;
    justify-content: center;
  }
</style>