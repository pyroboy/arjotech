import type { RequestHandler } from './$types';

export const POST: RequestHandler = async () => {
  return new Response(JSON.stringify({ error: 'better-auth deprecated. Use KV-based sessions.' }), {
    status: 410,
    headers: { 'Content-Type': 'application/json' },
  });
};

export const GET: RequestHandler = async () => {
  return new Response(JSON.stringify({ error: 'better-auth deprecated. Use KV-based sessions.' }), {
    status: 410,
    headers: { 'Content-Type': 'application/json' },
  });
};