declare module 'lucide-svelte';

declare global {
  namespace App {
    interface Platform {
      env: {
        ARJOSTYLE_BUCKET: R2Bucket;
        ARJOSTYLE_KV: KVNamespace;
        DATABASE_URL?: string;
        R2_PUBLIC_URL?: string;
        BETTER_AUTH_URL?: string;
        TURNSTILE_SITE_KEY?: string;
        TURNSTILE_SECRET_KEY?: string;
      };
      context: {
        waitUntil(promise: Promise<unknown>): void;
      };
      caches: CacheStorage & { default: Cache };
    }
    interface Locals {
      session: import('$lib/server/kv-session').SessionData | null;
    }
  }
}

export {};
