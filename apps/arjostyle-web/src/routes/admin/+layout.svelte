<script lang="ts">
  import { Menu, X } from 'lucide-svelte';
  import { page } from '$app/stores';

  let { children } = $props();
  let mobileNavOpen = $state(false);

  const navSections = [
    {
      label: 'Core',
      items: [
        { href: '/admin/reports', label: 'KPI Dashboard', icon: '📊' },
        { href: '/admin/bookings', label: 'Bookings', icon: '📋' },
        { href: '/admin/leads', label: 'Leads', icon: '🎯' },
      ]
    },
    {
      label: 'Marketing',
      items: [
        { href: '/admin/marketing', label: 'Pipeline', icon: '📣' },
        { href: '/admin/marketing/generate', label: 'Content Generator', icon: '✨' },
        { href: '/admin/marketing/calendar', label: 'Calendar', icon: '📅' },
      ]
    },
    {
      label: 'Content',
      items: [
        { href: '/admin/assets', label: 'Media Assets', icon: '🖼' },
      ]
    },
    {
      label: 'Tools',
      items: [
        { href: '/admin/model', label: '3D Mapping', icon: '🫀' },
        { href: '/admin/ai', label: 'AI Prompts', icon: '🤖' },
      ]
    },
  ];

  // Close mobile nav on route change
  $effect(() => {
    $page.url.pathname;
    mobileNavOpen = false;
  });
</script>

<div class="min-h-screen bg-surface-900 flex">
  <!-- Mobile hamburger button -->
  <button
    onclick={() => { mobileNavOpen = !mobileNavOpen; }}
    class="sm:hidden fixed top-3 left-3 z-[60] w-9 h-9 flex items-center justify-center rounded-lg bg-zinc-800/90 backdrop-blur-sm border border-zinc-700 text-zinc-300"
    aria-label="Toggle navigation"
  >
    {#if mobileNavOpen}
      <X size={18} />
    {:else}
      <Menu size={18} />
    {/if}
  </button>

  <!-- Mobile overlay -->
  {#if mobileNavOpen}
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="sm:hidden fixed inset-0 bg-black/60 z-[55] backdrop-blur-sm"
      onclick={() => { mobileNavOpen = false; }}
      onkeydown={(e) => { if (e.key === 'Escape') mobileNavOpen = false; }}
    ></div>
  {/if}

  <!-- Sidebar: hidden on mobile, slides in as overlay when hamburger is tapped -->
  <aside class="
    {mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}
    sm:translate-x-0
    fixed sm:relative z-[56] sm:z-auto
    w-64 h-full bg-surface-800 border-r border-zinc-800 flex flex-col p-6 shrink-0
    transition-transform duration-200 ease-out
  ">
    <div class="mb-8">
      <a href="/" class="text-zinc-500 text-xs font-mono hover:text-zinc-300">← arjostyle.com</a>
      <h2 class="text-white font-semibold mt-2">Admin Panel</h2>
    </div>
    <nav class="flex-1 space-y-6">
      {#each navSections as section}
        <div>
          <p class="text-zinc-600 text-[10px] uppercase tracking-widest font-semibold mb-2 px-3">{section.label}</p>
          <div class="space-y-0.5">
            {#each section.items as item}
              <a href={item.href} class="flex items-center gap-3 px-3 py-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors text-sm">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            {/each}
          </div>
        </div>
      {/each}
    </nav>
    <div class="pt-4 border-t border-zinc-800">
      <p class="text-zinc-600 text-xs font-mono">arjostyle admin v2</p>
    </div>
  </aside>

  <!-- Main content -->
  <main class="flex-1 overflow-auto w-full">
    {@render children()}
  </main>
</div>
