import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { deleteSession, SESSION_COOKIE_NAME } from '$lib/server/kv-session';

export const actions: Actions = {
  default: async ({ cookies, platform }) => {
    const token = cookies.get(SESSION_COOKIE_NAME);
    if (token) {
      const env = platform?.env ?? {};
      await deleteSession(env, token);
    }
    cookies.delete(SESSION_COOKIE_NAME, { path: '/' });
    throw redirect(302, '/admin/login');
  }
};