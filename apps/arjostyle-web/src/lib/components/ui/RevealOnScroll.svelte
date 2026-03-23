<script lang="ts">
  import { cn } from '$lib/utils/cn';
  import type { Snippet } from 'svelte';

  type AnimationType = 'fade-in' | 'fade-in-up' | 'fade-in-down' | 'zoom-in' | 'slide-in-left' | 'slide-in-right';

  interface Props {
    children: Snippet;
    animation?: AnimationType;
    delay?: number;
    duration?: number;
    threshold?: number;
    class?: string;
    once?: boolean;
    easing?: string;
    rootMargin?: string;
  }

  let {
    children,
    animation = 'fade-in-up',
    delay = 0,
    duration = 100,
    threshold = 0.1,
    class: className,
    once = true,
    easing = 'ease-out',
    rootMargin = '0px 0px -10px 0px',
  }: Props = $props();

  let isVisible = $state(false);
  let el: HTMLDivElement;

  $effect(() => {
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          isVisible = true;
          if (once) observer.disconnect();
        } else if (!once) {
          isVisible = false;
        }
      },
      { threshold, rootMargin }
    );
    observer.observe(el);
    return () => observer.disconnect();
  });

  function getAnimationStartClasses(anim: AnimationType): string {
    switch (anim) {
      case 'fade-in': return 'opacity-0';
      case 'fade-in-up': return 'opacity-0 translate-y-5';
      case 'fade-in-down': return 'opacity-0 -translate-y-5';
      case 'zoom-in': return 'opacity-0 scale-90';
      case 'slide-in-left': return 'opacity-0 -translate-x-8';
      case 'slide-in-right': return 'opacity-0 translate-x-8';
      default: return 'opacity-0';
    }
  }
</script>

<div
  bind:this={el}
  class={cn(
    'transition-all transform',
    easing,
    !isVisible && getAnimationStartClasses(animation),
    isVisible && 'opacity-100 translate-y-0 translate-x-0 scale-100',
    className
  )}
  style="transition-duration: {duration}ms; transition-delay: {delay}ms;"
>
  {@render children()}
</div>
