export interface SoftwareProject {
  slug: string;
  title: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  videoUrl?: string;
  tags: string[];
  status: 'production' | 'built' | 'prototype';
  featured: boolean;
}

export const softwareProjects: SoftwareProject[] = [
  {
    slug: 'tattoo-tide',
    title: 'Tattoo Tide',
    description: 'Full-stack tattoo studio platform — 3D body placement selector, AI-powered admin tools, online booking flow, and a portfolio gallery. This site is built on it.',
    longDescription: `Tattoo studio platform built for a real studio. Handles the full client journey — from browsing the portfolio and placing a tattoo on a 3D body model to booking a session and managing appointments.

**Features:**
- **3D body placement** — Interactive Three.js body model where clients position their tattoo idea before booking. Built with Threlte for reactive Svelte integration.
- **Booking flow** — Multi-step booking wizard: style selection, body placement, size, date/time, and artist preference. Validates availability in real time.
- **Portfolio gallery** — Filterable media gallery with image and video support, organized by tattoo style and artist.
- **AI admin tools** — AI-assisted tools for the studio admin: content generation, client communication drafts, and booking insights.
- **Cloudflare R2 storage** — All portfolio images and videos served from R2 with Cloudinary transformation pipelines.
- **Neon PostgreSQL** — Drizzle ORM with type-safe schema for bookings, artists, sessions, and availability.

**This site** — arjostyle.com is built on Tattoo Tide. The software portfolio you're reading is part of the same SvelteKit app.`,
    techStack: ['Svelte 5', 'SvelteKit', 'TypeScript', 'Neon', 'Drizzle', 'Three.js', 'Threlte', 'Cloudflare R2', 'TailwindCSS'],
    liveUrl: 'https://arjostyle.com',
    tags: ['Booking', 'AI', '3D', 'Full-stack'],
    status: 'production',
    featured: true
  },
  {
    slug: 'wtfpos',
    title: 'WTFPOS',
    description:
      'Offline-first restaurant POS with QR self-ordering, a live kitchen display, floor plan editor, and multi-location inventory. Built for a real BBQ restaurant chain with Svelte 5 and RxDB.',
    longDescription: `Full-stack point-of-sale system built for a BBQ restaurant chain. Handles the full service lifecycle — from guests scanning a QR code at the table to kitchen tickets to billing.

**Features:**
- **Floor plan editor** — WYSIWYG drag-and-drop canvas to design the restaurant layout. Tables, chairs, walls, labels, and entrances — all configurable with rotation and capacity settings.
- **QR self-ordering** — Guests scan a QR code at their table, browse the menu on their phone, and submit orders directly. Orders sync live to the POS. Dynamic pricing tiers by group size.
- **Kitchen Display System** — Real-time ticket view per station with live cooking timers, urgency levels, and one-tap item completion. Separate dine-in vs. takeout workflows.
- **Table operations** — Merge tables, transfer orders, split bills, void items with PIN authorization, and track elapsed time per table.
- **Inventory** — Real-time stock deduction per order. Delivery logging, waste tracking, periodic stock counts, and variance reports. Multi-protein tracking (beef, pork, chicken, seafood).
- **Multi-location** — All features support multiple branches with a consolidated KPI dashboard.
- **PWA** — Installable on Android/iOS for tablet use at the counter.

**Architecture:**
Offline-first using RxDB (reactive local database backed by IndexedDB). The POS works without internet and syncs via Server-Sent Events when back online. 117 Svelte components built with Svelte 5's new \`$state\` reactivity.`,
    techStack: ['Svelte 5', 'SvelteKit', 'TypeScript', 'RxDB', 'Dexie', 'TailwindCSS', 'Bits UI'],
    tags: ['POS', 'Restaurant', 'Offline-first', 'PWA'],
    status: 'production',
    featured: true
  },
  {
    slug: 'dorm-management',
    title: 'Dorm Management System',
    description: 'Full-stack property management platform for landlords — tenant leases, utility billing with meter readings, payment tracking, 3D floor plans, and a real-time financial dashboard. Built with Svelte 5, RxDB, and Neon.',
    longDescription: `Rental property management system built for a real dormitory. Handles the full landlord workflow — from onboarding tenants and creating leases to tracking utility consumption and chasing overdue payments.

**Features:**
- **Dashboard** — Financial KPIs at a glance: collected payments, outstanding balance, overdue count, collection rate, and occupancy metrics. Flags expiring leases and overdue billings automatically.
- **Tenant & lease management** — Tenant profiles, lease agreements with start/end dates, multi-tenant leases, and automated renewal tracking.
- **Utility billing** — Meter readings per unit, automatic bill generation based on consumption, and billing history per tenant.
- **Payment tracking** — Record payments, allocate across multiple billings, and track outstanding balances per tenant and per property.
- **Expenses & budgets** — Log property expenses by category, set budgets, and compare actuals vs plan.
- **Penalties** — Configurable late payment penalty rules per property.
- **3D floor plans** — Three.js-powered interactive floor plan viewer per property, built with Threlte.
- **Reports & insights** — Monthly overview, lease reports, and visual analytics across all properties.
- **Multi-property** — Manage multiple properties, floors, units, and meters from a single account.

**Architecture:**
Offline-first with RxDB (15 reactive collections backed by IndexedDB). Real-time sync via Supabase edge functions. Neon PostgreSQL for persistent storage. Cloudinary for image hosting, AWS S3 for file storage. Auth via Better Auth with role-based access.`,
    techStack: ['Svelte 5', 'SvelteKit', 'TypeScript', 'RxDB', 'Neon', 'Supabase', 'Three.js', 'Drizzle', 'TailwindCSS', 'Zod'],
    tags: ['Property', 'Management', 'Full-stack', 'Offline-first'],
    status: 'production',
    featured: true
  },
  {
    slug: 'remote-desk',
    title: 'FlowWork',
    description: 'Offline-first workforce management platform for field teams — GPS clock-in, task tracking with photo evidence, expense reporting, inventory, shift scheduling, and team chat with voice messages.',
    longDescription: `Workforce management platform built for organizations managing distributed field teams. Handles the full day-to-day ops loop — from clocking in at a job site to submitting expense reports and messaging the team.

**Features:**
- **GPS clock-in/out** — Record employee location with timestamp and geofence verification on every shift start and end.
- **Task management** — Assign tasks to field workers, track status, and require photo evidence on completion.
- **Expense reporting** — Workers submit expenses (transport, meals, equipment) from the field; managers approve from the dashboard.
- **Inventory tracking** — Real-time stock level monitoring across locations.
- **Shift scheduling** — View and manage employee schedules with conflict detection.
- **Team messaging** — Real-time group chat with voice message recording, reactions, mentions, and typing indicators.
- **Reports & analytics** — Performance metrics and insights across the workforce.
- **Admin dashboard** — System configuration, user management, and org settings.
- **PWA** — Full offline functionality; works without internet and syncs when back online.

**Architecture:**
Offline-first with RxDB (8 collections: employees, shifts, tasks, inventory, expenses, messages, schedules, locations). Neon PostgreSQL for server persistence. Drizzle ORM for type-safe queries. Cloudflare Workers for edge deployment.`,
    techStack: ['Svelte 5', 'SvelteKit', 'TypeScript', 'RxDB', 'Neon', 'Drizzle', 'TailwindCSS', 'Bits UI', 'Zod'],
    tags: ['Workforce', 'Field Ops', 'Offline-first', 'PWA'],
    status: 'prototype',
    featured: true
  },
  {
    slug: 'arjostyle-ai',
    title: 'ArjoStyle AI',
    description: 'AI-powered tattoo booking agent — converses with clients on Facebook Messenger, collects tattoo requirements, qualifies leads, and schedules appointments via Google Calendar. Built with SvelteKit, Groq (Llama 3.3 70B), and Inngest.',
    longDescription: `Conversational AI booking system built for ArjoStyle Tattoo Studio. Automates the full pre-booking client pipeline — from first Messenger message to a qualified, scheduled appointment.

**Features:**
- **Facebook Messenger bot** — Clients message the studio's Facebook page and the AI responds instantly. Collects design concept, placement, size, color vs. black & grey, and reference images — all conversationally.
- **AI consultation agent** — Powered by Groq (Llama 3.3 70B). Asks the right questions to build a complete tattoo brief the artist can price and act on without any back-and-forth.
- **Reference image handling** — Clients send photos directly in Messenger; the bot downloads and stores them via Cloudflare R2, linked to the inquiry record.
- **Admin Kanban dashboard** — All incoming inquiries appear as cards across four columns: Pending → Approved → Completed → Cancelled. One-click approve or reject with price quoting.
- **Google Calendar integration** — Admins schedule approved sessions directly from the inquiry detail view. Creates Google Calendar events with client info attached.
- **Async message processing** — Messenger webhooks are handled via Inngest durable functions — no timeouts, automatic retries on failure, full replay history.
- **CRM** — Full inquiry history per client, chat transcript, reference images, quoted price, and scheduled date all in one view.

**Architecture:**
SvelteKit full-stack deployed on Vercel. Groq API for low-latency LLM inference. Inngest for durable async job processing. Neon PostgreSQL + Drizzle ORM for inquiries, users, and chat history. Cloudflare R2 for reference image storage. Better Auth (magic link) for admin access. Meta Graph API v18 for Messenger integration. Google Calendar API via service account for appointment creation.`,
    techStack: ['SvelteKit', 'TypeScript', 'Groq (Llama 3.3 70B)', 'Inngest', 'Neon', 'Drizzle', 'Meta Graph API', 'Google Calendar API', 'Cloudflare R2', 'Better Auth', 'TailwindCSS'],
    liveUrl: 'https://arjostyle.com',
    tags: ['AI', 'Chatbot', 'Automation', 'Full-stack'],
    status: 'production',
    featured: true
  },
  {
    slug: 'kanaya',
    title: 'Kanaya',
    description: 'Multi-tenant ID card generation platform — drag-and-drop template designer, AI-powered image decomposition, 3D card preview, QR-encoded physical IDs, and real-time attendance verification. Built for schools, government, and events.',
    longDescription: `ID card generation and management platform serving schools, government agencies, and event organizers. Combines a visual card designer with AI-assisted template processing and a physical card production pipeline.

**Features:**
- **Template designer** — Drag-and-drop canvas for building ID card layouts. Position elements, set fonts, upload images, and preview in real-time.
- **AI image decomposition** — Uses fal.ai (Qwen-Image-Layered) to automatically separate template images into RGBA layers for clean element extraction.
- **3D card preview** — Real-time Three.js card visualization with scroll-triggered animations on the marketing page.
- **QR-encoded IDs** — Each generated ID embeds a scannable QR code encoding identity data for instant verification and attendance tracking.
- **Multi-tenant RBAC** — Organization-scoped data with a full role hierarchy: super_admin → org_admin → id_gen_admin → id_gen_user.
- **Credits billing** — Usage-based billing system with invoice generation and payment tracking.
- **Batch generation** — Generate ID cards at scale from a single template and a data import.
- **Physical ecosystem** — Supports shop integrations for physical card printing and production.

**Architecture:**
SvelteKit full-stack with Neon PostgreSQL and Drizzle ORM. Better Auth for multi-tenant authentication. Cloudflare R2 for file storage. pdf-lib for PDF generation. fal.ai for AI image processing. Threlte for 3D visualization.`,
    techStack: ['Svelte 5', 'SvelteKit', 'TypeScript', 'Neon', 'Drizzle', 'Three.js', 'fal.ai', 'Better Auth', 'TailwindCSS', 'Zod'],
    tags: ['SaaS', 'AI', 'Multi-tenant', '3D'],
    status: 'production',
    featured: true
  }
];

