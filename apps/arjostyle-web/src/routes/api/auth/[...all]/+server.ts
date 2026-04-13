import type { RequestHandler } from './$types';
import { createAuth } from '$lib/server/auth';

export const POST: RequestHandler = async ({ request, platform }) => {
  const auth = createAuth(platform?.env ?? {});
  
  return auth.handler(request);
};

export const GET: RequestHandler = async ({ request, platform }) => {
  const auth = createAuth(platform?.env ?? {});
  
  return auth.handler(request);
};