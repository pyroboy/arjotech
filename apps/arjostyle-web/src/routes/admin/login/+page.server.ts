import type { PageServerLoad, Actions } from './$types';
import { redirect } from '@sveltejs/kit';

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

export const load: PageServerLoad = async ({ cookies }) => {
  const sessionCookie = cookies.get('better-auth.session_token');
  if (sessionCookie) {
    throw redirect(302, '/admin');
  }
  return {};
};

export const actions: Actions = {
  default: async ({ request, locals, cookies }) => {
    const formData = await request.formData();
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const turnstileToken = formData.get('turnstileToken') as string;

    if (!email || !password) {
      return { error: 'Email and password are required' };
    }

    // Skip Turnstile check if no token (allows local dev without Turnstile)
    if (turnstileToken) {
      const isValid = await verifyTurnstile(turnstileToken);
      if (!isValid) {
        return { error: 'Security check failed. Please try again.' };
      }
    }

    try {
      const auth = locals.auth;
      if (!auth?.api?.signInEmail) {
        return { error: 'Authentication not configured' };
      }

      const result = await auth.api.signInEmail({
        body: { email, password },
        headers: { cookie: cookies.toString() }
      });

      if (result?.user) {
        throw redirect(302, '/admin');
      }

      return { error: 'Invalid credentials' };
    } catch (err: any) {
      if (err.status === 302 || err?.redirect) {
        throw redirect(302, '/admin');
      }
      return { error: err.message || 'Invalid email or password' };
    }
  }
};