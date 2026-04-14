import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { APP_VERSION } from '$env/static/private';
import { env as dynamicEnv } from '$env/dynamic/public';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  if (url.pathname === '/admin/login' || url.pathname === '/admin/logout' || url.pathname === '/admin/changelog') {
    return {};
  }

  if (!locals.session) {
    throw redirect(302, '/admin/login');
  }

  const commitSha = (dynamicEnv.CF_PAGES_COMMIT_SHA ?? 'dev').slice(0, 7);

  return {
    user: { email: locals.session.email, name: locals.session.name },
    version: APP_VERSION,
    commitSha,
  };
};