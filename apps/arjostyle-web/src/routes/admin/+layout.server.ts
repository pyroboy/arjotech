import type { LayoutServerLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { env as dynamicEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export const load: LayoutServerLoad = async ({ locals, url }) => {
  if (url.pathname === '/admin/login' || url.pathname === '/admin/logout' || url.pathname === '/admin/changelog') {
    return {};
  }

  if (!locals.session) {
    throw redirect(302, '/admin/login');
  }

  const version = dynamicEnv.APP_VERSION ?? 'v0.1.0';
  const commitSha = (publicEnv.CF_PAGES_COMMIT_SHA ?? 'dev').slice(0, 7);

  return {
    user: { email: locals.session.email, name: locals.session.name },
    version,
    commitSha,
  };
};