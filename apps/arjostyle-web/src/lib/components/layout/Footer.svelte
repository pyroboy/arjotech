<script lang="ts">
  import { Instagram, Github, Facebook, ArrowUpRight, Mail, MapPin } from 'lucide-svelte';
</script>

<footer class="relative bg-dark border-t border-border">
  <div class="relative z-10 max-w-6xl mx-auto px-6">
    <!-- Main footer grid -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-12 py-16">

      <!-- Brand column -->
      <div class="md:col-span-4">
        <a href="/" class="inline-block group">
          <h3 class="font-display tracking-wider text-2xl text-white group-hover:text-ink transition-colors">
            ARJO<span class="text-ink">STYLE</span>
          </h3>
        </a>
        <p class="text-zinc-500 text-sm mt-3 leading-relaxed max-w-xs">
          Full-stack developer, AI engineer & tattoo artist. Building intelligent systems and permanent art from the Philippines.
        </p>

        <!-- Contact info -->
        <div class="mt-5 space-y-2">
          <a href="mailto:hello@arjostyle.com" class="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors text-sm group">
            <Mail class="w-3.5 h-3.5 text-zinc-600 group-hover:text-ink transition-colors" />
            hello@arjostyle.com
          </a>
          <div class="flex items-center gap-2 text-zinc-600 text-sm">
            <MapPin class="w-3.5 h-3.5" />
            Tagbilaran City, Bohol
          </div>
        </div>

        <!-- Social icons -->
        <div class="flex gap-2 mt-6">
          {#each [
            { href: 'https://instagram.com/arjostyle.ink', icon: Instagram, label: 'Instagram' },
            { href: 'https://github.com/arjomagno', icon: Github, label: 'GitHub' },
            { href: 'https://facebook.com/arjostyle.ink', icon: Facebook, label: 'Facebook' }
          ] as social}
            <a
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              class="w-10 h-10 bg-elevated border border-border flex items-center justify-center text-zinc-500 hover:text-white hover:border-border-light transition-all duration-150"
              aria-label={social.label}
            >
              <social.icon class="w-4 h-4" />
            </a>
          {/each}
        </div>
      </div>

      <!-- Nav columns -->
      <div class="md:col-span-2">
        <p class="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-mono font-semibold mb-4">Portfolio</p>
        <ul class="space-y-2">
          {#each [
            { href: '/tattoo', label: 'Tattoo Work' },
            { href: '/paintings', label: 'Paintings' },
            { href: '/flash', label: 'Flash Designs' },
            { href: '/software', label: 'Software' },
            { href: '/pricing', label: 'Pricing' }
          ] as link}
            <li>
              <a href={link.href} class="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1 group">
                {link.label}
                <ArrowUpRight class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <div class="md:col-span-2">
        <p class="text-[10px] uppercase tracking-[0.2em] text-zinc-600 font-mono font-semibold mb-4">Studio</p>
        <ul class="space-y-2">
          {#each [
            { href: '/about', label: 'About' },
            { href: '/studio', label: 'The Studio' },
            { href: '/testimonials', label: 'Testimonials' },
            { href: '/faq', label: 'FAQ' },
            { href: '/aftercare', label: 'Aftercare' },
            { href: '/socials', label: 'Socials' }
          ] as link}
            <li>
              <a href={link.href} class="text-sm text-zinc-400 hover:text-white transition-colors inline-flex items-center gap-1 group">
                {link.label}
                <ArrowUpRight class="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
              </a>
            </li>
          {/each}
        </ul>
      </div>

      <!-- CTA column -->
      <div class="md:col-span-4">
        <div class="bg-elevated border border-border p-6">
          <p class="text-white font-display text-xl tracking-wide mb-2">READY TO CREATE?</p>
          <p class="text-zinc-500 text-sm leading-relaxed mb-5">Book a tattoo session or reach out about a software project.</p>
          <div class="flex flex-col gap-2">
            <a href="/book" class="text-center px-5 py-3 bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors">
              BOOK A TATTOO
            </a>
            <a href="/contact" class="text-center px-5 py-3 border border-border text-zinc-300 text-sm font-medium hover:bg-elevated hover:border-border-light transition-colors">
              GET IN TOUCH
            </a>
          </div>
        </div>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p class="text-xs text-zinc-600">
        &copy; {new Date().getFullYear()} ARJOSTYLE. All rights reserved.
      </p>
      <div class="flex gap-6 items-center">
        {#each [
          { href: '/terms', label: 'Terms' },
          { href: '/privacy', label: 'Privacy' },
          { href: '/cookies', label: 'Cookies' }
        ] as link}
          <a href={link.href} class="text-xs text-zinc-600 hover:text-zinc-400 transition-colors">{link.label}</a>
        {/each}
        <a href="/admin" class="text-xs text-zinc-700 hover:text-zinc-500 transition-colors">Admin</a>
      </div>
    </div>
  </div>
</footer>
