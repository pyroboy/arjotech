<script lang="ts">
  import { cn } from '$lib/utils/cn';

  interface Props {
    level: number;
    colorStops?: { level: number; colorClass: string }[];
    ariaLabel: string;
    showDivisions?: boolean;
    class?: string;
    minimized?: boolean;
  }

  let {
    level,
    colorStops,
    ariaLabel,
    showDivisions = false,
    class: className,
    minimized = false,
  }: Props = $props();

  const validLevel = $derived(Math.max(1, Math.min(10, level || 1)));
  const percentage = $derived(validLevel * 10);

  const defaultPainColors: { level: number; colorClass: string }[] = [
    { level: 2, colorClass: 'bg-teal-400' },
    { level: 4, colorClass: 'bg-emerald-400' },
    { level: 6, colorClass: 'bg-amber-400' },
    { level: 8, colorClass: 'bg-amber-500' },
    { level: 10, colorClass: 'bg-orange-500' },
  ];

  function getActiveColor(lvl: number, stops: { level: number; colorClass: string }[]): string {
    const sortedStops = [...stops].sort((a, b) => a.level - b.level);
    for (const stop of sortedStops) {
      if (lvl <= stop.level) return stop.colorClass;
    }
    return sortedStops[sortedStops.length - 1]?.colorClass || 'bg-muted';
  }

  const colors = $derived(colorStops || defaultPainColors);
  const activeColor = $derived(getActiveColor(validLevel, colors));
</script>

<div
  class={cn(
    'w-full bg-zinc-800/60 rounded-full overflow-hidden relative',
    minimized ? 'h-1.5 my-1' : 'h-3 my-1.5',
    className
  )}
  title="{ariaLabel}: {validLevel}/10"
>
  <div
    class={cn(
      'h-full rounded-l-full shadow-inner',
      percentage >= 100 ? 'rounded-r-full' : '',
      'transition-all duration-500 ease-out',
      activeColor
    )}
    style="width: {percentage}%"
    role="meter"
    aria-valuenow={validLevel}
    aria-valuemin={1}
    aria-valuemax={10}
    aria-label={ariaLabel}
  ></div>

  {#if showDivisions}
    <div class="absolute inset-y-0 left-[33.33%] w-px bg-zinc-900/50 opacity-80"></div>
    <div class="absolute inset-y-0 left-[66.66%] w-px bg-zinc-900/50 opacity-80"></div>
  {/if}
</div>
