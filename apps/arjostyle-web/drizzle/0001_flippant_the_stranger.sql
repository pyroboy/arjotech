CREATE TYPE "public"."job_fit" AS ENUM('strong', 'good', 'stretch', 'weak');--> statement-breakpoint
CREATE TYPE "public"."job_source" AS ENUM('hackernews', 'weworkremotely', 'remoteok', 'remotive', 'arcdev', 'linkedin', 'other');--> statement-breakpoint
CREATE TYPE "public"."job_status" AS ENUM('new', 'viewed', 'applied', 'screening', 'interview', 'offer', 'rejected', 'ghosted');--> statement-breakpoint
CREATE TYPE "public"."testimonial_source" AS ENUM('google', 'instagram', 'facebook', 'direct');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "job_keywords" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"keyword" text NOT NULL,
	"source_id" uuid,
	"is_active" boolean DEFAULT true NOT NULL,
	CONSTRAINT "job_keywords_keyword_unique" UNIQUE("keyword")
);
--> statement-breakpoint
CREATE TABLE "job_opportunities" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"title" text NOT NULL,
	"company" text NOT NULL,
	"url" text NOT NULL,
	"source" "job_source" DEFAULT 'other' NOT NULL,
	"fit" "job_fit" DEFAULT 'good',
	"pay_range" text,
	"location" text,
	"remote" text,
	"job_type" text,
	"status" "job_status" DEFAULT 'new' NOT NULL,
	"notes" text,
	"fit_summary" text,
	"your_tags" text,
	"jd_snippet" text,
	"found_at" timestamp with time zone DEFAULT now() NOT NULL,
	"applied_at" timestamp with time zone
);
--> statement-breakpoint
CREATE TABLE "job_sources" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"base_url" text NOT NULL,
	"search_path" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
CREATE TABLE "job_tags" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"name" text NOT NULL,
	"color" text DEFAULT '#fbbf24',
	"category" text,
	CONSTRAINT "job_tags_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "testimonials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"client_name" text NOT NULL,
	"client_handle" text,
	"rating" integer NOT NULL,
	"quote" text NOT NULL,
	"tattoo_style" text,
	"tattoo_image_url" text,
	"date" text NOT NULL,
	"source" "testimonial_source" DEFAULT 'direct' NOT NULL,
	"is_featured" boolean DEFAULT false NOT NULL,
	"display_order" integer DEFAULT 0
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "job_keywords" ADD CONSTRAINT "job_keywords_source_id_job_sources_id_fk" FOREIGN KEY ("source_id") REFERENCES "public"."job_sources"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "account_userId_idx" ON "account" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "session_userId_idx" ON "session" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_identifier_idx" ON "verification" USING btree ("identifier");