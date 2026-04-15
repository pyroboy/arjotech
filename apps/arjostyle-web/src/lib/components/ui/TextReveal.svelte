<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  interface Props {
    text: string;
    class?: string;
    delay?: number;
    stagger?: number;
    tag?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  }

  let {
    text,
    class: className = '',
    delay = 0,
    stagger = 0.04,
    tag = 'h2'
  }: Props = $props();

  let el: HTMLElement;
  let animated = $state(false);

  onMount(async () => {
    if (!browser || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animated = true;
      return;
    }

    const { gsap } = await import('$lib/utils/gsap');

    const chars = el.querySelectorAll('.char');
    gsap.set(chars, { y: 40, opacity: 0 });

    gsap.to(chars, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger,
      delay,
      ease: 'power3.out'
    });

    animated = true;
  });

  const chars = $derived(text.split(''));
</script>

<!-- svelte-ignore a11y_consider_explicit_label -->
<svelte:element this={tag} bind:this={el} class="{className} inline-block overflow-hidden" aria-label={text}>
  {#each chars as char}
    <span class="char inline-block {char === ' ' ? 'w-[0.3em]' : ''}" aria-hidden="true"
      >{char === ' ' ? '\u00A0' : char}</span>
  {/each}
</svelte:element>