// --- Website Projects ---

export interface WebProject {
  slug: string;
  title: string;
  client: string;
  location: string;
  description: string;
  longDescription?: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  imageUrl?: string;
  tags: string[];
  status: 'production' | 'built' | 'prototype';
  featured: boolean;
  year: number;
}

export const websiteProjects: WebProject[] = [
  {
    slug: 'march-of-faith',
    title: 'March of Faith Inc.',
    client: 'March of Faith Incorporated',
    location: 'Tagbilaran City, Bohol, Philippines',
    description: 'Official website for a church established in 1974 — sermons, events, live stream, online giving, gallery, member directory, and a full admin CMS. Built with SvelteKit and Supabase.',
    longDescription: `Church website built for March of Faith Incorporated, a faith-based organization serving Tagbilaran City, Bohol since 1974. The site covers the full congregation experience — from first-time visitors to long-time members.

**Features:**
- **Sermons library** — Browse and watch past sermon recordings by series, pastor, or topic. Supports video embeds and audio downloads.
- **Events calendar** — Upcoming services, ministry events, and community gatherings with registration support.
- **Live stream** — Dedicated livestream page for Sunday services and special broadcasts.
- **Online giving** — Secure digital offering and tithe submission for members.
- **Gallery** — Photo and video gallery of church activities, missions, and milestones.
- **Pastors & leadership** — Staff directory with bios, roles, and contact information.
- **Prayers** — Community prayer wall where members can submit and respond to prayer requests.
- **News & announcements** — Church bulletin and blog for ministry updates.
- **Multiple churches** — Directory of affiliated church branches.
- **Admin CMS** — Full admin panel for staff to manage all content without touching code.
- **Contact & map** — Location info, service schedules, and embedded map for the Tagbilaran City campus.

**Built for real people:**
The client is non-technical — the admin panel was designed to be usable by church staff with no developer involvement for day-to-day updates. Brand colors, typography, and tone all follow the official March of Faith brand guide.`,
    techStack: ['SvelteKit', 'TypeScript', 'Supabase', 'Drizzle ORM', 'TailwindCSS', 'Vercel'],
    tags: ['Church', 'CMS', 'Client Work', 'Full-stack'],
    status: 'production',
    featured: true,
    year: 2025
  }
];

