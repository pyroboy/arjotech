<script lang="ts">
  import { Menu, X } from 'lucide-svelte';
  import { page } from '$app/stores';

  let { children, data }: { children: any; data: { user: { email: string; name: string }; version: string; commitSha: string } } = $props();
  let mobileNavOpen = $state(false);

  const navSections = [
    {
      label: 'Core',
      items: [
        { href: '/admin/reports', label: 'KPI Dashboard', icon: '📊' },
        { href: '/admin/jobs', label: 'Jobs', icon: '💼' },
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
        { href: '/admin/changelog', label: 'Changelog', icon: '📝' },
      ]
    },
  ];

  // Close mobile nav on route change
  $effect(() => {
    $page.url.pathname;
    mobileNavOpen = false;
  });
  const showSidebar = $derived(!!data.user);
</script>

{#if showSidebar}
<div class="min-h-screen bg-[var(--bg-dark)] flex">
  <!-- Mobile hamburger button -->
  <button
    onclick={() => { mobileNavOpen = !mobileNavOpen; }}
    class="sm:hidden fixed top-3 left-3 z-[60] w-10 h-10 flex items-center justify-center bg-[var(--bg-elevated)] border border-[var(--border)] text-[var(--text-secondary)]"
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
      class="sm:hidden fixed inset-0 bg-[var(--bg-dark)]/80 z-[55]"
      onclick={() => { mobileNavOpen = false; }}
      onkeydown={(e) => { if (e.key === 'Escape') mobileNavOpen = false; }}
    ></div>
  {/if}

  <!-- Sidebar: hidden on mobile, slides in as overlay when hamburger is tapped -->
  <aside class="
    {mobileNavOpen ? 'translate-x-0' : '-translate-x-full'}
    sm:translate-x-0
    fixed sm:relative z-[56] sm:z-auto
    w-64 h-full bg-[var(--bg-elevated)] border-r border-[var(--border)] flex flex-col p-6 shrink-0
    transition-transform duration-150
  ">
    <div class="mb-8">
      <a href="/" class="text-[var(--text-muted)] text-xs font-mono hover:text-[var(--text-primary)]">← arjostyle.com</a>
      <h2 class="text-[var(--text-primary)] font-display mt-2 tracking-wide">ADMIN PANEL</h2>
    </div>
    <nav class="flex-1 space-y-6">
      {#each navSections as section}
        <div>
          <p class="text-[10px] uppercase tracking-widest font-mono text-[var(--text-muted)] mb-2 px-3">{section.label}</p>
          <div class="space-y-0.5">
            {#each section.items as item}
              <a href={item.href} class="flex items-center gap-3 px-3 py-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-dark)] border border-transparent hover:border-[var(--border)] transition-all duration-150 text-sm font-mono">
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </a>
            {/each}
          </div>
        </div>
      {/each}
    </nav>
    <div class="pt-4 border-t border-[var(--border)]">
      <form method="POST" action="/admin/logout">
        <button 
          type="submit" 
          class="w-full text-left px-3 py-2 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-dark)] border border-transparent hover:border-[var(--border)] transition-all duration-150 text-sm font-mono flex items-center gap-2"
        >
          <span>🚪</span>
          <span>LOGOUT</span>
        </button>
      </form>
      <p class="text-zinc-800 text-[10px] font-mono mt-2 uppercase tracking-widest">arjostyle admin {data.version} · {data.commitSha}</p>
    </div>
  </aside>

  <!-- Main content -->
  <main class="flex-1 overflow-auto w-full">
    {@render children()}
  </main>
</div>
{:else}
<!-- Public page layout (no sidebar) -->
<main class="min-h-screen bg-[var(--bg-dark)]">
  {@render children()}
</main>
{/if}