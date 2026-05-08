import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
	testDir: 'e2e',
	fullyParallel: true,
	forbidOnly: !!process.env.CI,
	retries: process.env.CI ? 2 : 0,
	workers: process.env.CI ? 1 : undefined,
	reporter: 'html',
	use: {
		baseURL: 'http://localhost:5174'
	},
	projects: [
		{
			name: 'chromium',
			use: { ...devices['Desktop Chrome'] }
		},
		{
			name: 'firefox',
			use: { ...devices['Desktop Firefox'] }
		},
		{
			name: 'mobile',
			use: { ...devices['Pixel 5'] }
		}
	],
	webServer: {
		command: 'pnpm run dev --port 5174',
		port: 5174,
		reuseExistingServer: process.env.PLAYWRIGHT_REUSE_SERVER === '1' || !!process.env.CI
	}
});
