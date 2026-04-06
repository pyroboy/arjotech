import {
  pgTable,
  text,
  integer,
  boolean,
  timestamp,
  uuid,
  real,
  jsonb,
  pgEnum
} from 'drizzle-orm/pg-core';
import { sql } from 'drizzle-orm';

// ── Enums ─────────────────────────────────────────────────────────────────────

export const bookingStatusEnum = pgEnum('booking_status', [
  'Available',
  'Pending',
  'Confirmed',
  'Rejected',
  'Completed',
  'Needs Info',
  'Conflict'
]);

// ── Bookings ──────────────────────────────────────────────────────────────────

export const bookings = pgTable('bookings', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),

  status: bookingStatusEnum('status').default('Pending').notNull(),

  // Client info
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone').notNull(),
  dob: text('dob'),
  instagramHandle: text('instagram_handle'),
  facebookProfile: text('facebook_profile'),
  preferredContact: text('preferred_contact'),
  referralSource: text('referral_source'),

  // Tattoo details
  tattooSize: real('tattoo_size').notNull(),
  isColor: boolean('is_color').default(false).notNull(),
  complexity: real('complexity'),
  category: text('category'),
  placement: text('placement'),
  placementIndex: integer('placement_index').default(0),
  isCoverUp: boolean('is_cover_up').default(false).notNull(),
  primaryTattooStyle: text('primary_tattoo_style'),
  styleDescription: text('style_description'),

  // Pricing
  pricingDetails: jsonb('pricing_details').$type<{
    basePriceRaw: number;
    complexityPrice: number;
    placementPrice: number;
    colorPrice: number;
    coverUpPrice: number;
    total: number;
  }>(),
  estimatedDuration: integer('estimated_duration'),
  estimatedSessions: integer('estimated_sessions'),

  // References & requirements
  referenceImageUrls: jsonb('reference_image_urls').$type<
    { key: string; url: string; originalFilename: string }[]
  >(),
  creativeFreedom: real('creative_freedom').default(50).notNull(),
  specificReqs: text('specific_reqs'),
  mustHaves: text('must_haves'),
  colorPrefs: text('color_prefs'),
  placementNotes: text('placement_notes'),

  // Scheduling
  requestedDate: text('requested_date'),
  requestedTime: text('requested_time'),
  artistPreference: text('artist_preference'),
  urgencyLevel: text('urgency_level'),

  // Consent
  termsAgreed: boolean('terms_agreed').default(false),
  medicalConfirmed: boolean('medical_confirmed').default(false),
  ageConfirmed: boolean('age_confirmed').default(false),

  // Pain & complexity
  painLevel: real('pain_level'),
  painReason: text('pain_reason'),
  visualComplexityScore: real('visual_complexity_score'),

  // Admin
  adminNotes: text('admin_notes'),
  savedReplyRecommendations: jsonb('saved_reply_recommendations').$type<string[]>()
});

// ── Body Part Mappings ────────────────────────────────────────────────────────

export const bodyPartMappings = pgTable('body_part_mappings', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),

  category: text('category').notNull(),
  placement: text('placement').notNull(),

  positionX: real('position_x').notNull(),
  positionY: real('position_y').notNull(),
  positionZ: real('position_z').notNull(),
  scale: real('scale').notNull().default(1),

  cameraAzimuth: real('camera_azimuth'),
  cameraPolar: real('camera_polar'),
  cameraDistance: real('camera_distance'),

  sizeLimitMin: real('size_limit_min'),
  sizeLimitMax: real('size_limit_max'),
  sizeLimitMultiplier: real('size_limit_multiplier'),

  painLevel: real('pain_level'),
  painReason: text('pain_reason'),

  isActive: boolean('is_active').default(true).notNull()
});

// ── Scheduling Slots ──────────────────────────────────────────────────────────

export const schedulingSlots = pgTable('scheduling_slots', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  date: text('date').notNull(),
  time: text('time').notNull(),
  isAvailable: boolean('is_available').default(true).notNull(),
  bookingId: uuid('booking_id').references(() => bookings.id, { onDelete: 'set null' }),
  durationMinutes: integer('duration_minutes').default(60)
});

