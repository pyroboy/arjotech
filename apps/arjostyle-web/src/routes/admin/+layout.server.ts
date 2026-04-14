import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';

export const load: LayoutServerLoad = async ({ locals, url, platform }) => {
  if (url.pathname === '/admin/login' || url.pathname === '/admin/logout') {
    return {};
  }

  if (!locals.session) {
    throw redirect(302, '/admin/login');
  }

  const env = platform?.env ?? {};
  const version = (env as Record<string, string>).APP_VERSION ?? '0.1.0';
  const commitSha = ((env as Record<string, string>).CF_PAGES_COMMIT_SHA ?? 'dev').slice(0, 7);

  return {
    user: { email: locals.session.email, name: locals.session.name },
    version,
    commitSha,
  };
};