// --- Tattoo Portfolio Types & Data ---

export interface PortfolioImageItem {
  id: number;
  title: string;
  artist: string;
  category: string;
  type: 'image';
  image: string;
  description?: string;
}

export interface PortfolioVideoItem {
  id: number;
  title: string;
  artist: string;
  category: string;
  type: 'video';
  videoSrc: string;
  poster?: string;
  description: string;
}

export type PortfolioItem = PortfolioImageItem | PortfolioVideoItem;

export const imageUrls = [
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826300/chy7geqmgfevi7pautgu.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826257/r8h4fpmjdecybf1txnmh.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826257/uumhrjprdgr6riqljgnj.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826257/ahhq0gk502fz4qleqxe4.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826257/rpbqxsyussrk4napsuqq.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826256/poxjsp0ryrzv6bdagfnx.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826256/ubesxyvwqovnwbwvyecv.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826256/gedbjsgkjpx1aj47iau7.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826256/d97ctyctrqmtxo4urhks.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826256/unano11p9wl3i0xqdc62.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826255/yzsacbjj2fye63iyu7xp.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826255/gd91tyuuyqtcmqepkekd.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826255/wl0j533bwoqemjiz9a2u.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826255/mqyypygh5lfleu5hzlc7.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826255/dg42uxfep9ixtnxlqcc9.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826254/fq27tdsbaxkwobmkexyg.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826254/ipda00snj6bruzzeax49.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826254/nh4k4g5ixnhhr4wjuz9c.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826254/omtjc4jp6xlahsgudrd5.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826253/fcjdhmkcxc6rgr8hlqe2.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826253/ps9eq6c5yfy6qn36jvkh.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826253/ihg4h2pk3am1jjlr5m0g.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826252/pzppd1yspyct2yvvdmlx.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826252/k67xxsxytljfxdf3voxn.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826252/gwylerwvdxevg2uegkez.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826252/ukglymujeyhzmr87ixjk.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826251/yrbsrmgommjri1czzgtv.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826251/lq4zasgqnxeyzlusxac0.jpg',
  'https://res.cloudinary.com/dexcw6vg0/image/upload/v1745826206/ehaiqs5mkedjhxxgbqnh.jpg',
];