// ── AI Prompts (admin) ────────────────────────────────────────────────────────

export const aiPrompts = pgTable('ai_prompts', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),

  name: text('name').notNull(),
  promptText: text('prompt_text').notNull(),
  isActive: boolean('is_active').default(true).notNull(),
  category: text('category').default('booking_reply')
});

// ── Portfolio Items ────────────────────────────────────────────────────────────

export const portfolioItems = pgTable('portfolio_items', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),

  type: text('type').notNull(), // 'tattoo' | 'software'
  title: text('title').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  tags: jsonb('tags').$type<string[]>(),
  slug: text('slug').unique(),

  // Software-specific
  techStack: jsonb('tech_stack').$type<string[]>(),
  liveUrl: text('live_url'),
  githubUrl: text('github_url'),
  caseStudyContent: text('case_study_content'), // markdown

  // Tattoo-specific
  style: text('style'),
  placement: text('placement'),

  isPublished: boolean('is_published').default(true).notNull(),
  displayOrder: integer('display_order').default(0)
});

// ── Marketing Pipeline ───────────────────────────────────────────────────────

export const marketingBusinessEnum = pgEnum('marketing_business', [
  'silog',
  'sweetytreats',
  'foodhub',
  'dorm',
  'arjostyle'
]);

export const contentStatusEnum = pgEnum('content_status', [
  'draft',
  'generated',
  'approved',
  'scheduled',
  'published',
  'failed'
]);

export const contentTypeEnum = pgEnum('content_type', [
  'menu_image',
  'promo_graphic',
  'social_caption',
  'story_post',
  'reel_script',
  'review_reply'
]);

export const platformEnum = pgEnum('platform_type', [
  'facebook',
  'tiktok',
  'instagram',
  'google_business'
]);

export const pipelineStageEnum = pgEnum('pipeline_stage', [
  'awareness',
  'interest',
  'conversion',
  'retention',
  'advocacy'
]);

export const marketingContent = pgTable('marketing_content', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),

  business: marketingBusinessEnum('business').notNull(),
  contentType: contentTypeEnum('content_type').notNull(),
  platform: platformEnum('platform').notNull(),
  pipelineStage: pipelineStageEnum('pipeline_stage').notNull(),
  status: contentStatusEnum('status').default('draft').notNull(),

  // Content
  title: text('title').notNull(),
  caption: text('caption'),
  imageUrl: text('image_url'),
  imagePrompt: text('image_prompt'),
  hashtags: jsonb('hashtags').$type<string[]>(),

  // Scheduling
  scheduledAt: timestamp('scheduled_at', { withTimezone: true }),
  publishedAt: timestamp('published_at', { withTimezone: true }),

  // AI metadata
  aiModel: text('ai_model'),
  aiPromptUsed: text('ai_prompt_used'),
  generationCost: real('generation_cost'),

  // Metrics (post-publish)
  reach: integer('reach'),
  engagement: integer('engagement'),
  clicks: integer('clicks'),
  shares: integer('shares'),

  // Admin
  notes: text('notes'),
  approvedBy: text('approved_by'),
});

export const marketingTemplates = pgTable('marketing_templates', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),

  business: marketingBusinessEnum('business').notNull(),
  contentType: contentTypeEnum('content_type').notNull(),
  name: text('name').notNull(),
  promptTemplate: text('prompt_template').notNull(),
  captionTemplate: text('caption_template'),
  platform: platformEnum('platform').notNull(),
  pipelineStage: pipelineStageEnum('pipeline_stage').notNull(),
  isActive: boolean('is_active').default(true).notNull(),

  // Template variables
  variables: jsonb('variables').$type<{ key: string; label: string; defaultValue: string }[]>(),
});

export const marketingCalendar = pgTable('marketing_calendar', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),

  business: marketingBusinessEnum('business').notNull(),
  date: text('date').notNull(),
  dayOfWeek: text('day_of_week').notNull(),
  theme: text('theme'),
  contentIds: jsonb('content_ids').$type<string[]>(),
  notes: text('notes'),
});

// ── Leads Pipeline ───────────────────────────────────────────────────────────

