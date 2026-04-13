<script lang="ts">
  import { animateCounter } from '$lib/actions/counterAnimation';
  import { scrollReveal } from '$lib/actions/scrollReveal';

  const metrics = [
    { label: 'Ink', value: 200, suffix: '+', display: 'Tattoos Inked', color: 'text-ink' },
    { label: 'Ink', value: 4.9, suffix: '★', display: 'Client Rating', color: 'text-ink', decimal: true },
    { label: 'Code', value: 5, suffix: '+', display: 'Apps Built', color: 'text-tech', isCode: true },
    { label: 'Code', value: 117, suffix: '', display: 'Components Shipped', color: 'text-tech', isCode: true }
  ];
</script>

<section class="bg-elevated border-b border-border px-6 py-10">
  <div class="max-w-5xl mx-auto">
<<<<<<< Updated upstream
    <div class="grid grid-cols-2 md:grid-cols-4 gap-0 md:gap-px bg-zinc-800/60 rounded-xl overflow-hidden" use:scrollReveal={{ y: 30, stagger: 0.12, children: true }}>
      {#each metrics as metric}
        <div class="flex flex-col items-center gap-2 px-6 py-8 bg-surface-800">
          <span class="text-xs font-mono tracking-[0.4em] {metric.color} uppercase mb-1">{metric.label}</span>
          <span class="text-2xl sm:text-3xl md:text-4xl font-bold text-white tabular-nums">
            <span use:animateCounter={{ target: metric.value, suffix: '', decimal: metric.decimal ?? false }}></span><span class="{metric.label === 'Ink' ? 'text-ink-500' : 'text-tech-500'} {metric.suffix === '★' ? 'text-base sm:text-xl' : 'text-base sm:text-lg'}">{metric.suffix}</span>
=======
    <div class="grid grid-cols-2 md:grid-cols-4 gap-px bg-border" use:scrollReveal={{ y: 30, stagger: 0.12, children: true }}>
      {#each metrics as metric}
        <div class="flex flex-col items-center gap-2 px-6 py-10 bg-elevated">
          <span class="text-[10px] font-mono tracking-[0.4em] {metric.color} uppercase mb-1">{metric.label}</span>
          <span class="text-5xl font-display text-white tabular-nums leading-none">
            <span use:animateCounter={{ target: metric.value, suffix: '', decimal: metric.decimal ?? false }}></span><span class="{metric.isCode ? 'text-tech' : 'text-ink'} text-3xl">{metric.suffix}</span>
>>>>>>> Stashed changes
          </span>
          <span class="text-[10px] font-mono text-zinc-600 tracking-widest uppercase">{metric.display}</span>
        </div>
      {/each}
    </div>
  </div>
</section>
