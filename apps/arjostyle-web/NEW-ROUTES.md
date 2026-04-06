# NEW-ROUTES.md

> Implementation plan for new routes to expand arjostyle.com portfolio website
> Updated: 2026-04-06 — Revised to use Cloudflare R2 (not Cloudinary), with asset management backend

---

## Route Summary

| Route | Priority | Status | Revenue Impact |
|-------|----------|--------|----------------|
| `/pricing` | P0 | Not Started | High |
| `/testimonials` | P0 | Not Started | High |
| `/paintings` | P1 | Not Started | High |
| `/design` | P1 | Not Started | High |
| `/faq` | P2 | Not Started | Medium |
| `/about` | P2 | Not Started | Medium |
| `/studio` | P2 | Not Started | Medium |
| `/flash` | P2 | Not Started | High |

---

## Step 0 — Asset Management Backend (Required First)

Before building any content routes, images need a home. All media goes through **Cloudflare R2** (`ARJOSTYLE_BUCKET`), catalogued in the `media_assets` DB table.

**Already built:**
- `src/lib/db/schema.ts` — `mediaAssets` table + `assetCategoryEnum`
- `src/routes/api/assets/+server.ts` — `GET` (list by category) + `POST` (upload to R2 + save DB)
- `src/routes/api/assets/[id]/+server.ts` — `PATCH` (edit metadata) + `DELETE` (R2 + DB)
- `src/routes/admin/assets/+page.svelte` — Media library admin UI
- `src/lib/utils/r2.ts` — `r2ImgProps()` helper (replaces Cloudinary srcset)

**Run once before proceeding:**
```bash
pnpm db:generate   # generate migration for media_assets table
pnpm db:push       # apply to Neon
```

**How to upload images for new routes:**
1. Go to `/admin/assets`
2. Select category (e.g. `painting`, `flash`)
3. Upload files → they land in R2 under `{category}/{timestamp}-{name}`
4. Copy the returned URL into the data file for that route

---

## Existing Components to Reuse

Do NOT rebuild these from scratch:

| Component | File | Reuse in |
|---|---|---|
| FAQ accordion | `src/lib/components/landing/FAQSection.svelte` | `/faq` — just route + expand content |
| Studio info | `src/lib/components/landing/StudioInfo.svelte` | `/studio` — extract + expand |
| Scroll reveal | `src/lib/components/ui/RevealOnScroll.svelte` | All new pages |
| Currency formatter | `src/lib/utils/formatters.ts` | `/pricing` |
| R2 image helper | `src/lib/utils/r2.ts` | All image-heavy pages |
| Embla carousel | Already installed (`embla-carousel-svelte`) | `/flash`, `/testimonials` |
| Accordion | Already installed (`bits-ui`) | `/faq` if you want to replace FAQSection |

---

## Data File Standards

Image URLs come from `media_assets.url` (R2 public URL). Structure all new data files like this:

```typescript
// src/lib/data/paintingsData.ts
export interface Painting {
  slug: string;
  title: string;
  medium: string;           // "Acrylic on canvas"
  dimensions: string;       // "30x40 cm"
  year: number;
  price: number | null;     // null = NFS
  status: 'available' | 'sold' | 'commissioned' | 'nfs';
  imageUrl: string;         // R2 URL from /admin/assets
  description?: string;
}

export const paintings: Painting[] = [];
```

```typescript
// src/lib/data/testimonialsData.ts
export interface Testimonial {
  id: string;
  clientName: string;
  clientHandle?: string;    // @instagram
  rating: number;           // 1-5
  quote: string;
  tattooStyle?: string;
  tattooImageUrl?: string;  // R2 URL (before/after, optional)
  date: string;             // ISO date
  source: 'google' | 'instagram' | 'facebook' | 'direct';
}

export const testimonials: Testimonial[] = [];
```

```typescript
// src/lib/data/flashData.ts
export interface FlashDesign {
  slug: string;
  title: string;
  style: string;
  size: 'small' | 'medium' | 'large';
  price: number;
  available: boolean;
  imageUrl: string;         // R2 URL from /admin/assets
  description?: string;
  tags: string[];
}

export const flashDesigns: FlashDesign[] = [];
```

---

## SEO Template

Every new page must include this in `<svelte:head>`:

```svelte
<svelte:head>
  <title>{pageTitle} — Arjo Magno</title>
  <meta name="description" content="..." />
  <meta property="og:title" content="{pageTitle} — Arjo Magno" />
  <meta property="og:description" content="..." />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://arjostyle.ink/{route}" />
</svelte:head>
```

---

## P0: Critical (Do First)