export const leadStatusEnum = pgEnum('lead_status', [
  'new',
  'contacted',
  'responded',
  'qualified',
  'proposal_sent',
  'negotiating',
  'won',
  'lost',
  'dormant'
]);

export const leadSourceEnum = pgEnum('lead_source', [
  'facebook',
  'instagram',
  'tiktok',
  'google',
  'walk_in',
  'referral',
  'dm',
  'email',
  'phone',
  'website',
  'other'
]);

export const leads = pgTable('leads', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),

  // Categorization
  business: marketingBusinessEnum('business').notNull(),
  status: leadStatusEnum('status').default('new').notNull(),
  source: leadSourceEnum('source').default('other').notNull(),

  // Contact info
  name: text('name').notNull(),
  phone: text('phone'),
  email: text('email'),
  facebook: text('facebook'),
  instagram: text('instagram'),

  // Lead details
  interest: text('interest'),           // what they want: "tapsilog catering for 50", "tattoo sleeve", "dorm bed"
  estimatedValue: real('estimated_value'), // ₱ value of the deal
  notes: text('notes'),

  // Activity tracking
  lastContactedAt: timestamp('last_contacted_at', { withTimezone: true }),
  nextFollowUpAt: timestamp('next_follow_up_at', { withTimezone: true }),
  dmsSent: integer('dms_sent').default(0).notNull(),
  dmsReceived: integer('dms_received').default(0).notNull(),
  callsMade: integer('calls_made').default(0).notNull(),

  // Conversion
  convertedAt: timestamp('converted_at', { withTimezone: true }),
  convertedValue: real('converted_value'),
  lostReason: text('lost_reason'),
});

// ── KPI Activity Log ────────────────────────────────────────────────────────

export const kpiActivityLog = pgTable('kpi_activity_log', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),

  business: marketingBusinessEnum('business').notNull(),
  category: text('category').notNull(),  // 'marketing', 'leads', 'sales', 'repo', 'operations'
  action: text('action').notNull(),       // 'content_created', 'dm_sent', 'booking_confirmed', 'commit_pushed'
  value: real('value').default(1),        // numeric value (e.g. 1 for count, ₱ amount for revenue)
  metadata: jsonb('metadata').$type<Record<string, any>>(),
  notes: text('notes'),
});

// ── Media Assets ─────────────────────────────────────────────────────────────

export const assetCategoryEnum = pgEnum('asset_category', [
  'tattoo',
  'painting',
  'flash',
  'design',
  'testimonial',
  'studio',
  'misc'
]);

export const mediaAssets = pgTable('media_assets', {
  id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),

  key: text('key').notNull().unique(),
  url: text('url').notNull(),
  originalFilename: text('original_filename').notNull(),
  mimeType: text('mime_type').notNull(),
  sizeBytes: integer('size_bytes'),

  category: assetCategoryEnum('category').default('misc').notNull(),
  title: text('title'),
  altText: text('alt_text'),
  tags: jsonb('tags').$type<string[]>(),

  width: integer('width'),
  height: integer('height'),

  isPublic: boolean('is_public').default(true).notNull(),
  displayOrder: integer('display_order').default(0),
});

// ── Type exports ──────────────────────────────────────────────────────────────

export type MediaAsset = typeof mediaAssets.$inferSelect;
export type NewMediaAsset = typeof mediaAssets.$inferInsert;
export type Lead = typeof leads.$inferSelect;
export type NewLead = typeof leads.$inferInsert;
export type KpiActivityLog = typeof kpiActivityLog.$inferSelect;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type BodyPartMapping = typeof bodyPartMappings.$inferSelect;
export type NewBodyPartMapping = typeof bodyPartMappings.$inferInsert;
export type SchedulingSlot = typeof schedulingSlots.$inferSelect;
export type AiPrompt = typeof aiPrompts.$inferSelect;
export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type MarketingContent = typeof marketingContent.$inferSelect;
export type NewMarketingContent = typeof marketingContent.$inferInsert;
export type MarketingTemplate = typeof marketingTemplates.$inferSelect;
export type NewMarketingTemplate = typeof marketingTemplates.$inferInsert;
export type MarketingCalendar = typeof marketingCalendar.$inferSelect;
