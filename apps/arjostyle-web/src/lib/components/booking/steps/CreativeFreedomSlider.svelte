<script lang="ts">
  import { Lock, Unlock, Zap, Palette, WandSparkles } from 'lucide-svelte';

  interface Props {
    value: number;
    onchange: (val: number) => void;
    getFreedomDescription: (value: number) => string;
    class?: string;
  }

  let { value, onchange, getFreedomDescription, class: className = '' }: Props = $props();

  const markersData = [
    { value: 0, icon: Lock, label: 'Strict' },
    { value: 33, icon: Unlock, label: 'Balanced' },
    { value: 50, icon: WandSparkles, label: 'Moderate' },
    { value: 66, icon: Zap, label: 'Creative' },
    { value: 100, icon: Palette, label: 'Unrestricted' },
  ];
  const markerValues = markersData.map((m) => m.value);

  let descriptionText = $state('');
  let isAnimatingDescription = $state(false);

  $effect(() => {
    isAnimatingDescription = true;
    descriptionText = getFreedomDescription(value);
    const timer = setTimeout(() => (isAnimatingDescription = false), 300);
    return () => clearTimeout(timer);
  });

  const activeMarker = $derived(markersData.find((marker) => marker.value === value));

  let justSwiped = false;

  function handleClick() {
    if (justSwiped) {
      justSwiped = false;
      return;
    }
    const currentIndex = markerValues.indexOf(value);
    const nextIndex = (currentIndex + 1) % markerValues.length;
    onchange(markerValues[nextIndex]);
  }

  function handleKeyDown(e: KeyboardEvent) {
    const currentIndex = markerValues.indexOf(value);
    let nextIndex = currentIndex;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      nextIndex = Math.min(markerValues.length - 1, currentIndex + 1);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      nextIndex = Math.max(0, currentIndex - 1);
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = markerValues.length - 1;
    }
    if (currentIndex !== nextIndex) onchange(markerValues[nextIndex]);
  }
</script>

<div class="my-6 {className} touch-pan-y">
  <div class="flex flex-col mb-2">
    <h3 class="text-lg font-semibold text-zinc-100 flex items-center gap-2">
      Artist's Creative Freedom {value}%
    </h3>
    <p class="text-xs text-zinc-400">Controls how closely the artist follows reference materials</p>
  </div>

  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    onclick={handleClick}
    onkeydown={handleKeyDown}
    class="relative h-32 sm:h-36 flex flex-col bg-gradient-to-br from-surface-800 to-surface-900 rounded-xl shadow-lg border border-zinc-700 transition-all duration-300 hover:shadow-xl overflow-hidden cursor-grab active:cursor-grabbing"
    role="slider"
    aria-valuemin={0}
    aria-valuemax={100}
    aria-valuenow={value}
    aria-valuetext="{value}%, {activeMarker?.label || descriptionText}"
    aria-label="Creative Freedom Selector"
    tabindex={0}
  >
    <!-- Centered Description Overlay -->
    <div class="absolute inset-0 z-10 flex items-center justify-center p-4 pointer-events-none" aria-hidden="true">
      <div class="text-center py-2 px-8 rounded-md backdrop-blur-sm">
        <p class="text-3xl sm:text-4xl font-light text-white">{descriptionText}</p>
      </div>
    </div>

    <!-- Instruction text -->
    <div class="absolute bottom-2 left-2 z-20 pointer-events-none">
      <p class="text-lg text-zinc-400 opacity-80">Click to change creative freedom</p>
    </div>
  </div>
</div>
