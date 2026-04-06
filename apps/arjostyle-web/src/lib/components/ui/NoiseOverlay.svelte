<script lang="ts">
  import { browser } from '$app/environment';

  let visible = $state(false);

  $effect(() => {
    if (browser) {
      const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
      visible = !mq.matches;
    }
  });
</script>

{#if visible}
  <div class="pointer-events-none fixed inset-0 z-[9999] opacity-[0.03]" aria-hidden="true">
    <svg class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
      <filter id="noise">
        <feTurbulence type="fractalNoise" baseFrequency="0.80" numOctaves="4" stitchTiles="stitch" />
        <feColorMatrix type="saturate" values="0" />
      </filter>
      <rect width="100%" height="100%" filter="url(#noise)" />
    </svg>
  </div>
{/if}
