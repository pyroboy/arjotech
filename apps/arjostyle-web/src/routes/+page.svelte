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
  <title>Arjo Magno — Full-Stack Developer, AI Engineer & Tattoo Artist</title>
  <meta name="description" content="Arjo Magno — full-stack developer, AI engineer, and tattoo artist. Building LLM-powered agents, complex web apps, and permanent art. Svelte 5, Rust, Claude API, Neon, Cloudflare." />
  <meta property="og:title" content="Arjo Magno — Full-Stack Developer, AI Engineer & Tattoo Artist" />
  <meta property="og:description" content="Building LLM-powered agents, complex web apps, and permanent art. Svelte 5, Rust, Claude API, Neon, Cloudflare." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://arjostyle.com/" />
  <meta property="og:image" content="https://res.cloudinary.com/dexcw6vg0/image/upload/v1744505507/usvdknljttntfwcjzujg.webp" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:image" content="https://res.cloudinary.com/dexcw6vg0/image/upload/v1744505507/usvdknljttntfwcjzujg.webp" />
</svelte:head>

<HeroRedesign />
<AboutSection />
<MetricsSection />
<SoftwareProjectsSection projects={featuredProjects} />
<WebsitesSection projects={websiteProjects} />
<TattooPortfolioSection images={imageUrls} />
<BookingCTASection onBook={() => (showBooking = true)} />
<BookingModal bind:show={showBooking} />
