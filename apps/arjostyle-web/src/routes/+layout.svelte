<script lang="ts">
  import Header from '$lib/components/layout/Header.svelte';
  import Footer from '$lib/components/layout/Footer.svelte';
  import { page } from '$app/stores';
  import { ModeWatcher } from 'mode-watcher';
  import '../app.css';

  let { children } = $props();

  // Don't show header/footer on admin pages or booking flow
  let isAdminPage = $derived($page.url.pathname.startsWith('/admin'));
  let isBookingPage = $derived($page.url.pathname === '/book');
</script>

<ModeWatcher defaultMode="dark" />

{#if isAdminPage}
  {@render children()}
{:else}
  <div class="min-h-screen flex flex-col bg-surface-900 text-zinc-100">
    {#if !isBookingPage}
      <Header />
    {/if}
    <main class="flex-1">
      {@render children()}
    </main>
    {#if !isBookingPage}
      <Footer />
    {/if}
  </div>
{/if}
