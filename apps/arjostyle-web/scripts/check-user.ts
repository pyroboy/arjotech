import { createAuth } from '../src/lib/server/auth';

const auth = createAuth({ DATABASE_URL: process.env.DATABASE_URL! });

async function main() {
  try {
    const result = await auth.api.signInEmail({
      body: {
        email: 'arjomagno@gmail.com',
        password: 'Admin@2024!',
      },
      headers: { cookie: '' }
    });
    console.log('Sign in result:', result);
  } catch (e) {
    console.error('Sign in error:', e);
  }
}

main();