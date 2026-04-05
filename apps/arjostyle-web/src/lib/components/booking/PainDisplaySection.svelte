<script lang="ts">
  import { Zap } from 'lucide-svelte';
  import LevelIndicator from './LevelIndicator.svelte';
  import { cn } from '$lib/utils/cn';

  interface Props {
    painLevel: number;
    painReason?: string;
  }

  let { painLevel, painReason }: Props = $props();

  const iconColor = $derived(
    painLevel <= 4 ? 'text-teal-400' : painLevel <= 6 ? 'text-amber-400' : 'text-orange-500'
  );

  // svelte-ignore state_referenced_locally
  let showPainLevelLabel = $state(!painReason);
  const intervalDuration = 7000;

  $effect(() => {
    if (painReason) {
      showPainLevelLabel = false;
      const timeout = setTimeout(() => {
        showPainLevelLabel = true;
      }, intervalDuration);
      return () => clearTimeout(timeout);
    } else {
      showPainLevelLabel = true;
    }
  });

  const shouldMinimizeIndicator = $derived(painReason ? !showPainLevelLabel : false);
</script>

<div class={cn('space-y-1 flex flex-col')}>
  <div class="flex justify-between items-center text-xs flex-grow">
    <div
      class={cn('relative flex-grow mr-2 flex items-center min-h-10')}
      aria-live="polite"
    >
      <span
        class={cn(
          'absolute inset-0 flex items-center',
          'text-sm font-medium text-zinc-400',
          'transition-opacity duration-300 ease-in-out',
          showPainLevelLabel ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
      >
        <Zap size={14} class={cn('mr-1 inline-block flex-shrink-0', iconColor)} />
        Comfort Level:
      </span>

      {#if painReason}
        <p
          class={cn(
            'absolute inset-0 flex items-center',
            'text-amber-400 text-left',
            'leading-tight',
            'transition-opacity duration-300 ease-in-out',
            !showPainLevelLabel ? 'opacity-100' : 'opacity-0 pointer-events-none'
          )}
          title={painReason}
        >
          {painReason}
        </p>
      {/if}
    </div>
  </div>

  <div class={cn('flex-shrink-0', 'h-6', 'flex items-center')}>
    <LevelIndicator
      level={painLevel}
      ariaLabel="Estimated Pain Level"
      minimized={shouldMinimizeIndicator}
    />
  </div>
</div>
