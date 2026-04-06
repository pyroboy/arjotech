<script lang="ts">
  interface Props {
    color?: string;
    size?: string;
    position?: string;
    delay?: number;
  }

  let {
    color = 'bg-ink-500/20',
    size = 'w-[600px] h-[600px]',
    position = 'top-0 left-0',
    delay = 0
  }: Props = $props();
</script>

<div
  class="absolute {position} {size} {color} rounded-full blur-[120px] animate-blob pointer-events-none"
  style="animation-delay: {delay}s;"
  aria-hidden="true"
></div>

<style>
  @keyframes blob {
    0%, 100% { transform: translate(0, 0) scale(1); }
    25% { transform: translate(30px, -50px) scale(1.1); }
    50% { transform: translate(-20px, 20px) scale(0.9); }
    75% { transform: translate(20px, 40px) scale(1.05); }
  }
  .animate-blob {
    animation: blob 20s ease-in-out infinite;
  }
</style>
