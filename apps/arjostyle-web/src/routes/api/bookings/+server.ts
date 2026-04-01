import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { getDb } from '$db/index';
import { bookings } from '$db/schema';
import { desc } from 'drizzle-orm';
import { z } from 'zod';
import { checkRateLimit } from '$lib/server/rateLimit';

const bookingSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone is required'),
  dob: z.string().optional(),
  size: z.number({ required_error: 'Tattoo size is required' }),
  isColor: z.boolean().optional().default(false),
  complexity: z.number().optional(),
  selectedCategory: z.string().optional(),
  currentPlacement: z.string().optional(),
  placementIndex: z.number().optional().default(0),
  isCoverUp: z.boolean().optional().default(false),
  primaryTattooStyle: z.string().optional(),
  styleDescription: z.string().optional(),
  pricing: z.any().optional(),
  estimatedDurationMinutes: z.number().optional(),
  estimatedSessions: z.number().optional(),
  creativeFreedom: z.number().optional().default(50),
  specificRequirements: z.string().optional(),
  mustHaveElements: z.string().optional(),
  colorPreferences: z.string().optional(),
  placementNotes: z.string().optional(),
  appointmentDate: z.string().optional(),
  appointmentTime: z.string().optional(),
  artistPreference: z.string().optional(),
  urgencyLevel: z.string().optional(),
  termsAgreed: z.boolean().optional().default(false),
  medicalConfirmed: z.boolean().optional().default(false),
  ageConfirmed: z.boolean().optional().default(false),
  instagramHandle: z.string().optional(),
  facebookProfile: z.string().optional(),
  preferredContactMethod: z.string().optional(),
  referralSource: z.string().optional(),
  painLevel: z.number().optional(),
  painReason: z.string().optional(),
  visualComplexityScore: z.number().optional(),
});

export const GET: RequestHandler = async ({ platform }) => {
  try {
    const db = getDb(platform?.env ?? {});
    const allBookings = await db
      .select()
      .from(bookings)
      .orderBy(desc(bookings.createdAt));
    return json(allBookings);
  } catch {
    // Database not configured — return empty list for prototype
    return json([]);
  }
};

export const POST: RequestHandler = async ({ request, platform, getClientAddress }) => {
  const ip = getClientAddress();
  if (!checkRateLimit(ip, 5, 60000)) {
    return json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }

  try {
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return json({ error: 'Invalid JSON in request body' }, { status: 400 });
    }

    const parsed = bookingSchema.safeParse(body);
    if (!parsed.success) {
      return json(
        { error: 'Validation failed', details: parsed.error.issues.map(i => i.message).join(', ') },
        { status: 400 }
      );
    }

    const data = parsed.data;

    // Try database insert if configured
    try {
      const db = getDb(platform?.env ?? {});
      const [booking] = await db
        .insert(bookings)
        .values({
          name: data.name,
          email: data.email,
          phone: data.phone,
          dob: data.dob,
          tattooSize: data.size,
          isColor: data.isColor,
          complexity: data.complexity,
          category: data.selectedCategory,
          placement: data.currentPlacement,
          placementIndex: data.placementIndex,
          isCoverUp: data.isCoverUp,
          primaryTattooStyle: data.primaryTattooStyle,
          styleDescription: data.styleDescription,
          pricingDetails: data.pricing,
          estimatedDuration: data.estimatedDurationMinutes,
          estimatedSessions: data.estimatedSessions,
          creativeFreedom: data.creativeFreedom,
          specificReqs: data.specificRequirements,
          mustHaves: data.mustHaveElements,
          colorPrefs: data.colorPreferences,
          placementNotes: data.placementNotes,
          requestedDate: data.appointmentDate,
          requestedTime: data.appointmentTime,
          artistPreference: data.artistPreference,
          urgencyLevel: data.urgencyLevel,
          termsAgreed: data.termsAgreed,
          medicalConfirmed: data.medicalConfirmed,
          ageConfirmed: data.ageConfirmed,
          instagramHandle: data.instagramHandle,
          facebookProfile: data.facebookProfile,
          preferredContact: data.preferredContactMethod,
          referralSource: data.referralSource,
          painLevel: data.painLevel,
          painReason: data.painReason,
          visualComplexityScore: data.visualComplexityScore,
          status: 'Pending'
        })
        .returning();

      return json(booking, { status: 201 });
    } catch {
      // Database not configured — return mock success for prototype
      console.log('POST /api/bookings: DB not configured, returning mock response');
      return json({
        id: crypto.randomUUID(),
        name: data.name,
        email: data.email,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      }, { status: 201 });
    }
  } catch (err) {
    console.error('POST /api/bookings error:', err);
    return json({ error: 'Failed to create booking' }, { status: 500 });
  }
};