### 1. `/pricing` — Pricing & Rates Page

**Purpose:** Remove friction for potential clients; qualify leads before inquiry

**Sections:**
1. **Tattoo Pricing Tiers**
   - Small (1-3 inches): Starting at ₱X,XXX
   - Medium (4-6 inches): Starting at ₱X,XXX
   - Large (7+ inches / sleeves): Starting at ₱X,XXX
   - Full sessions: Rate per hour

2. **Painting Commissions** — Canvas sizes + pricing + timeline

3. **Design Services** — Logo packages, menu design, brand identity

4. **Booking Terms** — Deposit (50%), cancellation policy, touch-up policy

**Data Sources:**
- SecondBrain: `03-ArjoStyle/Tattoo/Business/Prices.md`
- Existing: `src/lib/components/booking/TattooCalculator.svelte` — pricing constants live here; extract them into a shared `pricingData.ts` instead of duplicating

**Files to Create:**
```
src/lib/data/pricingData.ts     # Shared pricing constants (reuse in /pricing + TattooCalculator)
src/routes/pricing/
├── +page.svelte                 # Static pricing display + CTA to /book
└── +page.ts                     # import { pricingTiers } from '$data/pricingData'
```

**Files to Modify:**
- `src/lib/components/booking/TattooCalculator.svelte` — import from pricingData.ts instead of hardcoded values

---

### 2. `/testimonials` — Client Reviews & Stories

**Purpose:** Social proof to increase booking conversion

**Sections:**
1. **Featured Reviews** — Star rating + quote + client photo (R2 URL)
2. **Before/After Grid** — Side-by-side R2 image pairs
3. **Video Testimonials** — If collected; embed from R2

**Data Sources:**
- Collect from past clients (Instagram DMs, Google reviews)
- Upload photos to `/admin/assets` under category `testimonial`

**Files to Create:**
```
src/lib/data/testimonialsData.ts  # See data standard above
src/routes/testimonials/
├── +page.svelte                   # Grid layout (embla for featured carousel)
└── +page.ts                       # load() returns testimonials
```

**Content Collection Needed:**
- [ ] Reach out to past clients for reviews
- [ ] Request before/after photos → upload via `/admin/assets` (category: `testimonial`)
- [ ] Record video testimonials (if possible)
- [ ] Screenshot Google/Facebook reviews

---

## P1: High Revenue Impact

### 3. `/paintings` — Paintings Portfolio

**Purpose:** Activate painting revenue stream (₱5k each, target 20/month)

**Sections:**
1. **Gallery Grid** — Filter by: Available, Sold, Commission
2. **Individual Painting** (`/paintings/[slug]`) — Large image, dimensions, price, "Inquire" CTA
3. **Commission Section** — How commissions work, timeline, inquiry form

**Data Sources:**
- Upload paintings via `/admin/assets` (category: `painting`) first
- Commission inquiry → submit to existing `POST /api/leads`

**Files to Create:**
```
src/lib/data/paintingsData.ts     # See data standard above
src/routes/paintings/
├── +page.svelte                   # Gallery grid (uses r2ImgProps() for images)
├── +page.ts                       # load() returns paintings
└── [slug]/
    ├── +page.svelte               # Detail page + commission form
    └── +page.ts                   # load + throw error(404) if not found
```

**Content Collection Needed:**
- [ ] Photograph all available paintings
- [ ] Upload via `/admin/assets` (category: `painting`)
- [ ] Document dimensions, medium, year, price per piece

---

### 4. `/design` — Graphic Design Portfolio

**Purpose:** Showcase design work for ₱10k+ projects

**Sections:**
1. **Project Categories** — Logo, Menu, Signage, Brand Identity
2. **Case Studies** (`/design/[slug]`) — Before/after, challenge → solution → result
3. **Services & Packages** — Scope breakdown, tiers

**Data Sources:**
- Export design mockups as images → upload via `/admin/assets` (category: `design`)
- SecondBrain: `03-ArjoStyle/Design/`

**Files to Create:**
```
src/lib/data/designData.ts
src/routes/design/
├── +page.svelte
├── +page.ts
└── [slug]/
    └── +page.svelte
```

**Content Collection Needed:**
- [ ] Gather past project files
- [ ] Export high-quality comparison images
- [ ] Write case study narratives

---

## P2: Engagement & SEO

### 5. `/faq` — Frequently Asked Questions

**Purpose:** Reduce repetitive inquiries; SEO benefits

> **Note:** `FAQSection.svelte` already exists at `src/lib/components/landing/FAQSection.svelte` and renders on the homepage. The `/faq` route wraps and expands it — no new accordion component needed.

