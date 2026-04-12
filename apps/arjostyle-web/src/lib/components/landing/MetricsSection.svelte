<script lang="ts">
  import { animateCounter } from '$lib/actions/counterAnimation';
  import { scrollReveal } from '$lib/actions/scrollReveal';

  const metrics = [
    { label: 'Ink', value: 200, suffix: '+', display: 'Tattoos Inked', color: 'text-ink-500/60' },
    { label: 'Ink', value: 4.9, suffix: '★', display: 'Client Rating', color: 'text-ink-500/60', decimal: true },
    { label: 'Code', value: 5, suffix: '+', display: 'Apps Built', color: 'text-tech-500/60' },
    { label: 'Code', value: 117, suffix: ' ⚡', display: 'Components Shipped', color: 'text-tech-500/60' }
  ];
</script>

<section class="bg-surface-800 border-b border-zinc-800/50 px-6 py-10">
  <div class="max-w-5xl mx-auto">
    <div class="grid grid-cols-2 md:grid-cols-4 gap-0 md:gap-px bg-zinc-800/60 rounded-xl overflow-hidden" use:scrollReveal={{ y: 30, stagger: 0.12, children: true }}>
      {#each metrics as metric}
        <div class="flex flex-col items-center gap-2 px-6 py-8 bg-surface-800">
          <span class="text-xs font-mono tracking-[0.4em] {metric.color} uppercase mb-1">{metric.label}</span>
          <span class="text-4xl font-bold text-white tabular-nums">
            <span use:animateCounter={{ target: metric.value, suffix: '', decimal: metric.decimal ?? false }}></span><span class="{metric.label === 'Ink' ? 'text-ink-500' : 'text-tech-500'} {metric.suffix === '★' ? 'text-2xl' : ''}">{metric.suffix}</span>
          </span>
          <span class="text-xs text-zinc-500 tracking-widest uppercase font-medium">{metric.display}</span>
        </div>
      {/each}
    </div>
  </div>
</section>
