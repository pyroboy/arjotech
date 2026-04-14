import type { PageServerLoad } from './$types';
import { APP_VERSION } from '$env/static/private';
import { env as dynamicEnv } from '$env/dynamic/public';

export const load: PageServerLoad = async () => {
  const commitSha = (dynamicEnv.CF_PAGES_COMMIT_SHA ?? 'dev').slice(0, 7);
  return { version: APP_VERSION, commitSha };
};
