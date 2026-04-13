import type { Handle } from '@sveltejs/kit';
import { createAuth } from '$lib/server/auth';

export const handle: Handle = async ({ event, resolve }) => {
  try {
    const env = event.platform?.env ?? {};
    const auth = createAuth(env);
    event.locals.auth = auth;
  } catch (err) {
    console.error('Failed to initialize auth:', err);
  }

  return resolve(event);
};

declare global {
  namespace App {
    interface Locals {
      auth: ReturnType<typeof createAuth>;
    }
  }
}