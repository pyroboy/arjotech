import type { Handle } from '@sveltejs/kit';
import { getSession, SESSION_COOKIE_NAME } from '$lib/server/kv-session';

export const handle: Handle = async ({ event, resolve }) => {
  const env = event.platform?.env ?? {};
  const sessionToken = event.cookies.get(SESSION_COOKIE_NAME);
  const session = await getSession(env, sessionToken ?? '');
  event.locals.session = session;

  return resolve(event);
};