import type { PageServerLoad } from './$types';
import { APP_VERSION, COMMIT_SHA } from '$lib/version';

export const load: PageServerLoad = async () => {
  return { version: APP_VERSION, commitSha: COMMIT_SHA };
};
