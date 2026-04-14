import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { APP_VERSION, COMMIT_SHA } from '$lib/version';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  if (url.pathname === '/admin/login' || url.pathname === '/admin/logout' || url.pathname === '/admin/changelog') {
    return {};
  }

  if (!locals.session) {
    throw redirect(302, '/admin/login');
  }

  return {
    user: { email: locals.session.email, name: locals.session.name },
    version: APP_VERSION,
    commitSha: COMMIT_SHA,
  };
};
