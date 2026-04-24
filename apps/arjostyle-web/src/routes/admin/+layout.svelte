<script lang="ts">
  import { Menu, X, LayoutDashboard, Users, Calendar, BarChart3, Settings, LogOut, Megaphone, Image, BrainCircuit, Map, FileText, Rocket, MessageSquare } from 'lucide-svelte';
  import { page } from '$app/stores';

  let { children, data }: { children: any; data: { user: { email: string; name: string }; version: string; commitSha: string } } = $props();
  let mobileNavOpen = $state(false);

  const iconMap: Record<string, any> = {
    '/admin/reports': LayoutDashboard,
    '/admin/jobs': Users,
    '/admin/opportunities': Rocket,
    '/admin/bookings': Calendar,
    '/admin/leads': Users,
    '/admin/marketing': Megaphone,
    '/admin/marketing/generate': BrainCircuit,
    '/admin/marketing/calendar': Calendar,
    '/admin/assets': Image,
    '/admin/testimonials': MessageSquare,
    '/admin/model': Map,
    '/admin/ai': BrainCircuit,
    '/admin/changelog': FileText,
  };

  const navSections = [
    {
      label: 'Core',
      items: [
        { href: '/admin/reports', label: 'KPI Dashboard' },
        { href: '/admin/jobs', label: 'Jobs' },
        { href: '/admin/opportunities', label: 'Opportunities' },
        { href: '/admin/bookings', label: 'Bookings' },
        { href: '/admin/leads', label: 'Leads' },
      ]
    },
    {
      label: 'Marketing',
      items: [
        { href: '/admin/marketing', label: 'Pipeline' },
        { href: '/admin/marketing/generate', label: 'Content Generator' },
        { href: '/admin/marketing/calendar', label: 'Calendar' },
      ]
    },
    {
      label: 'Content',
      items: [
        { href: '/admin/assets', label: 'Media Assets' },
        { href: '/admin/testimonials', label: 'Testimonials' },
      ]
    },
    {
      label: 'Tools',
      items: [
        { href: '/admin/model', label: '3D Mapping' },
        { href: '/admin/ai', label: 'AI Prompts' },
        { href: '/admin/changelog', label: 'Changelog' },
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
<div class="admin-shell">
  <!-- Mobile hamburger -->
  <button
    onclick={() => { mobileNavOpen = !mobileNavOpen; }}
    class="admin-hamburger"
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
      class="admin-mobile-overlay"
      onclick={() => { mobileNavOpen = false; }}
      onkeydown={(e) => { if (e.key === 'Escape') mobileNavOpen = false; }}
    ></div>
  {/if}

  <!-- Sidebar -->
  <aside class="admin-sidebar" class:admin-sidebar--open={mobileNavOpen}>
    <!-- Brand -->
    <div class="admin-brand">
      <a href="/" class="admin-brand-link">← arjostyle.com</a>
      <h2 class="admin-brand-title">ADMIN</h2>
    </div>

    <!-- Nav -->
    <nav class="admin-nav">
      {#each navSections as section}
        <div class="admin-nav-section">
          <p class="admin-nav-section-label">{section.label}</p>
          {#each section.items as item}
            {@const Icon = iconMap[item.href] || BarChart3}
            {@const isActive = $page.url.pathname === item.href || ($page.url.pathname.startsWith(item.href) && item.href !== '/admin')}
            <a href={item.href} class="admin-nav-item" class:admin-nav-item--active={isActive}>
              <Icon size={15} />
              <span>{item.label}</span>
            </a>
          {/each}
        </div>
      {/each}
    </nav>

    <!-- Footer -->
    <div class="admin-sidebar-footer">
      <form method="POST" action="/admin/logout">
        <button type="submit" class="admin-logout-btn">
          <LogOut size={14} />
          <span>Logout</span>
        </button>
      </form>
      <p class="admin-version">arjostyle admin {data.version} · {data.commitSha}</p>
    </div>
  </aside>

  <!-- Main content -->
  <main class="admin-main">
    {@render children()}
  </main>
</div>
{:else}
<main class="admin-shell admin-shell--public">
  {@render children()}
</main>
{/if}

<style>
  /* ── Shell ─────────────────────────────────── */
  .admin-shell {
    display: flex;
    min-height: 100vh;
    background: var(--admin-root);
    font-family: var(--admin-font);
  }

  .admin-shell--public {
    display: block;
  }

  /* ── Hamburger ─────────────────────────────── */
  .admin-hamburger {
    display: none;
    position: fixed;
    top: 12px;
    left: 12px;
    z-index: 70;
    width: 38px;
    height: 38px;
    align-items: center;
    justify-content: center;
    background: var(--admin-panel);
    border: 1px solid var(--admin-border-standard);
    border-radius: 8px;
    color: var(--admin-text-secondary);
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .admin-hamburger { display: flex; }
  }

  /* ── Mobile overlay ────────────────────────── */
  .admin-mobile-overlay {
    display: none;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    z-index: 60;
  }

  @media (max-width: 768px) {
    .admin-mobile-overlay { display: block; }
  }

  /* ── Sidebar ──────────────────────────────── */
  .admin-sidebar {
    width: 220px;
    min-width: 220px;
    height: 100vh;
    position: sticky;
    top: 0;
    background: var(--admin-panel);
    border-right: 1px solid var(--admin-border-subtle);
    display: flex;
    flex-direction: column;
    padding: 24px 12px;
    overflow-y: auto;
    z-index: 65;
    transition: transform 150ms ease;
  }

  @media (max-width: 768px) {
    .admin-sidebar {
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      transform: translateX(-100%);
      z-index: 65;
    }
    .admin-sidebar--open {
      transform: translateX(0);
    }
  }

  /* ── Brand ────────────────────────────────── */
  .admin-brand {
    padding: 0 8px 20px;
  }

  .admin-brand-link {
    font-size: 10px;
    font-weight: 400;
    color: var(--admin-text-muted);
    text-decoration: none;
    font-family: var(--font-mono, monospace);
    display: block;
    margin-bottom: 4px;
  }

  .admin-brand-link:hover {
    color: var(--admin-text-secondary);
  }

  .admin-brand-title {
    font-size: 11px;
    font-weight: 590;
    color: var(--admin-text-primary);
    letter-spacing: 0.1em;
    font-family: var(--font-display, sans-serif);
  }

  /* ── Nav ──────────────────────────────────── */
  .admin-nav {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }

  .admin-nav-section {
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .admin-nav-section-label {
    font-size: 10px;
    font-weight: 590;
    color: var(--admin-text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    padding: 0 8px;
    margin-bottom: 4px;
  }

  .admin-nav-item {
    display: flex;
    align-items: center;
    gap: 9px;
    padding: 7px 8px;
    border-radius: 7px;
    font-size: 13px;
    font-weight: 510;
    color: var(--admin-text-secondary);
    text-decoration: none;
    transition: background 100ms ease, color 100ms ease;
    position: relative;
  }

  .admin-nav-item:hover {
    background: var(--admin-surface);
    color: var(--admin-text-primary);
  }

  .admin-nav-item--active {
    background: var(--admin-accent-subtle);
    color: var(--admin-accent-alt);
  }

  .admin-nav-item--active::before {
    content: '';
    position: absolute;
    left: -12px;
    top: 50%;
    transform: translateY(-50%);
    width: 3px;
    height: 18px;
    background: var(--admin-accent);
    border-radius: 0 2px 2px 0;
  }

  /* ── Sidebar footer ───────────────────────── */
  .admin-sidebar-footer {
    border-top: 1px solid var(--admin-border-subtle);
    padding-top: 12px;
    margin-top: 4px;
  }

  .admin-logout-btn {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 7px 8px;
    border-radius: 7px;
    font-size: 13px;
    font-weight: 510;
    color: var(--admin-text-muted);
    background: transparent;
    border: none;
    cursor: pointer;
    transition: background 100ms ease, color 100ms ease;
    font-family: var(--admin-font);
  }

  .admin-logout-btn:hover {
    background: var(--admin-surface);
    color: var(--admin-text-secondary);
  }

  .admin-version {
    font-size: 9px;
    color: #2a2a2e;
    font-family: var(--font-mono, monospace);
    padding: 0 8px;
    margin-top: 6px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
  }

  /* ── Main ─────────────────────────────────── */
  .admin-main {
    flex: 1;
    min-width: 0;
    overflow: auto;
  }
</style>
