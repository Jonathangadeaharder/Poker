import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: 'e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL: 'http://localhost:5174',
		launchOptions: {
			args: ['--mute-audio']
		}
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		}
	],
	webServer: {
		command: 'pnpm run dev --port 5174',
		port: 5174,
		reuseExistingServer: process.env.PLAYWRIGHT_REUSE_SERVER === '1' || !!process.env.CI
	}
});
