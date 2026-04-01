import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: './src/tests',
  timeout: 30000,
  retries: 1, // 3D model load can be slow on first run (WebGL warmup)
  use: {
    baseURL: 'http://localhost:5173',
    // Headed mode required: Three.js WebGL needs GPU context
    // Headless Chromium can't create WebGL context, crashing the booking flow
    headless: false,
  },
});
