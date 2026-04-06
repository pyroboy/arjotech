<script lang="ts">
  import { Instagram, Github, Facebook } from 'lucide-svelte';
</script>

<footer class="bg-surface-900 border-t border-zinc-800/50 py-12 px-6">
  <div class="max-w-6xl mx-auto mb-8">
    <!-- Three column grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
      <!-- Column 1: Brand -->
      <div>
        <div class="mb-4">
          <h3 class="font-display tracking-wider text-white text-lg font-bold">
            Arjo<span class="text-ink-500">Style</span>
          </h3>
          <p class="text-zinc-500 text-sm mt-1">Tattoo Art & Software</p>
        </div>

        <!-- Social links -->
        <div class="flex gap-4 mt-6">
          <a
            href="https://instagram.com/arjostyle.ink"
            target="_blank"
            rel="noopener noreferrer"
            class="text-zinc-500 hover:text-white transition-colors"
            aria-label="Instagram"
          >
            <Instagram class="w-5 h-5" />
          </a>
          <a
            href="https://github.com/arjomagno"
            target="_blank"
            rel="noopener noreferrer"
            class="text-zinc-500 hover:text-white transition-colors"
            aria-label="GitHub"
          >
            <Github class="w-5 h-5" />
          </a>
          <a
            href="https://facebook.com/arjostyle.ink"
            target="_blank"
            rel="noopener noreferrer"
            class="text-zinc-500 hover:text-white transition-colors"
            aria-label="Facebook"
          >
            <Facebook class="w-5 h-5" />
          </a>
        </div>
      </div>

      <!-- Column 2: Navigation -->
      <div>
        <p class="text-xs uppercase tracking-wider text-zinc-600 mb-3 font-semibold">Navigate</p>
        <ul class="space-y-2">
          <li><a href="/tattoo" class="text-sm text-zinc-400 hover:text-white transition-colors">Tattoo Portfolio</a></li>
          <li><a href="/paintings" class="text-sm text-zinc-400 hover:text-white transition-colors">Paintings</a></li>
          <li><a href="/flash" class="text-sm text-zinc-400 hover:text-white transition-colors">Flash Designs</a></li>
          <li><a href="/software" class="text-sm text-zinc-400 hover:text-white transition-colors">Software Projects</a></li>
          <li><a href="/pricing" class="text-sm text-zinc-400 hover:text-white transition-colors">Pricing</a></li>
          <li><a href="/book" class="text-sm text-zinc-400 hover:text-white transition-colors">Book a Session</a></li>
          <li><a href="/contact" class="text-sm text-zinc-400 hover:text-white transition-colors">Contact</a></li>
        </ul>
      </div>

      <!-- Column 2b: Studio -->
      <div>
        <p class="text-xs uppercase tracking-wider text-zinc-600 mb-3 font-semibold">More</p>
        <ul class="space-y-2">
          <li><a href="/about" class="text-sm text-zinc-400 hover:text-white transition-colors">About</a></li>
          <li><a href="/studio" class="text-sm text-zinc-400 hover:text-white transition-colors">The Studio</a></li>
          <li><a href="/testimonials" class="text-sm text-zinc-400 hover:text-white transition-colors">Testimonials</a></li>
          <li><a href="/faq" class="text-sm text-zinc-400 hover:text-white transition-colors">FAQ</a></li>
          <li><a href="/aftercare" class="text-sm text-zinc-400 hover:text-white transition-colors">Aftercare</a></li>
          <li><a href="/socials" class="text-sm text-zinc-400 hover:text-white transition-colors">Socials</a></li>
        </ul>
      </div>

      <!-- Column 3: Legal -->
      <div>
        <p class="text-xs uppercase tracking-wider text-zinc-600 mb-3 font-semibold">Legal</p>
        <ul class="space-y-2">
          <li>
            <a href="/terms" class="text-sm text-zinc-400 hover:text-white transition-colors">
              Terms & Conditions
            </a>
          </li>
          <li>
            <a href="/privacy" class="text-sm text-zinc-400 hover:text-white transition-colors">
              Privacy Policy
            </a>
          </li>
          <li>
            <a href="/cookies" class="text-sm text-zinc-400 hover:text-white transition-colors">
              Cookie Policy
            </a>
          </li>
          <li>
            <a href="/aftercare" class="text-sm text-zinc-400 hover:text-white transition-colors">
              Aftercare Info
            </a>
          </li>
        </ul>
      </div>
    </div>

    <!-- Bottom bar -->
    <div class="border-t border-zinc-800/50 pt-6">
      <p class="text-xs text-zinc-600 text-center">
        &copy; 2026 ArjoStyle. All rights reserved.
      </p>
    </div>
  </div>
</footer>
