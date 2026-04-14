import type { Handle } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import { getSession, SESSION_COOKIE_NAME } from '$lib/server/kv-session';

export const handle: Handle = async ({ event, resolve }) => {
  const platformEnv = event.platform?.env ?? {};

  // ── Dev auth bypass ──────────────────────────────────────────────────────
  // Set DEV_ADMIN_EMAIL in .env to skip auth in local dev (no DATABASE_URL/KV needed)
  if (env.DEV_ADMIN_EMAIL) {
    event.locals.session = {
      userId: 'dev-user-id',
      email: env.DEV_ADMIN_EMAIL,
      name: env.DEV_ADMIN_EMAIL.split('@')[0],
      createdAt: Date.now(),
      expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
    };
    return resolve(event);
  }
  // ─────────────────────────────────────────────────────────────────────────

  const sessionToken = event.cookies.get(SESSION_COOKIE_NAME);
  const session = await getSession(platformEnv, sessionToken ?? '');
  event.locals.session = session;

  return resolve(event);
};
