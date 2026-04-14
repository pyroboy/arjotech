import type { PageServerLoad } from './$types';
import { env as dynamicEnv } from '$env/dynamic/private';
import { env as publicEnv } from '$env/dynamic/public';

export const load: PageServerLoad = async () => {
  const version = dynamicEnv.APP_VERSION ?? 'v0.1.0';
  const commitSha = (publicEnv.CF_PAGES_COMMIT_SHA ?? 'dev').slice(0, 7);
  return { version, commitSha };
};
