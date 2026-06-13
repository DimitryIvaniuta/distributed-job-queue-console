import { defineConfig, devices } from '@playwright/test';
const isCi = Boolean(process.env['CI']);
const chromiumExecutablePath = process.env['PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH'];
const launchOptions = {
  ...(chromiumExecutablePath ? { executablePath: chromiumExecutablePath } : {}),
  args: ['--host-resolver-rules=MAP queueops.test 127.0.0.1'],
};
export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  reporter: [['html'], ['list']],
  use: { baseURL: 'http://queueops.test:4173', trace: 'on-first-retry' },
  webServer: { command: 'npm run build && npm run preview', url: 'http://localhost:4173', reuseExistingServer: true, timeout: 120_000 },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'], launchOptions } }],
});
