import { json, type RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, platform }) => {
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

    const key = `uploads/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
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
