import type { Actions } from './$types';
import { redirect } from '@sveltejs/kit';

export const actions: Actions = {
  default: async ({ locals, cookies }) => {
    const auth = locals.auth;
    if (auth?.api?.signOut) {
      try {
        await auth.api.signOut({
          headers: { cookie: cookies.toString() }
        });
      } catch (e) {
        console.error('Sign out error:', e);
      }
    }
    throw redirect(302, '/admin/login');
  }
};