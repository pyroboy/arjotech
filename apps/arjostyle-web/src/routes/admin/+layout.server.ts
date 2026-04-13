import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, cookies, url }) => {
  // Allow login page without auth
  if (url.pathname === '/admin/login' || url.pathname === '/admin/logout') {
    return {};
  }

  const sessionCookie = cookies.get('better-auth.session_token');
  
  if (!sessionCookie) {
    throw redirect(302, '/admin/login');
  }

  if (locals.auth?.api?.getSession) {
    try {
      const session = await locals.auth.api.getSession({
        headers: { cookie: cookies.toString() }
      });
      
      if (session?.session) {
        return { user: session.user };
      }
    } catch (e) {
      console.error('Session verification error:', e);
    }
  }

  throw redirect(302, '/admin/login');
};