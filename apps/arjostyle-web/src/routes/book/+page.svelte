<script lang="ts">
  import BookingFlow from '$lib/components/booking/BookingFlow.svelte';
  import { goto } from '$app/navigation';
  import { bookingStore } from '$lib/stores/booking.svelte';
  import { onMount } from 'svelte';

  onMount(() => { bookingStore.loadMappingsFromKV(); });
</script>

<svelte:head>
  <title>Book a Session — Arjo Magno</title>
  <meta name="description" content="Book a custom tattoo session with Arjo Magno. Multi-step booking with 3D body placement and real-time pricing." />
  <meta property="og:title" content="Book a Session — Arjo Magno" />
  <meta property="og:description" content="Book a custom tattoo session with Arjo Magno. Multi-step booking with 3D body placement and real-time pricing." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://arjostyle-web.pages.dev/book" />
</svelte:head>

<div class="min-h-screen bg-dark">
  <div class="sm:max-w-4xl sm:mx-auto min-h-screen flex flex-col">
    <BookingFlow onClose={() => goto('/tattoo')} />
  </div>
</div>