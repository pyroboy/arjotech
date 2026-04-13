import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';
import { verifyCredentials, createSession, SESSION_COOKIE_NAME } from '$lib/server/kv-session';

const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY;

async function verifyTurnstile(token: string): Promise<boolean> {
  try {
    const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET_KEY,
        response: token,
      }),
    });
    const data = await response.json();
    return data.success === true;
  } catch {
    return false;
  }
}

export const load: PageServerLoad = async ({ cookies, locals }) => {
  const sessionToken = cookies.get(SESSION_COOKIE_NAME);
  if (sessionToken && locals.session) {
    throw redirect(302, '/admin');
  }
  return {};
};

export const actions: Actions = {
  default: async ({ request, cookies, platform }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const turnstileToken = formData.get('turnstileToken') as string;

    if (!email || !password) {
      return { error: 'Email and password are required' };
    }

    // TODO: Re-enable Turnstile verification once TURNSTILE_SECRET_KEY is configured in Cloudflare Pages
    // if (turnstileToken) {
    //   const isValid = await verifyTurnstile(turnstileToken);
    //   if (!isValid) {
    //     return { error: 'Security check failed. Please try again.' };
    //   }
    // }

    const env = platform?.env ?? {};
    const credentials = await verifyCredentials(env, email, password);

    if (!credentials) {
      return { error: 'Invalid email or password' };
    }

    const token = await createSession(env, credentials.userId);
    if (!token) {
      return { error: 'Session creation failed' };
    }

    cookies.set(SESSION_COOKIE_NAME, token, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    throw redirect(302, '/admin');
  }
};