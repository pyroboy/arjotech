import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [sveltekit()],
  ssr: {
    noExternal: ['three', '@threlte/core', '@threlte/extras']
  },
  test: {
    // Run unit tests in node environment (no browser needed for pure logic)
    environment: 'node',
    // Match *.unit.test.ts and *.integration.test.ts files
    include: ['src/tests/**/*.test.ts'],
    // Exclude Playwright e2e specs (*.spec.ts)
    exclude: ['src/tests/**/*.spec.ts', 'node_modules/**'],
    globals: true,
    alias: {
      $lib: '/src/lib',
      '$lib/': '/src/lib/',
      '$types': '/src/lib/types',
      '$types/': '/src/lib/types/',
      '$db': '/src/lib/db',
      '$db/': '/src/lib/db/',
      '$utils': '/src/lib/utils',
      '$utils/': '/src/lib/utils/',
      '$data': '/src/lib/data',
      '$data/': '/src/lib/data/',
    },
  },
});