**Files to Create:**
```
src/routes/faq/
└── +page.svelte    # Import FAQSection + expanded Q&A items
```

**Content to add:**
- Booking & Process, Pricing & Payment, Design & Customization, Pain & Experience, Aftercare (link to `/aftercare`), Touch-ups

---

### 6. `/about` — Artist Bio & Story

**Purpose:** Personal connection; trust building

**Sections:**
1. Hero — Artist photo + tagline
2. My Story — Journey, training, philosophy
3. The Studio — ATS origin, mission
4. Personal — Family, faith, Bohol
5. Beyond Tattoo — Software + art intersection

**Data Sources:**
- SecondBrain: `03-ArjoStyle/ArjoStyle Bio.md`
- SecondBrain: `01-ArjoMagno/`

**Files to Create:**
```
src/routes/about/
├── +page.svelte
└── +page.ts
```

**Content to Gather:**
- [ ] Professional artist photos → upload via `/admin/assets` (category: `studio`)
- [ ] Write bio text from SecondBrain notes

---

### 7. `/studio` — Studio Location & Info

**Purpose:** Local SEO; inform clients before visit

> **Note:** `StudioInfo.svelte` already exists at `src/lib/components/landing/StudioInfo.svelte`. The `/studio` route expands it with photos, map embed, and safety details.

**Sections:**
1. Location — Address, Google Map iframe embed, landmarks
2. Studio Photos — R2 images (category: `studio`)
3. What to Expect — Arrival → consultation → tattoo → aftercare
4. Equipment & Safety — Sterilization, single-use needles
5. Hours & Contact

**Files to Create:**
```
src/routes/studio/
├── +page.svelte    # Expands StudioInfo.svelte content
└── +page.ts
```

**Content to Gather:**
- [ ] Take studio photos → upload via `/admin/assets` (category: `studio`)
- [ ] Confirm exact address and hours

---

### 8. `/flash` — Flash Designs

**Purpose:** Quick bookings; impulse purchases

**Sections:**
1. **Available Flash** — Grid of ready-to-book designs with price + "Book This" CTA
2. **Flash Detail** (`/flash/[slug]`) — Large image, recommended placement, price, booking button
3. **Flash Drops** — Limited availability notice

**Data Sources:**
- Design flash pieces → photograph/scan → upload via `/admin/assets` (category: `flash`)

**Files to Create:**
```
src/lib/data/flashData.ts         # See data standard above
src/routes/flash/
├── +page.svelte                   # Grid (embla carousel for featured)
├── +page.ts
└── [slug]/
    ├── +page.svelte               # Detail + Book CTA
    └── +page.ts                   # load + throw error(404) if not found
```

**Content to Create:**
- [ ] Design 10-20 flash pieces
- [ ] Price each design
- [ ] Photograph/scan → upload via `/admin/assets` (category: `flash`)

---

## Navigation Updates

**File:** `src/lib/components/layout/Header.svelte` (currently has 3 hardcoded `navLinks`)

```typescript
// Proposed primary nav
const navLinks = [
  { label: 'Tattoo', href: '/tattoo' },
  { label: 'Paintings', href: '/paintings' },   // NEW
  { label: 'Software', href: '/software' },
  { label: 'Free Tools', href: '/tools' },
];

// Add to mobile menu + Footer.svelte:
// About (/about) | Studio (/studio) | FAQ (/faq) | Testimonials (/testimonials) | Contact (/contact)
```

**File:** `src/lib/components/layout/Footer.svelte` — Add secondary nav links

---

## Implementation Order

1. **Run DB migration** — `pnpm db:generate && pnpm db:push` (for `media_assets` table)
2. **Verify `/admin/assets`** — Upload a test image, confirm it lands in R2 + DB
3. **`/pricing`** — Content readily available, highest conversion impact
4. **`/faq`** — Wraps existing FAQSection, fast to ship
5. **`/about`** — Bio content from SecondBrain, quick build
6. **`/testimonials`** — Start collecting content now; publish as received
7. **`/studio`** — One photo session, then quick build
8. **`/paintings`** — Requires inventory documentation + photos
9. **`/design`** — Requires portfolio compilation
10. **`/flash`** — Requires new design creation

---

## Questions to Answer Before Building

1. **Pricing:** What are exact tattoo rates? Hourly vs flat?
2. **Testimonials:** Which past clients can be contacted for reviews?
3. **Paintings:** How many exist? Which are for sale vs NFS?
4. **Design:** Which past projects can be showcased publicly?
5. **Studio:** Exact address and operating hours?
6. **Flash:** How many designs to launch with initially?

---

*End of NEW-ROUTES.md*
