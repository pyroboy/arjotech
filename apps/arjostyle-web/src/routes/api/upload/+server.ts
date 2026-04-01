import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { checkRateLimit } from '$lib/server/rateLimit';

export const POST: RequestHandler = async ({ request, platform, getClientAddress }) => {
  const ip = getClientAddress();
  if (!checkRateLimit(ip, 10, 60000)) {
    return json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
  }
  try {
    const bucket = platform?.env?.ARJOSTYLE_BUCKET;
    if (!bucket) {
      return json({ error: 'R2 bucket not configured' }, { status: 500 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return json({ error: 'No file provided' }, { status: 400 });
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      return json({ error: 'File too large. Maximum size is 5MB.' }, { status: 413 });
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      return json({ error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF.' }, { status: 400 });
    }

    // Sanitize filename: replace non-alphanumeric chars (except dots for extension)
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
    const key = `uploads/${Date.now()}-${sanitizedName}`;
    const buffer = await file.arrayBuffer();

    await bucket.put(key, buffer, {
      httpMetadata: {
        contentType: file.type
      }
    });

    const r2PublicUrl = process.env.R2_PUBLIC_URL ?? '';
    const url = `${r2PublicUrl}/${key}`;

    return json({ key, url, originalFilename: file.name }, { status: 201 });
  } catch (err) {
    console.error('POST /api/upload error:', err);
    return json({ error: 'Upload failed' }, { status: 500 });
  }
};
