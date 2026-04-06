CREATE TYPE "public"."asset_category" AS ENUM('tattoo', 'painting', 'flash', 'design', 'testimonial', 'studio', 'misc');--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('Available', 'Pending', 'Confirmed', 'Rejected', 'Completed', 'Needs Info', 'Conflict');--> statement-breakpoint
CREATE TYPE "public"."content_status" AS ENUM('draft', 'generated', 'approved', 'scheduled', 'published', 'failed');--> statement-breakpoint
CREATE TYPE "public"."content_type" AS ENUM('menu_image', 'promo_graphic', 'social_caption', 'story_post', 'reel_script', 'review_reply');--> statement-breakpoint
CREATE TYPE "public"."lead_source" AS ENUM('facebook', 'instagram', 'tiktok', 'google', 'walk_in', 'referral', 'dm', 'email', 'phone', 'website', 'other');--> statement-breakpoint
CREATE TYPE "public"."lead_status" AS ENUM('new', 'contacted', 'responded', 'qualified', 'proposal_sent', 'negotiating', 'won', 'lost', 'dormant');--> statement-breakpoint
CREATE TYPE "public"."marketing_business" AS ENUM('silog', 'sweetytreats', 'foodhub', 'dorm', 'arjostyle');--> statement-breakpoint
CREATE TYPE "public"."pipeline_stage" AS ENUM('awareness', 'interest', 'conversion', 'retention', 'advocacy');--> statement-breakpoint
CREATE TYPE "public"."platform_type" AS ENUM('facebook', 'tiktok', 'instagram', 'google_business');--> statement-breakpoint
CREATE TABLE "ai_prompts" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"name" text NOT NULL,
	"prompt_text" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"category" text DEFAULT 'booking_reply'
);
--> statement-breakpoint
CREATE TABLE "body_part_mappings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	"category" text NOT NULL,
	"placement" text NOT NULL,
	"position_x" real NOT NULL,
	"position_y" real NOT NULL,
	"position_z" real NOT NULL,
	"scale" real DEFAULT 1 NOT NULL,
	"camera_azimuth" real,
	"camera_polar" real,
	"camera_distance" real,
	"size_limit_min" real,
	"size_limit_max" real,
	"size_limit_multiplier" real,
	"pain_level" real,
	"pain_reason" text,
	"is_active" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"status" "booking_status" DEFAULT 'Pending' NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"phone" text NOT NULL,
	"dob" text,
	"instagram_handle" text,
	"facebook_profile" text,
	"preferred_contact" text,
	"referral_source" text,
	"tattoo_size" real NOT NULL,
	"is_color" boolean DEFAULT false NOT NULL,
	"complexity" real,
	"category" text,
	"placement" text,
	"placement_index" integer DEFAULT 0,
	"is_cover_up" boolean DEFAULT false NOT NULL,
	"primary_tattoo_style" text,
	"style_description" text,
	"pricing_details" jsonb,
	"estimated_duration" integer,
	"estimated_sessions" integer,
	"reference_image_urls" jsonb,
	"creative_freedom" real DEFAULT 50 NOT NULL,
	"specific_reqs" text,
	"must_haves" text,
	"color_prefs" text,
	"placement_notes" text,
	"requested_date" text,
	"requested_time" text,
	"artist_preference" text,
	"urgency_level" text,
	"terms_agreed" boolean DEFAULT false,
	"medical_confirmed" boolean DEFAULT false,
	"age_confirmed" boolean DEFAULT false,
	"pain_level" real,
	"pain_reason" text,
	"visual_complexity_score" real,
	"admin_notes" text,
	"saved_reply_recommendations" jsonb
);
--> statement-breakpoint
CREATE TABLE "kpi_activity_log" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"business" "marketing_business" NOT NULL,
	"category" text NOT NULL,
	"action" text NOT NULL,
	"value" real DEFAULT 1,
	"metadata" jsonb,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "leads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"business" "marketing_business" NOT NULL,
	"status" "lead_status" DEFAULT 'new' NOT NULL,
	"source" "lead_source" DEFAULT 'other' NOT NULL,
	"name" text NOT NULL,
	"phone" text,
	"email" text,
	"facebook" text,
	"instagram" text,
	"interest" text,
	"estimated_value" real,
	"notes" text,
	"last_contacted_at" timestamp with time zone,
	"next_follow_up_at" timestamp with time zone,
	"dms_sent" integer DEFAULT 0 NOT NULL,
	"dms_received" integer DEFAULT 0 NOT NULL,
	"calls_made" integer DEFAULT 0 NOT NULL,
	"converted_at" timestamp with time zone,
	"converted_value" real,
	"lost_reason" text
);
--> statement-breakpoint
CREATE TABLE "marketing_calendar" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"business" "marketing_business" NOT NULL,
	"date" text NOT NULL,
	"day_of_week" text NOT NULL,
	"theme" text,
	"content_ids" jsonb,
	"notes" text
);
--> statement-breakpoint
CREATE TABLE "marketing_content" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"business" "marketing_business" NOT NULL,
	"content_type" "content_type" NOT NULL,
	"platform" "platform_type" NOT NULL,
	"pipeline_stage" "pipeline_stage" NOT NULL,
	"status" "content_status" DEFAULT 'draft' NOT NULL,
	"title" text NOT NULL,
	"caption" text,
	"image_url" text,
	"image_prompt" text,
	"hashtags" jsonb,
	"scheduled_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"ai_model" text,
	"ai_prompt_used" text,
	"generation_cost" real,
	"reach" integer,
	"engagement" integer,
	"clicks" integer,
	"shares" integer,
	"notes" text,
	"approved_by" text
);
--> statement-breakpoint
CREATE TABLE "marketing_templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"business" "marketing_business" NOT NULL,
	"content_type" "content_type" NOT NULL,
	"name" text NOT NULL,
	"prompt_template" text NOT NULL,
	"caption_template" text,
	"platform" "platform_type" NOT NULL,
	"pipeline_stage" "pipeline_stage" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"variables" jsonb
);
--> statement-breakpoint
CREATE TABLE "media_assets" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"key" text NOT NULL,
	"url" text NOT NULL,
	"original_filename" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer,
	"category" "asset_category" DEFAULT 'misc' NOT NULL,
	"title" text,
	"alt_text" text,
	"tags" jsonb,
	"width" integer,
	"height" integer,
	"is_public" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0,
	CONSTRAINT "media_assets_key_unique" UNIQUE("key")
);
--> statement-breakpoint
CREATE TABLE "portfolio_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now(),
	"type" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"image_url" text,
	"tags" jsonb,
	"slug" text,
	"tech_stack" jsonb,
	"live_url" text,
	"github_url" text,
	"case_study_content" text,
	"style" text,
	"placement" text,
	"is_published" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0,
	CONSTRAINT "portfolio_items_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "scheduling_slots" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"date" text NOT NULL,
	"time" text NOT NULL,
	"is_available" boolean DEFAULT true NOT NULL,
	"booking_id" uuid,
	"duration_minutes" integer DEFAULT 60
);
--> statement-breakpoint
ALTER TABLE "scheduling_slots" ADD CONSTRAINT "scheduling_slots_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE set null ON UPDATE no action;