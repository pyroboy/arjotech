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
    description: 'Full-stack tattoo booking platform with 3D body placement selector and AI-powered admin tools.',
    techStack: ['SvelteKit', 'Neon', 'Drizzle', 'Threlte', 'Cloudflare'],
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
    description: 'Comprehensive dorm operations platform for billing, occupancy, and utility tracking.',
    techStack: ['SvelteKit', 'Supabase'],
    tags: ['Property', 'Management', 'Billing'],
    status: 'production',
    featured: true
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

const imageUrls = [
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
