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
  class="sticky top-0 z-50 transition-all duration-150
    {scrolled ? 'bg-dark/95 border-b border-border' : 'bg-transparent border-b border-transparent'}"
>
  <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    <!-- Logo -->
    <a href="/" class="flex items-center gap-3 group shrink-0">
      <div class="w-9 h-9 bg-ink flex items-center justify-center group-hover:bg-ink-600 transition-colors">
        <span class="font-display text-white text-xl leading-none tracking-tight">A</span>
      </div>
      <span class="font-display tracking-wider text-white text-xl leading-none hidden sm:block">
        ARJO<span class="text-ink">STYLE</span>
      </span>
    </a>

    <!-- Desktop nav -->
    <nav class="hidden lg:flex items-center">
      <!-- Primary links -->
      <div class="flex items-center border border-border">
        {#each navLinks as link}
          <a
            href={link.href}
            class="relative px-5 py-2 text-sm font-medium transition-all duration-150
              {isActive(link.href)
                ? 'bg-white text-dark font-semibold'
                : 'text-zinc-400 hover:text-white hover:bg-elevated'}"
          >
            {link.label}
          </a>
        {/each}
      </div>

      <!-- Separator -->
      <div class="w-px h-6 bg-border mx-4"></div>

      <!-- Secondary links (compact) -->
      <div class="hidden xl:flex items-center gap-0.5">
        {#each secondaryLinks.slice(0, 4) as link}
          <a
            href={link.href}
            class="px-3 py-2 text-xs font-medium transition-colors duration-150
              {isActive(link.href) ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'}"
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
        class="hidden md:inline-flex items-center gap-2 px-5 py-2 bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition-all duration-150 translate-y-0 hover:-translate-y-0.5"
      >
        <Sparkles class="w-3.5 h-3.5" />
        BOOK NOW
      </a>

      <!-- Mobile menu button -->
      <button
        class="lg:hidden relative w-10 h-10 flex items-center justify-center bg-elevated border border-border hover:border-border-light transition-all duration-150"
        onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
        aria-label="Toggle menu"
        aria-expanded={mobileMenuOpen}
      >
        <div class="transition-all duration-150 {mobileMenuOpen ? 'rotate-90' : ''}">
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
      class="absolute inset-0 bg-dark/98"
      onclick={() => (mobileMenuOpen = false)}
      onkeydown={(e) => { if (e.key === 'Escape') mobileMenuOpen = false; }}
    ></div>

    <!-- Menu content -->
    <div class="relative z-10 flex flex-col h-full">
      <!-- Mobile header -->
      <div class="flex items-center justify-between px-6 h-16 border-b border-border">
        <a href="/" class="flex items-center gap-3" onclick={() => (mobileMenuOpen = false)}>
          <div class="w-9 h-9 bg-ink flex items-center justify-center">
            <span class="font-display text-white text-xl leading-none tracking-tight">A</span>
          </div>
          <span class="font-display tracking-wider text-white text-xl leading-none">
            ARJO<span class="text-ink">STYLE</span>
          </span>
        </a>
        <button
          class="w-10 h-10 flex items-center justify-center bg-elevated border border-border hover:border-border-light transition-all"
          onclick={() => (mobileMenuOpen = false)}
          aria-label="Close menu"
        >
          <X class="w-5 h-5 text-white" />
        </button>
      </div>

      <!-- Primary links -->
      <div class="flex-1 overflow-y-auto px-6 py-8">
        <p class="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-mono font-semibold mb-4">Portfolio</p>
        <div class="space-y-0.5 mb-12">
          {#each navLinks as link, i}
            <a
              href={link.href}
              class="flex items-center justify-between px-4 py-4 border border-transparent transition-all duration-150
                {isActive(link.href)
                  ? 'bg-white text-dark border-border font-semibold'
                  : 'text-white hover:bg-elevated hover:border-border'}"
              onclick={() => (mobileMenuOpen = false)}
              style="animation: slideUp 0.2s ease-out {i * 50}ms both"
            >
              <span class="text-lg font-display tracking-wide">{link.label.toUpperCase()}</span>
              {#if isActive(link.href)}
                <div class="w-2 h-2 bg-red-500"></div>
              {/if}
            </a>
          {/each}
        </div>

        <p class="text-[10px] uppercase tracking-[0.3em] text-zinc-600 font-mono font-semibold mb-4">More</p>
        <div class="grid grid-cols-2 gap-0.5">
          {#each secondaryLinks as link, i}
            <a
              href={link.href}
              class="px-4 py-3 text-sm font-medium border border-transparent transition-all duration-150
                {isActive(link.href) ? 'text-white bg-elevated border-border' : 'text-zinc-400 hover:text-white hover:bg-elevated hover:border-border'}"
              onclick={() => (mobileMenuOpen = false)}
              style="animation: slideUp 0.2s ease-out {200 + i * 30}ms both"
            >
              {link.label}
            </a>
          {/each}
        </div>
      </div>

      <!-- Mobile CTA -->
      <div class="px-6 pb-8 pt-4 border-t border-border">
        <a
          href="/book"
          class="flex items-center justify-center gap-2 w-full py-4 bg-red-500 text-white font-bold text-base hover:bg-red-600 transition-all duration-150"
          onclick={() => (mobileMenuOpen = false)}
        >
          <Sparkles class="w-4 h-4" />
          BOOK NOW
        </a>
        <a
          href="/contact"
          class="flex items-center justify-center w-full py-3 mt-2 border border-border text-zinc-400 text-sm font-medium hover:bg-elevated hover:text-white hover:border-border-light transition-all duration-150"
          onclick={() => (mobileMenuOpen = false)}
        >
          Get in Touch
        </a>
      </div>
    </div>
  </div>
{/if}
