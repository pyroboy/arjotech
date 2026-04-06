<script lang="ts">
  import HeroRedesign from '$lib/components/landing/HeroRedesign.svelte';
  import AboutSection from '$lib/components/landing/AboutSection.svelte';
  import MetricsSection from '$lib/components/landing/MetricsSection.svelte';
  import SoftwareProjectsSection from '$lib/components/landing/SoftwareProjectsSection.svelte';
  import WebsitesSection from '$lib/components/landing/WebsitesSection.svelte';
  import TattooPortfolioSection from '$lib/components/landing/TattooPortfolioSection.svelte';
  import BookingCTASection from '$lib/components/landing/BookingCTASection.svelte';
  import BookingModal from '$lib/components/landing/BookingModal.svelte';
  import { bookingStore } from '$lib/stores/booking.svelte';
  import { imageUrls, softwareProjects, websiteProjects } from '$data/portfolioData';
  import { onMount } from 'svelte';

  let showBooking = $state(false);

  onMount(() => { bookingStore.loadMappingsFromKV(); });

  const featuredProjects = softwareProjects.filter(p => p.featured);
</script>

<svelte:head>
  <title>Arjo Magno — Tattoo Artist & Software Developer</title>
  <meta name="description" content="Arjo Magno — tattoo artist and software developer based in the Philippines. Full-stack apps, offline-first architecture, Svelte 5." />
  <meta property="og:title" content="Arjo Magno — Tattoo Artist & Software Developer" />
  <meta property="og:description" content="Arjo Magno — tattoo artist and software developer based in the Philippines." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://arjostyle.com/" />
</svelte:head>

<HeroRedesign />
<AboutSection />
<MetricsSection />
<SoftwareProjectsSection projects={featuredProjects} />
<WebsitesSection projects={websiteProjects} />
<TattooPortfolioSection images={imageUrls} />
<BookingCTASection onBook={() => (showBooking = true)} />
<BookingModal bind:show={showBooking} />
