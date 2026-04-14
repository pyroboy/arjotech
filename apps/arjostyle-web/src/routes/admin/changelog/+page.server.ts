import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ platform }) => {
  const env = platform?.env ?? {};
  const version = (env as Record<string, string>).APP_VERSION ?? '0.1.0';
  const commitSha = ((env as Record<string, string>).CF_PAGES_COMMIT_SHA ?? 'dev').slice(0, 7);
  return { version, commitSha };
};
