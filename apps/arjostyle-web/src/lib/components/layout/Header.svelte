<script lang="ts">
  import { page } from '$app/stores';
  import { Menu, X, Sparkles } from 'lucide-svelte';
  import { browser } from '$app/environment';

  let mobileMenuOpen = $state(false);
  let scrolled = $state(false);

  const navLinks = [
    { label: 'Tattoo', href: '/tattoo' },
    { label: 'Paintings', href: '/paintings' },
    { label: 'Software', href: '/software' },
    { label: 'Free Tools', href: '/tools' },
  ];

  const secondaryLinks = [
    { label: 'About', href: '/about' },
    { label: 'Studio', href: '/studio' },
    { label: 'Pricing', href: '/pricing' },
    { label: 'Flash', href: '/flash' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Testimonials', href: '/testimonials' },
    { label: 'Socials', href: '/socials' },
  ];

  function isActive(href: string): boolean {
    if (href === '/') return $page.url.pathname === '/';
    return $page.url.pathname.startsWith(href);
  }

  $effect(() => {
    if (!browser) return;
    function handleScroll() {
      scrolled = window.scrollY > 20;
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  });

  // Lock body scroll when mobile menu is open
  $effect(() => {
    if (!browser) return;
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
  });
</script>

<header
  class="sticky top-0 z-50 transition-all duration-300
    {scrolled ? 'bg-surface-900/90 backdrop-blur-xl border-b border-zinc-800/40 shadow-lg shadow-black/10' : 'bg-transparent border-b border-transparent'}"
>
  <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    <!-- Logo -->
    <a href="/" class="flex items-center gap-2.5 group shrink-0">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-ink-500 to-ink-600 flex items-center justify-center shadow-lg shadow-ink-500/20 group-hover:shadow-ink-500/40 transition-shadow">
        <span class="font-display text-white text-sm font-bold leading-none">A</span>
      </div>
      <span class="font-display tracking-wider text-white text-lg font-bold hidden sm:block">
        Arjo<span class="text-ink-500 group-hover:text-ink-400 transition-colors">Style</span>
      </span>
    </a>

    <!-- Desktop nav -->
    <nav class="hidden lg:flex items-center">
      <!-- Primary links -->
      <div class="flex items-center bg-zinc-800/30 border border-zinc-800/40 rounded-full px-1.5 py-1">
        {#each navLinks as link}
          <a
            href={link.href}
            class="relative px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200
              {isActive(link.href)
                ? 'text-white bg-zinc-700/60 shadow-sm'
                : 'text-zinc-400 hover:text-white hover:bg-zinc-800/50'}"
          >
            {link.label}
          </a>
        {/each}
      </div>

      <!-- Separator -->
      <div class="w-px h-5 bg-zinc-800 mx-4"></div>

      <!-- Secondary links (compact) -->
      <div class="hidden xl:flex items-center gap-1">
        {#each secondaryLinks.slice(0, 4) as link}
          <a
            href={link.href}
            class="px-2.5 py-1.5 text-xs font-medium rounded-lg transition-colors
              {isActive(link.href) ? 'text-zinc-200' : 'text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/30'}"
          >
            {link.label}
          </a>
        {/each}
      </div>
    </nav>

    <!-- Right side -->
    <div class="flex items-center gap-3">
      <!-- Book CTA -->
      <a
        href="/book"
        class="hidden md:inline-flex items-center gap-1.5 px-5 py-2 bg-ink-500 text-white rounded-full text-sm font-semibold
          hover:bg-ink-400 transition-all duration-200 hover:shadow-lg hover:shadow-ink-500/25 hover:-translate-y-px active:translate-y-0 active:shadow-none"
      >
        <Sparkles class="w-3.5 h-3.5" />
        Book Now
      </a>

      <!-- Mobile menu button -->
      <button
        class="lg:hidden relative w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-800/40 border border-zinc-800/50 hover:bg-zinc-700/50 hover:border-zinc-700 transition-all"
        onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
        aria-label="Toggle menu"
        aria-expanded={mobileMenuOpen}
      >
        <div class="transition-all duration-200 {mobileMenuOpen ? 'rotate-90 scale-90' : ''}">
          {#if mobileMenuOpen}
            <X class="w-5 h-5 text-white" />
          {:else}
            <Menu class="w-5 h-5 text-zinc-300" />
          {/if}
        </div>
      </button>
    </div>
  </div>
</header>

<!-- Mobile menu (fullscreen overlay) -->
{#if mobileMenuOpen}
  <div class="fixed inset-0 z-[60] lg:hidden">
    <!-- Backdrop -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div
      class="absolute inset-0 bg-surface-900/98 backdrop-blur-2xl"
      onclick={() => (mobileMenuOpen = false)}
      onkeydown={(e) => { if (e.key === 'Escape') mobileMenuOpen = false; }}
    ></div>

    <!-- Menu content -->
    <div class="relative z-10 flex flex-col h-full">
      <!-- Mobile header -->
      <div class="flex items-center justify-between px-6 h-16 border-b border-zinc-800/30">
        <a href="/" class="flex items-center gap-2.5" onclick={() => (mobileMenuOpen = false)}>
          <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-ink-500 to-ink-600 flex items-center justify-center">
            <span class="font-display text-white text-sm font-bold leading-none">A</span>
          </div>
          <span class="font-display tracking-wider text-white text-lg font-bold">
            Arjo<span class="text-ink-500">Style</span>
          </span>
        </a>
        <button
          class="w-10 h-10 flex items-center justify-center rounded-xl bg-zinc-800/40 border border-zinc-800/50 hover:bg-zinc-700/50 transition-all"
          onclick={() => (mobileMenuOpen = false)}
          aria-label="Close menu"
        >
          <X class="w-5 h-5 text-white" />
        </button>
      </div>

      <!-- Primary links -->
      <div class="flex-1 overflow-y-auto px-6 py-8">
        <p class="text-[11px] uppercase tracking-[0.2em] text-zinc-600 font-semibold mb-4">Portfolio</p>
        <div class="space-y-1 mb-10">
          {#each navLinks as link, i}
            <a
              href={link.href}
              class="flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-200
                {isActive(link.href)
                  ? 'bg-ink-500/10 border border-ink-500/20 text-ink-400'
                  : 'text-white hover:bg-zinc-800/50 border border-transparent'}"
              onclick={() => (mobileMenuOpen = false)}
              style="animation: slideUp 0.3s ease-out {i * 0.05}s both"
            >
              <span class="text-lg font-semibold">{link.label}</span>
              {#if isActive(link.href)}
                <div class="w-2 h-2 rounded-full bg-ink-500"></div>
              {/if}
            </a>
          {/each}
        </div>

        <p class="text-[11px] uppercase tracking-[0.2em] text-zinc-600 font-semibold mb-4">More</p>
        <div class="grid grid-cols-2 gap-1">
          {#each secondaryLinks as link, i}
            <a
              href={link.href}
              class="px-4 py-3 rounded-xl text-sm font-medium transition-all
                {isActive(link.href) ? 'text-zinc-200 bg-zinc-800/40' : 'text-zinc-400 hover:text-white hover:bg-zinc-800/30'}"
              onclick={() => (mobileMenuOpen = false)}
              style="animation: slideUp 0.3s ease-out {0.2 + i * 0.03}s both"
            >
              {link.label}
            </a>
          {/each}
        </div>
      </div>

      <!-- Mobile CTA -->
      <div class="px-6 pb-8 pt-4 border-t border-zinc-800/30">
        <a
          href="/book"
          class="flex items-center justify-center gap-2 w-full py-3.5 bg-ink-500 text-white rounded-2xl font-semibold text-lg
            hover:bg-ink-400 transition-all shadow-lg shadow-ink-500/20 active:scale-[0.98]"
          onclick={() => (mobileMenuOpen = false)}
        >
          <Sparkles class="w-4 h-4" />
          Book Now
        </a>
        <a
          href="/contact"
          class="flex items-center justify-center w-full py-3 mt-2.5 border border-zinc-800 text-zinc-400 rounded-2xl text-sm font-medium
            hover:bg-zinc-800/50 hover:text-white transition-all"
          onclick={() => (mobileMenuOpen = false)}
        >
          Get in Touch
        </a>
      </div>
    </div>
  </div>
{/if}

<style>
  @keyframes slideUp {
    from {
      opacity: 0;
      transform: translateY(12px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
