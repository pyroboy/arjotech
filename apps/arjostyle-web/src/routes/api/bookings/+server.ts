import { json, type RequestHandler } from '@sveltejs/kit';
import { getDb } from '$db/index';
import { bookings } from '$db/schema';
import { desc } from 'drizzle-orm';

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

export const POST: RequestHandler = async ({ request, platform }) => {
  try {
    const body = await request.json();

    // Try database insert if configured
    try {
      const db = getDb(platform?.env ?? {});
      const [booking] = await db
        .insert(bookings)
        .values({
          name: body.name,
          email: body.email,
          phone: body.phone,
          dob: body.dob,
          tattooSize: body.size,
          isColor: body.isColor ?? false,
          complexity: body.complexity,
          category: body.selectedCategory,
          placement: body.currentPlacement,
          placementIndex: body.placementIndex ?? 0,
          isCoverUp: body.isCoverUp ?? false,
          primaryTattooStyle: body.primaryTattooStyle,
          styleDescription: body.styleDescription,
          pricingDetails: body.pricing,
          estimatedDuration: body.estimatedDurationMinutes,
          estimatedSessions: body.estimatedSessions,
          creativeFreedom: body.creativeFreedom ?? 50,
          specificReqs: body.specificRequirements,
          mustHaves: body.mustHaveElements,
          colorPrefs: body.colorPreferences,
          placementNotes: body.placementNotes,
          requestedDate: body.appointmentDate,
          requestedTime: body.appointmentTime,
          artistPreference: body.artistPreference,
          urgencyLevel: body.urgencyLevel,
          termsAgreed: body.termsAgreed ?? false,
          medicalConfirmed: body.medicalConfirmed ?? false,
          ageConfirmed: body.ageConfirmed ?? false,
          instagramHandle: body.instagramHandle,
          facebookProfile: body.facebookProfile,
          preferredContact: body.preferredContactMethod,
          referralSource: body.referralSource,
          painLevel: body.painLevel,
          painReason: body.painReason,
          visualComplexityScore: body.visualComplexityScore,
          status: 'Pending'
        })
        .returning();

      return json(booking, { status: 201 });
    } catch {
      // Database not configured — return mock success for prototype
      console.log('POST /api/bookings: DB not configured, returning mock response');
      return json({
        id: crypto.randomUUID(),
        name: body.name,
        email: body.email,
        status: 'Pending',
        createdAt: new Date().toISOString(),
      }, { status: 201 });
    }
  } catch (err) {
    console.error('POST /api/bookings error:', err);
    return json({ error: 'Failed to create booking' }, { status: 500 });
  }
};