export const portfolioItems: PortfolioItem[] = [
  // Videos
  {
    id: 101,
    title: 'Time-lapse: Geometric Mandala Session',
    description: 'Watch our artist create a stunning geometric full-back piece',
    artist: 'Alex Morgan',
    category: 'geometric',
    type: 'video',
    videoSrc: 'https://cdn.pixabay.com/video/2020/09/11/51734-459980693_large.mp4',
    poster: 'https://images.unsplash.com/photo-1544867885-2333f61544ad?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 102,
    title: 'Custom Sleeve Design Process',
    description: 'From concept sketches to final ink',
    artist: 'Jamie Lee',
    category: 'custom',
    type: 'video',
    videoSrc: 'https://cdn.pixabay.com/video/2022/11/10/136110-771040506_large.mp4',
    poster: 'https://images.unsplash.com/photo-1585585064638-06035a0ed308?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 103,
    title: 'Working Video Example',
    description: 'A sample video that should load correctly.',
    artist: 'Studio Bot',
    category: 'custom',
    type: 'video',
    videoSrc: 'https://videos.pexels.com/video-files/1851190/1851190-sd_640_360_30fps.mp4',
    poster: 'https://images.pexels.com/videos/1851190/pexels-photo-1851190.jpeg?auto=compress&cs=tinysrgb&dpr=1&w=500',
  },

  // Images
  { id: 1, title: 'Minimal Line Art Portrait', artist: 'Sarah Chen', category: 'minimalist', type: 'image', image: imageUrls[0] },
  { id: 2, title: 'Sacred Geometry Forearm Piece', artist: 'Marcus Bell', category: 'geometric', type: 'image', image: imageUrls[1] },
  { id: 3, title: 'Cherry Blossom Half Sleeve', artist: 'Lily Wong', category: 'florals', type: 'image', image: imageUrls[2] },
  { id: 4, title: 'Custom Script Typography', artist: 'Jamie Lee', category: 'custom', type: 'image', image: imageUrls[3] },
  { id: 5, title: 'Minimalist Wind Element', artist: 'Sarah Chen', category: 'minimalist', type: 'image', image: imageUrls[4] },
  { id: 6, title: 'Geometric Wolf Design', artist: 'Marcus Bell', category: 'geometric', type: 'image', image: imageUrls[5] },
  { id: 7, title: 'Wildflower Ankle Piece', artist: 'Lily Wong', category: 'florals', type: 'image', image: imageUrls[6] },
  { id: 8, title: 'Geometric Owl Back Piece', artist: 'Marcus Bell', category: 'geometric', type: 'image', image: imageUrls[7] },
  { id: 10, title: 'New Tattoo Work 1', artist: 'Studio Artist', category: 'blackwork', type: 'image', image: imageUrls[8] },
  { id: 11, title: 'New Tattoo Work 2', artist: 'Studio Artist', category: 'blackwork', type: 'image', image: imageUrls[9] },
  { id: 12, title: 'New Tattoo Work 3', artist: 'Studio Artist', category: 'traditional', type: 'image', image: imageUrls[10] },
  { id: 13, title: 'New Tattoo Work 4', artist: 'Studio Artist', category: 'traditional', type: 'image', image: imageUrls[11] },
  { id: 14, title: 'New Tattoo Work 5', artist: 'Studio Artist', category: 'japanese', type: 'image', image: imageUrls[12] },
  { id: 15, title: 'New Tattoo Work 6', artist: 'Studio Artist', category: 'japanese', type: 'image', image: imageUrls[13] },
  { id: 16, title: 'New Tattoo Work 7', artist: 'Studio Artist', category: 'custom', type: 'image', image: imageUrls[14] },
  { id: 17, title: 'New Tattoo Work 8', artist: 'Studio Artist', category: 'custom', type: 'image', image: imageUrls[15] },
  { id: 18, title: 'New Tattoo Work 9', artist: 'Studio Artist', category: 'minimalist', type: 'image', image: imageUrls[16] },
  { id: 19, title: 'New Tattoo Work 10', artist: 'Studio Artist', category: 'florals', type: 'image', image: imageUrls[17] },
  { id: 20, title: 'New Tattoo Work 11', artist: 'Studio Artist', category: 'geometric', type: 'image', image: imageUrls[18] },
  { id: 21, title: 'New Tattoo Work 12', artist: 'Studio Artist', category: 'blackwork', type: 'image', image: imageUrls[19] },
  { id: 22, title: 'New Tattoo Work 13', artist: 'Studio Artist', category: 'florals', type: 'image', image: imageUrls[20] },
  { id: 23, title: 'New Tattoo Work 14', artist: 'Studio Artist', category: 'traditional', type: 'image', image: imageUrls[21] },
  { id: 24, title: 'New Tattoo Work 15', artist: 'Studio Artist', category: 'minimalist', type: 'image', image: imageUrls[22] },
  { id: 25, title: 'New Tattoo Work 16', artist: 'Studio Artist', category: 'geometric', type: 'image', image: imageUrls[23] },
  { id: 26, title: 'New Tattoo Work 17', artist: 'Studio Artist', category: 'japanese', type: 'image', image: imageUrls[24] },
  { id: 27, title: 'New Tattoo Work 18', artist: 'Studio Artist', category: 'custom', type: 'image', image: imageUrls[25] },
  { id: 28, title: 'New Tattoo Work 19', artist: 'Studio Artist', category: 'blackwork', type: 'image', image: imageUrls[26] },
  { id: 29, title: 'New Tattoo Work 20', artist: 'Studio Artist', category: 'traditional', type: 'image', image: imageUrls[27] },
  { id: 30, title: 'New Tattoo Work 21', artist: 'Studio Artist', category: 'geometric', type: 'image', image: imageUrls[28] },
];
