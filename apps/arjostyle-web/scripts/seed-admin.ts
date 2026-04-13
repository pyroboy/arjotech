import { createAuth } from '../src/lib/server/auth';

export async function seedAdminUser() {
  const auth = createAuth({ DATABASE_URL: process.env.DATABASE_URL });

  const result = await auth.api.signUpEmail({
    body: {
      email: 'arjomagno@gmail.com',
      password: 'Admin@2024!',
      name: 'Arjo Magno',
    },
    headers: { cookie: '' }
  });

  console.log('Admin user created:', result.user?.email);
}

seedAdminUser().catch(console.error);