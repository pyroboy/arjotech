<script lang="ts">
  import BookingFlow from '$lib/components/booking/BookingFlow.svelte';
  import { goto } from '$app/navigation';
</script>

<svelte:head>
  <title>Book a Session — Arjo Magno</title>
  <meta name="description" content="Book a custom tattoo session with Arjo Magno. Multi-step booking with 3D body placement and real-time pricing." />
</svelte:head>

<div class="min-h-screen bg-surface-900">
  <div class="max-w-4xl mx-auto min-h-screen flex flex-col">
    <BookingFlow onClose={() => goto('/tattoo')} />
  </div>
</div>
