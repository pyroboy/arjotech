import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  if (url.pathname === '/admin/login' || url.pathname === '/admin/logout') {
    return {};
  }

  if (!locals.session) {
    throw redirect(302, '/admin/login');
  }

  return { user: { email: locals.session.email, name: locals.session.name } };
};