<script lang="ts">
  import { page } from '$app/stores';
  import { Menu, X } from 'lucide-svelte';

  let mobileMenuOpen = $state(false);

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
  ];

  function isActive(href: string): boolean {
    return $page.url.pathname === href;
  }
</script>

<header class="sticky top-0 z-50 backdrop-blur-md bg-surface-900/80 border-b border-zinc-800/50">
  <div class="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
    <!-- Logo -->
    <a href="/" class="flex items-center gap-2 group">
      <span class="font-display tracking-wider text-white text-lg font-bold">
        Arjo<span class="text-ink-500">Style</span>
      </span>
    </a>

    <!-- Desktop nav -->
    <nav class="hidden md:flex items-center gap-8">
      {#each navLinks as link}
        <a
          href={link.href}
          class="text-sm font-medium text-zinc-400 hover:text-white transition-colors {isActive(link.href)
            ? 'text-ink-500'
            : ''}"
        >
          {link.label}
        </a>
      {/each}

      <!-- Book Now CTA -->
      <a
        href="/book"
        class="ml-4 px-4 py-1.5 bg-ink-500 text-white rounded-full text-sm font-semibold hover:bg-ink-400 transition-colors"
      >
        Book Now
      </a>
    </nav>

    <!-- Mobile menu button -->
    <button
      class="md:hidden p-2 hover:bg-zinc-800/50 rounded-lg transition-colors"
      onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
      aria-label="Toggle menu"
    >
      {#if mobileMenuOpen}
        <X class="w-6 h-6 text-white" />
      {:else}
        <Menu class="w-6 h-6 text-white" />
      {/if}
    </button>
  </div>

  <!-- Mobile menu -->
  {#if mobileMenuOpen}
    <div class="fixed inset-0 z-40 bg-surface-900/95 backdrop-blur-xl md:hidden flex flex-col items-center justify-center gap-8">
      <!-- Close button -->
      <button
        class="absolute top-6 right-6 p-2 hover:bg-zinc-800/50 rounded-lg transition-colors"
        onclick={() => (mobileMenuOpen = false)}
        aria-label="Close menu"
      >
        <X class="w-6 h-6 text-white" />
      </button>

      <!-- Mobile nav links -->
      {#each navLinks as link}
        <a
          href={link.href}
          class="text-2xl font-semibold {isActive(link.href) ? 'text-ink-500' : 'text-white hover:text-ink-500'} transition-colors"
          onclick={() => (mobileMenuOpen = false)}
        >
          {link.label}
        </a>
      {/each}

      <!-- Secondary links -->
      <div class="flex flex-wrap gap-x-6 gap-y-2 pt-2 border-t border-zinc-800">
        {#each secondaryLinks as link}
          <a
            href={link.href}
            class="text-sm {isActive(link.href) ? 'text-ink-400' : 'text-zinc-400 hover:text-white'} transition-colors"
            onclick={() => (mobileMenuOpen = false)}
          >
            {link.label}
          </a>
        {/each}
      </div>

      <!-- Mobile Book button -->
      <a
        href="/book"
        class="mt-4 px-6 py-3 bg-ink-500 text-white rounded-full font-semibold hover:bg-ink-400 transition-colors text-lg"
        onclick={() => (mobileMenuOpen = false)}
      >
        Book Now
      </a>
    </div>
  {/if}
</header>
