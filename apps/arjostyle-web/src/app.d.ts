declare module 'lucide-svelte';

declare global {
  namespace App {
    interface Platform {
      env: {
        ARJOSTYLE_BUCKET: R2Bucket;
        ARJOSTYLE_KV: KVNamespace;
        DATABASE_URL?: string;
        R2_PUBLIC_URL?: string;
      };
      context: {
        waitUntil(promise: Promise<unknown>): void;
      };
      caches: CacheStorage & { default: Cache };
    }
    interface Locals {
      // Add any request-scoped locals here
    }
  }
}

export {};
